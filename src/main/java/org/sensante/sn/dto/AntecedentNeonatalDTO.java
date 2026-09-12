package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AntecedentNeonatalDTO {
    private Double poidsNaissance;
    private Double tailleNaissance;
    private Double perimetreCranien;
    private String scoreApgar;
    private String statutDrepanocytose;
    private String modeAccouchement;
    private Boolean allaitementMaternelExclusif;
    private String materniteOrigine;
}
