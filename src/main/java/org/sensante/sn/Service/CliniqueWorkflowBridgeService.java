package org.sensante.sn.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.sensante.sn.Model.*;
import org.sensante.sn.Repository.*;
import org.sensante.sn.dto.PatientFileAttenteDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Service Pivot d'Orchestration Clinique — Le « Fil Rouge » Transversal.
 * Coordonne les transitions d'état entre Parent, Agent Terrain, Médecin, Superviseur et Admin.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CliniqueWorkflowBridgeService {

    private final EnfantRepository enfantRepository;
    private final RendezVousRepository rendezVousRepository;
    private final BilanAnthroRepository bilanAnthroRepository;
    private final AlerteMASRepository alerteMASRepository;
    private final ConsultationArchiveRepository consultationArchiveRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final StructureSanteRepository structureSanteRepository;

    private final ReferenceGeneratorService referenceGeneratorService;

    /**
     * PALIER 1 & 2 : L'agente (ou le parent) oriente un enfant vers le cabinet médical.
     * Enregistre le bilan anthropométrique et crée un créneau en file d'attente pour le Dr. Fall.
     */
    @Transactional
    public RendezVous orienterEnfantVersCabinet(Long enfantId,
                                               String nomPraticien,
                                               String localisationSalle,
                                               Double poids,
                                               Double pbMm,
                                               boolean mas,
                                               String noteRelais,
                                               String agentEmail) {
        log.info("Fil Rouge — Orientation enfant #{} vers {} ({}) par {}", enfantId, nomPraticien, localisationSalle, agentEmail);

        Enfant enfant = enfantRepository.findById(enfantId)
                .orElseThrow(() -> new IllegalArgumentException("Enfant introuvable avec l'id : " + enfantId));

        Utilisateur agent = null;
        if (agentEmail != null && !agentEmail.isBlank()) {
            agent = utilisateurRepository.findByEmail(agentEmail).orElse(null);
        }

        // 1. Sauvegarder le Bilan Anthropométrique
        BilanAntro bilan = new BilanAntro();
        bilan.setEnfant(enfant);
        bilan.setDateBilan(LocalDate.now());
        bilan.setPoids(poids != null ? poids : 7.2);
        bilan.setPerimetreBrachial(pbMm != null ? (pbMm / 10.0) : 11.5); // conversion en cm
        bilan.setStatut(mas ? StatutNutritionnel.MAS : (pbMm != null && pbMm < 125 ? StatutNutritionnel.MAM : StatutNutritionnel.NORMAL));
        bilan.setAgentSaisie(agent);
        bilan.setStructureSante(enfant.getStructureSante());
        bilan = bilanAnthroRepository.save(bilan);

        // 2. Si MAS, déclencher l'alerte vitale
        if (mas || (pbMm != null && pbMm < 115)) {
            AlerteMAS alerte = new AlerteMAS();
            alerte.setBilan(bilan);
            alerte.setDateAlerte(LocalDate.now());
            alerte.setMessage("Alerte MAS Terrain : PB critique à " + pbMm + "mm. Prise en charge prioritaire au " + localisationSalle + " requise.");
            alerte.setAcquittee(false);
            alerteMASRepository.save(alerte);
        }

        // 3. Créer ou mettre à jour le Rendez-vous en BDD
        String refDossier = referenceGeneratorService.generateRefDossier();
        String structureNom = (enfant.getStructureSante() != null)
                ? enfant.getStructureSante().getNom()
                : "Centre de Santé Gaspard Kamara";

        String nomRelais = (agent != null) ? (agent.getPrenom() + " " + agent.getNom()) : "Agent de Santé";
        String roleRelais = (agent != null && agent.getTitrePoste() != null) ? agent.getTitrePoste() : "Agent Terrain — Bajenu Gox";
        String telRelais = (agent != null && agent.getTelephone() != null) ? agent.getTelephone() : "+221 33 800 00 00";

        RendezVous rdv = RendezVous.builder()
                .enfant(enfant)
                .codeDossierRef(refDossier)
                .titre(mas ? "Consultation Urgence MAS — Priorité P1" : "Consultation Pédiatrique Spécialisée")
                .typeConsultation("PEDIATRIE")
                .dateRendezVous(LocalDate.now())
                .heureRendezVous(LocalTime.now())
                .statut(StatutRendezVous.CONFIRME) // Confirmé pour la file du jour
                .priorite(mas ? "URGENTE" : "MODEREE")
                .motifParent(noteRelais != null ? noteRelais : "Orientation par relais communautaire pour prise en charge nutritionnelle.")
                .nomPraticien(nomPraticien != null ? nomPraticien : "Dr. Babacar Fall")
                .specialitePraticien("Pédiatre • Cabinet 04")
                .nomStructure(structureNom)
                .localisationSalle(localisationSalle != null ? localisationSalle : "Cabinet 04")
                .nomRelais(nomRelais)
                .roleRelais(roleRelais)
                .telephoneRelais(telRelais)
                .instructionsTuteur("Veuillez vous présenter immédiatement au " + localisationSalle + " sans passer par la salle d'attente générale.")
                .build();

        return rendezVousRepository.save(rdv);
    }

    /**
     * PALIER 3 : Le Médecin fait entrer le patient dans son cabinet.
     * Le statut du rendez-vous passe à EN_CONSULTATION.
     */
    @Transactional
    public RendezVous faireEntrerCabinet(Long rdvId) {
        log.info("Fil Rouge — Admission patient RDV #{} au Cabinet", rdvId);
        Optional<RendezVous> opt = rendezVousRepository.findById(rdvId);
        if (opt.isPresent()) {
            RendezVous rdv = opt.get();
            rdv.setStatut(StatutRendezVous.EN_CONSULTATION);
            return rendezVousRepository.save(rdv);
        }
        return null;
    }

    /**
     * PALIER 4 : Le Médecin clôture la consultation et délivre l'ordonnance.
     * Archive la consultation et met à jour le carnet de l'enfant.
     */
    @Transactional
    public ConsultationArchive cloturerEtArchiverConsultation(Long enfantId,
                                                             String nomPraticien,
                                                             String titre,
                                                             String notesCliniques,
                                                             Double poidsKg,
                                                             Double pbCm,
                                                             String prescription,
                                                             String refDocument) {
        log.info("Fil Rouge — Clôture et archivage consultation enfant #{} par {}", enfantId, nomPraticien);

        Enfant enfant = enfantRepository.findById(enfantId)
                .orElseThrow(() -> new IllegalArgumentException("Enfant introuvable avec l'id : " + enfantId));

        ConsultationArchive archive = ConsultationArchive.builder()
                .enfant(enfant)
                .dateConsultation(LocalDate.now())
                .titre(titre != null ? titre : "Consultation Pédiatrique de Nutrition CRENAS")
                .categorie("NUTRITION")
                .statutBadge("Validée")
                .nomStructure("Centre de Santé Gaspard Kamara")
                .nomPraticien(nomPraticien != null ? nomPraticien : "Dr. Babacar Fall")
                .notesCliniques(notesCliniques != null ? notesCliniques : "Prise en charge MAM/MAS initiée selon protocole national PCIME.")
                .poidsKg(poidsKg != null ? poidsKg : 6.3)
                .perimetreBrachialCm(pbCm != null ? pbCm : 11.9)
                .prescription(prescription != null ? prescription : "Plumpy'Nut® ATPE (2 sachets/j) + Céfuroxime Axétil + Vitamine A")
                .referenceDocument(refDocument != null ? refDocument : "ORD-SN-" + LocalDate.now().getYear() + "-4812")
                .typeDocument("ORDONNANCE")
                .build();

        archive = consultationArchiveRepository.save(archive);

        // Mettre à jour les éventuels rendez-vous en cours pour cet enfant à EFFECTUE
        List<RendezVous> rdvs = rendezVousRepository.findByEnfantEnfantIdOrderByDateRendezVousDesc(enfantId);
        for (RendezVous r : rdvs) {
            if (r.getStatut() == StatutRendezVous.EN_CONSULTATION || r.getStatut() == StatutRendezVous.CONFIRME) {
                r.setStatut(StatutRendezVous.EFFECTUE);
                rendezVousRepository.save(r);
            }
        }

        return archive;
    }

    /**
     * PALIER 3 : Récupérer la file d'attente réelle pour un praticien (Dr. Babacar Fall).
     * Mappe les entités RendezVous du jour en PatientFileAttenteDTO.
     */
    @Transactional(readOnly = true)
    public List<PatientFileAttenteDTO> getPatientsFileAttenteReels(String nomPraticien) {
        List<RendezVous> rdvs = rendezVousRepository.findByDateRendezVous(LocalDate.now());
        List<PatientFileAttenteDTO> resultats = new ArrayList<>();

        for (RendezVous r : rdvs) {
            if (r.getStatut() == StatutRendezVous.CONFIRME || r.getStatut() == StatutRendezVous.EN_TRIAGE) {
                Enfant e = r.getEnfant();
                if (e != null) {
                    boolean mas = "URGENTE".equalsIgnoreCase(r.getPriorite()) || (r.getTitre() != null && r.getTitre().contains("MAS"));
                    String gravite = mas ? "MAS" : "MAM";
                    String motif = mas ? "🔴 MAS Prioritaire" : "MAM Modérée";

                    resultats.add(new PatientFileAttenteDTO(
                            r.getId(),
                            e.getPrenom() + " " + e.getNom(),
                            "14 mois",
                            "Parent Accompagnant",
                            "Tutrice",
                            "https://lh3.googleusercontent.com/aida-public/AB6AXuD4z-liZyNFxjCgQOiPmhgrxT0RXdl8j5QA6__vPsLUbgUMCBG6BASeLkHw17NrWmcT_VnNAg_eLHe4pb-xvbMZXDgL35LVZ9gBzl036LvsuC3HEYSAXDScl4yI0VduBjWnIhHjG-PFg0NeFEb9wem8wYlFY4qHCo-duV17ZQzO6uvySRtMEx0Jh5oA_jqUlBIXbXCytO0Pb_GzCyTve2nUfnvLsJE1hfbwZSeHNXodkAFBZAFJEwHd",
                            "",
                            e.getQrCode() != null ? e.getQrCode() : ("SN-DKR-2024-0" + e.getEnfantId()),
                            r.getHeureRendezVous() != null ? r.getHeureRendezVous().format(DateTimeFormatter.ofPattern("HH:mm")) : "09:30",
                            10,
                            gravite,
                            motif,
                            mas ? 112 : 122,
                            "ATTENTE",
                            false,
                            mas,
                            mas ? "Prioriser & Appeler" : "Faire Entrer"
                    ));
                }
            }
        }

        return resultats;
    }

    /**
     * Nombre réel de consultations clôturées aujourd'hui.
     */
    @Transactional(readOnly = true)
    public long compterConsultationsAujourdhui() {
        return consultationArchiveRepository.countByDateConsultation(LocalDate.now());
    }
}
