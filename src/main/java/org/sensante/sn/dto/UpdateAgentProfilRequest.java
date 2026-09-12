package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAgentProfilRequest {
    private String nomComplet;
    private String telephone;
    private String dateNaissance;
    private String residence;
    private String structureSante;
    private String zonesIntervention;
    private String langueService;
    private String avatarUrl;
}
