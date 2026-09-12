package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupervisedStructureDTO {
    private String code;
    private String name;
    private String type; // HUB, HOPITAL, CRENAS, POSTE
    private boolean isHub;
    private String commune;
}
