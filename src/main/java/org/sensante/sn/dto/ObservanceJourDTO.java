package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ObservanceJourDTO {
    private LocalDate date;
    private String jourNomCourt; // "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Auj"
    private Integer prisesEffectuees; // 2
    private Integer prisesPrescrites; // 2
    private Double pourcentage; // 100.0 ou 50.0
    private Boolean estAujourdhui;
}
