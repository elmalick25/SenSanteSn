import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CroissanceOmsData, IndicateurCroissance } from '../../../../core/models/croissance-oms.model';
import Chart, { ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-who-chart-svg',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <!-- Chart Card Header -->
      <div class="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-slate-50/70 to-white">
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h2 class="text-base font-bold text-slate-900 text-balance">
              {{ getTitle() }}
            </h2>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 whitespace-nowrap flex-shrink-0">
              {{ data?.genre === 'FEMININ' ? 'Filles (0–24m)' : 'Garçons (0–24m)' }}
            </span>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100/80 text-blue-800 border border-blue-200 whitespace-nowrap flex-shrink-0">
              Moteur&nbsp;Chart.js&nbsp;v4&nbsp;Actif
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-1 text-pretty">
            Repères percentiles OMS 2006 (Z-scores : Médiane verte, Alerte MAM orange −22, Alerte MAS rouge −23)
          </p>
        </div>

        <!-- Legend Badges -->
        <div class="flex items-center gap-2 flex-wrap text-xs">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/70 font-medium whitespace-nowrap flex-shrink-0">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Médiane&nbsp;OMS
          </span>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/70 font-medium whitespace-nowrap flex-shrink-0">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            −2 SD&nbsp;(MAM)
          </span>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200/70 font-medium whitespace-nowrap flex-shrink-0">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            −3 SD&nbsp;(MAS)
          </span>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white font-semibold whitespace-nowrap flex-shrink-0">
            <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            Pesées&nbsp;de&nbsp;l'enfant
          </span>
        </div>
      </div>

      <!-- Chart Viewport (Chart.js Canvas Container) -->
      <div class="relative p-2 sm:p-5 w-full h-[430px] sm:h-[480px]">
        <canvas #chartCanvas class="w-full h-full"></canvas>
      </div>

      <!-- Clinical Interpretation Callout Footer -->
      <div class="p-4 sm:p-5 border-t border-slate-100 bg-emerald-50/50 flex items-start gap-3.5">
        <div class="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 mt-0.5">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-xs font-bold uppercase tracking-wider text-emerald-900">
            Avis & Diagnostic Pédiatrique Automatisé
          </h3>
          <p class="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
            {{ data?.interpretationClinique || 'Données en cours d\'analyse anthropométrique conforme aux tables OMS 2006.' }}
          </p>
        </div>
      </div>
    </div>
  `
})
export class WhoChartSvgComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() data: CroissanceOmsData | null = null;
  @Input() indicateur: IndicateurCroissance = 'POIDS_AGE';

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;

  ngAfterViewInit(): void {
    this.createOrUpdateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart) {
      this.createOrUpdateChart();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  getTitle(): string {
    switch (this.indicateur) {
      case 'TAILLE_AGE': return 'Courbe de Croissance Stature : Taille pour Âge (T/A)';
      case 'PERIMETRE_BRACHIAL': return 'Indice Nutritionnel : Périmètre Brachial pour Âge (PB)';
      case 'POIDS_TAILLE': return 'Indice d\'Émaciation : Poids pour Taille (P/T)';
      default: return 'Courbe Pondérale OMS : Poids pour Âge (0 - 24 Mois)';
    }
  }

  private createOrUpdateChart(): void {
    if (!this.chartCanvas?.nativeElement) return;

    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    const refs = this.data?.referencesOms;
    const moisAxe = refs?.moisAxe || [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
    const plusUn = refs?.plusUnSdKg || [3.7, 5.8, 7.3, 8.2, 8.9, 9.6, 10.1, 10.6, 11.1, 11.6, 12.1, 12.6, 13.0];
    const mediane = refs?.medianeKg || [3.2, 5.1, 6.4, 7.3, 7.9, 8.5, 8.9, 9.4, 9.8, 10.2, 10.6, 11.0, 11.5];
    const moinsDeux = refs?.moinsDeuxSdKg || [2.4, 3.9, 5.0, 5.7, 6.3, 6.8, 7.1, 7.6, 8.0, 8.4, 8.7, 9.1, 9.5];
    const moinsTrois = refs?.moinsTroisSdKg || [2.0, 3.4, 4.4, 5.0, 5.6, 6.0, 6.3, 6.8, 7.2, 7.5, 7.8, 8.2, 8.5];

    // Trajectoire réelle de l'enfant
    const pesees = this.data?.historiquePesees || [];
    const childScatter = pesees.map(p => ({
      x: p.ageMois,
      y: p.poidsKg,
      dateBilan: p.dateBilan,
      zScore: p.zScorePoidsAge,
      statut: p.statut,
      examinateur: p.examinateurNom
    }));

    const plusUnData = moisAxe.map((m, i) => ({ x: m, y: plusUn[i] }));
    const medianeData = moisAxe.map((m, i) => ({ x: m, y: mediane[i] }));
    const moinsDeuxData = moisAxe.map((m, i) => ({ x: m, y: moinsDeux[i] }));
    const moinsTroisData = moisAxe.map((m, i) => ({ x: m, y: moinsTrois[i] }));

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        datasets: [
          // 1. +1 SD (Norme Haute)
          {
            label: '+1 SD (Norme Haute)',
            data: plusUnData,
            borderColor: '#34D399',
            borderWidth: 1.5,
            borderDash: [5, 4],
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0.35,
            fill: '+1',
            backgroundColor: 'rgba(52, 211, 153, 0.08)'
          },
          // 2. Médiane OMS (Idéal 0 SD)
          {
            label: 'Médiane OMS (0 SD)',
            data: medianeData,
            borderColor: '#059669',
            borderWidth: 2.5,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0.35,
            fill: '+1',
            backgroundColor: 'rgba(16, 185, 129, 0.06)'
          },
          // 3. -2 SD (Alerte MAM)
          {
            label: '-2 SD (Alerte MAM)',
            data: moinsDeuxData,
            borderColor: '#F59E0B',
            borderWidth: 2,
            borderDash: [5, 3],
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0.35,
            fill: '+1',
            backgroundColor: 'rgba(245, 158, 11, 0.12)'
          },
          // 4. -3 SD (Alerte MAS)
          {
            label: '-3 SD (Dénutrition MAS)',
            data: moinsTroisData,
            borderColor: '#EF4444',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0.35,
            fill: 'origin',
            backgroundColor: 'rgba(239, 68, 68, 0.08)'
          },
          // 5. Pesées Réelles de l'Enfant
          {
            label: `Pesées réelles : ${this.data?.nomComplet || 'Enfant'}`,
            data: childScatter,
            borderColor: '#064E3B',
            borderWidth: 3.5,
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#059669',
            pointBorderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 9,
            pointHoverBackgroundColor: '#10B981',
            pointHoverBorderColor: '#064E3B',
            pointHoverBorderWidth: 3.5,
            tension: 0.25,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'nearest',
          intersect: false
        },
        plugins: {
          legend: {
            display: false // Légende personnalisée dans l'en-tête
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#FFFFFF',
            bodyColor: '#E2E8F0',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 10,
            displayColors: true,
            callbacks: {
              title: (items) => {
                if (!items.length) return '';
                const item = items[0];
                return `Âge : ${item.parsed.x} mois`;
              },
              label: (context) => {
                const datasetLabel = context.dataset.label || '';
                const val = context.parsed.y ?? 0;
                if (context.datasetIndex === 4) {
                  const raw = context.raw as any;
                  return [
                    `Poids Enfant : ${val.toFixed(2)} kg`,
                    raw?.dateBilan ? `Date : ${raw.dateBilan}` : '',
                    raw?.zScore !== undefined ? `Z-Score : ${raw.zScore >= 0 ? '+' : ''}${raw.zScore.toFixed(2)}σ` : '',
                    raw?.statut ? `Statut : ${raw.statut}` : '',
                    raw?.examinateur ? `Praticien : ${raw.examinateur}` : ''
                  ].filter(Boolean);
                }
                return `${datasetLabel} : ${val.toFixed(1)} kg`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            min: 0,
            max: 24,
            grid: {
              color: '#F1F5F9'
            },
            ticks: {
              stepSize: 2,
              callback: (val) => `${val} m`,
              font: {
                family: 'Plus Jakarta Sans, sans-serif',
                size: 11,
                weight: 'bold'
              },
              color: '#64748B'
            },
            title: {
              display: true,
              text: 'Âge révolu en mois (0 à 24 Mois)',
              color: '#475569',
              font: {
                family: 'Plus Jakarta Sans, sans-serif',
                size: 12,
                weight: 'bold'
              }
            }
          },
          y: {
            type: 'linear',
            min: 2,
            max: 16,
            grid: {
              color: '#F1F5F9'
            },
            ticks: {
              stepSize: 2,
              callback: (val) => `${val} kg`,
              font: {
                family: 'Plus Jakarta Sans, sans-serif',
                size: 11,
                weight: 'bold'
              },
              color: '#64748B'
            },
            title: {
              display: true,
              text: 'Poids corporel (kg)',
              color: '#475569',
              font: {
                family: 'Plus Jakarta Sans, sans-serif',
                size: 12,
                weight: 'bold'
              }
            }
          }
        }
      }
    };

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, config);
    }
  }
}
