package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.sensante.sn.Model.Genre;
import org.sensante.sn.Model.StatutNutritionnel;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CroissanceOmsDTO {
    private Long enfantId;
    private String nomComplet;
    private String prenom;
    private String nom;
    private Genre genre;
    private LocalDate dateNaissance;
    private int ageEnMois;
    private String codeNational;
    private String nomStructureSante;
    private String regionMedicale;

    // Dernières mesures
    private Double dernierPoids;
    private Double derniereTaille;
    private Double dernierPerimetreBrachial;
    private Double dernierZScorePoidsAge;
    private Double deltaPoidsCeMoisKg;
    private Double vitesseGainPonderalGJour;
    private StatutNutritionnel statutNutritionnel;
    private String interpretationClinique;

    // Historique chronologique et Références OMS
    private List<PointPeseeDTO> historiquePesees;
    private CourbesReferenceOmsDTO referencesOms;
}
