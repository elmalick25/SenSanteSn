package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.sensante.sn.Model.PrioriteMission;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateMissionRequest {
    private String zoneCiblee;
    private String agentNom;
    private String objectifChiffre;
    private LocalDate dateLimite;
    private LocalTime heureEcheance;
    private PrioriteMission priorite;
    private Boolean dotationMuac;
    private Boolean dotationAtpe;
    private Boolean dotationRegistres;
    private Boolean deployerImmediatement;
}
