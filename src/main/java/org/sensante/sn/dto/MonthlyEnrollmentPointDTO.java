package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyEnrollmentPointDTO {
    // Champs Français
    private String moisLabel;
    private int annee;
    private long valeurReelle;
    private long valeurCible;
    private String jalonTitre;
    private boolean isMilestone;

    // Champs Frontend Barometre model
    private String month;
    private String monthLabel;
    private long actualEnrolled;
    private long targetEnrolled;
    private double growthRate;
    private String milestoneDescription;

    public MonthlyEnrollmentPointDTO(String moisLabel, int annee, long valeurReelle, long valeurCible, String jalonTitre, boolean isMilestone) {
        this.moisLabel = moisLabel;
        this.annee = annee;
        this.valeurReelle = valeurReelle;
        this.valeurCible = valeurCible;
        this.jalonTitre = jalonTitre;
        this.isMilestone = isMilestone;

        // Synchronisation Frontend
        this.month = moisLabel;
        this.monthLabel = moisLabel;
        this.actualEnrolled = valeurReelle;
        this.targetEnrolled = valeurCible;
        this.milestoneDescription = jalonTitre;
        this.growthRate = (valeurCible > 0) ? Math.round(((double) valeurReelle / valeurCible * 100.0) * 10.0) / 10.0 : 0.0;
    }
}
