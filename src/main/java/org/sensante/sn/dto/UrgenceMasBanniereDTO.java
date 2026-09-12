package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UrgenceMasBanniereDTO {
    private Long alerteId;
    private Long enfantId;
    private String nomCompletEnfant; // "Mamadou Ndiaye"
    private Integer ageMois;         // 14
    private String ageTexte;        // "14 mois"
    private String matricule;        // "#SEN-MED-2489"
    private Double muacMm;           // 112.0
    private String muacTexte;        // "112 mm (<115)"
    private Boolean oedemes;         // true
    private String oedemesTexte;     // "Présents (+)"
    private String tuteurNom;        // "Fatou Fall"
    private String tuteurTelephone;  // "77 412 89 20"
    private String adresse;          // "Médina Rue 22 x Corniche"
    private String noteClinique;
    private Boolean nonAcquittee;    // true
    private String dateAlerte;
}
