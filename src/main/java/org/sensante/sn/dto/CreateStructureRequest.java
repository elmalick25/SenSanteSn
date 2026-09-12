package org.sensante.sn.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.sensante.sn.Model.AgrementCren;
import org.sensante.sn.Model.StatutStructure;
import org.sensante.sn.Model.TypeStructure;

@Data
public class CreateStructureRequest {
    private String codeNational;

    @NotBlank(message = "Le nom officiel de la structure est obligatoire")
    private String nom;

    @NotNull(message = "Le type d'établissement est obligatoire")
    private TypeStructure type;

    private StatutStructure statut = StatutStructure.OPERATIONNEL;

    private String localisation;

    @NotBlank(message = "La région médicale est obligatoire")
    private String region;

    private String district;
    private String commune;

    private Double latitude;
    private Double longitude;
    private Boolean gpsValide = false;

    private AgrementCren agrementCren = AgrementCren.AUCUN;

    private Integer capaciteLits = 0;
    private Integer litsReanimation = 0;
    private Boolean urgences247 = false;
    private Boolean blocOperatoire = false;
    private Boolean secteurRural = false;

    private String responsable;
    private String telephone;
}
