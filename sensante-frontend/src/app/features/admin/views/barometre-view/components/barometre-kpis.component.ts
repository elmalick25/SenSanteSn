import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarometreKpi } from '../../../../../core/models/barometre.model';

@Component({
  selector: 'app-barometre-kpis',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      @for (kpi of kpis; track kpi.id) {
        <article 
          class="relative bg-white rounded-2xl p-5 border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group overflow-hidden"
          [ngClass]="{
            'border-emerald-200 ring-1 ring-emerald-100/70 bg-gradient-to-br from-white via-white to-emerald-50/20': kpi.id === 'cas-mas',
            'border-slate-200/80': kpi.id !== 'cas-mas'
          }"
        >
          <!-- Accent top glow on card with life saved or highlight -->
          @if (kpi.id === 'cas-mas') {
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400"></div>
          }

          <header class="flex items-start justify-between gap-3 mb-3">
            <div 
              class="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
              [ngClass]="{
                'bg-emerald-50 text-emerald-600': kpi.colorTheme === 'emerald',
                'bg-blue-50 text-blue-600': kpi.colorTheme === 'blue',
                'bg-amber-50 text-amber-600': kpi.colorTheme === 'amber',
                'bg-purple-50 text-purple-600': kpi.colorTheme === 'purple'
              }"
            >
              <span class="material-symbols-outlined text-[24px]">{{ kpi.icon }}</span>
            </div>

            <div 
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
              [ngClass]="{
                'bg-emerald-50 text-emerald-700 border border-emerald-200/60': kpi.isPositiveTrend,
                'bg-rose-50 text-rose-700 border border-rose-200/60': !kpi.isPositiveTrend
              }"
            >
              <span class="material-symbols-outlined text-[14px]">
                {{ kpi.isPositiveTrend ? 'trending_up' : 'trending_down' }}
              </span>
              <span>{{ kpi.progressionLabel }}</span>
            </div>
          </header>

          <div class="space-y-1">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-500 text-balance">
              {{ kpi.label }}
            </h3>
            
            <div class="flex items-baseline gap-2">
              <span class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
                {{ kpi.formattedValue }}
              </span>
              @if (kpi.unit) {
                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  {{ kpi.unit }}
                </span>
              }
            </div>

            <p class="text-xs text-slate-500 font-medium text-pretty pt-0.5">
              {{ kpi.subtitle }}
            </p>
          </div>

          <footer class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div 
              class="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap"
              [ngClass]="{
                'bg-emerald-50 text-emerald-800 border border-emerald-200/60': kpi.colorTheme === 'emerald',
                'bg-blue-50 text-blue-800 border border-blue-200/60': kpi.colorTheme === 'blue',
                'bg-amber-50 text-amber-800 border border-amber-200/60': kpi.colorTheme === 'amber',
                'bg-purple-50 text-purple-800 border border-purple-200/60': kpi.colorTheme === 'purple'
              }"
            >
              @if (kpi.id === 'cas-mas') {
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              }
              <span>{{ kpi.badgeText }}</span>
            </div>

            <span class="text-[11px] text-slate-400 font-mono">MSAS • DIIS</span>
          </footer>
        </article>
      }
    </section>
  `
})
export class BarometreKpisComponent {
  @Input({ required: true }) kpis: BarometreKpi[] = [];
}
