package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidationQueueOverviewDTO {
    private long totalEnAttente;
    private long totalCrenasMas;
    private long totalDepistages;
    private long totalMenages;
    private long totalRavitaillement;
    private String tempsMoyenValidation;
    private String statutDhis2;
    private String derniereSyncHeure;
}
