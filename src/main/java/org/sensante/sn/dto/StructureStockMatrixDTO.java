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
public class StructureStockMatrixDTO {
    private String structureNom;
    private String roleLogistique;
    private String sousTitre;
    private Boolean enAlerteRupture;
    private Boolean hubDonneur;
    private List<StockProduitDetailDTO> stocksIntrants;
}
