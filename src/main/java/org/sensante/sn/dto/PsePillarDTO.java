package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PsePillarDTO {
    // Champs Français
    private String titre;
    private double tauxConformite;
    private String statutLabel;
    private String description;
    private String badgeCss;

    // Champs Frontend Barometre model
    private String pillarCode;
    private String title;
    private double achievementRate;
    private double targetRate;
    private String status;
    private String badgeColor;

    public PsePillarDTO(String titre, double tauxConformite, String statutLabel, String description, String badgeCss) {
        this.titre = titre;
        this.tauxConformite = tauxConformite;
        this.statutLabel = statutLabel;
        this.description = description;
        this.badgeCss = badgeCss;

        // Synchronisation Frontend
        this.pillarCode = "PSE-" + Math.abs(titre.hashCode() % 100);
        this.title = titre;
        this.achievementRate = tauxConformite;
        this.targetRate = 90.0;
        this.status = statutLabel;
        this.badgeColor = badgeCss.contains("emerald") || badgeCss.contains("ECFDF5") ? "emerald" : "blue";
    }
}
