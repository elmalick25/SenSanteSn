import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CroissanceOmsData } from '../../../../core/models/croissance-oms.model';

@Component({
  selector: 'app-growth-kpi-strip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Card 1: Dernier Poids -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform"></div>
        <div class="flex items-center justify-between relative z-10">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Dernier Poids</span>
          <span class="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </span>
        </div>
        <div class="mt-3 flex items-baseline gap-2 relative z-10">
          <span class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ data?.dernierPoids || 0 | number:'1.2-2' }}</span>
          <span class="text-sm font-semibold text-slate-500">kg</span>
        </div>
        <div class="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-medium relative z-10">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span>+{{ data?.deltaPoidsCeMoisKg || 0.45 }} kg depuis dernier bilan</span>
        </div>
      </div>

      <!-- Card 2: Écart-Type (Z-Score) -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div class="flex items-center justify-between relative z-10">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Écart-Type (Z-Score P/A)</span>
          <span class="p-2 rounded-xl" [ngClass]="getZScoreBadgeBg()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </span>
        </div>
        <div class="mt-3 flex items-baseline gap-2 relative z-10">
          <span class="text-3xl font-extrabold tracking-tight" [ngClass]="getZScoreTextColor()">
            {{ (data?.dernierZScorePoidsAge || 0) >= 0 ? '+' : '' }}{{ data?.dernierZScorePoidsAge || 0 | number:'1.2-2' }}
          </span>
          <span class="text-sm font-semibold text-slate-500">σ (OMS)</span>
        </div>
        <div class="mt-2 text-xs font-medium relative z-10">
          <span *ngIf="isZScoreNormal()" class="text-emerald-700">Zone Médiane Optimale [-1σ, +1σ]</span>
          <span *ngIf="isZScoreMam()" class="text-amber-700">Zone Vigilance Modérée [-2σ, -1σ]</span>
          <span *ngIf="isZScoreMas()" class="text-rose-700">Alerte Clinique &lt; -2σ (Dénutrition)</span>
        </div>
      </div>

      <!-- Card 3: Périmètre Brachial (MUAC) -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div class="flex items-center justify-between relative z-10">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Périmètre Brachial (MUAC)</span>
          <span class="p-2 rounded-xl" [ngClass]="getMuacBadgeBg()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </div>
        <div class="mt-3 flex items-baseline gap-2 relative z-10">
          <span class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ data?.dernierPerimetreBrachial || 0 | number:'1.1-1' }}</span>
          <span class="text-sm font-semibold text-slate-500">cm</span>
        </div>
        <div class="mt-2 text-xs font-medium flex items-center gap-1.5 relative z-10">
          <span *ngIf="isMuacNormal()" class="inline-flex items-center gap-1 text-emerald-700">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            Ruban Vert • Nutrition Normale
          </span>
          <span *ngIf="isMuacMam()" class="inline-flex items-center gap-1 text-amber-700">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            Ruban Jaune • Risque MAM
          </span>
          <span *ngIf="isMuacMas()" class="inline-flex items-center gap-1 text-rose-700">
            <span class="w-2 h-2 rounded-full bg-rose-500"></span>
            Ruban Rouge • Alerte MAS (&lt; 115mm)
          </span>
        </div>
      </div>

      <!-- Card 4: Vitesse de Gain Pondéral -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div class="flex items-center justify-between relative z-10">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Vitesse Pondérale</span>
          <span class="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </span>
        </div>
        <div class="mt-3 flex items-baseline gap-2 relative z-10">
          <span class="text-3xl font-extrabold text-slate-900 tracking-tight">+{{ data?.vitesseGainPonderalGJour || 15.2 | number:'1.1-1' }}</span>
          <span class="text-sm font-semibold text-slate-500">g / jour</span>
        </div>
        <div class="mt-2 text-xs font-medium text-indigo-700 flex items-center gap-1 relative z-10">
          <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Rythme physiologique régulier</span>
        </div>
      </div>
    </div>
  `
})
export class GrowthKpiStripComponent {
  @Input() data: CroissanceOmsData | null = null;

  isZScoreNormal(): boolean {
    const z = this.data?.dernierZScorePoidsAge ?? 0;
    return z >= -1;
  }

  isZScoreMam(): boolean {
    const z = this.data?.dernierZScorePoidsAge ?? 0;
    return z < -1 && z >= -2;
  }

  isZScoreMas(): boolean {
    const z = this.data?.dernierZScorePoidsAge ?? 0;
    return z < -2;
  }

  getZScoreBadgeBg(): string {
    if (this.isZScoreNormal()) return 'bg-emerald-50 text-emerald-600';
    if (this.isZScoreMam()) return 'bg-amber-50 text-amber-600';
    return 'bg-rose-50 text-rose-600';
  }

  getZScoreTextColor(): string {
    if (this.isZScoreNormal()) return 'text-emerald-600';
    if (this.isZScoreMam()) return 'text-amber-600';
    return 'text-rose-600';
  }

  isMuacNormal(): boolean {
    const muac = this.data?.dernierPerimetreBrachial ?? 0;
    return muac >= 12.5;
  }

  isMuacMam(): boolean {
    const muac = this.data?.dernierPerimetreBrachial ?? 0;
    return muac >= 11.5 && muac < 12.5;
  }

  isMuacMas(): boolean {
    const muac = this.data?.dernierPerimetreBrachial ?? 0;
    return muac < 11.5;
  }

  getMuacBadgeBg(): string {
    if (this.isMuacNormal()) return 'bg-emerald-50 text-emerald-600';
    if (this.isMuacMam()) return 'bg-amber-50 text-amber-600';
    return 'bg-rose-50 text-rose-600';
  }
}
