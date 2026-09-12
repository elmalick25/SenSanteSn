package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnfantTactiqueDTO {
    private Long id;
    private String matricule;            // "SEN-MED-2489"
    private String nom;                  // "Ndiaye"
    private String prenom;               // "Mamadou"
    private String nomComplet;           // "Mamadou Ndiaye"
    private String initiales;            // "MN"
    private Integer ageMois;             // 14
    private String ageTexte;             // "14 mois"
    private String genre;                // "MASCULIN" / "FEMININ"

    // Tuteur & Localisation
    private String tuteurNom;            // "Fatou Fall"
    private String tuteurTelephone;      // "77 412 89 20"
    private String adresse;              // "Médina Rue 22 x Corniche • C.14"
    private String secteur;              // "Médina Rue 16-24"
    private Boolean anomalieLocalisation;// true si passage manqué ou wrong location

    // Statut Nutritionnel & MUAC
    private String statutNutritionnel;   // "MAS", "MAM", "NORMAL"
    private Double muacMm;               // 112.0
    private String muacBadgeTexte;       // "MAS • 112 mm"
    private String statutCliniqueDetail; // "Œdèmes: Présents (Grade +)", "Sans œdème", etc.
    private Boolean alerteCritique;      // true si MAS non acquitté

    // Évolution Poids / MUAC
    private String evolutionTexte;       // "Hier (-4mm / -300g)", "Il y a 3j (+2mm / +150g)"
    private String directionTendance;    // "BAISSE", "HAUSSE", "STABLE", "INCONNU"
    private Double poidsActuelKg;        // 6.2
    private String statutSurveillance;   // "Dernier PB: 125mm (Chute)", "Vaccin Pentavalent 3: OK"

    // Ration ATPE
    private Integer sachetsRestants;     // 0, 4, 8, etc.
    private String rationStatutTexte;    // "Épuisé (0 sachet)", "4 sachets restants", "Sevrage ATPE réussi"
    private String rationSousTitre;      // "Recharge dans 2 jours", "Observance correcte"
    private String statutStockBadge;     // "EPUISE", "VALIDE", "SEVRAGE", "NA"

    // Type d'action immédiate suggérée
    private String actionPrincipaleType; // "REFERER_SAMU", "DISPENSER_ATPE", "VISITE_DOMICILE", "RELANCER", "CLOTURER", "PLANIFIER_VISITE"
    private String actionPrincipaleLabel;// "Référer SAMU", "Dispenser ATPE", etc.
    private Boolean perduDeVue;          // true si non vu depuis > 30j
}
