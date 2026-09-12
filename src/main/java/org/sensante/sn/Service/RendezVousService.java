package org.sensante.sn.Service;

import org.sensante.sn.Model.*;
import org.sensante.sn.Repository.ConsultationArchiveRepository;
import org.sensante.sn.Repository.EnfantRepository;
import org.sensante.sn.Repository.RendezVousRepository;
import org.sensante.sn.Repository.UtilisateurRepository;
import org.sensante.sn.dto.*;
import org.sensante.sn.util.PdfDocumentGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Period;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RendezVousService {

    private final RendezVousRepository rendezVousRepository;
    private final ConsultationArchiveRepository consultationArchiveRepository;
    private final EnfantRepository enfantRepository;
    private final ReferenceGeneratorService referenceGeneratorService;
    private final UtilisateurRepository utilisateurRepository;
    private final EnfantAccesService enfantAccesService;

    public RendezVousService(RendezVousRepository rendezVousRepository,
                             ConsultationArchiveRepository consultationArchiveRepository,
                             EnfantRepository enfantRepository,
                             ReferenceGeneratorService referenceGeneratorService,
                             UtilisateurRepository utilisateurRepository,
                             EnfantAccesService enfantAccesService) {
        this.rendezVousRepository = rendezVousRepository;
        this.consultationArchiveRepository = consultationArchiveRepository;
        this.enfantRepository = enfantRepository;
        this.referenceGeneratorService = referenceGeneratorService;
        this.utilisateurRepository = utilisateurRepository;
        this.enfantAccesService = enfantAccesService;
    }

    @Transactional(readOnly = true)
    public RdvPageDataDTO getRdvPageData(Long enfantId) {
        Enfant enfant = enfantRepository.findById(enfantId)
                .orElseThrow(() -> new org.sensante.sn.exception.RessourceNonTrouveeException("Enfant", enfantId));

        int ageEnMois = 0;
        if (enfant.getDateNaissance() != null) {
            Period p = Period.between(enfant.getDateNaissance(), LocalDate.now());
            ageEnMois = (p.getYears() * 12) + p.getMonths();
        }

        RendezVous rdv = rendezVousRepository.findFirstByEnfantEnfantIdOrderByDateRendezVousDesc(enfantId)
                .orElse(null);

        RendezVousDTO rdvDto = null;
        if (rdv != null) {
            int joursRestants = 0;
            if (rdv.getDateRendezVous() != null) {
                joursRestants = (int) ChronoUnit.DAYS.between(LocalDate.now(), rdv.getDateRendezVous());
            }

            rdvDto = RendezVousDTO.builder()
                    .id(rdv.getId())
                    .enfantId(enfant.getEnfantId())
                    .enfantNomComplet(enfant.getPrenom() + " " + enfant.getNom())
                    .enfantAgeMois(ageEnMois)
                    .codeDossierRef(rdv.getCodeDossierRef())
                    .titre(rdv.getTitre())
                    .typeConsultation(rdv.getTypeConsultation())
                    .dateRendezVous(rdv.getDateRendezVous())
                    .heureRendezVous(rdv.getHeureRendezVous())
                    .statut(rdv.getStatut())
                    .priorite(rdv.getPriorite())
                    .motifParent(rdv.getMotifParent())
                    .nomPraticien(rdv.getNomPraticien())
                    .specialitePraticien(rdv.getSpecialitePraticien())
                    .ordreMedecin(rdv.getOrdreMedecin())
                    .nomStructure(rdv.getNomStructure())
                    .localisationSalle(rdv.getLocalisationSalle())
                    .nomRelais(rdv.getNomRelais())
                    .roleRelais(rdv.getRoleRelais())
                    .telephoneRelais(rdv.getTelephoneRelais())
                    .telephoneStructure(rdv.getTelephoneStructure())
                    .instructionsTuteur(rdv.getInstructionsTuteur())
                    .distanceEstimee(rdv.getDistanceEstimee())
                    .crenauPropose(rdv.getCrenauPropose())
                    .photoJointesInfo(rdv.getPhotoJointesInfo())
                    .joursAvantRdv(joursRestants)
                    .qrPassCode(enfant.getQrCode() != null ? enfant.getQrCode() : "SN-PASS-RDV-442")
                    .build();
        }

        List<ConsultationArchive> archives = consultationArchiveRepository.findByEnfantEnfantIdOrderByDateConsultationDesc(enfantId);
        List<ConsultationArchiveDTO> archivesDto = archives.stream()
                .map(a -> ConsultationArchiveDTO.builder()
                        .id(a.getId())
                        .dateConsultation(a.getDateConsultation())
                        .titre(a.getTitre())
                        .categorie(a.getCategorie())
                        .statutBadge(a.getStatutBadge())
                        .nomStructure(a.getNomStructure())
                        .nomPraticien(a.getNomPraticien())
                        .notesCliniques(a.getNotesCliniques())
                        .poidsKg(a.getPoidsKg())
                        .perimetreBrachialCm(a.getPerimetreBrachialCm())
                        .prescription(a.getPrescription())
                        .referenceDocument(a.getReferenceDocument())
                        .typeDocument(a.getTypeDocument())
                        .build())
                .collect(Collectors.toList());

        return RdvPageDataDTO.builder()
                .enfantId(enfant.getEnfantId())
                .enfantNomComplet(enfant.getPrenom() + " " + enfant.getNom())
                .enfantAgeMois(ageEnMois)
                .codeNational(enfant.getQrCode() != null ? enfant.getQrCode() : "SN-DKR-2025-00" + enfant.getEnfantId())
                .rendezVousActif(rdvDto)
                .historiqueConsultations(archivesDto)
                .build();
    }

    @Transactional
    public RendezVousDTO creerDemandeRdv(DemandeRdvRequestDTO request) {
        if (request == null || request.getEnfantId() == null) {
            throw new org.sensante.sn.exception.AccesRefuseMetierException("Identifiant de l'enfant manquant pour la demande de rendez-vous.");
        }
        enfantAccesService.verifierAcces(request.getEnfantId());
        Enfant enfant = enfantRepository.findById(request.getEnfantId())
                .orElseThrow(() -> new org.sensante.sn.exception.RessourceNonTrouveeException("Enfant", request.getEnfantId()));

        String motifComplet = request.getMotif() != null ? request.getMotif() : "Demande de rendez-vous pédiatrique";
        if (request.getSymptomesTags() != null && !request.getSymptomesTags().isEmpty()) {
            motifComplet += " • Symptômes signalés : " + String.join(", ", request.getSymptomesTags());
        } else if (request.getSymptomesCoches() != null && !request.getSymptomesCoches().isEmpty()) {
            motifComplet += " • Symptômes signalés : " + String.join(", ", request.getSymptomesCoches());
        }
        if (request.getObservations() != null && !request.getObservations().isBlank()) {
            motifComplet += " (" + request.getObservations() + ")";
        }

        LocalDate dateRdv = request.getDateSouhaitee() != null ? request.getDateSouhaitee() : LocalDate.now();
        LocalTime heureRdv = request.getHeureSouhaitee() != null ? request.getHeureSouhaitee() : LocalTime.now();

        String refDossier = referenceGeneratorService.generateRefDossier();
        String nomStruct = enfant.getStructureSante() != null ? enfant.getStructureSante().getNom() : "Centre de Santé Gaspard Kamara";

        Utilisateur medecin = utilisateurRepository.findByRole(Role.MEDECIN).stream().findFirst().orElse(null);
        String nomMed = (medecin != null) ? ("Dr. " + (medecin.getPrenom() != null ? medecin.getPrenom() + " " : "") + (medecin.getNom() != null ? medecin.getNom() : "")).trim() : "Dr. Médecin Pédiatre";
        String ordre = (medecin != null && medecin.getNumeroOrdre() != null) ? medecin.getNumeroOrdre() : "CNOM-SN-4812 / MSAS-DK-094";

        Utilisateur relais = utilisateurRepository.findByRole(Role.AGENT_SANTE).stream().findFirst().orElse(null);
        String nomRel = (relais != null) ? ((relais.getPrenom() != null ? relais.getPrenom() + " " : "") + (relais.getNom() != null ? relais.getNom() : "")).trim() : "Agent Terrain Bajenu Gox";
        String telRel = (relais != null && relais.getTelephone() != null) ? relais.getTelephone() : "+221 77 520 14 88";
        String roleRel = (relais != null && relais.getTitrePoste() != null) ? relais.getTitrePoste() : "Agent Terrain — Bajenu Gox";

        String typeConsult = (request.getTypeConsultation() != null && !request.getTypeConsultation().isBlank())
                ? request.getTypeConsultation()
                : "PEDIATRIE";
        String specPraticien = (request.getSpecialite() != null && !request.getSpecialite().isBlank())
                ? request.getSpecialite()
                : "Pédiatre • Cabinet 04";

        RendezVous rdv = RendezVous.builder()
                .enfant(enfant)
                .codeDossierRef(refDossier)
                .titre("Demande de Consultation Pédiatrique & Triage Nutritionnel")
                .typeConsultation(typeConsult)
                .dateRendezVous(dateRdv)
                .heureRendezVous(heureRdv)
                .statut(StatutRendezVous.EN_TRIAGE) // En attente de triage par l'agente Bajenu Gox
                .priorite("MODEREE")
                .motifParent(motifComplet)
                .nomPraticien(nomMed)
                .specialitePraticien(specPraticien)
                .ordreMedecin(ordre)
                .nomStructure(nomStruct)
                .localisationSalle("Cabinet 04 (" + nomMed + ")")
                .nomRelais(nomRel)
                .roleRelais(roleRel)
                .telephoneRelais(telRel)
                .telephoneStructure("+221 33 821 44 20")
                .instructionsTuteur("Présentez-vous au poste avec le carnet de santé numérique ou le QR pass.")
                .distanceEstimee("1.2 km (8 min)")
                .crenauPropose(dateRdv.toString() + " à " + heureRdv.toString())
                .photoJointesInfo("1 observation clinique jointe")
                .build();

        rdv = rendezVousRepository.save(rdv);
        return getRdvPageData(enfant.getEnfantId()).getRendezVousActif();
    }

    public byte[] exportBilanRdvPdf(Long enfantId) {
        enfantAccesService.verifierAcces(enfantId);
        RdvPageDataDTO data = getRdvPageData(enfantId);
        RendezVousDTO rdv = data.getRendezVousActif();

        String nomMedecin = rdv != null ? rdv.getNomPraticien() : "Dr. Médecin Référent";
        String dateRdvStr = rdv != null && rdv.getDateRendezVous() != null ? rdv.getDateRendezVous().toString() : "Non programmé";
        String sha = referenceGeneratorService.generateCryptographicHash("BILAN_RDV:" + data.getCodeNational() + ":" + dateRdvStr);

        return PdfDocumentGenerator.generateMedicalCertificate(
                "RDV-BILAN-" + data.getCodeNational(),
                "Bilan Officiel des Rendez-vous & Fiches de Suivi",
                data.getEnfantNomComplet(),
                data.getCodeNational(),
                dateRdvStr,
                "O+",
                rdv != null ? rdv.getNomStructure() : "Poste de Santé Médina",
                "13.1",
                "CONFIRME",
                sha
        );
    }

    public byte[] exportFicheConsultationPdf(Long consultationId) {
        if (consultationId == null) {
            throw new org.sensante.sn.exception.AccesRefuseMetierException("Identifiant de consultation requis.");
        }
        ConsultationArchive ca = consultationArchiveRepository.findById(consultationId)
                .orElseThrow(() -> new org.sensante.sn.exception.RessourceNonTrouveeException("ConsultationArchive", consultationId));

        if (ca.getEnfant() == null || ca.getEnfant().getEnfantId() == null) {
            throw new org.sensante.sn.exception.AccesRefuseMetierException("Consultation non rattachée à un enfant valide.");
        }
        enfantAccesService.verifierAcces(ca.getEnfant().getEnfantId());

        String sha = referenceGeneratorService.generateCryptographicHash("CONSULTATION_ARCHIVE:" + ca.getId() + ":" + ca.getReferenceDocument());

        return PdfDocumentGenerator.generateMedicalCertificate(
                ca.getReferenceDocument(),
                ca.getTitre(),
                ca.getEnfant().getPrenom() + " " + ca.getEnfant().getNom(),
                ca.getEnfant().getQrCode() != null ? ca.getEnfant().getQrCode() : "SN-DKR-001",
                ca.getDateConsultation() != null ? ca.getDateConsultation().toString() : "",
                ca.getEnfant().getGroupeSanguin() != null ? ca.getEnfant().getGroupeSanguin() : "O+",
                ca.getNomStructure(),
                ca.getPerimetreBrachialCm() != null ? String.valueOf(ca.getPerimetreBrachialCm()) : "13.0",
                ca.getStatutBadge(),
                sha
        );
    }
}
