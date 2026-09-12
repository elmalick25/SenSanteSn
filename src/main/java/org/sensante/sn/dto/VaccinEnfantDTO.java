package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VaccinEnfantDTO {
    private Long id;
    private String codeVaccin;
    private String nomVaccin;
    private LocalDate dateAdministration;
    private Boolean effectue;
    private String agentSanteNom;
}
