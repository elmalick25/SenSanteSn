package org.sensante.sn.service.ia;

import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Moteur de règles PCIMA OMS 2013.
 * Protocole : Prise en Charge Intégrée de la Malnutrition Aiguë (WHO/UNICEF).
 *
 * DÉCISION ARCHITECTURALE : Ce service est intentionnellement en Java pur (règles
 * déterministes), sans ML. Le protocole OMS PCIMA est une règle médicale publiée —
 * une boîte noire (neural net) n'est pas acceptable médicalement car elle empêche
 * l'audit et la certification réglementaire.
 */
@Service
public class PcimaTriageService {

    private final OmsZscoreService omsZscoreService;

    public PcimaTriageService(OmsZscoreService omsZscoreService) {
        this.omsZscoreService = omsZscoreService;
    }

    // ══════════════════════════════════════════════════════════════════════════
    // RÈGLE 1 — Statut nutritionnel (MUAC + z-score + œdèmes)
    // Source : WHO PCIMA 2013, Section 3.2 & UNICEF CMAM Framework 2020
    // ══════════════════════════════════════════════════════════════════════════
    public StatutNutritionnel calculerStatut(
            double muacMm,
            double poidKg,
            int ageMois,
            String sexe,
            boolean oedemesBilatéraux
    ) {
        // Critère 1 — Œdèmes bilatéraux → MAS systématique (kwashiorkor)
        if (oedemesBilatéraux) return StatutNutritionnel.MAS;

        // Critère 2 — MUAC (Périmètre Brachial)
        if (muacMm < 115.0) return StatutNutritionnel.MAS;
        if (muacMm < 125.0) return StatutNutritionnel.MAM;

        // Critère 3 — Z-score poids-pour-âge (si MUAC ambigu ou absent)
        double zscore = omsZscoreService.calculerZscorePoidsAge(poidKg, ageMois, sexe);
        if (!Double.isNaN(zscore)) {
            if (zscore < -3.0) return StatutNutritionnel.MAS;
            if (zscore < -2.0) return StatutNutritionnel.MAM;
            if (zscore < -1.0) return StatutNutritionnel.A_RISQUE;
        }

        return StatutNutritionnel.NORMAL;
    }

    // ══════════════════════════════════════════════════════════════════════════
    // RÈGLE 2 — Ordre de priorité de triage
    // Retourne 1 (le plus urgent) à 4 (routine)
    // ══════════════════════════════════════════════════════════════════════════
    public int calculerOrdrePriorite(
            double muacMm,
            double poidKg,
            int ageMois,
            String sexe,
            boolean oedemesBilatéraux,
            List<String> signesDanger
    ) {
        // Signes de danger OMS → Priorité absolue P1
        // Ex : convulsions, léthargie, vomissements incoercibles, déshydratation sévère
        if (signesDanger != null && !signesDanger.isEmpty()) return 1;

        StatutNutritionnel statut = calculerStatut(muacMm, poidKg, ageMois, sexe, oedemesBilatéraux);

        return switch (statut) {
            case MAS      -> oedemesBilatéraux ? 1 : 2; // Kwashiorkor = P1, marasme = P2
            case MAM      -> 3;
            case A_RISQUE -> 4;
            case NORMAL   -> 4;
        };
    }

    // ══════════════════════════════════════════════════════════════════════════
    // RÈGLE 3 — Conseil clinique contextuel (pour le composant parent)
    // ══════════════════════════════════════════════════════════════════════════
    public ConseilClinique genererConseilParent(
            double muacMm,
            double poidKg,
            int ageMois,
            String sexe,
            String prenomEnfant
    ) {
        StatutNutritionnel statut = calculerStatut(muacMm, poidKg, ageMois, sexe, false);
        double zscore = omsZscoreService.calculerZscorePoidsAge(poidKg, ageMois, sexe);
        String zscoreStr = Double.isNaN(zscore) ? "N/A" : String.format("%.1f", zscore);

        return switch (statut) {
            case MAS -> new ConseilClinique(
                "CRITIQUE",
                "GAAW ! " + prenomEnfant + " doit être vu par un médecin aujourd'hui",
                "Le périmètre brachial de " + prenomEnfant + " (" + (int)muacMm + " mm) indique " +
                "une malnutrition aiguë sévère. Rendez-vous immédiatement au CRENAS ou CRENI le plus proche. " +
                "Z-score : " + zscoreStr,
                "mas_urgent",
                "#B91C1C"
            );
            case MAM -> new ConseilClinique(
                "ALERTE",
                prenomEnfant + " a besoin d'un suivi nutritionnel renforcé",
                "Le périmètre brachial (" + (int)muacMm + " mm) indique une malnutrition modérée. " +
                "Continuez les sachets ATPE Plumpy'Nut et ne manquez pas le prochain rendez-vous. " +
                "Z-score : " + zscoreStr,
                "mam_suivi",
                "#D97706"
            );
            case A_RISQUE -> new ConseilClinique(
                "SURVEILLANCE",
                prenomEnfant + " est à surveiller — continuez le suivi",
                "Le périmètre brachial (" + (int)muacMm + " mm) est dans la zone de surveillance. " +
                "Maintenez une alimentation diversifiée et venez aux pesées mensuelles. " +
                "Z-score : " + zscoreStr,
                "a_risque_surveillance",
                "#CA8A04"
            );
            default -> new ConseilClinique(
                "NORMAL",
                prenomEnfant + " grandit bien — continuez ainsi !",
                "Le périmètre brachial (" + (int)muacMm + " mm) est dans la zone normale. " +
                "Continuez l'allaitement maternel et les repas diversifiés. " +
                "Z-score : " + zscoreStr,
                "normal_wer",
                "#15803D"
            );
        };
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Types de données du domaine
    // ══════════════════════════════════════════════════════════════════════════
    public enum StatutNutritionnel { MAS, MAM, A_RISQUE, NORMAL }

    public record ConseilClinique(
        String alerteNiveau,
        String titre,
        String detail,
        String phraseAudioKey,   // Clé pour le fichier MP3 Wolof correspondant
        String couleurHex
    ) {}
}
