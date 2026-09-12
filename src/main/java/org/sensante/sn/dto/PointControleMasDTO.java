package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointControleMasDTO {
    private String heureLabel;
    private Double tauxMas;
    private Double seuilUcl;
    private Double seuilLcl;
    private Boolean estPicAlerte;
    private String annotationPic;
}
