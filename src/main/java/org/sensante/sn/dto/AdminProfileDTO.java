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
public class AdminProfileDTO {
    private Long idUser;
    private String nom;
    private String prenom;
    private String nomComplet;
    private String email;
    private String telephone;
    private String indicatifPays;
    private LocalDate dateNaissance;
    private String adresse;
    private String fonction;
    private String matricule;
    private boolean matriculeVerifie;
    private String perimetre;
    private boolean perimetreVerrouille;
    private String langueTravail;
    private String avatarUrl;
    private Role role;
    private String roleLabel;
    private String roleNationalNiveau;
    private boolean compteCertifieCni;
    private String derniereConnexion;
    private String derniereSynchronisation;
    private String institution;
    private String direction;
    private String sessionCertificat;
}
