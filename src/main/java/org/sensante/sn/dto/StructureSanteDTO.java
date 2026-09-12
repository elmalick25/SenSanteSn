package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.sensante.sn.Model.AgrementCren;
import org.sensante.sn.Model.StatutStructure;
import org.sensante.sn.Model.TypeStructure;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StructureSanteDTO {
    private Long id;
    private String codeNational;
    private String nom;
    private TypeStructure type;
    private StatutStructure statut;
    private String localisation;
    private String region;
    private String district;
    private String commune;
    private Double latitude;
    private Double longitude;
    private Boolean gpsValide;
    private AgrementCren agrementCren;
    private Integer capaciteLits;
    private Integer litsReanimation;
    private Boolean urgences247;
    private Boolean blocOperatoire;
    private Boolean secteurRural;
    private String responsable;
    private String telephone;
}
