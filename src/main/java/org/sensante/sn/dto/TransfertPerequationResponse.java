package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransfertPerequationResponse {
    private String numeroBonTransfert;
    private String statut;
    private Double donneurNouvelleAutonomie;
    private Double beneficiaireNouvelleAutonomie;
    private Boolean beneficiaireSortieCrise;
    private String message;
    private String horodatage;
}
