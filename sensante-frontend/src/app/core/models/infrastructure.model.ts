export interface TelemetryPoint {
  timeLabel: string; // "00h", "04h", "08h", etc.
  cpuPercent: number; // e.g. 28.4
  ramPercent: number; // e.g. 62.1
  latencyMs: number;  // e.g. 42
}

export interface DatabaseClusterStatus {
  engineVersion: string;
  haArchitecture: string;
  securitySpecs: string;
  uptimePercent: number;
  uptimeDays: number;

  activeConnections: number;
  maxConnections: number;
  connectionUsagePercent: number;
  connectionPoolDetails: string;

  replicationMode: string;
  replicationLagMs: number;
  mirrorNode: string;

  totalVolumeTb: number;
  dsiPatientsVolumeTb: number;
  indexVolumeTb: number;

  transactionsPerSec: number;
  morningPeakVariationPercent: number;
  commitRatioPercent: number;

  walSecurityStatus: string;
  storageBackend: string;
  pitrRetentionDays: number;
}

export interface BackupArchive {
  id: string;
  dateGmt: string;
  typeSauvegarde: string;
  perimetre: string;
  schemaRef: string;
  tailleGb: number;
  statut: string;
  hashSha256: string;
  hashCourt: string;
  isWormArchived: boolean;
}

export interface SyncConflict {
  id: string;
  reference: string;
  badgePriorite: string;
  typePriorite: 'rose' | 'amber' | 'slate';
  titre: string;
  patientOuPraticien: string;
  district: string;

  sourceHorsLigne: string;
  retardHorsLigne: string;
  detailsHorsLigne: string;

  sourceEnLigne: string;
  detailsEnLigne: string;
  noteEnLigne: string;

  statutResolution: 'EN_ATTENTE' | 'RESOLU_LOCAL' | 'RESOLU_SERVEUR';
}

export interface InfrastructureOverview {
  datacenterName: string;
  datacenterLocation: string;
  slaOverallPercent: number;
  statusLabel: string;
  gmtTimestamp: string;
  networkPill: string;
  appVersion: string;

  currentCpuPercent: number;
  peakCpuPercent: number;
  peakCpuTime: string;

  currentRamPercent: number;
  usedRamGb: number;
  totalRamGb: number;
  sharedBuffersGb: number;

  currentLatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  gatewayAvailabilityPercent: number;

  telemetrySeries: TelemetryPoint[];
  databaseCluster: DatabaseClusterStatus;

  totalArchivesCount: number;
  dernierSnapshotTempsEcoule: string;
  recentBackups: BackupArchive[];

  conflitsBloquantsCount: number;
  syncConflicts: SyncConflict[];
}
