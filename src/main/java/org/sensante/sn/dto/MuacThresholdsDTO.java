package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MuacThresholdsDTO {
    private int masMaxMm; // e.g. 115 mm
    private int mamMaxMm; // e.g. 124 mm
    private int normalMinMm; // e.g. 125 mm
}
