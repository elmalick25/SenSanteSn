package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegionPerformanceDTO {
    // Champs Français
    private int rang;
    private String nomRegion;
    private double tauxCouverture;
    private String statutLabel;
    private String badgeType;
    private boolean isSousSeuilOms;

    // Champs Frontend Barometre model
    private int rank;
    private String regionName;
    private double coveragePercentage;
    private long enrolledCount;
    private long healedMasCount;
    private String statusLabel;
    private String statusTier; // 'elite' | 'high' | 'conform' | 'standard' | 'vigilance' | 'urgent'
    private boolean isCriticalZone;

    public RegionPerformanceDTO(int rang, String nomRegion, double tauxCouverture, String statutLabel, String badgeType, boolean isSousSeuilOms) {
        this.rang = rang;
        this.nomRegion = nomRegion;
        this.tauxCouverture = tauxCouverture;
        this.statutLabel = statutLabel;
        this.badgeType = badgeType;
        this.isSousSeuilOms = isSousSeuilOms;

        // Synchronisation automatique
        this.rank = rang;
        this.regionName = nomRegion;
        this.coveragePercentage = tauxCouverture;
        this.statusLabel = statutLabel;
        this.isCriticalZone = isSousSeuilOms;
        this.statusTier = mapBadgeTypeToTier(badgeType);
        this.enrolledCount = Math.round(tauxCouverture * 1250);
        this.healedMasCount = Math.round(tauxCouverture * 85);
    }

    private static String mapBadgeTypeToTier(String badgeType) {
        if (badgeType == null) return "standard";
        return switch (badgeType.toLowerCase()) {
            case "elite" -> "elite";
            case "eleve", "high" -> "high";
            case "vert", "conforme", "conform" -> "conform";
            case "vigilance" -> "vigilance";
            case "urgent", "appui pna", "appui d'urgence" -> "urgent";
            default -> "standard";
        };
    }
}
