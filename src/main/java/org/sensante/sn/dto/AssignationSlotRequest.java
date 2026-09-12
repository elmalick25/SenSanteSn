package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignationSlotRequest {
    private Long patientId;
    private String slotId;
    private Integer boxId;
    private String motif;
}
