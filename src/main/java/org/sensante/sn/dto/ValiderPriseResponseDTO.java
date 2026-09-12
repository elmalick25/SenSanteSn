package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ValiderPriseResponseDTO {
    private Boolean succes;
    private String message;
    private PriseNutritionnelleDTO priseValidee;
    private TraitementNutritionnelDTO traitementMisAJour;
}
