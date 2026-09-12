import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { MacroFlowPoint } from '../../../../../core/models/audit.model';

Chart.register(...registerables);

@Component({
  selector: 'app-audit-macro-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-5">
      <!-- En-tête avec ventilation par domaine médical -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[22px]">query_stats</span>
            <h2 class="text-headline-md font-headline-md text-slate-900 tracking-tight font-bold text-balance">
              Traçabilité Macroscopique des Consultations &amp; Protocoles d'Accès
            </h2>
          </div>
          <p class="text-xs text-slate-500 mt-0.5 text-pretty">
            Flux d'accès agrégés sur 30 jours et répartition légale par domaine d'intervention médicale
          </p>
        </div>

        <!-- Badges de répartition des spécialités cliniques -->
        <div class="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 whitespace-nowrap">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>Pédiatrie &amp; Néonatalogie (41%)</span>
          </span>

          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-900 border border-sky-200 whitespace-nowrap">
            <span class="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
            <span>Maternité &amp; Santé Femme (28%)</span>
          </span>

          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 whitespace-nowrap">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
            <span>Urgences &amp; SAMU (19%)</span>
          </span>

          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200 whitespace-nowrap">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <span>Pharmacie PNA (12%)</span>
          </span>
        </div>
      </div>

      <!-- Zone Canevas Graphique Chart.js -->
      <div class="relative w-full h-64 bg-slate-50/50 rounded-xl border border-slate-200/80 p-3 overflow-hidden">
        <!-- Callouts Stratégiques contextuels -->
        <div class="absolute left-[45%] top-3 -translate-x-1/2 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg shadow-sm border border-emerald-200 flex items-center gap-2 z-10 pointer-events-none hidden md:flex">
          <span class="material-symbols-outlined text-emerald-600 text-sm">campaign</span>
          <span class="text-[11px] text-emerald-950 font-bold whitespace-nowrap">
            Campagne Vaccination Polio (Pic Pédiatrie)
          </span>
        </div>

        <div class="absolute left-[85%] top-3 -translate-x-1/2 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg shadow-sm border border-sky-200 flex items-center gap-2 z-10 pointer-events-none hidden md:flex">
          <span class="material-symbols-outlined text-sky-600 text-sm">inventory</span>
          <span class="text-[11px] text-sky-950 font-bold whitespace-nowrap">
            Audit Approvisionnement PNA
          </span>
        </div>

        <canvas #chartCanvas class="w-full h-full"></canvas>
      </div>

      <!-- 3 Cartouches d'Excellence Juridique & SSI -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
          <span class="material-symbols-outlined text-primary text-2xl shrink-0">lock_clock</span>
          <div>
            <h4 class="text-xs font-bold uppercase text-slate-800 tracking-wider">Audit Trail Immutable</h4>
            <p class="text-[11px] text-slate-500 mt-0.5 text-pretty">
              Chaque trace est scellée par bloc toutes les 15 minutes sous mandat DSI-MSAS.
            </p>
          </div>
        </div>

        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
          <span class="material-symbols-outlined text-secondary text-2xl shrink-0">policy</span>
          <div>
            <h4 class="text-xs font-bold uppercase text-slate-800 tracking-wider">Directive Secret Médical</h4>
            <p class="text-[11px] text-slate-500 mt-0.5 text-pretty">
              Masquage automatique des identifiants nominatifs pour les analyses épidémiologiques.
            </p>
          </div>
        </div>

        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
          <span class="material-symbols-outlined text-emerald-700 text-2xl shrink-0">gavel</span>
          <div>
            <h4 class="text-xs font-bold uppercase text-slate-800 tracking-wider">Conformité CNDH &amp; RGPD-SN</h4>
            <p class="text-[11px] text-slate-500 mt-0.5 text-pretty">
              Dispositif audité selon la loi n° 2008-12 sur la protection des données personnelles.
            </p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class AuditMacroChartComponent implements OnChanges, OnDestroy {
  @Input() dataPoints: MacroFlowPoint[] = [];
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chartInstance: any = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataPoints'] && this.dataPoints && this.dataPoints.length > 0) {
      this.renderChart();
    }
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  private renderChart(): void {
    const canvas = this.chartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }

    const labels = this.dataPoints.map((p) => p.labelDate);
    const pediatrieData = this.dataPoints.map((p) => p.volumePediatrie);
    const materniteData = this.dataPoints.map((p) => p.volumeMaternite);
    const urgencesData = this.dataPoints.map((p) => p.volumeUrgences);
    const pharmacieData = this.dataPoints.map((p) => p.volumePharmacie);

    // Gradients officiels
    const gradPediatrie = ctx.createLinearGradient(0, 0, 0, 240);
    gradPediatrie.addColorStop(0, 'rgba(5, 150, 105, 0.25)');
    gradPediatrie.addColorStop(1, 'rgba(5, 150, 105, 0.01)');

    const gradMaternite = ctx.createLinearGradient(0, 0, 0, 240);
    gradMaternite.addColorStop(0, 'rgba(2, 132, 199, 0.20)');
    gradMaternite.addColorStop(1, 'rgba(2, 132, 199, 0.01)');

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Pédiatrie & Néonatologie',
            data: pediatrieData,
            borderColor: '#059669',
            backgroundColor: gradPediatrie,
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointRadius: (context) => (context.dataIndex === 14 ? 6 : 0),
            pointHoverRadius: 6,
            pointBackgroundColor: '#059669',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2
          },
          {
            label: 'Maternité & Santé Femme',
            data: materniteData,
            borderColor: '#0284c7',
            backgroundColor: gradMaternite,
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            borderDash: [4, 4],
            pointRadius: (context) => (context.dataIndex === 27 ? 6 : 0),
            pointHoverRadius: 6,
            pointBackgroundColor: '#0284c7',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2
          },
          {
            label: 'Urgences & SAMU',
            data: urgencesData,
            borderColor: '#d97706',
            fill: false,
            tension: 0.4,
            borderWidth: 1.8,
            pointRadius: 0,
            pointHoverRadius: 5
          },
          {
            label: 'Pharmacie Centrale PNA',
            data: pharmacieData,
            borderColor: '#4f46e5',
            fill: false,
            tension: 0.4,
            borderWidth: 1.8,
            pointRadius: 0,
            pointHoverRadius: 5
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
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(19, 27, 46, 0.95)',
            titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' },
            bodyFont: { family: 'Inter', size: 11 },
            padding: 10,
            cornerRadius: 8,
            boxPadding: 4,
            callbacks: {
              label: (item) => ` ${item.dataset.label} : ${item.formattedValue} accès/jour`
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: { family: 'Inter', size: 10 },
              color: '#94a3b8',
              maxTicksLimit: 7
            }
          },
          y: {
            border: {
              dash: [4, 4]
            },
            grid: {
              color: '#e2e8f0'
            },
            ticks: {
              font: { family: 'Inter', size: 10 },
              color: '#94a3b8',
              callback: (value) => `${value} flux`
            }
          }
        }
      }
    });
  }
}
