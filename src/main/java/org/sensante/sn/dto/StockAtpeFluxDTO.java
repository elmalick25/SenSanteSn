package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockAtpeFluxDTO {
    private Integer stockInitialMatin;
    private Integer entreesRavitaillement;
    private Integer sortiesRationsTerrain;
    private Integer stockActuelVerifie;
    private Integer ecartDetecte;
    private Double joursAutonomie;
    private Integer seuilCritiqueDistrict;
    private Integer capaciteMaxDistrict;
    private String depotNom;
    private String zoneEcart;
}
