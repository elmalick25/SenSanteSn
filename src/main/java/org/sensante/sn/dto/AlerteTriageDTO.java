package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlerteTriageDTO {
    private Long id;
    private Long enfantId;
    private String nomComplet;
    private Integer ageMois;
    private String centreSanteNom;
    private String zoneNom;
    private Double perimetreBrachial; // in mm
    private Boolean oedemes;
    private Integer heuresSansPriseEnCharge;
    private String typeAlerte; // "MAS_SEVERE", "RUPTURE_ATPE", "VISITE_RELAIS", "TRANSFERT"
    private String statutUrgence; // "CRITIQUE", "ELEVEE", "VIGILANCE"
    private String libelleDelai;
    private Boolean acquittee;
}
