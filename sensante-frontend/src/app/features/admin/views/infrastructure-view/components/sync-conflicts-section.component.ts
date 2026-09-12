import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SyncConflict } from '../../../../../core/models/infrastructure.model';

@Component({
  selector: 'app-sync-conflicts-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section aria-label="Arbitrage des conflits de données synchronisées" class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-base font-semibold text-slate-900 text-balance">
              Conflits de Synchronisation en Attente d'Arbitrage
            </h2>
            <span class="px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-900 border border-amber-300 font-semibold whitespace-nowrap">
              {{ conflitsCount }} conflits bloquants
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5 text-pretty">
            Conflits issus du mode hors-ligne des agents communautaires (Badienou Gokh / Relais) et postes de santé ruraux en attente d'arbitrage réglementaire.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="onFilterDistrict()"
            class="flex items-center gap-1 text-xs font-semibold text-[#166b53] hover:underline whitespace-nowrap"
          >
            <span class="material-symbols-outlined text-[16px]">filter_list</span>
            <span>Filtrer par District</span>
          </button>
        </div>
      </div>

      <!-- 3 Rich Conflict Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        @for (conflict of conflicts; track conflict.id) {
          <div
            [class]="conflict.statutResolution !== 'EN_ATTENTE' ? 'opacity-60 bg-slate-50' : 'bg-white'"
            class="border border-amber-200/80 rounded-xl p-5 flex flex-col justify-between shadow-sm ring-1 ring-amber-100 transition-all"
          >
            <div>
              <div class="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
                <span
                  [class]="conflict.typePriorite === 'rose' ? 'bg-rose-50 text-rose-800 border-rose-200' : (conflict.typePriorite === 'amber' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-800 border-slate-200')"
                  class="px-2 py-0.5 rounded text-xs border font-semibold whitespace-nowrap"
                >
                  {{ conflict.badgePriorite }}
                </span>
                <span class="text-xs font-mono text-slate-500 whitespace-nowrap">
                  {{ conflict.reference }}
                </span>
              </div>

              <h3 class="text-sm font-bold text-slate-900 mt-3 text-balance">
                {{ conflict.titre }}
              </h3>
              <p class="text-xs text-slate-600 mt-0.5">
                Patient / Praticien : <strong>{{ conflict.patientOuPraticien }}</strong> • {{ conflict.district }}
              </p>

              <!-- Collision Detail Box -->
              <div class="mt-4 space-y-2 text-xs">
                <!-- Offline version -->
                <div class="p-3 rounded bg-amber-50/60 border border-amber-200 text-slate-800">
                  <div class="flex items-center justify-between text-amber-900 font-semibold text-[11px]">
                    <span class="flex items-center gap-1 whitespace-nowrap">
                      <span class="material-symbols-outlined text-[15px]">cloud_off</span> Version Hors-Ligne
                    </span>
                    <span class="whitespace-nowrap">{{ conflict.retardHorsLigne }}</span>
                  </div>
                  <p class="mt-1 text-slate-700 text-pretty">
                    Source : <em>{{ conflict.sourceHorsLigne }}</em><br />
                    Données : <strong class="text-slate-900">{{ conflict.detailsHorsLigne }}</strong>
                  </p>
                </div>

                <!-- Online National version -->
                <div class="p-3 rounded bg-emerald-50/60 border border-emerald-200 text-slate-800">
                  <div class="flex items-center justify-between text-emerald-900 font-semibold text-[11px]">
                    <span class="flex items-center gap-1 whitespace-nowrap">
                      <span class="material-symbols-outlined text-[15px]">cloud_done</span> Version En Ligne (Serveur)
                    </span>
                    <span class="whitespace-nowrap">{{ conflict.noteEnLigne }}</span>
                  </div>
                  <p class="mt-1 text-slate-700 text-pretty">
                    Source : <em>{{ conflict.sourceEnLigne }}</em><br />
                    Données : <strong class="text-slate-900">{{ conflict.detailsEnLigne }}</strong>
                  </p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              @if (conflict.statutResolution === 'EN_ATTENTE') {
                <button
                  type="button"
                  (click)="openInspectModal(conflict)"
                  class="text-xs font-semibold text-slate-600 hover:text-[#003426] transition-colors whitespace-nowrap"
                >
                  Inspecter les deux versions
                </button>
                <button
                  type="button"
                  (click)="openResolveModal(conflict)"
                  class="px-3 py-1.5 bg-[#0f4c3a] text-white hover:bg-[#166b53] rounded-lg text-xs font-semibold transition-all active:scale-95 shadow-sm whitespace-nowrap"
                >
                  Résoudre
                </button>
              } @else {
                <span class="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold whitespace-nowrap">
                  <span class="material-symbols-outlined text-sm">check_circle</span>
                  Arbitré ({{ conflict.statutResolution === 'RESOLU_SERVEUR' ? 'Serveur National' : 'Version Locale' }})
                </span>
              }
            </div>
          </div>
        }
      </div>

      <!-- Modal d'Arbitrage -->
      @if (selectedConflict) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div class="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-amber-600 text-2xl">sync_problem</span>
                <h3 class="text-base font-bold text-slate-900">Arbitrage Réglementaire du Conflit</h3>
              </div>
              <button
                type="button"
                (click)="selectedConflict = null"
                class="text-slate-400 hover:text-slate-600 p-1"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <p class="text-xs text-slate-600 mb-4">
              Sélectionnez la version certifiée à synchroniser sur le Registre Médical National pour le dossier <strong>{{ selectedConflict.patientOuPraticien }}</strong>.
            </p>

            <div class="space-y-3 mb-6">
              <!-- Choix 1: Version Hors-Ligne -->
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:border-amber-400 cursor-pointer bg-slate-50/50">
                <input
                  type="radio"
                  name="arbitrageChoice"
                  [value]="'RESOLU_LOCAL'"
                  [(ngModel)]="arbitrageChoice"
                  class="mt-1 text-[#0f4c3a] focus:ring-[#0f4c3a]"
                />
                <div class="text-xs">
                  <span class="font-bold text-slate-900">Prioriser la Version Terrain (Hors-Ligne)</span>
                  <p class="text-slate-500 mt-0.5">{{ selectedConflict.detailsHorsLigne }}</p>
                  <span class="text-[10px] text-amber-700 font-medium">Recommandé si l'agent communautaire était au chevet du patient.</span>
                </div>
              </label>

              <!-- Choix 2: Version En Ligne -->
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:border-emerald-400 cursor-pointer bg-slate-50/50">
                <input
                  type="radio"
                  name="arbitrageChoice"
                  [value]="'RESOLU_SERVEUR'"
                  [(ngModel)]="arbitrageChoice"
                  class="mt-1 text-[#0f4c3a] focus:ring-[#0f4c3a]"
                />
                <div class="text-xs">
                  <span class="font-bold text-slate-900">Conserver la Version Serveur National</span>
                  <p class="text-slate-500 mt-0.5">{{ selectedConflict.detailsEnLigne }}</p>
                  <span class="text-[10px] text-emerald-700 font-medium">Recommandé si une consultation hospitalière plus récente a eu lieu.</span>
                </div>
              </label>
            </div>

            <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                (click)="selectedConflict = null"
                class="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                Annuler
              </button>
              <button
                type="button"
                (click)="confirmArbitrage()"
                class="px-4 py-1.5 bg-[#0f4c3a] hover:bg-[#166b53] text-white rounded-lg text-xs font-semibold transition-all shadow-sm whitespace-nowrap"
              >
                Valider l'Arbitrage
              </button>
            </div>
          </div>
        </div>
      }
    </section>
  `
})
export class SyncConflictsSectionComponent {
  @Input() conflicts: SyncConflict[] = [];
  @Input() conflitsCount = 3;

  @Output() resolveRequested = new EventEmitter<{ conflictId: string; choix: string }>();

  selectedConflict: SyncConflict | null = null;
  arbitrageChoice = 'RESOLU_SERVEUR';

  openInspectModal(conflict: SyncConflict): void {
    this.selectedConflict = conflict;
  }

  openResolveModal(conflict: SyncConflict): void {
    this.selectedConflict = conflict;
  }

  confirmArbitrage(): void {
    if (!this.selectedConflict) return;
    this.resolveRequested.emit({
      conflictId: this.selectedConflict.id,
      choix: this.arbitrageChoice
    });
    this.selectedConflict = null;
  }

  onFilterDistrict(): void {
    alert('Filtre par district : Kaolack, Matam, Kanel, Saint-Louis et Dakar sont actifs.');
  }
}
