import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import { MonthlyEnrollmentPoint } from '../../../../../core/models/barometre.model';

Chart.register(...registerables);

@Component({
  selector: 'app-enrollment-chart',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between h-full">
      <!-- En-tête du graphique -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-emerald-600 text-[22px]">show_chart</span>
            <h2 class="text-base font-bold text-slate-900 tracking-tight text-balance">
              Évolution Cumulative des Enfants Enrôlés
            </h2>
          </div>
          <p class="text-xs text-slate-500 mt-0.5 text-pretty">
            Suivi mensuel consolidé national (Novembre 2023 — Octobre 2024)
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 whitespace-nowrap">
            <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Moyenne: +{{ averageMonthlyGain | number:'1.0-0' }} / mois</span>
          </span>

          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
            <span class="material-symbols-outlined text-[14px] text-slate-500">flag</span>
            <span>Cible {{ nationalTargetCoverage }}%</span>
          </span>
        </div>
      </div>

      <!-- Zone Canevas Chart.js -->
      <div class="relative w-full h-[280px] sm:h-[320px]">
        <canvas #chartCanvas></canvas>
      </div>

      <!-- Jalons & Repères Clés -->
      <div class="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div class="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
          <div class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 text-xs font-bold">
            05/24
          </div>
          <div class="min-w-0">
            <p class="text-xs font-bold text-slate-800 truncate">Campagne Polio+MAS</p>
            <p class="text-[11px] text-slate-500 truncate">+142 000 enfants en 1 mois</p>
          </div>
        </div>

        <div class="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
          <div class="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 text-xs font-bold">
            07/24
          </div>
          <div class="min-w-0">
            <p class="text-xs font-bold text-slate-800 truncate">Postes ruraux Est &amp; Sud</p>
            <p class="text-[11px] text-slate-500 truncate">Kédougou, Tamba &amp; Kolda</p>
          </div>
        </div>

        <div class="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
          <div class="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 text-xs font-bold">
            09/24
          </div>
          <div class="min-w-0">
            <p class="text-xs font-bold text-slate-800 truncate">Cap 1.4M Franchi</p>
            <p class="text-[11px] text-slate-500 truncate">Record national d'enrôlement</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EnrollmentChartComponent implements OnChanges, OnDestroy {
  @ViewChild('chartCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input({ required: true }) series: MonthlyEnrollmentPoint[] = [];
  @Input() averageMonthlyGain = 123550;
  @Input() nationalTargetCoverage = 89.2;

  private chart: any = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['series'] && this.series?.length > 0) {
      this.renderChart();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  private renderChart(): void {
    if (!this.canvasRef?.nativeElement) return;

    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Dégradé émeraude sous la courbe
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.28)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.01)');

    const labels = this.series.map(s => s.monthLabel);
    const actualData = this.series.map(s => s.actualEnrolled);
    const targetData = this.series.map(s => s.targetEnrolled);

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Enfants Enrôlés (Réalisé)',
            data: actualData,
            borderColor: '#059669',
            backgroundColor: gradient,
            borderWidth: 3,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#059669',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointHoverBackgroundColor: '#047857',
            pointHoverBorderColor: '#ffffff'
          },
          {
            label: 'Objectif Stratégique (PSE)',
            data: targetData,
            borderColor: '#94a3b8',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: 0.25,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#64748b'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              boxWidth: 8,
              boxHeight: 8,
              font: {
                family: "'Inter', sans-serif",
                size: 11,
                weight: 600
              },
              color: '#475569'
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#f8fafc',
            bodyColor: '#e2e8f0',
            padding: 12,
            cornerRadius: 10,
            boxPadding: 4,
            usePointStyle: true,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const val = context.parsed.y ?? 0;
                return ` ${label}: ${new Intl.NumberFormat('fr-FR').format(val)} enfants`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                family: "'Inter', sans-serif",
                size: 11
              },
              color: '#64748b'
            }
          },
          y: {
            beginAtZero: false,
            grid: {
              color: '#f1f5f9'
            },
            ticks: {
              font: {
                family: "'Inter', sans-serif",
                size: 11
              },
              color: '#64748b',
              callback: (value) => {
                const val = Number(value);
                if (val >= 1000000) {
                  return (val / 1000000).toFixed(1) + ' M';
                } else if (val >= 1000) {
                  return (val / 1000).toFixed(0) + ' k';
                }
                return val;
              }
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }
}
