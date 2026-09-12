package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.sensante.sn.Model.StatutValidationRapport;
import org.sensante.sn.Model.TypeMissionValidation;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RapportValidationSummaryDTO {
    private Long id;
    private String numeroRapport;
    private TypeMissionValidation typeMission;
    private String agentNom;
    private String agentRole;
    private String agentInitiales;
    private String zoneCiblee;
    private String posteSante;
    private String tempsRelatif;
    private Integer masDetectes;
    private Integer mamDetectes;
    private Integer enfantsDepistes;
    private Integer tauxCiblePourcent;
    private Integer atpeDelivresCartons;
    private Boolean geofenceConforme;
    private Integer distanceFoyerMetres;
    private String prioriteClinique;
    private StatutValidationRapport statutValidation;
}
