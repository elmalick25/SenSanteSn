package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.sensante.sn.Model.PrioriteMission;
import org.sensante.sn.Model.StatutMission;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MissionTerrainDTO {
    private Long id;
    private String codeMission;
    private String zoneCiblee;
    private String posteSante;
    private String agentNom;
    private String agentInitiale;
    private String agentStatut;
    private String objectifChiffre;
    private Integer progression;
    private Integer cibleAtteinte;
    private Integer cibleTotale;
    private LocalDate dateLimite;
    private LocalTime heureEcheance;
    private String echeanceLibelle;
    private PrioriteMission priorite;
    private StatutMission statut;
    private Boolean dotationMuac;
    private Boolean dotationAtpe;
    private Boolean dotationRegistres;
}
