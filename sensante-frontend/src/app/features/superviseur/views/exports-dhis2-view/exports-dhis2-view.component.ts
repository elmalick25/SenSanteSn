import {
  Component, OnInit, OnDestroy, inject, signal,
  AfterViewInit, ElementRef, viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupervisionService } from '../../services/supervision.service';
import {
  Dhis2StudioOverview,
  Dhis2KpiMetric,
  SphereStandardIndicator,
  PrnNationalTarget,
  Dhis2BordereauArchive,
  TeletransmissionDhis2Result
} from '../../models/supervision.models';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-exports-dhis2-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exports-dhis2-view.component.html',
  styleUrls: ['./exports-dhis2-view.component.css']
})
export class ExportsDhis2ViewComponent implements OnInit, AfterViewInit, OnDestroy {

  private readonly supervisionService = inject(SupervisionService);

  // --- State signals ---
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  overview = signal<Dhis2StudioOverview | null>(null);

  // --- UI state ---
  transmissionLoading = signal<boolean>(false);
  transmissionSuccess = signal<string | null>(null);
  transmissionError = signal<string | null>(null);
  exportLoading = signal<boolean>(false);
  pdfLoading = signal<boolean>(false);
  periodeSelectionnee = signal<string>('202410');

  // --- Chart refs ---
  private readonly histogramCanvas = viewChild<ElementRef<HTMLCanvasElement>>('histogramCanvas');
  private histogramChart: Chart | null = null;

  // -------------------------------------------------------------------------
  ngOnInit(): void {
    this.chargerDonnees();
  }

  ngAfterViewInit(): void {
    // Chart rendered after data arrives (see chargerDonnees)
  }

  ngOnDestroy(): void {
    this.histogramChart?.destroy();
    this.histogramChart = null;
  }

  // -------------------------------------------------------------------------
  chargerDonnees(): void {
    this.loading.set(true);
    this.error.set(null);
    this.supervisionService.getDhis2StudioOverview(this.periodeSelectionnee()).subscribe({
      next: (data: Dhis2StudioOverview) => {
        this.overview.set(data);
        this.loading.set(false);
        // Defer chart initialisation to after Angular renders the template
        setTimeout(() => this.initHistogramChart(data), 0);
      },
      error: (err: unknown) => {
        console.error('[ExportsDhis2] Échec chargement données DHIS2 :', err);
        this.error.set('Impossible de charger les données du Studio DHIS2. Vérifiez votre connexion au serveur.');
        this.loading.set(false);
      }
    });
  }

  // -------------------------------------------------------------------------
  // HISTOGRAM CHART.JS
  // -------------------------------------------------------------------------
  private initHistogramChart(data: Dhis2StudioOverview): void {
    const canvasRef = this.histogramCanvas();
    if (!canvasRef) return;

    // Always destroy before re-creating to prevent memory leak
    this.histogramChart?.destroy();

    const labels = data.historiqueMensuel.map(d => d.moisCourt);
    const values = data.historiqueMensuel.map(d => d.volumeDepistages);
    const backgroundColors = data.historiqueMensuel.map(d =>
      d.estMoisActif
        ? 'rgba(16, 185, 129, 1)'      // emerald-500 — mois actif
        : 'rgba(99, 102, 241, 0.35)'   // indigo tonal — mois archivés
    );
    const borderColors = data.historiqueMensuel.map(d =>
      d.estMoisActif ? 'rgba(16, 185, 129, 1)' : 'rgba(99, 102, 241, 0.6)'
    );

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Dépistages',
          data: values,
          backgroundColor: backgroundColors as any,
          borderColor: borderColors as any,
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.92)',
            padding: 12,
            cornerRadius: 8,
            titleColor: '#94a3b8',
            bodyColor: '#f1f5f9',
            callbacks: {
              title: (items) => {
                const mois = data.historiqueMensuel[items[0].dataIndex]?.moisLibelle ?? '';
                return mois + ' 2024';
              },
              label: (item) => {
                const v = item.raw as number;
                return ` ${v.toLocaleString('fr-FR')} dépistages`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#64748b',
              font: { family: 'Inter, sans-serif', size: 11 }
            }
          },
          y: {
            grid: { color: 'rgba(100,116,139,0.12)', lineWidth: 1 },
            border: { dash: [4, 4], display: false },
            ticks: {
              color: '#64748b',
              font: { family: 'Inter, sans-serif', size: 11 },
              callback: (v) => (Number(v) / 1000).toFixed(0) + 'k'
            }
          }
        }
      }
    };

    this.histogramChart = new Chart(canvasRef.nativeElement, config);
  }

  // -------------------------------------------------------------------------
  // ACTIONS
  // -------------------------------------------------------------------------
  teletransmettre(): void {
    const ov = this.overview();
    if (!ov) return;
    this.transmissionLoading.set(true);
    this.transmissionSuccess.set(null);
    this.transmissionError.set(null);
    this.supervisionService.teletransmettreDhis2({
      periode: ov.periodCode,
      codeDistrict: 'DKR-OUEST',
      signataire: 'Dr. Aminata Diallo'
    }).subscribe({
      next: (res: TeletransmissionDhis2Result) => {
        this.transmissionLoading.set(false);
        if (res.success) {
          this.transmissionSuccess.set(`Bordereau ${res.numeroAccuse} transmis · ${res.dateHorodatage}`);
          // Reload to get fresh state
          this.chargerDonnees();
        } else {
          this.transmissionError.set('La transmission a échoué côté DHIS2 MSAS.');
        }
      },
      error: (err: unknown) => {
        console.error('[ExportsDhis2] Échec télétransmission :', err);
        this.transmissionLoading.set(false);
        this.transmissionError.set('Erreur réseau — Veuillez réessayer dans quelques instants.');
      }
    });
  }

  exporterFichier(format: 'json' | 'xml' | 'csv'): void {
    const ov = this.overview();
    this.exportLoading.set(true);
    this.supervisionService.exportDhis2Data(format, ov?.periodCode).subscribe({
      next: (res: { statut: string; format: string; fichier: string }) => {
        this.exportLoading.set(false);
        this.transmissionSuccess.set(`Export ${res.format} généré : ${res.fichier}`);
      },
      error: (_err: unknown) => {
        this.exportLoading.set(false);
        this.transmissionError.set('Échec de la génération du fichier export.');
      }
    });
  }

  genererPdf(): void {
    const ov = this.overview();
    this.pdfLoading.set(true);
    this.supervisionService.genererBordereauPdf(ov?.uuidBordereau).subscribe({
      next: (res: { statut: string; fichier: string; pages: number }) => {
        this.pdfLoading.set(false);
        this.transmissionSuccess.set(`PDF généré : ${res.fichier} (${res.pages} pages)`);
      },
      error: (_err: unknown) => {
        this.pdfLoading.set(false);
        this.transmissionError.set('Échec génération PDF.');
      }
    });
  }

  dismissNotification(): void {
    this.transmissionSuccess.set(null);
    this.transmissionError.set(null);
  }

  // -------------------------------------------------------------------------
  // HELPERS — SPHERE gauge SVG
  // -------------------------------------------------------------------------
  getSphereCircumference(): number { return 2 * Math.PI * 30; } // r=30 → C≈188.5

  getSphereStrokeDash(ind: SphereStandardIndicator): string {
    const c = this.getSphereCircumference();
    // Use the pre-computed dashArrayValeur from backend (percentage of the reference)
    const filled = (ind.dashArrayValeur / 100) * c;
    return `${filled.toFixed(1)} ${(c - filled).toFixed(1)}`;
  }

  getSphereStrokeColor(ind: SphereStandardIndicator): string {
    const map: Record<string, string> = {
      emerald: '#10b981',
      teal: '#14b8a6',
      amber: '#f59e0b',
      red: '#ef4444'
    };
    return map[ind.couleur] ?? '#10b981';
  }

  // -------------------------------------------------------------------------
  // KPI helper
  // -------------------------------------------------------------------------
  kpisAsList(): Dhis2KpiMetric[] {
    const ov = this.overview();
    if (!ov) return [];
    return [
      ov.kpiDepistagesMasMam,
      ov.kpiAdmissionsCrenas,
      ov.kpiHospitalisationsCreni,
      ov.kpiConsommationAtpe
    ];
  }

  getKpiThemeClass(theme: string): string {
    const map: Record<string, string> = {
      emerald: 'kpi-emerald',
      teal: 'kpi-teal',
      amber: 'kpi-amber',
      blue: 'kpi-blue'
    };
    return map[theme] ?? 'kpi-emerald';
  }

  getPrnProgressWidth(prn: PrnNationalTarget): string {
    const pct = Math.min((prn.tauxActuel / 100) * 100, 100);
    return `${pct.toFixed(1)}%`;
  }

  getPrnBarColor(prn: PrnNationalTarget): string {
    if (prn.statut === 'SURPERFORMÉ') return '#10b981';
    if (prn.statut === 'DANS_LA_CIBLE') return '#6366f1';
    return '#f59e0b';
  }

  trackByCode(_: number, item: { code: string }): string { return item.code; }
  trackById(_: number, item: Dhis2BordereauArchive): number { return item.id; }

  getSparklinePolyline(points: number[]): string {
    if (!points || points.length === 0) return '';
    const width = 80;
    const height = 28;
    const maxV = Math.max(...points, 1);
    const xs = points.map((_, i) => (i / (points.length - 1)) * width);
    const ys = points.map(v => height - (v / maxV) * height);
    return xs.map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  }
}
