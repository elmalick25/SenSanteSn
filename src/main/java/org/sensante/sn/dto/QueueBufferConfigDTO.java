package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QueueBufferConfigDTO {
    private int bufferInterConsultationMinutes; // e.g. 15 min
    private int toleranceRetardMinutes;          // e.g. 10 min
    private int plafondUrgencesParVacation;      // e.g. 4 cas
    private int tauxOccupationCalibrePct;        // e.g. 78%
    private int reductionAttenteEstimeePct;      // e.g. 42%
}
