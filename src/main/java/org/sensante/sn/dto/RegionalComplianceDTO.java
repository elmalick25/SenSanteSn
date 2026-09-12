package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegionalComplianceDTO {
    private String region;
    private String structuresAuditees;
    private double scoreSsi;
    private String grade; // "A+", "A", "A-", "B+"
    private int accesJustifies;
    private int totalAcces;
    private double pourcentageJustifie;
    private String statutLegal; // "Homologué", "Sous revue"
    private String noteAlerte;
}
