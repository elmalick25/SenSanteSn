package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BarometreKpiItemDTO {
    private String id;
    private String label;
    private double value;
    private String formattedValue;
    private String unit;
    private double progressionPercentage;
    private String progressionLabel;
    private boolean isPositiveTrend;
    private String subtitle;
    private String badgeText;
    private String colorTheme; // 'emerald' | 'amber' | 'blue' | 'purple'
    private String icon;
}
