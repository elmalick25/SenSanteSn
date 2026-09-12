package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedecinProfilDTO {
    private Long idMedecin;
    private String nomComplet;                  // "Dr. Babacar Fall"
    private String prenom;                      // "Babacar"
    private String nom;                         // "Fall"
    private String email;                       // "babacar.fall@sensante.sn"
    private String telephone;                   // "+221 77 645 82 91"
    private String dateNaissance;               // "14/09/1982"
    private String adresse;                     // "Médina, Rue 22 x Corniche Ouest, Dakar"
    private String specialite;                  // "Pédiatrie & Néonatalogie Ambulatoire"
    private String matriculeOrdre;              // "CNOM-SN-4812 / MSAS-DK-094"
    private String structureRattachement;       // "Centre de Santé Gaspard Kamara (District Dakar Centre)"
    private String cabinet;                     // "Cabinet 04"
    private String statutOrdre;                 // "Médecin Pédiatre Inscrit • Ordre National"
    private boolean langueFrancaise;            // true
    private boolean langueWolof;                // true
    private String avatarUrl;                   // Photo profil
    private String dateDerniereMiseAJour;       // "12 Octobre 2024"
    private boolean synchroniseDhis2;           // true
}
