package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransfertPerequationRequest {
    private String posteDonneur;
    private String posteBeneficiaire;
    private Integer quantiteCartons;
    private String vecteurTransport;
    private String chauffeurRelais;
}
