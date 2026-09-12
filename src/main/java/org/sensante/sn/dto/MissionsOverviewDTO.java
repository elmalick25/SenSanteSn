package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MissionsOverviewDTO {
    private long totalMissionsActives;
    private long aIntervenir;
    private long enCours;
    private long rapportsSoumis;
    private long validees;
}
