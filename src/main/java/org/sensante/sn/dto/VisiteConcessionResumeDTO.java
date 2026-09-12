package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VisiteConcessionResumeDTO {
    private int concessionsVisitees;       // 8
    private boolean bornageGpsCertifie;    // true
    private int triageRdvEmis;             // 12
    private boolean delivresParSms;        // true
    private int femmesSuivies;             // 14
    private String creneauxDemain;         // "08:30 – 11:45"
    private int reductionFluxPourcent;     // 65
    private boolean signaturesBiometriques; // true
}
