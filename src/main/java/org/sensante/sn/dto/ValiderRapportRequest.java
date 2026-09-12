package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ValiderRapportRequest {
    private String commentaireMedecinChef;
    private Boolean certifierDhis2;
}
