package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FicheExpressDTO {
    // Confirmation
    private String matricule;            // "SEN-MED-2489"
    private String horodatageValidation; // "Horodaté avec succès à 08:44:12"
    private String heureScan;            // "08:44:12"

    // Enfant
    private Long enfantId;
    private String nomCompletEnfant;     // "Mamadou Ndiaye"
    private String prenom;               // "Mamadou"
    private String nom;                  // "Ndiaye"
    private Integer ageMois;             // 14
    private String ageTexte;             // "14 mois"
    private String dateNaissanceTexte;   // "Né le 12 Août 2023"
    private String sexe;                 // "M"
    private String photoEnfantUrl;
    private String idRegistre;           // "SEN-MED-2489"
    private String secteurRue;           // "Médina Rue 22 x Corniche"

    // Parent / Tutrice
    private String nomTuteur;            // "Fatou Fall (Mère)"
    private String telephoneTuteur;      // "+221 77 412 89 20"
    private String langue;               // "Langue : Wolof / Français"
    private String concession;           // "Médina Concession Diop, Carré 14"
    private String suiviCommunautaire;   // "Assidue (3/3 visites)"
    private String photoTuteurUrl;
    private Boolean presenteAuxPesees;   // true

    // Diagnostic & Tendance
    private String statutNutritionnel;   // "MAS", "MAM", "NORMAL"
    private String statutBadgeTexte;     // "URGENCE MAS (<115mm)"
    private Double muacMm;               // 112.0
    private String muacZone;             // "Zone Rouge Sévère"
    private Boolean oedemes;             // true
    private String oedemesGrade;         // "Grade +"
    private String oedemesNote;          // "Godet visible membres inférieurs (Prise en charge prioritaire)"

    // Historique Pondéral (3 pesées)
    private List<PeseeHistoriqueDTO> historiquePonderal;

    // Télémétrie Stock Domicile
    private Integer rationRestanteDomicile; // 0
    private String rationDomicileTexte;     // "0 sachet (Épuisé depuis 48h)"
    private Boolean ruptureStockDomicile;   // true
}
