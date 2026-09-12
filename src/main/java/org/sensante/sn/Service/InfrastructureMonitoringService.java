package org.sensante.sn.Service;

import lombok.extern.slf4j.Slf4j;
import org.sensante.sn.dto.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

@Service
@Slf4j
public class InfrastructureMonitoringService {

    private final AtomicReference<InfrastructureOverviewDTO> currentOverview = new AtomicReference<>();
    private final List<BackupArchiveDTO> backupsList = new CopyOnWriteArrayList<>();
    private final List<SyncConflictDTO> conflictsList = new CopyOnWriteArrayList<>();
    private final AtomicInteger archiveCounter = new AtomicInteger(1482);

    public InfrastructureMonitoringService() {
        initDefaultInfrastructure();
    }

    public InfrastructureOverviewDTO getOverview() {
        InfrastructureOverviewDTO overview = currentOverview.get();
        overview.setGmtTimestamp("Dakar GMT " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));
        return overview;
    }

    public BackupArchiveDTO createBackup() {
        int newTotal = archiveCounter.incrementAndGet();
        String id = "bkp-" + System.currentTimeMillis();
        String hash = UUID.randomUUID().toString().replace("-", "") + "e91";
        String hashCourt = "#" + hash.substring(0, 4) + "..." + hash.substring(hash.length() - 4);

        BackupArchiveDTO newBackup = BackupArchiveDTO.builder()
                .id(id)
                .dateGmt("À l'instant (Manuel)")
                .typeSauvegarde("Instantané Snapshot")
                .perimetre("Base Complète Souveraine (Full Cluster)")
                .schemaRef("(all_databases, vault)")
                .tailleGb(134.6)
                .statut("Succès (SHA-256 Validé)")
                .hashSha256(hash)
                .hashCourt(hashCourt)
                .isWormArchived(true)
                .build();

        backupsList.add(0, newBackup);
        log.info("Nouvelle sauvegarde immuable créée avec succès : {} (Hash: {})", id, hashCourt);

        InfrastructureOverviewDTO overview = currentOverview.get();
        overview.setTotalArchivesCount(newTotal);
        overview.setDernierSnapshotTempsEcoule("À l'instant");
        overview.setRecentBackups(new ArrayList<>(backupsList));

        return newBackup;
    }

    public Map<String, Object> restoreSandbox(String backupId) {
        log.info("Restauration bac à sable demandée pour la sauvegarde {}", backupId);
        return Map.of(
                "statut", "RESTAURATION_BAC_A_SABLE_REUSSIE",
                "backupId", backupId,
                "sandboxInstance", "sbx-node-diamniadio-04",
                "environnement", "ISOLÉ_NON_ROUTABLE",
                "message", "Instantané restauré avec succès dans le bac à sable de pré-qualification étanche."
        );
    }

    public Map<String, Object> resolveConflict(String conflictId, String resolutionChoice) {
        log.info("Arbitrage du conflit {} résolu en faveur de {}", conflictId, resolutionChoice);

        for (SyncConflictDTO conflict : conflictsList) {
            if (conflict.getId().equals(conflictId)) {
                conflict.setStatutResolution(resolutionChoice);
                break;
            }
        }

        InfrastructureOverviewDTO overview = currentOverview.get();
        long activeCount = conflictsList.stream().filter(c -> "EN_ATTENTE".equals(c.getStatutResolution())).count();
        overview.setConflitsBloquantsCount((int) activeCount);
        overview.setSyncConflicts(new ArrayList<>(conflictsList));

        return Map.of(
                "statut", "CONFLIT_ARBITRE",
                "conflictId", conflictId,
                "choix", resolutionChoice,
                "message", "Conflit arbitré avec succès. La version retenue a été synchronisée sur le registre national."
        );
    }

    private void initDefaultInfrastructure() {
        // Points de télémétrie horaire 24h
        List<TelemetryPointDTO> series = new ArrayList<>();
        series.add(new TelemetryPointDTO("00h", 22.1, 58.0, 36.0));
        series.add(new TelemetryPointDTO("04h", 19.4, 57.5, 34.0));
        series.add(new TelemetryPointDTO("08h", 48.6, 60.2, 98.0)); // Morning sync peak
        series.add(new TelemetryPointDTO("12h", 35.8, 61.8, 45.0));
        series.add(new TelemetryPointDTO("16h", 31.2, 62.4, 43.0));
        series.add(new TelemetryPointDTO("20h", 27.5, 62.0, 41.0));
        series.add(new TelemetryPointDTO("24h", 28.4, 62.1, 42.0));

        // Cluster PostgreSQL
        DatabaseClusterStatusDTO db = DatabaseClusterStatusDTO.builder()
                .engineVersion("PostgreSQL v16.2 Enterprise")
                .haArchitecture("Haute Disponibilité Bi-Datacenter (Dakar / Diamniadio)")
                .securitySpecs("Chiffrement matériel au repos AES-256-GCM • Gestion des clés HSM SenGouv • Isolation DSI Santé")
                .uptimePercent(99.984)
                .uptimeDays(142)
                .activeConnections(184)
                .maxConnections(500)
                .connectionUsagePercent(36.8)
                .connectionPoolDetails("PgBouncer Pool Actif (99% Hit)")
                .replicationMode("Synchrone")
                .replicationLagMs(0.2)
                .mirrorNode("Diamniadio DC-2")
                .totalVolumeTb(4.2)
                .dsiPatientsVolumeTb(3.1)
                .indexVolumeTb(1.1)
                .transactionsPerSec(340)
                .morningPeakVariationPercent(4.2)
                .commitRatioPercent(99.94)
                .walSecurityStatus("Immuable")
                .storageBackend("WORM activé S3")
                .pitrRetentionDays(30)
                .build();

        // Sauvegardes
        backupsList.add(BackupArchiveDTO.builder()
                .id("bkp-1")
                .dateGmt("Aujourd'hui, 11:10 GMT")
                .typeSauvegarde("Instantané Snapshot")
                .perimetre("Base Patients & DSI National")
                .schemaRef("(schema: public, dsi)")
                .tailleGb(42.8)
                .statut("Succès (SHA-256 Validé)")
                .hashSha256("a48fc39811d0928e0192e2")
                .hashCourt("#a48f...91e2")
                .isWormArchived(false)
                .build());

        backupsList.add(BackupArchiveDTO.builder()
                .id("bkp-2")
                .dateGmt("Aujourd'hui, 05:00 GMT")
                .typeSauvegarde("Automatique (Quotidienne)")
                .perimetre("Base Complète Clustered (Full Dump)")
                .schemaRef("(all_databases)")
                .tailleGb(128.4)
                .statut("Archivé WORM S3 Souverain")
                .hashSha256("33b1e84a90cd7c04")
                .hashCourt("#33b1...7c04")
                .isWormArchived(true)
                .build());

        backupsList.add(BackupArchiveDTO.builder()
                .id("bkp-3")
                .dateGmt("Hier, 23:00 GMT")
                .typeSauvegarde("Automatique (Quotidienne)")
                .perimetre("Registre Vaccinal & PEV National")
                .schemaRef("(schema: immunization)")
                .tailleGb(3.4)
                .statut("Succès (SHA-256 Validé)")
                .hashSha256("d91eb399a1122")
                .hashCourt("#d91e...339a")
                .isWormArchived(false)
                .build());

        backupsList.add(BackupArchiveDTO.builder()
                .id("bkp-4")
                .dateGmt("06 Nov 2024, 23:00 GMT")
                .typeSauvegarde("Manuelle (Pré-déploiement)")
                .perimetre("Fichiers Biométriques & Identités ANEC")
                .schemaRef("(schema: identity_vault)")
                .tailleGb(18.9)
                .statut("Archivé WORM S3 Souverain")
                .hashSha256("88fc9011029e")
                .hashCourt("#88fc...1102")
                .isWormArchived(true)
                .build());

        backupsList.add(BackupArchiveDTO.builder()
                .id("bkp-5")
                .dateGmt("05 Nov 2024, 14:30 GMT")
                .typeSauvegarde("Instantané Snapshot")
                .perimetre("Configuration Clinique & Référentiels CIM-11")
                .schemaRef("(schema: ref_health)")
                .tailleGb(1.2)
                .statut("Succès (SHA-256 Validé)")
                .hashSha256("55e98200abaa")
                .hashCourt("#55e9...00ab")
                .isWormArchived(false)
                .build());

        // Conflits de synchronisation
        conflictsList.add(SyncConflictDTO.builder()
                .id("conf-001")
                .reference("#SEN-PED-2024-8841")
                .badgePriorite("Priorité Clinique")
                .typePriorite("rose")
                .titre("Conflit Posologie ATPE / Poids Patient")
                .patientOuPraticien("Mamadou Diop (18 mois)")
                .district("District Sanitaire de Kaolack")
                .sourceHorsLigne("Poste de santé Ndorong (Relais communautaire)")
                .retardHorsLigne("Retard synchro : 48h")
                .detailsHorsLigne("Poids 8.4 kg → Prescription 4 sachets ATPE / jour")
                .sourceEnLigne("Centre de Santé de Kaolack (Consultation pédiatrique)")
                .noteEnLigne("Pesée récente")
                .detailsEnLigne("Poids 8.9 kg → Prescription 4 sachets")
                .statutResolution("EN_ATTENTE")
                .build());

        conflictsList.add(SyncConflictDTO.builder()
                .id("conf-002")
                .reference("#SEN-PED-2024-3109")
                .badgePriorite("Arbitrage Requis")
                .typePriorite("amber")
                .titre("Double Enregistrement BCG / Penta")
                .patientOuPraticien("Aïcha Ba (6 mois)")
                .district("District Sanitaire de Matam / Kanel")
                .sourceHorsLigne("Agent mobile Matam (Badienou Gokh)")
                .retardHorsLigne("Équipe Mobile Matam")
                .detailsHorsLigne("Vaccin Penta-3 administré le 05 Nov 2024 (Lot #PT-8812)")
                .sourceEnLigne("Poste de santé Kanel")
                .noteEnLigne("Poste Fixe Kanel")
                .detailsEnLigne("Enregistré comme Non Présentée / Manqué")
                .statutResolution("EN_ATTENTE")
                .build());

        conflictsList.add(SyncConflictDTO.builder()
                .id("conf-003")
                .reference("#PRAT-SEN-9920")
                .badgePriorite("Gouvernance")
                .typePriorite("slate")
                .titre("Habilitation & Structure d'Affectation")
                .patientOuPraticien("Dr. B. Ndiaye (Chirurgien Chef) • Ordre National")
                .district("CHR Saint-Louis / DSI Dakar")
                .sourceHorsLigne("CHR Saint-Louis (Service Chirurgie Pédiatrique)")
                .retardHorsLigne("Poste Fixe Régional")
                .detailsHorsLigne("Praticien Titulaire Hospitalier")
                .sourceEnLigne("Direction Générale de la Santé (DSI Dakar)")
                .noteEnLigne("DSI / MSAS Dakar")
                .detailsEnLigne("Coordonnateur National Projets Télémédecine (Mutation validée)")
                .statutResolution("EN_ATTENTE")
                .build());

        InfrastructureOverviewDTO overview = InfrastructureOverviewDTO.builder()
                .datacenterName("Datacenter National ADIE / SEN-GOUV")
                .datacenterLocation("Diamniadio (Principal) & Nœud Souverain Dakar Plateau")
                .slaOverallPercent(99.98)
                .statusLabel("Opérationnel")
                .gmtTimestamp("Dakar GMT 11:42:18")
                .networkPill("PROD - Réseau National MSAS")
                .appVersion("V2.4-PROD MSAS")
                .currentCpuPercent(28.4)
                .peakCpuPercent(54.2)
                .peakCpuTime("14h15")
                .currentRamPercent(62.1)
                .usedRamGb(63.5)
                .totalRamGb(102.4)
                .sharedBuffersGb(24.0)
                .currentLatencyMs(42.0)
                .p95LatencyMs(42.0)
                .p99LatencyMs(88.0)
                .gatewayAvailabilityPercent(100.0)
                .telemetrySeries(series)
                .databaseCluster(db)
                .totalArchivesCount(1482)
                .dernierSnapshotTempsEcoule("32 minutes")
                .recentBackups(new ArrayList<>(backupsList))
                .conflitsBloquantsCount(3)
                .syncConflicts(new ArrayList<>(conflictsList))
                .build();

        currentOverview.set(overview);
    }
}
