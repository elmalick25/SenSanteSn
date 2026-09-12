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
import { Chart, registerables } from 'chart.js';
import { TelemetryPoint } from '../../../../../core/models/infrastructure.model';

Chart.register(...registerables);

@Component({
  selector: 'app-telemetry-charts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section aria-label="Télémétrie des ressources de calcul et réseau" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- CHART 1: Charge CPU Clustered -->
      <div class="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm">
        <div>
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Télémétrie 24h</span>
              <h2 class="text-base font-semibold text-slate-900 mt-0.5 text-balance">
                Charge CPU Clustered (vCPU)
              </h2>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap">
              Nominal ({{ currentCpu }}%)
            </span>
          </div>
          <!-- Metric readout -->
          <div class="mt-4 flex items-baseline gap-3">
            <span class="text-3xl font-bold text-slate-900 tracking-tight font-mono">
              {{ currentCpu }}%
            </span>
            <span class="text-xs text-slate-500">
              Pic max : <strong class="font-mono text-slate-800">{{ peakCpu }}%</strong> ({{ peakTime }})
            </span>
          </div>
        </div>

        <!-- Canvas Area -->
        <div class="mt-3 pt-1">
          <div class="h-28 w-full relative">
            <canvas #cpuCanvas></canvas>
          </div>
        </div>

        <div class="mt-3 pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
          <span>Seuil d'alerte : 80% vCPU</span>
          <span class="font-mono text-emerald-700 font-medium">Zone Nominale : 0-70%</span>
        </div>
      </div>

      <!-- CHART 2: Utilisation Mémoire RAM -->
      <div class="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm">
        <div>
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Télémétrie 24h</span>
              <h2 class="text-base font-semibold text-slate-900 mt-0.5 text-balance">
                Mémoire RAM (Postgres/Redis)
              </h2>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap">
              Stable
            </span>
          </div>
          <!-- Metric readout -->
          <div class="mt-4 flex items-baseline gap-3">
            <span class="text-3xl font-bold text-slate-900 tracking-tight font-mono">
              {{ currentRam }}%
            </span>
            <span class="text-xs text-slate-500">
              <strong class="font-mono text-slate-800">{{ usedRamGb }} GB</strong> / {{ totalRamGb }} GB
            </span>
          </div>
        </div>

        <!-- Canvas Area -->
        <div class="mt-3 pt-1">
          <div class="h-28 w-full relative">
            <canvas #ramCanvas></canvas>
          </div>
        </div>

        <div class="mt-3 pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
          <span>Cache Shared Buffers : {{ sharedBuffersGb }} GB</span>
          <span class="font-mono text-emerald-700 font-medium">Seuil Confort &lt; 80%</span>
        </div>
      </div>

      <!-- CHART 3: Temps de Réponse API Gateway -->
      <div class="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm">
        <div>
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Télémétrie 24h</span>
              <h2 class="text-base font-semibold text-slate-900 mt-0.5 text-balance">
                Temps de Réponse Gateway (MSAS)
              </h2>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap">
              Optimal ({{ currentLatency }}ms)
            </span>
          </div>
          <!-- Metric readout -->
          <div class="mt-4 flex items-baseline gap-3">
            <span class="text-3xl font-bold text-slate-900 tracking-tight font-mono">
              {{ currentLatency }} ms
            </span>
            <span class="text-xs text-slate-500">
              p95 : <strong class="font-mono text-slate-800">{{ p95Latency }}ms</strong> | p99 : <strong class="font-mono text-slate-800">{{ p99Latency }}ms</strong>
            </span>
          </div>
        </div>

        <!-- Canvas Area -->
        <div class="mt-3 pt-1">
          <div class="h-28 w-full relative">
            <canvas #latencyCanvas></canvas>
          </div>
        </div>

        <div class="mt-3 pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
          <span>SLA National Garanti &lt; 150ms</span>
          <span class="font-mono text-emerald-700 font-medium">Disponibilité : {{ availability }}%</span>
        </div>
      </div>
    </section>
  `
})
export class TelemetryChartsComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() series: TelemetryPoint[] = [];
  @Input() currentCpu = 28.4;
  @Input() peakCpu = 54.2;
  @Input() peakTime = '14h15';

  @Input() currentRam = 62.1;
  @Input() usedRamGb = 63.5;
  @Input() totalRamGb = 102.4;
  @Input() sharedBuffersGb = 24.0;

  @Input() currentLatency = 42.0;
  @Input() p95Latency = 42.0;
  @Input() p99Latency = 88.0;
  @Input() availability = 100.0;

  @ViewChild('cpuCanvas') cpuCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ramCanvas') ramCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('latencyCanvas') latencyCanvas!: ElementRef<HTMLCanvasElement>;

  private cpuChart?: any;
  private ramChart?: any;
  private latencyChart?: any;

  ngAfterViewInit(): void {
    this.buildCharts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.cpuChart && (changes['series'] || changes['currentCpu'])) {
      this.updateCharts();
    }
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  private buildCharts(): void {
    if (!this.cpuCanvas || !this.ramCanvas || !this.latencyCanvas) return;

    const labels = this.series.map(s => s.timeLabel);
    const cpuData = this.series.map(s => s.cpuPercent);
    const ramData = this.series.map(s => s.ramPercent);
    const latencyData = this.series.map(s => s.latencyMs);

    // 1. CPU Chart
    this.cpuChart = new Chart(this.cpuCanvas.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Charge vCPU (%)',
            data: cpuData,
            borderColor: '#166b53',
            backgroundColor: 'rgba(22, 107, 83, 0.15)',
            borderWidth: 2,
            fill: true,
            tension: 0.35,
            pointRadius: (ctx) => ctx.dataIndex === labels.length - 1 ? 4 : 0,
            pointBackgroundColor: '#003426'
          }
        ]
      },
      options: this.getBaseOptions(0, 100, '%')
    });

    // 2. RAM Chart
    this.ramChart = new Chart(this.ramCanvas.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Mémoire RAM (%)',
            data: ramData,
            borderColor: '#0f4c3a',
            backgroundColor: 'rgba(15, 76, 58, 0.15)',
            borderWidth: 2,
            fill: true,
            tension: 0.35,
            pointRadius: (ctx) => ctx.dataIndex === labels.length - 1 ? 4 : 0,
            pointBackgroundColor: '#003426'
          }
        ]
      },
      options: this.getBaseOptions(0, 100, '%')
    });

    // 3. Latency Gateway Chart
    this.latencyChart = new Chart(this.latencyCanvas.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Latence Gateway (ms)',
            data: latencyData,
            borderColor: '#166b53',
            backgroundColor: 'rgba(22, 107, 83, 0.15)',
            borderWidth: 2,
            fill: true,
            tension: 0.35,
            pointRadius: (ctx) => (ctx.dataIndex === 2 || ctx.dataIndex === labels.length - 1) ? 4 : 0,
            pointBackgroundColor: (ctx) => ctx.dataIndex === 2 ? '#ba1a1a' : '#003426'
          }
        ]
      },
      options: this.getBaseOptions(0, 150, 'ms')
    });
  }

  private updateCharts(): void {
    if (!this.series || this.series.length === 0) return;

    const labels = this.series.map(s => s.timeLabel);
    if (this.cpuChart) {
      this.cpuChart.data.labels = labels;
      this.cpuChart.data.datasets[0].data = this.series.map(s => s.cpuPercent);
      this.cpuChart.update();
    }
    if (this.ramChart) {
      this.ramChart.data.labels = labels;
      this.ramChart.data.datasets[0].data = this.series.map(s => s.ramPercent);
      this.ramChart.update();
    }
    if (this.latencyChart) {
      this.latencyChart.data.labels = labels;
      this.latencyChart.data.datasets[0].data = this.series.map(s => s.latencyMs);
      this.latencyChart.update();
    }
  }

  private getBaseOptions(minY: number, maxY: number, unit: string): any {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { family: 'Inter', size: 11 },
          bodyFont: { family: 'Inter', size: 11 },
          callbacks: {
            label: (ctx: any) => ` ${ctx.parsed.y} ${unit}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: { family: 'Inter', size: 9 },
            color: '#64748b'
          }
        },
        y: {
          min: minY,
          max: maxY,
          grid: { color: 'rgba(226, 232, 240, 0.6)' },
          ticks: {
            font: { family: 'Inter', size: 9 },
            color: '#64748b',
            callback: (v: any) => `${v}${unit === '%' ? '%' : ''}`
          }
        }
      }
    };
  }

  private destroyCharts(): void {
    if (this.cpuChart) {
      this.cpuChart.destroy();
      this.cpuChart = undefined;
    }
    if (this.ramChart) {
      this.ramChart.destroy();
      this.ramChart = undefined;
    }
    if (this.latencyChart) {
      this.latencyChart.destroy();
      this.latencyChart = undefined;
    }
  }
}
