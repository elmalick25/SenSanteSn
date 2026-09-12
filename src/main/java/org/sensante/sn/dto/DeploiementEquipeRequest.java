package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeploiementEquipeRequest {
    private String zoneCible;
    private String motif;
    private String niveauPriorite;
    private Long alerteId;
}
