package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StocksAtpeOverviewDTO {
    private Integer totalCartonsPlumpyNut;
    private Double autonomieMoyenneJours;
    private Integer structuresEnAlerteRupture;
    private Integer structuresEnVigilance;
    private Integer debitDistributionQuotidien;
    private Double evolutionDebitPourcent;
    private Integer cartonsEnTransitPna;
    private String dateLivraisonPrevuePna;
    private String bordereauLivraisonPna;
    private List<StructureStockMatrixDTO> matriceStructures;
    private List<ZoneResilienceScoreDTO> scoresResilienceZones;
    private String prochaineLivraisonCamion;
    private String bonCommandeActifPna;
}
