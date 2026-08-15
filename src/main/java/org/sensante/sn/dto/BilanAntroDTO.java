package org.sensante.sn.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import org.sensante.sn.Model.Enfant;
import org.sensante.sn.Model.StatutNutritionnel;


import java.time.LocalDate;

@Data
public class BilanAntroDTO {
    private LocalDate dateBilan;
    private Double poids;
    private Double taille;
    private Double perimetreBrachial;
    private Double zScorePoidsTaille;
    private Double zScorePoidsAge;

    private StatutNutritionnel statut;

    private Enfant enfant;
}
