package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoxPraticienDTO {
    private Integer boxId;             // 1, 2, 3
    private String nomBox;             // "Box 1 • Pédiatrie MAS"
    private String docteurNom;         // "Dr. Babacar Diop"
    private String specialite;         // "UREN • Spécialiste Malnutrition"
    private String statutService;      // "Garde" ou "En service"
    private Boolean isGarde;           // true
}
