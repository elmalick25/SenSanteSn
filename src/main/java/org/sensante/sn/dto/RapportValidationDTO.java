package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.sensante.sn.Model.StatutValidationRapport;
import org.sensante.sn.Model.TypeMissionValidation;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RapportValidationDTO {
    private Long id;
    private String numeroRapport;
    private TypeMissionValidation typeMission;
    private String titreMission;
    private String agentNom;
    private String agentRole;
    private String agentInitiales;
    private String zoneCiblee;
    private String posteSante;
    private Integer distanceFoyerMetres;
    private Double latitude;
    private Double longitude;
    private Boolean geofenceConforme;
    private String heureCheckIn;
    private String heureCheckOut;
    private String dureeTerrain;
    private Integer enfantsDepistes;
    private Integer cibleInitiale;
    private Integer tauxCiblePourcent;
    private Integer masDetectes;
    private Integer mamDetectes;
    private Integer atpeDelivresCartons;
    private String lotAtpe;
    private String observationsTerrain;
    private String prioriteClinique;
    private LocalDateTime dateSoumission;
    private String tempsRelatif;
    private StatutValidationRapport statutValidation;
    private String motifComplement;
    private String commentaireMedecinChef;
    private List<PreuvePhotoDTO> preuvesPhotos;
}
