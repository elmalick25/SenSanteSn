package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IssueCliniqueStructureDTO {
    private String structureNom;
    private Integer totalCas;
    private Integer pourcentAmbulatoire;
    private Integer pourcentHospitalisation;
    private Integer pourcentRavitaillement;
    private Integer pourcentEnAttente;
    private String libelleDetail;
}
