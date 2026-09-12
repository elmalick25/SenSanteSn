package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.sensante.sn.Model.StatutNutritionnel;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointPeseeDTO {
    private Long id;
    private LocalDate dateBilan;
    private int ageMois;
    private Double poidsKg;
    private Double tailleCm;
    private Double perimetreBrachialCm;
    private Double zScorePoidsAge;
    private Double zScorePoidsTaille;
    private String examinateurNom;
    private String examinateurTitre;
    private String structureNom;
    private StatutNutritionnel statut;
}
