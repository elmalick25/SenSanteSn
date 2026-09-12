package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActionTactiqueResponse {
    private Boolean succes;
    private String message;
    private String statutMisAJour;
    private Object donneeResultat;
}
