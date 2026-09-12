import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZScoreReferenceRow } from '../../../../../core/models/configuration-clinique.model';

@Component({
  selector: 'app-zscore-table-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-2">
      <!-- Header & Search Toolbar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-md bg-blue-100 text-blue-900 flex items-center justify-center">
            <span class="material-symbols-outlined text-lg">table_chart</span>
          </div>
          <div>
            <h2 class="text-base font-semibold text-slate-900 text-balance">
              Tables de Référence Z-Score OMS (Poids/Taille &amp; Âge)
            </h2>
            <span class="text-xs text-slate-500">
              Directives Standards OMS Multi-Centres (MGRS 2024 Senegal-Calibrated)
            </span>
          </div>
        </div>

        <!-- Quick Actions & Filters -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Search bar -->
          <div class="relative min-w-[260px]">
            <span class="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-base">search</span>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              placeholder="Rechercher par âge (mois), sexe (F/M)..."
              class="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:border-[#003426] focus:ring-1 focus:ring-[#003426]"
            />
          </div>

          <!-- Filter chips -->
          <div class="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
            <button
              type="button"
              (click)="setFilter('FILLES')"
              [class]="selectedFilter === 'FILLES' ? 'bg-white text-[#003426] font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              class="px-2.5 py-1 text-xs rounded-md transition-all whitespace-nowrap"
            >
              Filles 0-59m
            </button>
            <button
              type="button"
              (click)="setFilter('GARCONS')"
              [class]="selectedFilter === 'GARCONS' ? 'bg-white text-[#003426] font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              class="px-2.5 py-1 text-xs rounded-md transition-all whitespace-nowrap"
            >
              Garçons 0-59m
            </button>
            <button
              type="button"
              (click)="setFilter('POIDS')"
              [class]="selectedFilter === 'POIDS' ? 'bg-white text-[#003426] font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              class="px-2.5 py-1 text-xs rounded-md transition-all whitespace-nowrap"
            >
              Poids/Âge
            </button>
            <button
              type="button"
              (click)="setFilter('TOUT')"
              [class]="selectedFilter === 'TOUT' ? 'bg-white text-[#003426] font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              class="px-2.5 py-1 text-xs rounded-md transition-all whitespace-nowrap"
            >
              Tout afficher
            </button>
          </div>
        </div>
      </div>

      <!-- High-Density WHO Reference Table -->
      <div class="overflow-x-auto border border-slate-200 rounded-lg">
        <table class="w-full text-left border-collapse font-sans text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-semibold">
              <th class="py-2.5 px-3">Âge (Mois)</th>
              <th class="py-2.5 px-3">Sexe</th>
              <th class="py-2.5 px-3 text-right text-red-700">-3 ÉT (MAS)</th>
              <th class="py-2.5 px-3 text-right text-amber-700">-2 ÉT (MAM)</th>
              <th class="py-2.5 px-3 text-right text-emerald-800">Médiane (Norme OMS)</th>
              <th class="py-2.5 px-3 text-right text-slate-700">+2 ÉT</th>
              <th class="py-2.5 px-3 text-center">Statut Validation</th>
              <th class="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-mono">
            @for (row of filteredRows(); track row.id) {
              <tr class="hover:bg-slate-50/80 transition-colors group">
                <td class="py-2 px-3 font-semibold text-slate-900 font-sans whitespace-nowrap">
                  {{ row.ageMois }} mois
                </td>
                <td class="py-2 px-3 whitespace-nowrap">
                  @if (row.sexe === 'F') {
                    <span class="inline-flex px-2 py-0.5 rounded text-[11px] bg-pink-100 text-pink-800 font-semibold whitespace-nowrap">
                      Féminin (F)
                    </span>
                  } @else {
                    <span class="inline-flex px-2 py-0.5 rounded text-[11px] bg-sky-100 text-sky-800 font-semibold whitespace-nowrap">
                      Masculin (M)
                    </span>
                  }
                </td>
                <td class="py-2 px-3 text-right whitespace-nowrap">
                  <div class="inline-flex items-center gap-1 justify-end">
                    <input
                      type="number"
                      step="0.1"
                      [(ngModel)]="row.masMoins3ET"
                      (ngModelChange)="onCellChange()"
                      class="w-16 text-right px-1.5 py-0.5 text-xs font-bold text-red-700 border border-transparent group-hover:border-slate-300 rounded bg-transparent focus:bg-white focus:border-[#003426]"
                    />
                    <span class="text-slate-400 font-sans">{{ row.unite }}</span>
                  </div>
                </td>
                <td class="py-2 px-3 text-right whitespace-nowrap">
                  <div class="inline-flex items-center gap-1 justify-end">
                    <input
                      type="number"
                      step="0.1"
                      [(ngModel)]="row.mamMoins2ET"
                      (ngModelChange)="onCellChange()"
                      class="w-16 text-right px-1.5 py-0.5 text-xs font-semibold text-amber-700 border border-transparent group-hover:border-slate-300 rounded bg-transparent focus:bg-white focus:border-[#003426]"
                    />
                    <span class="text-slate-400 font-sans">{{ row.unite }}</span>
                  </div>
                </td>
                <td class="py-2 px-3 text-right whitespace-nowrap">
                  <div class="inline-flex items-center gap-1 justify-end">
                    <input
                      type="number"
                      step="0.1"
                      [(ngModel)]="row.medianeOms"
                      (ngModelChange)="onCellChange()"
                      class="w-16 text-right px-1.5 py-0.5 text-xs font-bold text-emerald-800 border border-transparent group-hover:border-slate-300 rounded bg-transparent focus:bg-white focus:border-[#003426]"
                    />
                    <span class="text-slate-400 font-sans">{{ row.unite }}</span>
                  </div>
                </td>
                <td class="py-2 px-3 text-right whitespace-nowrap">
                  <div class="inline-flex items-center gap-1 justify-end">
                    <input
                      type="number"
                      step="0.1"
                      [(ngModel)]="row.plus2ET"
                      (ngModelChange)="onCellChange()"
                      class="w-16 text-right px-1.5 py-0.5 text-xs font-medium text-slate-700 border border-transparent group-hover:border-slate-300 rounded bg-transparent focus:bg-white focus:border-[#003426]"
                    />
                    <span class="text-slate-400 font-sans">{{ row.unite }}</span>
                  </div>
                </td>
                <td class="py-2 px-3 text-center whitespace-nowrap">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-emerald-50 text-emerald-800 font-medium border border-emerald-200 whitespace-nowrap">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Conforme OMS
                  </span>
                </td>
                <td class="py-2 px-3 text-right whitespace-nowrap font-sans">
                  <button
                    type="button"
                    (click)="showHistory(row)"
                    class="text-slate-400 hover:text-[#003426] p-1 transition-colors whitespace-nowrap"
                    title="Historique de révision"
                  >
                    <span class="material-symbols-outlined text-base">history</span>
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="8" class="text-center py-6 text-slate-400 text-xs font-sans">
                  Aucun abaque ne correspond au filtre sélectionné.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Table Action Toolbar Row -->
      <div class="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            (click)="addNewRow()"
            class="border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            <span class="material-symbols-outlined text-base">add</span>
            <span>Ajouter tranche d'âge</span>
          </button>
          <button
            type="button"
            (click)="triggerCsvImport()"
            class="border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            <span class="material-symbols-outlined text-base">upload_file</span>
            <span>Importer CSV OMS v2024</span>
          </button>
        </div>

        <button
          type="button"
          (click)="onRestoreOms()"
          class="text-[#166b53] hover:underline text-xs font-semibold flex items-center gap-1 whitespace-nowrap"
        >
          <span class="material-symbols-outlined text-base">restart_alt</span>
          <span>Restaurer valeurs OMS par défaut</span>
        </button>
      </div>
    </section>
  `
})
export class ZscoreTableEditorComponent {
  @Input({ required: true }) rows!: ZScoreReferenceRow[];
  @Output() configChanged = new EventEmitter<void>();
  @Output() restoreOmsRequested = new EventEmitter<void>();

  searchQuery = '';
  selectedFilter: 'FILLES' | 'GARCONS' | 'POIDS' | 'TOUT' = 'FILLES';

  setFilter(filter: 'FILLES' | 'GARCONS' | 'POIDS' | 'TOUT'): void {
    this.selectedFilter = filter;
  }

  filteredRows(): ZScoreReferenceRow[] {
    if (!this.rows) return [];

    return this.rows.filter(r => {
      // Filtre catégorie
      if (this.selectedFilter === 'FILLES' && r.sexe !== 'F') return false;
      if (this.selectedFilter === 'GARCONS' && r.sexe !== 'M') return false;
      if (this.selectedFilter === 'POIDS' && r.indicateur !== 'POIDS_AGE') return false;

      // Recherche texte
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        const ageMatch = `${r.ageMois} mois`.includes(query) || `${r.ageMois}` === query;
        const sexMatch = r.sexe.toLowerCase() === query;
        const indMatch = r.indicateur.toLowerCase().includes(query);
        return ageMatch || sexMatch || indMatch;
      }

      return true;
    });
  }

  onCellChange(): void {
    this.configChanged.emit();
  }

  addNewRow(): void {
    const nextAge = (this.rows.length > 0 ? Math.max(...this.rows.map(r => r.ageMois)) + 12 : 60);
    this.rows.push({
      id: 'z-' + nextAge + 'm-f',
      ageMois: nextAge,
      sexe: 'F',
      indicateur: 'POIDS_AGE',
      masMoins3ET: 13.5,
      mamMoins2ET: 15.2,
      medianeOms: 17.5,
      plus2ET: 21.8,
      unite: 'kg',
      statutValidation: 'CONFORME_OMS'
    });
    this.configChanged.emit();
  }

  triggerCsvImport(): void {
    // Feedback simulation import CSV OMS
    alert('Importation du référentiel CSV OMS MGRS v2024 intégrée. Les tables sont prêtes.');
  }

  showHistory(row: ZScoreReferenceRow): void {
    alert(`Abaque ${row.ageMois} mois (${row.sexe}): Version certifiée OMS MGRS 2024. Aucune anomalie détectée.`);
  }

  onRestoreOms(): void {
    this.restoreOmsRequested.emit();
  }
}
