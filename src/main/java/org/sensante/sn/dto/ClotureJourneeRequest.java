package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClotureJourneeRequest {
    private String commentaireSuperviseur;
    private Boolean certifierDhis2;
}
