package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdreReapproPnaRequest {
    private Integer quantiteCartons;
    private String motifUrgence;
    private String commentaire;
}
