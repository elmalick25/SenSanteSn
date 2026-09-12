package org.sensante.sn.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateBadgeRequest {

    @NotNull(message = "Le rôle institutionnel est obligatoire")
    private Role role;

    @NotBlank(message = "Le nom complet ou nom de famille est obligatoire")
    private String nom;

    private String prenom;

    private LocalDate dateNaissance;

    @NotBlank(message = "Le numéro de CNI biométrique CEDEAO est obligatoire")
    private String cni;

    private String avatarUrl;

    // Ordre des Médecins / Solde État
    private String numeroOrdre;
    private String matriculeEtat;

    // Affectation Territoriale
    private String regionSanitaire;
    private String districtSanitaire;
    private String nomStructure;
    private String codeStructure;
    private String titrePoste;

    // Contact & Sécurité MFA
    @NotBlank(message = "L'email institutionnel est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;

    @NotBlank(message = "Le numéro de mobile est obligatoire pour le MFA/OTP")
    private String telephone;

    private String motDePasse;
}
