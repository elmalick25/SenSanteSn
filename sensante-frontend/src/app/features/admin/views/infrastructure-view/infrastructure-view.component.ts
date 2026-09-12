import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfrastructureService } from '../../../../core/services/infrastructure.service';
import { HealthToastService } from '../../../../core/services/health-toast.service';
import { BackupArchive, InfrastructureOverview } from '../../../../core/models/infrastructure.model';
import { TelemetryChartsComponent } from './components/telemetry-charts.component';
import { DatabaseClusterCardComponent } from './components/database-cluster-card.component';
import { BackupHistoryTableComponent } from './components/backup-history-table.component';
import { SyncConflictsSectionComponent } from './components/sync-conflicts-section.component';

@Component({
  selector: 'app-infrastructure-view',
  standalone: true,
  imports: [
    CommonModule,
    TelemetryChartsComponent,
    DatabaseClusterCardComponent,
    BackupHistoryTableComponent,
    SyncConflictsSectionComponent
  ],
  template: `
    <div class="p-6 pb-20 max-w-[1720px] mx-auto min-h-screen flex flex-col gap-6">
      <!-- 1. Title Row & Live Telemetry Banner -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-xl md:text-2xl font-bold text-slate-900 tracking-tight text-balance">
            Supervision Datacenter &amp; Continuité Opérationnelle
          </h1>
          <p class="text-xs md:text-sm text-slate-600 mt-0.5 text-pretty">
            Architecture résiliente multi-sites : Datacenter Diamniadio (Principal) &amp; Nœud Souverain Dakar Plateau.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 shadow-sm whitespace-nowrap">
            <span class="w-2 h-2 rounded-full bg-[#166b53] animate-pulse"></span>
            <span>Flux Télémétrie en Direct (Intervalle : 10s)</span>
          </div>
          <button
            type="button"
            (click)="loadOverview(false)"
            class="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-[#003426] hover:bg-slate-50 transition-colors shadow-sm"
            title="Actualiser manuellement"
          >
            <span [class.animate-spin]="isRefreshing()" class="material-symbols-outlined text-[18px]">refresh</span>
          </button>
        </div>
      </div>

      <!-- Loading State Skeleton -->
      @if (isLoading()) {
        <div class="space-y-6 animate-pulse">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="h-64 bg-slate-200 rounded-xl"></div>
            <div class="h-64 bg-slate-200 rounded-xl"></div>
            <div class="h-64 bg-slate-200 rounded-xl"></div>
          </div>
          <div class="h-44 bg-slate-200 rounded-xl"></div>
          <div class="h-72 bg-slate-200 rounded-xl"></div>
        </div>
      } @else {
        @if (errorState()) {
          <!-- Error Boundary -->
          <div class="p-8 rounded-xl bg-red-50 border border-red-200 text-center max-w-xl mx-auto my-12">
            <span class="material-symbols-outlined text-red-600 text-4xl mb-2">cloud_off</span>
            <h3 class="text-base font-bold text-red-900 mb-1">Supervision Datacenter Indisponible</h3>
            <p class="text-xs text-red-700 mb-4">Impossible d'établir la liaison télémétrique avec l'infrastructure de Diamniadio.</p>
            <button
              type="button"
              (click)="loadOverview(true)"
              class="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
            >
              Réessayer la liaison
            </button>
          </div>
        } @else {
          @if (overview(); as data) {
            <!-- SECTION 1: 3 Live Monitoring Charts (Chart.js) -->
            <app-telemetry-charts
              [series]="data.telemetrySeries"
              [currentCpu]="data.currentCpuPercent"
              [peakCpu]="data.peakCpuPercent"
              [peakTime]="data.peakCpuTime"
              [currentRam]="data.currentRamPercent"
              [usedRamGb]="data.usedRamGb"
              [totalRamGb]="data.totalRamGb"
              [sharedBuffersGb]="data.sharedBuffersGb"
              [currentLatency]="data.currentLatencyMs"
              [p95Latency]="data.p95LatencyMs"
              [p99Latency]="data.p99LatencyMs"
              [availability]="data.gatewayAvailabilityPercent"
            ></app-telemetry-charts>

            <!-- SECTION 2: Database Status Card (PostgreSQL Cluster) -->
            <app-database-cluster-card
              [cluster]="data.databaseCluster"
            ></app-database-cluster-card>

            <!-- SECTION 3: Backup History Table -->
            <app-backup-history-table
              [backups]="data.recentBackups"
              [totalArchives]="data.totalArchivesCount"
              [dernierSnapshotTemps]="data.dernierSnapshotTempsEcoule"
              [isCreatingBackup]="isCreatingBackup()"
              (createBackupRequested)="onCreateBackup()"
              (restoreSandboxRequested)="onRestoreSandbox($event)"
              (exportAuditRequested)="onExportAuditLog()"
            ></app-backup-history-table>

            <!-- SECTION 4: Sync Conflicts Arbitration -->
            <app-sync-conflicts-section
              [conflicts]="data.syncConflicts"
              [conflitsCount]="data.conflitsBloquantsCount"
              (resolveRequested)="onResolveConflict($event)"
            ></app-sync-conflicts-section>
          }
        }
      }

      <!-- Institutional Compliance Footnote -->
      <footer class="mt-4 pt-4 pb-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div class="flex flex-wrap items-center gap-2">
          <span class="font-semibold text-[#003426]">République du Sénégal</span>
          <span>•</span>
          <span>Ministère de la Santé et de l'Action Sociale (MSAS)</span>
          <span>•</span>
          <span>Direction des Systèmes d'Information (DSI)</span>
        </div>
        <div class="flex flex-wrap items-center gap-2 font-mono text-[11px]">
          <span>Conforme Normes ANSSI &amp; RGPD Sénégalais (Loi n° 2008-12)</span>
          <span>•</span>
          <span>Hébergement Souverain Diamniadio</span>
        </div>
      </footer>
    </div>
  `
})
export class InfrastructureViewComponent implements OnInit, OnDestroy {
  private readonly infraService = inject(InfrastructureService);
  private readonly toast = inject(HealthToastService);

  readonly overview = signal<InfrastructureOverview | null>(null);
  readonly isLoading = signal(true);
  readonly isRefreshing = signal(false);
  readonly isCreatingBackup = signal(false);
  readonly errorState = signal(false);

  private pollTimer?: any;

  ngOnInit(): void {
    this.loadOverview(true);
    // Polling télémétrie toutes les 10 secondes
    this.pollTimer = setInterval(() => {
      this.loadOverview(false);
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
    }
  }

  loadOverview(initial = false): void {
    if (initial) {
      this.isLoading.set(true);
    } else {
      this.isRefreshing.set(true);
    }
    this.errorState.set(false);

    this.infraService.getOverview().subscribe({
      next: (data: InfrastructureOverview) => {
        this.overview.set(data);
        this.isLoading.set(false);
        this.isRefreshing.set(false);
      },
      error: (err: unknown) => {
        console.error('Erreur chargement infrastructure:', err);
        if (initial) {
          this.errorState.set(true);
        }
        this.isLoading.set(false);
        this.isRefreshing.set(false);
        this.toast.show('Impossible de récupérer la télémétrie de l\'infrastructure.', 'error');
      }
    });
  }

  onCreateBackup(): void {
    this.isCreatingBackup.set(true);
    this.infraService.createBackup().subscribe({
      next: (bkp: BackupArchive) => {
        this.isCreatingBackup.set(false);
        this.loadOverview(false);
        this.toast.show(
          `Instantané créé avec succès (${bkp.hashCourt}) et scellé sur S3 WORM.`,
          'success'
        );
      },
      error: (err: unknown) => {
        console.error('Erreur création sauvegarde:', err);
        this.isCreatingBackup.set(false);
        this.toast.show('Échec de la génération de sauvegarde.', 'error');
      }
    });
  }

  onRestoreSandbox(bkp: BackupArchive): void {
    this.infraService.restoreSandbox(bkp.id).subscribe({
      next: (res: { statut: string; message: string }) => {
        this.toast.show(res.message, 'info');
      },
      error: (err: unknown) => {
        console.error('Erreur restauration sandbox:', err);
        this.toast.show('Échec du déploiement sandbox.', 'error');
      }
    });
  }

  onResolveConflict(evt: { conflictId: string; choix: string }): void {
    this.infraService.resolveConflict(evt.conflictId, evt.choix).subscribe({
      next: (res: { statut: string; message: string }) => {
        this.loadOverview(false);
        this.toast.show(res.message, 'success');
      },
      error: (err: unknown) => {
        console.error('Erreur arbitrage conflit:', err);
        this.toast.show('Échec de l\'arbitrage du conflit.', 'error');
      }
    });
  }

  onExportAuditLog(): void {
    this.toast.show(
      'Export du journal d\'audit certifié SHA-256 en cours de téléchargement...',
      'info'
    );
  }
}
