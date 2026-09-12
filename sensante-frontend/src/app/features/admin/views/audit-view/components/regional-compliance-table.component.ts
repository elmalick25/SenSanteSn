import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegionalCompliance } from '../../../../../core/models/audit.model';

@Component({
  selector: 'app-regional-compliance-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
      <!-- En-tête -->
      <div class="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-[22px]">map</span>
          <div>
            <h3 class="text-headline-sm font-headline-sm text-slate-900 font-bold">
              Grille Analytique Régionale de Conformité SSI
            </h3>
            <p class="text-xs text-slate-500">
              Évaluation des 14 Régions Médicales du Sénégal (Norme SSI-MSAS)
            </p>
          </div>
        </div>
        <span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-semibold whitespace-nowrap">
          Toutes régions actives
        </span>
      </div>

      <!-- Tableau -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <th class="py-3 px-3.5">Région Médicale</th>
              <th class="py-3 px-3">Structures Auditées</th>
              <th class="py-3 px-3">Score SSI</th>
              <th class="py-3 px-3">Accès Hors-Secteur Régularisés</th>
              <th class="py-3 px-3 text-right">Statut Légal</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              *ngFor="let item of regionalData"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <!-- Région -->
              <td class="py-3 px-3.5 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <div
                    class="w-2 h-2 rounded-full"
                    [ngClass]="item.statutLegal === 'Homologué' ? 'bg-emerald-500' : 'bg-amber-500'"
                  ></div>
                  <span class="font-bold text-slate-900">{{ item.region }}</span>
                </div>
              </td>

              <!-- Structures Auditées -->
              <td class="py-3 px-3 text-slate-600 font-code-num whitespace-nowrap">
                {{ item.structuresAuditees }}
              </td>

              <!-- Score SSI avec barre de progression et grade -->
              <td class="py-3 px-3">
                <div class="flex flex-col gap-1 w-28">
                  <div class="flex items-center justify-between text-xs font-semibold">
                    <span class="text-slate-800 font-code-num">{{ item.scoreSsi }}%</span>
                    <span
                      class="text-[10px] font-bold px-1 rounded"
                      [ngClass]="getGradeClass(item.grade)"
                    >
                      {{ item.grade }}
                    </span>
                  </div>
                  <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-500"
                      [ngClass]="item.scoreSsi >= 96 ? 'bg-emerald-600' : 'bg-amber-500'"
                      [style.width.%]="item.scoreSsi"
                    ></div>
                  </div>
                </div>
              </td>

              <!-- Accès Justifiés -->
              <td class="py-3 px-3 whitespace-nowrap">
                <span
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-code-num font-medium border"
                  [ngClass]="item.statutLegal === 'Homologué' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'"
                >
                  <span
                    class="material-symbols-outlined text-[13px]"
                    [ngClass]="item.statutLegal === 'Homologué' ? 'text-emerald-600' : 'text-amber-600'"
                  >
                    {{ item.statutLegal === 'Homologué' ? 'task_alt' : 'schedule' }}
                  </span>
                  <span>
                    {{ item.accesJustifies }} / {{ item.totalAcces }}
                    {{ item.noteAlerte ? '(' + item.noteAlerte + ')' : '(100%)' }}
                  </span>
                </span>
              </td>

              <!-- Statut Légal -->
              <td class="py-3 px-3 text-right whitespace-nowrap">
                <span
                  class="px-2 py-0.5 rounded text-xs font-semibold"
                  [ngClass]="item.statutLegal === 'Homologué' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'"
                >
                  {{ item.statutLegal }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Régional -->
      <div class="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span>
          Moyenne Nationale de Conformité des Régions :
          <strong class="text-slate-800 font-code-num">97.88%</strong>
        </span>
        <button type="button" class="text-primary font-bold hover:underline flex items-center gap-1 whitespace-nowrap">
          <span>Consulter les 14 Régions</span>
          <span class="material-symbols-outlined text-xs">arrow_forward</span>
        </button>
      </div>
    </section>
  `
})
export class RegionalComplianceTableComponent {
  @Input() regionalData: RegionalCompliance[] = [];

  getGradeClass(grade: string): string {
    if (grade.startsWith('A')) {
      return 'text-emerald-700 bg-emerald-50';
    }
    return 'text-amber-700 bg-amber-50';
  }
}
