package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NouveauBilanRequest {
    private String matricule;
    private Double poidsKg;
    private Double tailleCm;
    private Double muacMm;
    private Boolean oedemes;
    private String notes;
}
