package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TelemetryPointDTO {
    private String timeLabel; // "00h", "04h", "08h", etc.
    private double cpuPercent; // e.g. 28.4%
    private double ramPercent; // e.g. 62.1%
    private double latencyMs;  // e.g. 42 ms
}
