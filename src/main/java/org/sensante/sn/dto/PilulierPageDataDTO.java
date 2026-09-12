package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PilulierPageDataDTO {
    private Long enfantId;
    private String nomCompletEnfant;
    private Integer ageMois;
    private String statutNutritionnel; // MAM, MAS, NORMAL
    private String perimetreBrachial; // ex: 11.9 cm
    private String synchronisationStatut; // "Fiche synchronisée à 07:45"
    private Boolean estHorsLigne;

    private TraitementNutritionnelDTO traitement;
    private List<PriseNutritionnelleDTO> prisesAujourdhui;
    private List<ObservanceJourDTO> observance7Jours;
    private String tauxObservanceAffiche; // "13/14 prises respectées (93%)"
    private Double pourcentageObservance; // 92.85

    private List<RecetteNutritionnelleDTO> recettes;
}
