package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BarometreKpiDTO {
    // KPI 1: Enfants Enrôlés (National)
    private long totalEnfantsEnroles; // 1 482 630
    private double variationEnrolesPercent; // +14.2%
    private double objectifNationalPercent; // 88.5%

    // KPI 2: Dépistages Réalisés (MUAC/Brachial)
    private long depistagesRealises; // 3 845 120
    private double variationDepistagesPercent; // +18.7%
    private String perimetreDepistages; // "Consultations & Badienou Gokh"

    // KPI 3: Cas MAS Guéris (Vies Sauvées)
    private long casMasGueris; // 94 210
    private double variationGuerisPercent; // +8.4%
    private double tauxGuerisonPercent; // 92.4%
    private String statutGuerison; // "> cibles OMS (CREN/URENI)"

    // KPI 4: Dotations ATPE Sécurisées
    private long dotationsAtpeCartons; // 428 500
    private double variationAtpePercent; // +22.1%
    private String tracabiliteStatut; // "Traçabilité zéro rupture PNA"
}
