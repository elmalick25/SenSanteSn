package org.sensante.sn.dto;

import lombok.Getter;
import lombok.Setter;
import org.sensante.sn.Model.Role;

@Getter
@Setter
public class UtilisateurResponseDTO {

    private Long idUser;
    private String nomUser;
    private String prenomUser;
    private String email;
    private Role role;
}