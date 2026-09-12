package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BackupArchiveDTO {
    private String id; // "bkp-001"
    private String dateGmt; // "Aujourd'hui, 11:10 GMT"
    private String typeSauvegarde; // "Instantané Snapshot", "Automatique (Quotidienne)", "Manuelle (Pré-déploiement)"
    private String perimetre; // "Base Patients & DSI National"
    private String schemaRef; // "(schema: public, dsi)"
    private double tailleGb; // 42.8
    private String statut; // "Succès (SHA-256 Validé)" ou "Archivé WORM S3 Souverain"
    private String hashSha256; // "a48fbc8921e90192e..."
    private String hashCourt; // "#a48f...91e2"
    private boolean isWormArchived; // true/false
}
