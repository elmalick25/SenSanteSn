package org.sensante.sn.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminProfileUpdateDTO {
    @NotBlank(message = "Le nom complet ou nom est obligatoire")
    private String nom;
    
    private String prenom;
    private String telephone;
    private LocalDate dateNaissance;
    private String adresse;
    private String fonction;
    private String matricule;
    private String langueTravail;
    private String avatarUrl;
}
