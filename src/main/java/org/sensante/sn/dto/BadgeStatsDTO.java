package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BadgeStatsDTO {
    private long totalBadges;
    private long totalValides;
    private long totalEnAttente;
    private long totalSuspendus;

    // Métriques par Corps de Métier (Mini Bento Grid)
    private long medecinsChefsCount;
    private long agentsSanteCount;
    private long superviseursCount;
    private long administrateursCount;
    private long parentsCount;
}
