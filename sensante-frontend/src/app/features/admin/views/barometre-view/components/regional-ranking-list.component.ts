import { Component, Input, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegionPerformance } from '../../../../../core/models/barometre.model';

@Component({
  selector: 'app-regional-ranking-list',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between h-full">
      <!-- En-tête -->
      <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-emerald-600 text-[22px]">map</span>
            <h2 class="text-base font-bold text-slate-900 tracking-tight text-balance">
              Classement des 14 Régions Médicales
            </h2>
          </div>
          <p class="text-xs text-slate-500 mt-0.5 text-pretty">
            Taux de couverture vaccinale &amp; prise en charge dénutrition
          </p>
        </div>

        <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 whitespace-nowrap">
          14 / 14 DRSP
        </span>
      </div>

      <!-- Liste scrollable optimisée -->
      <div class="space-y-2.5 max-h-[380px] overflow-y-auto pr-1.5 custom-scrollbar">
        @for (region of rankings; track region.rank) {
          <div 
            class="p-2.5 rounded-xl border transition-all duration-200 hover:shadow-xs"
            [ngClass]="{
              'bg-rose-50/40 border-rose-200/80': region.isCriticalZone,
              'bg-slate-50/60 border-slate-100 hover:bg-slate-50': !region.isCriticalZone
            }"
          >
            <!-- Ligne supérieure : Rang, Nom, Pourcentage & Statut -->
            <div class="flex items-center justify-between gap-2 mb-1.5">
              <div class="flex items-center gap-2 min-w-0">
                <span 
                  class="w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                  [ngClass]="{
                    'bg-amber-400 text-amber-950 font-extrabold': region.rank === 1,
                    'bg-slate-300 text-slate-800': region.rank === 2,
                    'bg-amber-200 text-amber-900': region.rank === 3,
                    'bg-slate-200 text-slate-700': region.rank > 3 && !region.isCriticalZone,
                    'bg-rose-200 text-rose-800 font-bold': region.isCriticalZone
                  }"
                >
                  {{ region.rank }}
                </span>
                <span class="text-xs font-bold text-slate-900 truncate">
                  {{ region.regionName }}
                </span>
              </div>

              <div class="flex items-center gap-2 flex-shrink-0">
                <span class="text-xs font-extrabold font-mono" [ngClass]="region.isCriticalZone ? 'text-rose-700' : 'text-slate-900'">
                  {{ region.coveragePercentage | number:'1.1-1' }}%
                </span>
                
                <span 
                  class="px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap border"
                  [ngClass]="{
                    'bg-emerald-50 text-emerald-800 border-emerald-200': region.statusTier === 'elite',
                    'bg-teal-50 text-teal-800 border-teal-200': region.statusTier === 'high',
                    'bg-blue-50 text-blue-800 border-blue-200': region.statusTier === 'conform',
                    'bg-indigo-50 text-indigo-800 border-indigo-200': region.statusTier === 'standard',
                    'bg-amber-50 text-amber-800 border-amber-200': region.statusTier === 'vigilance',
                    'bg-rose-100 text-rose-800 border-rose-300 animate-pulse': region.statusTier === 'urgent'
                  }"
                >
                  {{ region.statusLabel }}
                </span>
              </div>
            </div>

            <!-- Barre de progression -->
            <div class="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
              <div 
                class="h-full rounded-full transition-all duration-500"
                [style.width.%]="region.coveragePercentage"
                [ngClass]="{
                  'bg-emerald-600': region.statusTier === 'elite' || region.statusTier === 'high',
                  'bg-blue-600': region.statusTier === 'conform' || region.statusTier === 'standard',
                  'bg-amber-500': region.statusTier === 'vigilance',
                  'bg-rose-600': region.statusTier === 'urgent'
                }"
              ></div>
            </div>

            <!-- Ligne inférieure : Détails enfants & MAS -->
            <div class="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 font-medium">
              <span>{{ region.enrolledCount | number:'1.0-0' }} enfants enrôlés</span>
              <span class="text-slate-600">{{ region.healedMasCount | number:'1.0-0' }} guérisons MAS</span>
            </div>
          </div>
        }
      </div>

      <!-- Seuil d'Alerte OMS & Plan d'Action Kolda-Kédougou -->
      <div class="mt-3.5 pt-3 border-t border-slate-100">
        <div class="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div class="flex items-start gap-2">
            <span class="material-symbols-outlined text-amber-700 text-[18px] mt-0.5">warning</span>
            <div>
              <p class="text-xs font-bold text-amber-900 text-balance">
                Seuil d'Alerte OMS (80.0%)
              </p>
              <p class="text-[11px] text-amber-800 text-pretty">
                Kolda (78.4%) et Kédougou (74.2%) nécessitent un renfort urgent en intrants PNA.
              </p>
            </div>
          </div>

          <button 
            (click)="onOpenInterventionPlan.emit()"
            class="px-2.5 py-1 text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 rounded-lg border border-amber-300 transition-colors whitespace-nowrap self-end sm:self-center"
          >
            Plan d'Intervention
          </button>
        </div>
      </div>
    </div>
  `
})
export class RegionalRankingListComponent {
  @Input({ required: true }) rankings: RegionPerformance[] = [];
  onOpenInterventionPlan = output<void>();
}
