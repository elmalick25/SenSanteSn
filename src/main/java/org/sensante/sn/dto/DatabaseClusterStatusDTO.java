package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DatabaseClusterStatusDTO {
    private String engineVersion; // "PostgreSQL v16.2 Enterprise"
    private String haArchitecture; // "Haute Disponibilité Bi-Datacenter (Dakar / Diamniadio)"
    private String securitySpecs; // "Chiffrement matériel au repos AES-256-GCM • Gestion des clés HSM SenGouv • Isolation DSI Santé"
    private double uptimePercent; // 99.984%
    private int uptimeDays; // 142
    
    // 5 indicateurs clés
    private int activeConnections; // 184
    private int maxConnections;    // 500
    private double connectionUsagePercent; // 36.8%
    private String connectionPoolDetails; // "PgBouncer Pool Actif (99% Hit)"

    private String replicationMode; // "Synchrone"
    private double replicationLagMs; // 0.2 ms
    private String mirrorNode; // "Diamniadio DC-2"

    private double totalVolumeTb; // 4.2 TB
    private double dsiPatientsVolumeTb; // 3.1 TB
    private double indexVolumeTb; // 1.1 TB

    private int transactionsPerSec; // 340
    private double morningPeakVariationPercent; // +4.2%
    private double commitRatioPercent; // 99.94%

    private String walSecurityStatus; // "Immuable"
    private String storageBackend; // "WORM activé S3"
    private int pitrRetentionDays; // 30
}
