package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RdvPageDataDTO {
    private Long enfantId;
    private String enfantNomComplet;
    private Integer enfantAgeMois;
    private String codeNational;
    private String statutNutritionnel;
    private RendezVousDTO rendezVousActif;
    private List<ConsultationArchiveDTO> historiqueConsultations;
    private String statutTriage;
    private String tempsEstimeAttente;

    public String getNomEnfant() {
        return enfantNomComplet;
    }

    public Integer getAgeEnMois() {
        return enfantAgeMois;
    }

    public List<ConsultationArchiveDTO> getConsultationsPassees() {
        return historiqueConsultations;
    }
}
