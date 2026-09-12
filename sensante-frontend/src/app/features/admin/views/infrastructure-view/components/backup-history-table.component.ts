import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackupArchive } from '../../../../../core/models/infrastructure.model';

@Component({
  selector: 'app-backup-history-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section aria-label="Historique des sauvegardes et journal des restaurations" class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <!-- Table Header Control Bar -->
      <div class="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-white">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-base font-semibold text-slate-900 text-balance">
              Historique des Sauvegardes &amp; Restauration Immuable
            </h2>
            <span class="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600 font-mono whitespace-nowrap">
              {{ totalArchives }} archives actives
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5 text-pretty">
            Dernier instantané réussi il y a <span class="font-semibold text-[#166b53]">{{ dernierSnapshotTemps }}</span> (Certifié SHA-256 par l'Autorité de Confiance Numérique).
          </p>
        </div>

        <!-- Primary Action + Filters -->
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            (click)="onExportAuditLog()"
            class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors shadow-sm whitespace-nowrap"
          >
            <span class="material-symbols-outlined text-[18px]">verified</span>
            <span>Exporter Journal d'Audit</span>
          </button>
          <button
            type="button"
            (click)="onCreateBackup()"
            [disabled]="isCreatingBackup"
            class="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f4c3a] text-white hover:bg-[#166b53] disabled:opacity-50 rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-95 whitespace-nowrap"
          >
            <span class="material-symbols-outlined text-[18px]">cloud_upload</span>
            <span>{{ isCreatingBackup ? 'Sauvegarde en cours...' : '+ Créer une Sauvegarde Maintenant' }}</span>
          </button>
        </div>
      </div>

      <!-- High-Density Governmental Data Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse font-sans text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <th class="py-2.5 px-4">Date &amp; Horodatage (GMT)</th>
              <th class="py-2.5 px-4">Type de Sauvegarde</th>
              <th class="py-2.5 px-4">Périmètre / Composant</th>
              <th class="py-2.5 px-4 text-right">Taille</th>
              <th class="py-2.5 px-4">Statut &amp; Intégrité Cryptographique</th>
              <th class="py-2.5 px-4 text-right">Actions Référent</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-800">
            @for (bkp of backups; track bkp.id) {
              <tr class="hover:bg-slate-50/80 transition-colors h-10">
                <td class="py-2 px-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                  {{ bkp.dateGmt }}
                </td>
                <td class="py-2 px-4 whitespace-nowrap">
                  @if (bkp.isWormArchived) {
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap font-medium">
                      <span class="material-symbols-outlined text-[13px]">autorenew</span> {{ bkp.typeSauvegarde }}
                    </span>
                  } @else if (bkp.typeSauvegarde.includes('Manuelle')) {
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-blue-50 text-blue-800 border border-blue-200 whitespace-nowrap font-medium">
                      <span class="material-symbols-outlined text-[13px]">build</span> {{ bkp.typeSauvegarde }}
                    </span>
                  } @else {
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-800 border border-slate-200 whitespace-nowrap font-medium">
                      <span class="material-symbols-outlined text-[13px]">camera_alt</span> {{ bkp.typeSauvegarde }}
                    </span>
                  }
                </td>
                <td class="py-2 px-4 whitespace-nowrap">
                  <span class="font-medium text-slate-900">{{ bkp.perimetre }}</span>
                  <span class="text-[11px] text-slate-500 ml-1 font-mono">{{ bkp.schemaRef }}</span>
                </td>
                <td class="py-2 px-4 text-right font-mono font-semibold text-slate-900 whitespace-nowrap">
                  {{ bkp.tailleGb }} GB
                </td>
                <td class="py-2 px-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <span
                      [class]="bkp.isWormArchived ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border font-medium whitespace-nowrap"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> {{ bkp.statut }}
                    </span>
                    <button
                      type="button"
                      (click)="copyHash(bkp.hashSha256)"
                      class="text-[11px] text-slate-500 font-mono hover:text-[#003426] hover:underline"
                      title="Copier empreinte SHA-256 complète"
                    >
                      {{ bkp.hashCourt }}
                    </button>
                  </div>
                </td>
                <td class="py-2 px-4 text-right whitespace-nowrap">
                  <div class="inline-flex items-center gap-1">
                    <button
                      type="button"
                      (click)="onRestoreSandbox(bkp)"
                      class="px-2 py-1 text-[11px] font-medium rounded border border-slate-300 hover:bg-slate-100 transition-colors whitespace-nowrap"
                      title="Restaurer dans l'environnement bac à sable"
                    >
                      Restaurer Sandbox
                    </button>
                    <button
                      type="button"
                      (click)="downloadManifest(bkp)"
                      class="p-1 text-slate-500 hover:text-[#003426] rounded hover:bg-slate-100 transition-colors"
                      title="Télécharger le manifeste de contrôle"
                    >
                      <span class="material-symbols-outlined text-[16px]">file_download</span>
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Table Footer / Pagination Notice -->
      <div class="py-2.5 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <span>Affichage de {{ backups.length }} sauvegardes sur {{ totalArchives }} répertoriées</span>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="px-2.5 py-1 bg-white border border-slate-200 rounded text-xs hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            Précédent
          </button>
          <span class="font-mono font-semibold text-slate-800">Page 1 / 297</span>
          <button
            type="button"
            class="px-2.5 py-1 bg-white border border-slate-200 rounded text-xs hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            Suivant
          </button>
        </div>
      </div>
    </section>
  `
})
export class BackupHistoryTableComponent {
  @Input() backups: BackupArchive[] = [];
  @Input() totalArchives = 1482;
  @Input() dernierSnapshotTemps = '32 minutes';
  @Input() isCreatingBackup = false;

  @Output() createBackupRequested = new EventEmitter<void>();
  @Output() restoreSandboxRequested = new EventEmitter<BackupArchive>();
  @Output() exportAuditRequested = new EventEmitter<void>();

  onCreateBackup(): void {
    this.createBackupRequested.emit();
  }

  onRestoreSandbox(bkp: BackupArchive): void {
    this.restoreSandboxRequested.emit(bkp);
  }

  onExportAuditLog(): void {
    this.exportAuditRequested.emit();
  }

  copyHash(hash: string): void {
    navigator.clipboard.writeText(hash);
    alert(`Empreinte SHA-256 copiée dans le presse-papiers :\n${hash}`);
  }

  downloadManifest(bkp: BackupArchive): void {
    const manifest = {
      id: bkp.id,
      timestamp: bkp.dateGmt,
      schema: bkp.schemaRef,
      tailleGb: bkp.tailleGb,
      sha256: bkp.hashSha256,
      autorite: 'DSI MSAS République du Sénégal - Datacenter Diamniadio'
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manifeste-sauvegarde-${bkp.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
