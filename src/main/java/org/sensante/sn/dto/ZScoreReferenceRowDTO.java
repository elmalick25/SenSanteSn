package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ZScoreReferenceRowDTO {
    private String id;
    private int ageMois;
    private String sexe; // "F" ou "M"
    private String indicateur; // "POIDS_AGE" ou "TAILLE_AGE"
    private double masMoins3ET;
    private double mamMoins2ET;
    private double medianeOms;
    private double plus2ET;
    private String unite; // "kg" ou "cm"
    private String statutValidation; // "CONFORME_OMS" ou "DEROGATION"
}
