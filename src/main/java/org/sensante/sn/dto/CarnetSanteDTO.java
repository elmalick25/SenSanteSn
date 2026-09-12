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
public class CarnetSanteDTO {
    private Long enfantId;
    private String nomComplet;
    private String prenom;
    private String nom;
    private Genre genre;
    private LocalDate dateNaissance;
    private int ageEnMois;
    private String codeNational;
    private String qrCodeToken;
    private String groupeSanguin;
    private String nomStructureSante;
    private String regionMedicale;
    private String tuteurNom;
    private Double dernierPoids;
    private Double derniereTaille;
    private Double dernierPerimetreBrachial;
    private StatutNutritionnel statutNutritionnel;
    private AntecedentNeonatalDTO antecedents;
    private List<VaccinEnfantDTO> vaccinsNaissance;
    private List<DocumentCertifieDTO> documentsOfficiels;
    private String hashCryptographiqueSHA256;
}
