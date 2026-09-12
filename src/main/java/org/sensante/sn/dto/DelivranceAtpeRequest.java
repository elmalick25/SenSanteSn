package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DelivranceAtpeRequest {
    private String matricule;
    private Integer nombreSachets;
    private String motif;
    private String lotNumero;
}
