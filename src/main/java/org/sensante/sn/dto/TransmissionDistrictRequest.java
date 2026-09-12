package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransmissionDistrictRequest {
    private String dateCloture;
    private String signatureAgenteId;
    private String notesTransmission;
}
