package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ZoneResilienceScoreDTO {
    private String zoneNom;
    private Integer scoreGlobal;
    private Double autonomieGlobale;
    private Double rotationStock;
    private Double promptitudeCommande;
    private Double stockTampon;
    private Double conformiteSigl;
}
