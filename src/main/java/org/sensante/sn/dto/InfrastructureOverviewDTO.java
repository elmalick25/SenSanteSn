package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InfrastructureOverviewDTO {
    // Métadonnées Datacenter
    private String datacenterName; // "Datacenter National ADIE / SEN-GOUV"
    private String datacenterLocation; // "Diamniadio (Principal) & Dakar Plateau"
    private double slaOverallPercent; // 99.98
    private String statusLabel; // "Opérationnel"
    private String gmtTimestamp; // "Dakar GMT 11:42:18"
    private String networkPill; // "PROD - Réseau National MSAS"
    private String appVersion; // "V2.4-PROD MSAS"

    // Télémétrie 24h actuelle
    private double currentCpuPercent; // 28.4
    private double peakCpuPercent; // 54.2
    private String peakCpuTime; // "14h15"

    private double currentRamPercent; // 62.1
    private double usedRamGb; // 63.5
    private double totalRamGb; // 102.4
    private double sharedBuffersGb; // 24.0

    private double currentLatencyMs; // 42
    private double p95LatencyMs; // 42
    private double p99LatencyMs; // 88
    private double gatewayAvailabilityPercent; // 100.0

    // Séries temporelles
    private List<TelemetryPointDTO> telemetrySeries;

    // Cluster PostgreSQL
    private DatabaseClusterStatusDTO databaseCluster;

    // Sauvegardes
    private int totalArchivesCount; // 1482
    private String dernierSnapshotTempsEcoule; // "32 minutes"
    private List<BackupArchiveDTO> recentBackups;

    // Conflits hors-ligne
    private int conflitsBloquantsCount; // 3
    private List<SyncConflictDTO> syncConflicts;
}
