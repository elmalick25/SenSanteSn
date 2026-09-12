import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseClusterStatus } from '../../../../../core/models/infrastructure.model';

@Component({
  selector: 'app-database-cluster-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section aria-label="État de la grappe de bases de données souveraine" class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-emerald-50 text-[#166b53] border border-emerald-200 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-2xl">database</span>
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-base font-semibold text-slate-900 text-balance">
                {{ cluster?.engineVersion || 'PostgreSQL v16.2 Enterprise' }}
              </h2>
              <span class="px-2 py-0.5 rounded text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium whitespace-nowrap">
                {{ cluster?.haArchitecture || 'Haute Disponibilité Bi-Datacenter (Dakar / Diamniadio)' }}
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5 text-pretty">
              {{ cluster?.securitySpecs || 'Chiffrement matériel au repos AES-256-GCM • Gestion des clés HSM SenGouv • Isolation DSI Santé' }}
            </p>
          </div>
        </div>

        <!-- Uptime Badge Component -->
        <div class="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg shrink-0">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
          <span class="text-xs font-semibold whitespace-nowrap">
            {{ cluster?.uptimePercent || 99.984 }}% Uptime — {{ cluster?.uptimeDays || 142 }} jours sans interruption
          </span>
        </div>
      </div>

      <!-- High-density 5-metric Telemetry Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-4">
        <!-- Metric 1: Connexions Actives -->
        <div class="flex flex-col">
          <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Connexions Actives</span>
          <span class="text-xl font-bold text-slate-900 font-mono mt-1">
            {{ cluster?.activeConnections || 184 }}
            <span class="text-xs font-normal text-slate-500">/ {{ cluster?.maxConnections || 500 }} max</span>
          </span>
          <div class="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              class="bg-[#166b53] h-full rounded-full transition-all duration-500"
              [style.width.%]="cluster?.connectionUsagePercent || 36.8"
            ></div>
          </div>
          <span class="text-[11px] text-slate-500 mt-1">
            {{ cluster?.connectionPoolDetails || 'PgBouncer Pool Actif (99% Hit)' }}
          </span>
        </div>

        <!-- Metric 2: Statut Réplication -->
        <div class="flex flex-col">
          <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Statut Réplication</span>
          <div class="flex items-center gap-1.5 mt-1">
            <span class="text-xl font-bold text-[#166b53] font-mono">
              {{ cluster?.replicationMode || 'Synchrone' }}
            </span>
          </div>
          <div class="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px] text-[#166b53]">drafts</span>
            <span>Lag réplique : <strong class="font-mono text-slate-800">{{ cluster?.replicationLagMs || 0.2 }} ms</strong></span>
          </div>
          <span class="text-[11px] text-slate-500">Nœud Miroir : {{ cluster?.mirrorNode || 'Diamniadio DC-2' }}</span>
        </div>

        <!-- Metric 3: Volume Données -->
        <div class="flex flex-col">
          <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Volume Données</span>
          <span class="text-xl font-bold text-slate-900 font-mono mt-1">
            {{ cluster?.totalVolumeTb || 4.2 }} TB
          </span>
          <span class="text-[11px] text-slate-500 mt-2">DSI Patients : {{ cluster?.dsiPatientsVolumeTb || 3.1 }} TB</span>
          <span class="text-[11px] text-slate-500">Index GiST/GIN : {{ cluster?.indexVolumeTb || 1.1 }} TB</span>
        </div>

        <!-- Metric 4: Débit Transactions -->
        <div class="flex flex-col">
          <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Débit Transactions</span>
          <span class="text-xl font-bold text-slate-900 font-mono mt-1">
            {{ cluster?.transactionsPerSec || 340 }}
            <span class="text-xs font-normal text-slate-500">tx/sec</span>
          </span>
          <span class="text-[11px] text-emerald-800 mt-2 font-medium flex items-center gap-0.5 whitespace-nowrap">
            <span class="material-symbols-outlined text-sm">arrow_upward</span>
            +{{ cluster?.morningPeakVariationPercent || 4.2 }}% charge matinale
          </span>
          <span class="text-[11px] text-slate-500">Commit ratio : {{ cluster?.commitRatioPercent || 99.94 }}%</span>
        </div>

        <!-- Metric 5: Sécurité WAL & PITR -->
        <div class="flex flex-col">
          <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Sécurité WAL &amp; PITR</span>
          <span class="text-xl font-bold text-slate-900 font-mono mt-1">
            {{ cluster?.walSecurityStatus || 'Immuable' }}
          </span>
          <div class="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px] text-[#166b53]">lock</span>
            <span>{{ cluster?.storageBackend || 'WORM activé S3' }}</span>
          </div>
          <span class="text-[11px] text-slate-500">
            Point-in-Time Recovery : {{ cluster?.pitrRetentionDays || 30 }}j
          </span>
        </div>
      </div>
    </section>
  `
})
export class DatabaseClusterCardComponent {
  @Input() cluster?: DatabaseClusterStatus;
}
