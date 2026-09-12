package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClotureJourneeResponse {
    private String statut;
    private String numeroCertificat;
    private String horodatageSha256;
    private String autoriteSignataire;
    private String message;
}
