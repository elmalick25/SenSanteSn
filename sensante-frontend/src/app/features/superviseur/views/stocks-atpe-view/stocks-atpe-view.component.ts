import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  signal,
  computed,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupervisionService } from '../../services/supervision.service';
import {
  StocksAtpeOverview,
  StructureStockMatrix,
  StockProduitDetail,
  TransfertPerequationResult,
  OrdreReapproPnaResult
} from '../../models/supervision.models';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-stocks-atpe-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stocks-atpe-view.component.html',
  styleUrls: ['./stocks-atpe-view.component.css']
})
export class StocksAtpeViewComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly supervisionService = inject(SupervisionService);

  @ViewChild('resilienceRadarCanvas') resilienceRadarCanvas?: ElementRef<HTMLCanvasElement>;
  private radarChart?: any;

  // Signaux d'état
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly overview = signal<StocksAtpeOverview | null>(null);
  readonly actionLoading = signal<boolean>(false);
  readonly toastMessage = signal<string | null>(null);
  readonly viewMode = signal<'all' | 'heatmap' | 'perequation'>('all');

  // Console de Péréquation & Transfert
  readonly donorStructure = signal<string>('Centre de Santé Médina');
  readonly receiverStructure = signal<string>('Poste Médina Secteur 3');
  readonly transferQuantity = signal<number>(15);
  readonly transferResult = signal<TransfertPerequationResult | null>(null);

  // Simulation dynamique d'impact
  readonly donorInitialDays = computed(() => {
    const donor = this.donorStructure();
    if (donor.includes('Dépôt')) return 28.0;
    if (donor.includes('Ouakam')) return 19.0;
    return 24.0;
  });

  readonly donorFinalDays = computed(() => {
    const init = this.donorInitialDays();
    const qty = this.transferQuantity();
    return Math.max(14.0, Math.round((init - (qty * 0.2)) * 10) / 10);
  });

  readonly receiverInitialDays = computed(() => {
    const recv = this.receiverStructure();
    if (recv.includes('Fann Hock')) return 11.0;
    return 2.0;
  });

  readonly receiverFinalDays = computed(() => {
    const init = this.receiverInitialDays();
    const qty = this.transferQuantity();
    return Math.round((init + (qty * 0.47)) * 10) / 10;
  });

  readonly isReceiverOutOfCrisis = computed(() => {
    return this.receiverFinalDays() >= 7.0;
  });

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // Initialisation du radar dès réception des données
  }

  ngOnDestroy(): void {
    if (this.radarChart) {
      this.radarChart.destroy();
      this.radarChart = undefined;
    }
  }

  loadData(): void {
    this.loading.set(true);
    this.error.set(null);

    this.supervisionService.getStocksAtpeOverview().subscribe({
      next: (data: StocksAtpeOverview) => {
        this.overview.set(data);
        this.loading.set(false);
        setTimeout(() => this.initRadarChart(), 100);
      },
      error: (err: unknown) => {
        console.error('Erreur chargement stocks ATPE:', err);
        this.error.set('Impossible de charger les données de stock et de flux ATPE.');
        this.loading.set(false);
      }
    });
  }

  prefillTransfer(donor: string, receiver: string): void {
    this.donorStructure.set(donor);
    this.receiverStructure.set(receiver);
    this.scrollToTransferConsole();
    this.showToast(`Transfert préconfiguré : ${donor} ➔ ${receiver}`);
  }

  onSliderChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.transferQuantity.set(parseInt(input.value, 10) || 15);
  }

  executeTransfer(): void {
    this.actionLoading.set(true);
    this.supervisionService.executerTransfertPerequation({
      posteDonneur: this.donorStructure(),
      posteBeneficiaire: this.receiverStructure(),
      quantiteCartons: this.transferQuantity(),
      vecteurTransport: 'Moto de Supervision Médicale #DK-04',
      chauffeurRelais: 'M. Ibrahima Sow'
    }).subscribe({
      next: (res: TransfertPerequationResult) => {
        this.actionLoading.set(false);
        this.transferResult.set(res);
        this.showToast(`Bon de Transfert ${res.numeroBonTransfert} validé et télétransmis sur SIGL/e-LMIS !`);
      },
      error: () => {
        this.actionLoading.set(false);
        this.showToast('Erreur lors de la validation du bon de transfert.');
      }
    });
  }

  commanderReapproPna(): void {
    this.actionLoading.set(true);
    this.supervisionService.creerOrdreReapproPna({
      quantiteCartons: 300,
      motifUrgence: 'Renouvellement stock tampon de district et prévention de rupture',
      commentaire: 'Livraison prioritaire programmée pour jeudi.'
    }).subscribe({
      next: (res: OrdreReapproPnaResult) => {
        this.actionLoading.set(false);
        this.showToast(`Commande ${res.bonCommandeNumero} télétransmise à la PNA (Arrivée : ${res.dateLivraisonPrevue}).`);
      },
      error: () => {
        this.actionLoading.set(false);
        this.showToast('Échec de la télétransmission vers la PNA.');
      }
    });
  }

  exportSigl(): void {
    this.supervisionService.exportSiglStocks().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SIGL-Stocks-ATPE-DakarOuest.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.showToast('Fichier d\'export SIGL/e-LMIS téléchargé avec succès.');
      },
      error: () => {
        this.showToast('Génération de l\'export SIGL effectuée.');
      }
    });
  }

  scrollToTransferConsole(): void {
    const el = document.getElementById('transferConsole');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToHeatmap(): void {
    const el = document.getElementById('heatmapSection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  showToast(message: string): void {
    this.toastMessage.set(message);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 4500);
  }

  private initRadarChart(): void {
    if (!this.resilienceRadarCanvas) return;
    if (this.radarChart) {
      this.radarChart.destroy();
    }

    const ctx = this.resilienceRadarCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.radarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: [
          '1. Autonomie Globale',
          '2. Rotation Stock',
          '3. Promptitude Commande',
          '4. Stock Tampon',
          '5. Conformité SIGL'
        ],
        datasets: [
          {
            label: 'Zone Médina (88%)',
            data: [85, 78, 88, 92, 95],
            backgroundColor: 'rgba(0, 108, 74, 0.25)',
            borderColor: '#006c4a',
            borderWidth: 2.5,
            pointBackgroundColor: '#006c4a',
            pointBorderColor: '#ffffff',
            pointHoverBackgroundColor: '#ffffff',
            pointHoverBorderColor: '#006c4a',
            pointRadius: 4
          },
          {
            label: 'Zone Ouakam (75%)',
            data: [72, 82, 75, 65, 80],
            backgroundColor: 'rgba(2, 132, 199, 0.18)',
            borderColor: '#0284c7',
            borderWidth: 2,
            pointBackgroundColor: '#0284c7',
            pointBorderColor: '#ffffff',
            pointRadius: 3
          },
          {
            label: 'Zone Fann (78%)',
            data: [80, 65, 70, 88, 85],
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            borderColor: '#8b5cf6',
            borderWidth: 1.8,
            pointBackgroundColor: '#8b5cf6',
            pointBorderColor: '#ffffff',
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              boxWidth: 8,
              font: { family: "'Inter', sans-serif", size: 11, weight: 500 }
            }
          },
          tooltip: {
            backgroundColor: '#003426',
            titleFont: { family: "'Inter', sans-serif", size: 12, weight: 600 },
            bodyFont: { family: "'Inter', sans-serif", size: 12 },
            padding: 8,
            cornerRadius: 8
          }
        },
        scales: {
          r: {
            angleLines: { color: 'rgba(203, 213, 225, 0.6)' },
            grid: { color: 'rgba(226, 232, 240, 0.8)' },
            pointLabels: {
              font: { family: "'Inter', sans-serif", size: 10, weight: 600 },
              color: '#0f4c3a'
            },
            ticks: {
              backdropColor: 'transparent',
              font: { size: 9 },
              color: '#94a3b8',
              stepSize: 20
            },
            suggestedMin: 0,
            suggestedMax: 100
          }
        }
      }
    });
  }

  // Utilitaires de classes de cellules Heatmap
  getCellBadgeClass(stock: StockProduitDetail): string {
    switch (stock.niveauAlerte) {
      case 'RUPTURE_IMMINENTE':
        return 'bg-red-600 text-white font-extrabold ring-2 ring-red-300 shadow-md animate-pulse';
      case 'CRITIQUE':
        return 'bg-orange-500 text-white font-bold shadow-xs';
      case 'VIGILANCE':
        return 'bg-amber-400 text-slate-900 font-bold';
      case 'SECURITAIRE':
      default:
        return 'bg-emerald-600 text-white font-bold';
    }
  }
}
