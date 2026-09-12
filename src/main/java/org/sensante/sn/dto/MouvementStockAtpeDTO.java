package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MouvementStockAtpeDTO {
    private String numeroLot;          // "PN-2024-098"
    private int dotationInitiale;      // 100
    private int delivresTerrain;       // 63
    private int restePhysique;         // 37
    private int ecartStock;            // 0
    private String statutEcart;        // "CONFORME"
    private int consommationPourcent;  // 63
    private String quotaPreserveTexte; // "Quota préservé : 37 sachets pour astreinte de nuit"
    private double variancePourcent;   // 0.00
    private boolean inventaireValide;  // true
}
