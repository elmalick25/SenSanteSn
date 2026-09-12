package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LegalAuditLogDTO {
    private Long id;
    private String titre;
    private String dateAudit;
    private String organisme;
    private String description;
    private String hashSha256;
    private String labelSignature;
    private String statut;
    private String documentPdfUrl;
}
