package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnomalieJournaliereDTO {
    private String id;
    private String typeAlerte;
    private String structureNom;
    private String titre;
    private String description;
    private String ecartChiffre;
    private String niveauCriticite; // CRITIQUE (rouge), ATTENTION (ambre)
    private String statutLibelle;
    private String actionLibelle;
}
