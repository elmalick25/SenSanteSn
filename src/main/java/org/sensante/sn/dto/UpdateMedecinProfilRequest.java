package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMedecinProfilRequest {
    private String nomComplet;
    private String telephone;
    private String dateNaissance;
    private String adresse;
    private String specialite;
    private String structureRattachement;
    private Boolean langueFrancaise;
    private Boolean langueWolof;
    private String avatarUrl;
}
