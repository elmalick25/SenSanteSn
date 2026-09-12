package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AudioConseilRequest {
    private String langue; // "WO" ou "FR"
    private Double muacMm;
    private Double poidsKg;
    private Double tailleCm;
    private Boolean oedemes;
    private String prenomEnfant;
}
