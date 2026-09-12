package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentKpiMetricsDTO {
    // KPI 1: Cohorte Active
    private Integer enfantsActifsSuivis; // 148
    private String variationSemaine;    // "+6 sem."
    private String statutCarnet;        // "100% carnet validé"

    // KPI 2: Alertes MAS (<115mm)
    private Integer alertesMasCritiques; // 3
    private String badgeMas;             // "Critique"
    private String sousTitreMas;         // "1 référé, 2 sous protocole"

    // KPI 3: Cas MAM (115-124mm)
    private Integer casMamTotal;         // 19
    private String sousTitreMam;         // "14 sous ATPE"
    private String statutMam;            // "5 en stabilisation"

    // KPI 4: Perdus de Vue (>30j)
    private Integer perdusDeVue;         // 8
    private String badgePerdus;          // "Relance urgente"
    private String actionPerdus;         // "Visites domiciliaires prévues"

    // KPI 5: Stock ATPE Cartons
    private Integer stockAtpeCartons;    // 34
    private Integer pourcentageStock;    // 68
    private String autonomieEstimee;     // "Suffisant pour ~12 jours"
}
