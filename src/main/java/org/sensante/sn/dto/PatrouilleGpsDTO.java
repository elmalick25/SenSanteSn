package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatrouilleGpsDTO {
    private String id;
    private String nom;
    private String code;
    private String type; // "RELAIS", "VEHICULE_SUPERVISEUR"
    private String zone;
    private Double xPos;
    private Double yPos;
    private String derniereSynchro;
    private Boolean actif;
}
