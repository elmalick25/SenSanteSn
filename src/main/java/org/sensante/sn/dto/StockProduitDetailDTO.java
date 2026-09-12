package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockProduitDetailDTO {
    private String codeProduit;
    private String nomProduit;
    private Double autonomieJours;
    private Integer quantiteDisponible;
    private String uniteMesure;
    private String niveauAlerte; // RUPTURE_IMMINENTE, CRITIQUE, VIGILANCE, SECURITAIRE
}
