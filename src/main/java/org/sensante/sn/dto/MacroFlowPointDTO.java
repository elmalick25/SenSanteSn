package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MacroFlowPointDTO {
    private String labelDate;
    private int volumePediatrie;
    private int volumeMaternite;
    private int volumeUrgences;
    private int volumePharmacie;
}
