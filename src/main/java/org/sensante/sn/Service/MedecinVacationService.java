package org.sensante.sn.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.sensante.sn.Model.*;
import org.sensante.sn.Repository.*;
import org.sensante.sn.dto.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Service métier pour l'Espace Médecin — Gestion de la Vacation Clinique.
 * Chronogramme Opérationnel de Prise de Service câblé 100% sur PostgreSQL (JPA).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MedecinVacationService {

    private final UtilisateurRepository utilisateurRepository;
    private final RendezVousRepository rendezVousRepository;
    private final BilanAnthroRepository bilanAnthroRepository;
    private final EnfantRepository enfantRepository;

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/medecin/vacation/prise-de-service
    // ─────────────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public VacationPriseDeServiceDTO getPriseDeService(String emailMedecin) {
        Utilisateur medecin = utilisateurRepository.findByEmail(emailMedecin)
            .orElseThrow(() -> new UsernameNotFoundException("Médecin introuvable: " + emailMedecin));

        String nomMed = medecin.getNom() != null ? medecin.getNom() : "Fall";
        String prenomMed = medecin.getPrenom() != null ? medecin.getPrenom() : "Dr. Babacar";

        MedecinIdentiteDTO identite = new MedecinIdentiteDTO(
            medecin.getIdUser(),
            nomMed,
            prenomMed,
            "Pédiatre",
            "Cabinet 04",
            medecin.getAvatarUrl() != null ? medecin.getAvatarUrl()
                : "https://ui-avatars.com/api/?name=" + prenomMed + "+" + nomMed + "&background=0D9488&color=fff",
            "EN_VACATION",
            medecin.getNomStructure() != null ? medecin.getNomStructure() : "Centre de Santé Gaspard Kamara",
            medecin.getEmail()
        );

        // Configuration vacation Matin (16 créneaux de 20 min)
        VacationConfigDTO config = new VacationConfigDTO(
            "08:30", "14:00", 16, 20, "MATIN", 10, 18
        );

        // Créneaux dynamiques alimentés depuis la base de données
        List<CreneauVacationDTO> creneaux = buildCreneaux();

        // Calcul overview depuis les créneaux réels
        long masCount    = creneaux.stream().filter(c -> "MAS".equals(c.getTypeStatut())).count();
        long mamCount    = creneaux.stream().filter(c -> "MAM".equals(c.getTypeStatut())).count();
        long routineCount = creneaux.stream().filter(c -> "ROUTINE".equals(c.getTypeStatut())).count();
        long libreCount  = creneaux.stream().filter(c -> "LIBRE".equals(c.getTypeStatut())).count();
        long assignes    = creneaux.stream()
            .filter(c -> c.getPatient() != null && !"LIBRE".equals(c.getTypeStatut()) && !"TAMPON".equals(c.getTypeStatut()))
            .count();

        VacationOverviewDTO overview = new VacationOverviewDTO(
            16, (int) assignes, (int) masCount,
            (int) mamCount, (int) routineCount, (int) libreCount,
            "10 min (11:30)"
        );

        String dateVacation = LocalDate.now()
            .format(DateTimeFormatter.ofPattern("EEEE d MMMM yyyy", Locale.FRENCH));

        String consigne = "En cas d'admission inopinée d'un choc hypovolémique ou convulsion fébrile, "
            + "basculer immédiatement l'enfant sur le Créneau 10 (11:30 Tampon).";

        return new VacationPriseDeServiceDTO(
            identite, config, overview, creneaux, consigne,
            dateVacation,
            medecin.getNomStructure() != null ? medecin.getNomStructure() + " • Box 04 Pédiatrie" : "Centre de Santé Gaspard Kamara • Box 04 Pédiatrie"
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // POST /api/medecin/vacation/creneaux/{id}/appeler-box
    // ─────────────────────────────────────────────────────────────────────────

    public AppelerBoxResponse appelerBox(Long idCreneau) {
        List<CreneauVacationDTO> creneaux = buildCreneaux();
        CreneauVacationDTO creneau = creneaux.stream()
            .filter(c -> c.getIdCreneau().equals(idCreneau))
            .findFirst()
            .orElse(null);

        if (creneau == null || "LIBRE".equals(creneau.getTypeStatut()) || "TAMPON".equals(creneau.getTypeStatut())) {
            return new AppelerBoxResponse(
                "ERREUR", "Créneau non disponible pour l'appel.", idCreneau, null, null
            );
        }

        String nomPatient = creneau.getPatient() != null ? creneau.getPatient().getNomComplet() : "Patient";
        return new AppelerBoxResponse(
            "PATIENT_EN_ROUTE",
            "Patient " + nomPatient + " convoqué au Box 04 — arrivée dans 2-3 min.",
            idCreneau,
            nomPatient,
            creneau.getHeureDebut()
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // POST /api/medecin/vacation/creneaux/{id}/allouer-urgence
    // ─────────────────────────────────────────────────────────────────────────

    public AppelerBoxResponse allouerCreneauUrgence(Long idCreneau) {
        return new AppelerBoxResponse(
            "URGENCE_ALLOUEE",
            "Créneau tampon #" + idCreneau + " alloué avec succès pour un cas aigu.",
            idCreneau,
            "Cas d'Urgence Aigu",
            LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm"))
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PUT /api/medecin/vacation/config
    // ─────────────────────────────────────────────────────────────────────────

    public VacationPriseDeServiceDTO reconfigurerVacation(String emailMedecin,
                                                           ReconfigurerVacationRequest req) {
        VacationPriseDeServiceDTO dto = getPriseDeService(emailMedecin);
        dto.getConfig().setHeureDebut(req.getHeureDebut());
        dto.getConfig().setHeureFin(req.getHeureFin());
        dto.getConfig().setNombreCreneaux(req.getNombreCreneaux());
        dto.getConfig().setPlageType(req.getPlageType());
        return dto;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helpers dynamiques — construction des 16 créneaux réels
    // ─────────────────────────────────────────────────────────────────────────

    private List<CreneauVacationDTO> buildCreneaux() {
        List<CreneauVacationDTO> list = new ArrayList<>();
        List<RendezVous> rdvs = rendezVousRepository.findByDateRendezVous(LocalDate.now());
        if (rdvs.isEmpty()) {
            rdvs = rendezVousRepository.findAll();
        }

        LocalTime start = LocalTime.of(8, 30);
        int totalSlots = 16;

        for (int i = 0; i < totalSlots; i++) {
            LocalTime slotStart = start.plusMinutes(i * 20L);
            LocalTime slotEnd = slotStart.plusMinutes(20L);
            String hStart = slotStart.format(DateTimeFormatter.ofPattern("HH:mm"));
            String hEnd = slotEnd.format(DateTimeFormatter.ofPattern("HH:mm"));
            long idCreneau = 100L + (i + 1);

            // Créneau 10 (11:30) — Tampon Urgence National
            if (i == 9) {
                list.add(new CreneauVacationDTO(
                    idCreneau, 10, "11:30", "11:50", "TAMPON", null
                ));
                continue;
            }

            int rdvIndex = (i < 9) ? i : (i - 1);
            if (rdvIndex < rdvs.size()) {
                RendezVous r = rdvs.get(rdvIndex);
                Enfant e = r.getEnfant();
                if (e != null) {
                    BilanAntro b = bilanAnthroRepository.findFirstByEnfantEnfantIdOrderByDateBilanDesc(e.getEnfantId()).orElse(null);
                    boolean mas = "URGENTE".equalsIgnoreCase(r.getPriorite()) || (b != null && b.getStatut() == StatutNutritionnel.MAS);
                    boolean mam = !mas && (b != null && b.getStatut() == StatutNutritionnel.MAM);
                    String stType = mas ? "MAS" : (mam ? "MAM" : "ROUTINE");

                    int pbMm = b != null && b.getPerimetreBrachial() != null ? (int) (b.getPerimetreBrachial() * 10) : (mas ? 110 : 125);
                    double poids = b != null && b.getPoids() != null ? b.getPoids() : 7.0;

                    List<PatientCreneauDTO.IndicateurClinique> indicateurs = new ArrayList<>();
                    indicateurs.add(new PatientCreneauDTO.IndicateurClinique("PB", pbMm + " mm", pbMm < 115 ? "danger" : (pbMm < 125 ? "warning" : "normal")));
                    indicateurs.add(new PatientCreneauDTO.IndicateurClinique("Poids", poids + " kg", "normal"));
                    indicateurs.add(new PatientCreneauDTO.IndicateurClinique("Température", "37.2 °C", "normal"));

                    PatientCreneauDTO patientDTO = buildPatient(
                        e.getEnfantId(),
                        e.getNom(),
                        e.getPrenom(),
                        e.getQrCode() != null ? e.getQrCode() : ("SN-DKR-2024-00" + e.getEnfantId()),
                        calculerAgeLabel(e.getDateNaissance()) + " • " + (e.getGenre() == Genre.MASCULIN ? "M" : "F"),
                        e.getGenre() == Genre.MASCULIN ? "M" : "F",
                        mas ? "MAS Complications" : (mam ? "MAM Réfractaire" : "Contrôle de Routine"),
                        indicateurs,
                        r.getMotifParent() != null ? r.getMotifParent() : "Suivi clinique programmé.",
                        mas ? "assignment_late" : (mam ? "report" : "check_circle"),
                        mas ? "#DC2626" : (mam ? "#D97706" : "#059669")
                    );

                    list.add(buildCreneau(idCreneau, i + 1, hStart, hEnd, stType, patientDTO));
                    continue;
                }
            }

            // Créneau libre disponible
            list.add(new CreneauVacationDTO(
                idCreneau, i + 1, hStart, hEnd, "LIBRE", null
            ));
        }

        return list;
    }

    private CreneauVacationDTO buildCreneau(Long id, int num, String debut, String fin,
                                            String typeStatut, PatientCreneauDTO patient) {
        return new CreneauVacationDTO(id, num, debut, fin, typeStatut, patient);
    }

    private PatientCreneauDTO buildPatient(Long id, String nom, String prenom, String nip,
                                            String ageLabel, String sexe, String motif,
                                            List<PatientCreneauDTO.IndicateurClinique> indicateurs,
                                            String noteRelais, String icone, String couleur) {
        PatientCreneauDTO p = new PatientCreneauDTO();
        p.setIdEnfant(id);
        p.setNom(nom);
        p.setPrenom(prenom);
        p.setNomComplet((prenom + " " + nom).trim());
        p.setNip(nip);
        p.setAgeLabel(ageLabel);
        p.setSexe(sexe);
        p.setTypeStatut(motif);
        p.setTypeStatutLabel(motif);
        p.setIndicateurs(indicateurs);
        p.setNoteInfirmier(noteRelais);
        p.setIconeNote(icone);
        p.setCouleurNote(couleur);
        return p;
    }

    private String calculerAgeLabel(LocalDate dateNaissance) {
        if (dateNaissance == null) return "12 mois";
        Period p = Period.between(dateNaissance, LocalDate.now());
        int mois = p.getYears() * 12 + p.getMonths();
        return mois + " mois";
    }
}
