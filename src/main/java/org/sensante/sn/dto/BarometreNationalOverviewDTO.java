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
public class BarometreNationalOverviewDTO {
    // Champs Français
    private String exercice; // "Exercice Annuel 2024"
    private String trimestre; // "Vue Trimestrielle T4 (Oct-Déc)"
    private String horodatageGmt; // "Dakar GMT 11:42"
    private String statutRegionsPill; // "Données Consolidées 14 Régions Médicales"

    private String moyenneMensuelleTexte; // "+123 550 / mois"
    private double couvertureCibleePercent; // 89.2%
    private double indexGlobalPerformancePse; // 93.4 / 100

    // Les 4 KPI sous forme de liste pour le frontend
    private List<BarometreKpiItemDTO> kpis;

    // Métadonnées KPI détaillées
    private BarometreKpiDTO kpiDetails;

    // Évolution temporelle (12 mois)
    private List<MonthlyEnrollmentPointDTO> enrollmentSeries;

    // Classement des 14 Régions
    private List<RegionPerformanceDTO> regionsRanking;
    private List<RegionPerformanceDTO> regionalRankings;

    // Piliers PSE
    private List<PsePillarDTO> psePillars;

    // Agrégats typés pour le Frontend BarometreNationalOverview
    private String generatedAt;
    private String periodYear;
    private String periodQuarter;
    private double globalPerformanceIndex;
    private double averageMonthlyGain;
    private double nationalTargetCoverage;
}
