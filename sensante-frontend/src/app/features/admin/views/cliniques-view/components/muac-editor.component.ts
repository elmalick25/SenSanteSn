import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MuacThresholds } from '../../../../../core/models/configuration-clinique.model';

@Component({
  selector: 'app-muac-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full">
      <div>
        <!-- Card Header -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-md bg-emerald-100 text-[#003426] flex items-center justify-center">
              <span class="material-symbols-outlined text-lg">straighten</span>
            </div>
            <h2 class="text-base font-semibold text-slate-900 text-balance">
              Seuils Anthropométriques PB / MUAC (Dépistage Dénutrition)
            </h2>
          </div>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap flex-shrink-0">
            Standard National MSAS
          </span>
        </div>

        <!-- Numeric Range Inputs Bento -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <!-- Zone Rouge: MAS -->
          <div class="p-3 rounded-lg border border-red-200 bg-red-50/50">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xs font-bold text-red-800">Zone Rouge (MAS)</span>
              <span class="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            </div>
            <label class="text-[11px] text-red-700 block mb-1">Seuil Max Malnutrition Sévère</label>
            <div class="relative flex items-center">
              <span class="absolute left-2.5 text-xs text-red-700 font-bold">&lt;</span>
              <input
                type="number"
                [(ngModel)]="muac.masMaxMm"
                (ngModelChange)="onModelChange()"
                class="w-full pl-6 pr-8 py-1 text-right font-mono text-base font-bold text-red-900 bg-white border border-red-300 rounded focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
              <span class="absolute right-2.5 text-xs text-red-700">mm</span>
            </div>
          </div>

          <!-- Zone Jaune: MAM -->
          <div class="p-3 rounded-lg border border-amber-200 bg-amber-50/50">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xs font-bold text-amber-800">Zone Jaune (MAM)</span>
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            </div>
            <label class="text-[11px] text-amber-700 block mb-1">Plage Malnutrition Modérée</label>
            <div class="grid grid-cols-2 gap-1">
              <div class="relative flex items-center">
                <input
                  type="number"
                  [(ngModel)]="muac.masMaxMm"
                  (ngModelChange)="onModelChange()"
                  class="w-full px-2 py-1 text-center font-mono text-xs font-bold text-amber-900 bg-white border border-amber-300 rounded focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                />
              </div>
              <div class="relative flex items-center">
                <input
                  type="number"
                  [(ngModel)]="muac.mamMaxMm"
                  (ngModelChange)="onModelChange()"
                  class="w-full px-2 py-1 text-center font-mono text-xs font-bold text-amber-900 bg-white border border-amber-300 rounded focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                />
              </div>
            </div>
            <span class="block text-center text-[10px] text-amber-700 mt-1">
              {{ muac.masMaxMm }} mm à {{ muac.mamMaxMm }} mm
            </span>
          </div>

          <!-- Zone Verte: Normal -->
          <div class="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xs font-bold text-emerald-800">Zone Verte (Normal)</span>
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            </div>
            <label class="text-[11px] text-emerald-700 block mb-1">Seuil Min Nutrition Normale</label>
            <div class="relative flex items-center">
              <span class="absolute left-2.5 text-xs text-emerald-700 font-bold">&ge;</span>
              <input
                type="number"
                [(ngModel)]="muac.normalMinMm"
                (ngModelChange)="onModelChange()"
                class="w-full pl-6 pr-8 py-1 text-right font-mono text-base font-bold text-emerald-900 bg-white border border-emerald-300 rounded focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
              <span class="absolute right-2.5 text-xs text-emerald-700">mm</span>
            </div>
          </div>
        </div>

        <!-- Live Realistic Interactive Tri-Color Medical MUAC Tape Visual Preview -->
        <div class="border border-slate-200 rounded-lg p-3 bg-slate-50/70 mb-3">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] uppercase font-bold text-slate-600 tracking-wider">
              Aperçu Calibré Ruban MUAC Shakir (Directives Nationales)
            </span>
            <span class="font-mono text-xs font-semibold text-[#003426]">
              Étalonnage 0 - 210 mm
            </span>
          </div>

          <!-- Shakir MUAC Tape Replica -->
          <div class="relative w-full h-14 rounded-md shadow-inner overflow-hidden flex border border-slate-300 bg-white my-3">
            <!-- Zone Rouge Strip (0 - masMaxMm) -->
            <div
              [style.width.%]="getRedPct()"
              class="bg-red-600 h-full flex flex-col justify-between p-1.5 relative border-r border-red-800 transition-all duration-300"
            >
              <span class="text-[10px] font-bold text-white uppercase tracking-wider">MAS Sévère</span>
              <span class="text-[11px] font-bold text-white text-right">&lt; {{ muac.masMaxMm }} mm</span>
              <!-- Graduation lines -->
              <div class="absolute inset-x-0 bottom-0 flex justify-between px-1 h-2 opacity-60">
                <span class="w-px h-full bg-white"></span>
                <span class="w-px h-1.5 bg-white"></span>
                <span class="w-px h-full bg-white"></span>
                <span class="w-px h-1.5 bg-white"></span>
                <span class="w-px h-full bg-white"></span>
              </div>
            </div>

            <!-- Zone Jaune Strip (masMaxMm - mamMaxMm) -->
            <div
              [style.width.%]="getYellowPct()"
              class="bg-amber-400 h-full flex flex-col justify-between p-1.5 relative border-r border-amber-600 transition-all duration-300"
            >
              <span class="text-[10px] font-bold text-amber-950 uppercase tracking-wider">MAM</span>
              <span class="text-[11px] font-bold text-amber-950 text-right">{{ muac.masMaxMm }}-{{ muac.mamMaxMm }}</span>
              <!-- Graduation lines -->
              <div class="absolute inset-x-0 bottom-0 flex justify-between px-1 h-2 opacity-50">
                <span class="w-px h-full bg-amber-950"></span>
                <span class="w-px h-1.5 bg-amber-950"></span>
                <span class="w-px h-full bg-amber-950"></span>
              </div>
            </div>

            <!-- Zone Verte Strip (mamMaxMm - 210) -->
            <div
              [style.width.%]="getGreenPct()"
              class="bg-emerald-600 h-full flex flex-col justify-between p-1.5 relative transition-all duration-300"
            >
              <span class="text-[10px] font-bold text-white uppercase tracking-wider">État Nutritionnel Normal</span>
              <span class="text-[11px] font-bold text-white text-right">&ge; {{ muac.normalMinMm }} mm</span>
              <!-- Graduation lines -->
              <div class="absolute inset-x-0 bottom-0 flex justify-between px-2 h-2 opacity-60">
                <span class="w-px h-full bg-white"></span>
                <span class="w-px h-1 bg-white"></span>
                <span class="w-px h-1 bg-white"></span>
                <span class="w-px h-full bg-white"></span>
                <span class="w-px h-1 bg-white"></span>
                <span class="w-px h-full bg-white"></span>
                <span class="w-px h-1 bg-white"></span>
                <span class="w-px h-full bg-white"></span>
              </div>
            </div>

            <!-- Active Gauge Indicator Needle positioned at MAS threshold -->
            <div
              [style.left.%]="getRedPct()"
              class="absolute top-0 bottom-0 w-1 bg-slate-900 shadow-md flex items-center justify-center pointer-events-none transition-all duration-300"
            >
              <div class="absolute -top-1 w-2.5 h-2.5 bg-slate-950 rotate-45"></div>
              <div class="absolute -bottom-1 w-2.5 h-2.5 bg-slate-950 rotate-45"></div>
            </div>
          </div>

          <!-- Indicator tags breakdown -->
          <div class="flex flex-wrap items-center justify-between text-xs pt-1 px-1 font-medium gap-2">
            <span class="text-red-700 font-bold flex items-center gap-1 whitespace-nowrap">
              <span class="w-2 h-2 rounded-full bg-red-600 flex-shrink-0"></span> MAS &lt; {{ muac.masMaxMm }} mm (PECMA Hospitalier)
            </span>
            <span class="text-amber-700 font-bold flex items-center gap-1 whitespace-nowrap">
              <span class="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"></span> MAM {{ muac.masMaxMm }} - {{ muac.mamMaxMm }} mm (ATPE Ambulatoire)
            </span>
            <span class="text-emerald-700 font-bold flex items-center gap-1 whitespace-nowrap">
              <span class="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0"></span> Normal &ge; {{ muac.normalMinMm }} mm (Suivi Régulier)
            </span>
          </div>
        </div>
      </div>

      <!-- Informational Note -->
      <div class="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-600 mt-2">
        <span class="material-symbols-outlined text-[#003426] text-base shrink-0 mt-0.5">sync_alt</span>
        <p class="text-xs text-pretty">
          <strong>Synchronisation automatique :</strong> Toute altération est immédiatement répercutée sur les carnets de santé numériques et l'application mobile des agents communautaires (Badienou Gokh / Relais Communautaires).
        </p>
      </div>
    </section>
  `
})
export class MuacEditorComponent {
  @Input({ required: true }) muac!: MuacThresholds;
  @Output() configChanged = new EventEmitter<void>();

  onModelChange(): void {
    // Garantir la cohérence des seuils si nécessaire
    if (this.muac.normalMinMm <= this.muac.mamMaxMm) {
      this.muac.normalMinMm = this.muac.mamMaxMm + 1;
    }
    this.configChanged.emit();
  }

  getRedPct(): number {
    const val = Math.max(50, Math.min(150, this.muac.masMaxMm || 115));
    return (val / 210) * 100;
  }

  getYellowPct(): number {
    const redVal = Math.max(50, Math.min(150, this.muac.masMaxMm || 115));
    const yellowVal = Math.max(redVal, Math.min(180, this.muac.mamMaxMm || 124));
    return ((yellowVal - redVal) / 210) * 100;
  }

  getGreenPct(): number {
    return Math.max(10, 100 - this.getRedPct() - this.getYellowPct());
  }
}
