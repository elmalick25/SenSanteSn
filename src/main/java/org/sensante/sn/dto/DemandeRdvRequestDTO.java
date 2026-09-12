package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DemandeRdvRequestDTO {
    private Long enfantId;
    private LocalDate dateSouhaitee;
    private LocalTime heureSouhaitee;
    private String motif;
    private List<String> symptomesTags;
    private String observations;
    private String specialite;
    private String typeConsultation;
    private String creneauPrefere;
    private List<String> symptomesCoches;
}
