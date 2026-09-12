package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NouveauTriageRequest {
    private String prenom;
    private String nom;
    private Integer ageMois;
    private String genre;
    private Double poids;
    private Double taille;
    private Double muac;
    private Boolean oedemes;
    private String tuteurNom;
    private String tuteurTelephone;
    private String adresse;
}
