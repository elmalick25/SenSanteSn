package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrdreReapproPnaResponse {
    private String bonCommandeNumero;
    private Integer quantiteCommandee;
    private String statut;
    private String dateLivraisonPrevue;
    private String message;
    private String horodatage;
}
