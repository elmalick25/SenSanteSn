package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMedecinProfilResponse {
    private boolean succes;
    private String message;
    private String horodatage;
    private MedecinProfilDTO profil;
}
