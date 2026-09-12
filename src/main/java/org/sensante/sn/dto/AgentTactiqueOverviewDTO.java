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
public class AgentTactiqueOverviewDTO {
    private AgentIdentiteDTO identite;
    private UrgenceMasBanniereDTO urgencePrioritaire;
    private AgentKpiMetricsDTO kpis;
    private List<EnfantTactiqueDTO> cohorte;
    private Integer totalAlertesActives;
    private Integer pageCourante;
    private Integer totalPages;
    private List<String> secteursDisponibles;
    private List<String> tranchesAgeDisponibles;
    private String dateDuJour;
    private String zoneGeographique;
}
