import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CroissanceOmsData, IndicateurCroissance } from '../../../../core/models/croissance-oms.model';

@Component({
  selector: 'app-growth-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-white border-b border-slate-200/80 sticky top-0 z-20 backdrop-blur-md bg-white/95">
      <div class="w-full py-3 sm:py-4">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <!-- Title & Badges -->
          <div>
            <div class="flex items-center gap-2.5 flex-wrap">
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap flex-shrink-0">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Norme OMS 2006 Active
              </span>
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap flex-shrink-0">
                <svg class="w-3 h-3 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Certifié DHIS2 Sénégal
              </span>
            </div>
            <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1.5 flex items-center gap-2 text-balance font-sans">
              Courbes de Croissance OMS
              <span class="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200 whitespace-nowrap">0 à 24 Mois</span>
            </h1>
            <p class="text-xs sm:text-sm text-slate-500 mt-0.5 text-pretty">
              Trajectoire anthropométrique &amp; percentile OMS en temps réel pour
              <span class="font-semibold text-slate-800">{{ data?.nomComplet || 'Enfant' }}</span>
              ({{ data?.ageEnMois || 0 }} mois • {{ data?.genre === 'FEMININ' ? 'Fille' : 'Garçon' }})
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2.5 flex-wrap sm:flex-nowrap flex-shrink-0">
            <button
              type="button"
              (click)="onOpenGuideModal.emit()"
              class="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 active:scale-[0.98] whitespace-nowrap flex-shrink-0">
              <svg class="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Guide Mesure &amp; Nutrition</span>
            </button>

            <button
              type="button"
              (click)="onExportPdf.emit()"
              [disabled]="isExportingPdf"
              class="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm shadow-emerald-600/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0">
              <svg *ngIf="!isExportingPdf" class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <svg *ngIf="isExportingPdf" class="w-4 h-4 animate-spin text-white flex-shrink-0" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span class="whitespace-nowrap">{{ isExportingPdf ? 'Génération...' : 'Exporter Courbes PDF' }}</span>
            </button>
          </div>
        </div>

        <!-- Demographic Pill Strip -->
        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-600">
          <div class="flex items-center gap-4 flex-wrap">
            <span class="inline-flex items-center gap-1.5 font-medium text-slate-700">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              ID National : <code class="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-semibold">{{ data?.codeNational }}</code>
            </span>
            <span class="text-slate-300">|</span>
            <span>Structure : <strong class="text-slate-800">{{ data?.nomStructureSante }}</strong></span>
            <span class="text-slate-300">|</span>
            <span>Région : <strong class="text-slate-800">{{ data?.regionMedicale }}</strong></span>
          </div>

          <!-- Indicator Tabs -->
          <div class="flex items-center bg-slate-100 p-1 rounded-xl gap-1 overflow-x-auto">
            <button
              type="button"
              (click)="onSelectIndicateur.emit('POIDS_AGE')"
              [class.bg-white]="selectedIndicateur === 'POIDS_AGE'"
              [class.text-emerald-700]="selectedIndicateur === 'POIDS_AGE'"
              [class.shadow-sm]="selectedIndicateur === 'POIDS_AGE'"
              [class.text-slate-600]="selectedIndicateur !== 'POIDS_AGE'"
              class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap">
              Poids / Âge
            </button>
            <button
              type="button"
              (click)="onSelectIndicateur.emit('TAILLE_AGE')"
              [class.bg-white]="selectedIndicateur === 'TAILLE_AGE'"
              [class.text-emerald-700]="selectedIndicateur === 'TAILLE_AGE'"
              [class.shadow-sm]="selectedIndicateur === 'TAILLE_AGE'"
              [class.text-slate-600]="selectedIndicateur !== 'TAILLE_AGE'"
              class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap">
              Taille / Âge
            </button>
            <button
              type="button"
              (click)="onSelectIndicateur.emit('PERIMETRE_BRACHIAL')"
              [class.bg-white]="selectedIndicateur === 'PERIMETRE_BRACHIAL'"
              [class.text-emerald-700]="selectedIndicateur === 'PERIMETRE_BRACHIAL'"
              [class.shadow-sm]="selectedIndicateur === 'PERIMETRE_BRACHIAL'"
              [class.text-slate-600]="selectedIndicateur !== 'PERIMETRE_BRACHIAL'"
              class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap">
              Périmètre Brachial (MUAC)
            </button>
            <button
              type="button"
              (click)="onSelectIndicateur.emit('POIDS_TAILLE')"
              [class.bg-white]="selectedIndicateur === 'POIDS_TAILLE'"
              [class.text-emerald-700]="selectedIndicateur === 'POIDS_TAILLE'"
              [class.shadow-sm]="selectedIndicateur === 'POIDS_TAILLE'"
              [class.text-slate-600]="selectedIndicateur !== 'POIDS_TAILLE'"
              class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap">
              Poids / Taille
            </button>
          </div>
        </div>
      </div>
    </header>
  `
})
export class GrowthHeaderComponent {
  @Input() data: CroissanceOmsData | null = null;
  @Input() selectedIndicateur: IndicateurCroissance = 'POIDS_AGE';
  @Input() isExportingPdf = false;

  @Output() onExportPdf = new EventEmitter<void>();
  @Output() onOpenGuideModal = new EventEmitter<void>();
  @Output() onSelectIndicateur = new EventEmitter<IndicateurCroissance>();
}
