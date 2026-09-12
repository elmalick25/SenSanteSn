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
public class RecetteNutritionnelleDTO {
    private String id; // bouillie-421, puree-patate-douce
    private String titre;
    private String sousTitreBadge;
    private String badgeCouleur; // secondary, orange
    private String description;
    private String photoUrl;
    private String photoAlt;
    private List<String> ingredients;
    private String conseilBadienGox;
    private String tempsPreparation;
    private String beneficeSante;
    private List<String> etapesPreparation;
}
