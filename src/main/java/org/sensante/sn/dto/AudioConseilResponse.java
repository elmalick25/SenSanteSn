package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AudioConseilResponse {
    private String texteFrancais;
    private String texteWolof;
    private String statutNutritionnel; // "NORMAL", "MAM", "MAS"
    private String audioUrl;
    private String recommandationClinique;
    private boolean urgenceVitale;
}
