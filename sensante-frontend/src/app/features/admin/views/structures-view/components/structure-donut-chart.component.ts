import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
import { StructureStats } from '../../../../../core/models/structure-sante.model';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-structure-donut-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white p-3 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_0_rgba(15,23,42,0.05)] flex items-center gap-3 h-full">
      <div class="relative w-20 h-20 shrink-0 flex items-center justify-center">
        <canvas #donutCanvas class="w-full h-full"></canvas>
        <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span class="text-[11px] font-bold text-slate-800 font-mono leading-none">{{ stats?.totalStructures || 0 }}</span>
          <span class="text-[8px] text-slate-400 uppercase tracking-tighter mt-0.5">Total</span>
        </div>
      </div>
      <div class="flex-1 flex flex-col justify-center gap-1 min-w-0">
        <span class="text-[11px] font-semibold text-slate-700 truncate">Typologie Sanitaire</span>
        <div class="flex items-center justify-between text-[10px]">
          <span class="flex items-center gap-1.5 text-slate-600 truncate">
            <span class="w-2 h-2 rounded-full bg-[#0F4C3A] shrink-0"></span> Postes
          </span>
          <span class="font-mono font-semibold text-slate-800 whitespace-nowrap">{{ stats?.pctPostes || 0 }}%</span>
        </div>
        <div class="flex items-center justify-between text-[10px]">
          <span class="flex items-center gap-1.5 text-slate-600 truncate">
            <span class="w-2 h-2 rounded-full bg-[#10B981] shrink-0"></span> Centres
          </span>
          <span class="font-mono font-semibold text-slate-800 whitespace-nowrap">{{ stats?.pctCentres || 0 }}%</span>
        </div>
        <div class="flex items-center justify-between text-[10px]">
          <span class="flex items-center gap-1.5 text-slate-600 truncate">
            <span class="w-2 h-2 rounded-full bg-[#F59E0B] shrink-0"></span> Hôpitaux
          </span>
          <span class="font-mono font-semibold text-slate-800 whitespace-nowrap">{{ stats?.pctHopitaux || 0 }}%</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class StructureDonutChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('donutCanvas') private canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() stats: StructureStats | null = null;

  private chart: Chart<'doughnut'> | null = null;

  ngAfterViewInit(): void {
    this.createOrUpdateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stats'] && this.canvasRef) {
      this.createOrUpdateChart();
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  private createOrUpdateChart(): void {
    if (!this.canvasRef?.nativeElement) return;

    const postes = this.stats?.pctPostes ?? 0;
    const centres = this.stats?.pctCentres ?? 0;
    const hopitaux = this.stats?.pctHopitaux ?? 0;
    const autres = this.stats?.pctAutres ?? 0;

    const dataValues = [postes, centres, hopitaux, autres].filter(v => v > 0);
    const backgroundColors = ['#0F4C3A', '#10B981', '#F59E0B', '#94A3B8'];

    if (this.chart) {
      this.chart.data.datasets[0].data = [postes, centres, hopitaux, Math.max(0, autres)];
      this.chart.update('none');
      return;
    }

    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Postes de Santé', 'Centres de Santé', 'Hôpitaux', 'Autres'],
        datasets: [
          {
            data: [postes, centres, hopitaux, Math.max(0, autres)],
            backgroundColor: backgroundColors,
            borderWidth: 0,
            hoverOffset: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                return ` ${label}: ${value}%`;
              }
            }
          }
        },
        animation: {
          duration: 600
        }
      }
    });
  }
}
