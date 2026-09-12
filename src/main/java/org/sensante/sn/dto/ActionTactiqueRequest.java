package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActionTactiqueRequest {
    private Long idAlerte;
    private Long idEnfant;
    private String typeAction; // "ACQUITTER", "REFERER_SAMU", "DISPENSER_ATPE", "PLANIFIER_VISITE", "CLOTURER"
    private String motif;
    private Integer nombreRations;
    private String dateVisite;
    private String notes;
}
