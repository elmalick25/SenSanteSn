package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationArchiveDTO {
    private Long id;
    private LocalDate dateConsultation;
    private String titre;
    private String categorie; // NUTRITION, VACCINATION, GENERALE
    private String statutBadge;
    private String nomStructure;
    private String nomPraticien;
    private String notesCliniques;
    private Double poidsKg;
    private Double perimetreBrachialCm;
    private String prescription;
    private String referenceDocument;
    private String typeDocument;
}
