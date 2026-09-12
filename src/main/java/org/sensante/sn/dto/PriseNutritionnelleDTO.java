package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriseNutritionnelleDTO {
    private Long id;
    private LocalDate datePrise;
    private LocalTime heurePrevue;
    private LocalTime heureReelle;
    private String heurePrevueAffichee; // "08:00", "13:00", "19:00"
    private String heureReelleAffichee; // "08:14"

    private String typeRation; // PLUMPY_SUP, REPAS_FORTIFIE_421
    private String titreRation; // 1 sachet Plumpy'Sup
    private String statut; // VALIDE, A_DONNER, PROGRAMME, MANQUE
    private String instructions;
    private String notesObservation;
}
