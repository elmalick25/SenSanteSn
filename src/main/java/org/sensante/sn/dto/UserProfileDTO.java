package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.sensante.sn.Model.Role;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    private Long idUser;
    private String nom;
    private String prenom;
    private String nomComplet;
    private String nomUtilisateur;
    private String email;
    private String telephone;
    private LocalDate dateNaissance;
    private String adresseActuelle;
    private String adressePermanente;
    private String ville;
    private String codePostal;
    private String pays;
    private String avatarUrl;
    private Role role;
}
