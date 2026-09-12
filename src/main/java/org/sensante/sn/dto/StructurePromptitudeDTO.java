package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StructurePromptitudeDTO {
    private String structureNom;
    private String typeStructure;
    private List<String> creneaux; // 10 créneaux (08h à 18h)
    private Double scoreJourPourcent;
    private String clotureHeure;
    private String statutBadge; // OK, RETARD, CRITIQUE, GROUPE
}
