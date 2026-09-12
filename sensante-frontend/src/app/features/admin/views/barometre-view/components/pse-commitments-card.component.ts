import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PsePillar } from '../../../../../core/models/barometre.model';

@Component({
  selector: 'app-pse-commitments-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800 relative overflow-hidden">
      <!-- Background subtle pattern/glow -->
      <div class="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
      <div class="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>

      <!-- En-tête de section PSE -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-800 pb-5 mb-6 relative z-10">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 whitespace-nowrap uppercase tracking-wider">
              Gouvernance Publique
            </span>
            <span class="text-xs text-slate-400">• Axe 2 Capital Humain</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-white font-display text-balance">
            Engagements Stratégiques — Plan Sénégal Émergent (PSE) Santé 2024
          </h2>
          <p class="text-xs sm:text-sm text-slate-300 max-w-3xl text-pretty">
            Alignement direct des indicateurs opérationnels SenSanté sur les cibles nationales du Ministère de la Santé et de l'Action Sociale (MSAS).
          </p>
        </div>

        <!-- Grand Score Global PSE -->
        <div class="flex items-center gap-4 bg-slate-800/80 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-slate-700/80 flex-shrink-0 self-start lg:self-center">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
            <span class="material-symbols-outlined text-[28px]">verified</span>
          </div>
          <div>
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Index Global PSE Santé
            </p>
            <div class="flex items-baseline gap-1.5">
              <span class="text-3xl font-extrabold text-white font-display tracking-tight">
                {{ globalPerformanceIndex | number:'1.1-1' }}
              </span>
              <span class="text-sm font-bold text-slate-400">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 3 Piliers Opérationnels -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
        @for (pillar of pillars; track pillar.pillarCode) {
          <div class="bg-slate-800/60 backdrop-blur-sm rounded-xl p-5 border border-slate-700/60 flex flex-col justify-between hover:border-slate-600 transition-colors">
            <div>
              <div class="flex items-center justify-between gap-2 mb-3">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {{ pillar.pillarCode }}
                </span>

                <span 
                  class="px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap"
                  [ngClass]="{
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30': pillar.badgeColor === 'emerald',
                    'bg-blue-500/20 text-blue-300 border border-blue-500/30': pillar.badgeColor === 'blue',
                    'bg-purple-500/20 text-purple-300 border border-purple-500/30': pillar.badgeColor === 'purple'
                  }"
                >
                  {{ pillar.status }}
                </span>
              </div>

              <h3 class="text-sm font-bold text-white mb-1.5 text-balance">
                {{ pillar.title }}
              </h3>

              <p class="text-xs text-slate-300 text-pretty mb-4 leading-relaxed">
                {{ pillar.description }}
              </p>
            </div>

            <div>
              <!-- Bar & percentage -->
              <div class="flex items-center justify-between text-xs mb-1.5 font-medium">
                <span class="text-slate-400">Atteinte:</span>
                <span class="text-white font-bold font-mono">
                  {{ pillar.achievementRate | number:'1.1-1' }}%
                  <span class="text-slate-400 font-normal text-[11px]">(cible: {{ pillar.targetRate | number:'1.1-1' }}%)</span>
                </span>
              </div>

              <div class="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all duration-500"
                  [style.width.%]="pillar.achievementRate"
                  [ngClass]="{
                    'bg-emerald-500': pillar.badgeColor === 'emerald',
                    'bg-blue-500': pillar.badgeColor === 'blue',
                    'bg-purple-500': pillar.badgeColor === 'purple'
                  }"
                ></div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class PseCommitmentsCardComponent {
  @Input({ required: true }) pillars: PsePillar[] = [];
  @Input() globalPerformanceIndex = 93.4;
}
