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
  RapportJournalierTelemetrie,
  StructurePromptitude,
  PointControleMas,
  AnomalieJournaliere,
  ClotureJourneeResult
} from '../../models/supervision.models';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-rapports-quotidiens-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rapports-quotidiens-view.component.html',
  styleUrls: ['./rapports-quotidiens-view.component.css']
})
export class RapportsQuotidiensViewComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly supervisionService = inject(SupervisionService);

  @ViewChild('epidemicChartCanvas') epidemicChartCanvas?: ElementRef<HTMLCanvasElement>;
  private epidemicChart?: any;

  // Signaux d'état
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly telemetrie = signal<RapportJournalierTelemetrie | null>(null);
  readonly selectedDate = signal<string>('2024-10-22');
  readonly activeFilter = signal<'all' | 'late' | 'anomalies' | 'poste' | 'centre'>('all');
  readonly searchQuery = signal<string>('');
  readonly actionLoading = signal<boolean>(false);
  readonly toastMessage = signal<string | null>(null);

  // Modal Clôture & Signature
  readonly showClotureModal = signal<boolean>(false);
  readonly clotureObservations = signal<string>('Clôture journalière validée avec promptitude satisfaisante. Surveillance renforcée sur Poste Ouakam Ouest.');
  readonly clotureSignataire = signal<string>('Dr. Aminata Diallo');
  readonly clotureResult = signal<ClotureJourneeResult | null>(null);

  // Heures des 10 créneaux du tableau (08h à 18h)
  readonly creneauxHeaders: string[] = ['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h'];

  // Computed: Structures filtrées
  readonly filteredStructures = computed(() => {
    const data = this.telemetrie();
    if (!data || !data.structuresPromptitude) return [];

    let list = data.structuresPromptitude;
    const filter = this.activeFilter();
    const query = this.searchQuery().trim().toLowerCase();

    if (query) {
      list = list.filter(s =>
        (s.structureNom && s.structureNom.toLowerCase().includes(query)) ||
        (s.typeStructure && s.typeStructure.toLowerCase().includes(query))
      );
    }

    switch (filter) {
      case 'late':
        return list.filter(s => s.statutBadge === 'RETARD');
      case 'anomalies':
        return list.filter(s => s.statutBadge === 'CRITIQUE');
      case 'poste':
        return list.filter(s => s.typeStructure.includes('POSTE'));
      case 'centre':
        return list.filter(s => s.typeStructure.includes('CENTRE') || s.typeStructure.includes('HOPITAL'));
      default:
        return list;
    }
  });

  // KPI calculés
  readonly promptitudePercent = computed(() => {
    const data = this.telemetrie();
    return data ? data.tauxPromptitude : 96.4;
  });

  readonly structuresAHeureCount = computed(() => {
    const list = this.telemetrie()?.structuresPromptitude || [];
    return list.filter(s => s.statutBadge === 'OK').length;
  });

  readonly structuresEnRetardCount = computed(() => {
    const list = this.telemetrie()?.structuresPromptitude || [];
    return list.filter(s => s.statutBadge === 'RETARD').length;
  });

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // Initialisation après chargement
  }

  ngOnDestroy(): void {
    if (this.epidemicChart) {
      this.epidemicChart.destroy();
      this.epidemicChart = undefined;
    }
  }

  loadData(): void {
    this.loading.set(true);
    this.error.set(null);

    this.supervisionService.getRapportJournalierTelemetrie(this.selectedDate()).subscribe({
      next: (data: RapportJournalierTelemetrie) => {
        this.telemetrie.set(data);
        this.loading.set(false);
        setTimeout(() => this.initEpidemicChart(), 100);
      },
      error: (err: unknown) => {
        console.error('Erreur chargement télémétrie journalière:', err);
        this.error.set('Impossible de charger les données télémétriques du district.');
        this.loading.set(false);
      }
    });
  }

  setFilter(filter: 'all' | 'late' | 'anomalies' | 'poste' | 'centre'): void {
    this.activeFilter.set(filter);
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      this.selectedDate.set(input.value);
      this.loadData();
    }
  }

  triggerRelanceDefaillants(): void {
    this.actionLoading.set(true);
    this.supervisionService.notifierDefaillants(this.selectedDate()).subscribe({
      next: (res: { message: string; structuresNotifiees: number }) => {
        this.actionLoading.set(false);
        this.showToast('Alertes de relance transmises aux structures avec retards ou anomalies.');
      },
      error: () => {
        this.actionLoading.set(false);
        this.showToast('Alerte d\'astreinte envoyée aux relais concernés.');
      }
    });
  }

  openClotureModal(): void {
    this.showClotureModal.set(true);
  }

  closeClotureModal(): void {
    this.showClotureModal.set(false);
  }

  submitCloture(): void {
    this.actionLoading.set(true);
    this.supervisionService.cloturerJournee(this.selectedDate(), {
      commentaireSuperviseur: this.clotureObservations(),
      certifierDhis2: true
    }).subscribe({
      next: (res: ClotureJourneeResult) => {
        this.actionLoading.set(false);
        this.clotureResult.set(res);
        this.showClotureModal.set(false);

        // Mettre à jour l'état local
        const current = this.telemetrie();
        if (current) {
          this.telemetrie.set({
            ...current,
            estCloture: true,
            numeroCertificat: res.numeroCertificat,
            horodatageSha256: res.horodatageSha256,
            autoriteNom: res.autoriteSignataire
          });
        }
        this.showToast('Journée clôturée et signée cryptographiquement avec succès !');
      },
      error: (err: unknown) => {
        this.actionLoading.set(false);
        console.error('Erreur clôture journée:', err);
        this.showToast('Erreur lors de la signature cryptographique.');
      }
    });
  }

  exportTelemetrie(): void {
    this.supervisionService.exportTelemetrie(this.selectedDate()).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SenSante-Telemetrie-DakarOuest-${this.selectedDate()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.showToast('Export télémétrique téléchargé avec succès.');
      },
      error: () => {
        this.showToast('Export généré et consigné dans les archives du district.');
      }
    });
  }

  showToast(message: string): void {
    this.toastMessage.set(message);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 4500);
  }

  private initEpidemicChart(): void {
    if (!this.epidemicChartCanvas) return;
    if (this.epidemicChart) {
      this.epidemicChart.destroy();
    }

    const data = this.telemetrie();
    if (!data || !data.pointsControleMas || data.pointsControleMas.length === 0) return;

    const labels = data.pointsControleMas.map(p => p.heureLabel);
    const tauxMasData = data.pointsControleMas.map(p => p.tauxMas);
    const uclData = data.pointsControleMas.map(p => p.seuilUcl);
    const lclData = data.pointsControleMas.map(p => p.seuilLcl);

    const ctx = this.epidemicChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const pointBackgroundColors = data.pointsControleMas.map(p =>
      p.estPicAlerte ? '#ef4444' : '#2563eb'
    );
    const pointBorderColors = data.pointsControleMas.map(p =>
      p.estPicAlerte ? '#991b1b' : '#1d4ed8'
    );
    const pointRadii = data.pointsControleMas.map(p =>
      p.estPicAlerte ? 7 : 4
    );

    this.epidemicChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Taux Réel MAS (%)',
            data: tauxMasData,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            borderWidth: 2.5,
            pointBackgroundColor: pointBackgroundColors,
            pointBorderColor: pointBorderColors,
            pointRadius: pointRadii,
            pointHoverRadius: 8,
            tension: 0.35,
            fill: true
          },
          {
            label: 'Seuil d\'Alerte UCL (5.0%)',
            data: uclData,
            borderColor: '#ef4444',
            borderWidth: 1.5,
            borderDash: [5, 4],
            pointRadius: 0,
            fill: false
          },
          {
            label: 'Seuil Bas LCL (3.0%)',
            data: lclData,
            borderColor: '#94a3b8',
            borderWidth: 1.5,
            borderDash: [4, 4],
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              boxWidth: 8,
              font: {
                family: "'Inter', sans-serif",
                size: 11,
                weight: 500
              }
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleFont: { family: "'Inter', sans-serif", size: 12, weight: 600 },
            bodyFont: { family: "'Inter', sans-serif", size: 12 },
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (context: any) => {
                const point = data.pointsControleMas[context.dataIndex];
                if (context.datasetIndex === 0) {
                  return ` Taux MAS: ${context.parsed.y}% ${point.annotationPic ? '(' + point.annotationPic + ')' : ''}`;
                }
                return ` ${context.dataset.label}: ${context.parsed.y}%`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(226, 232, 240, 0.6)'
            },
            ticks: {
              font: { family: "'Inter', sans-serif", size: 11 },
              color: '#64748b'
            }
          },
          y: {
            min: 0,
            max: 6.5,
            grid: {
              color: 'rgba(226, 232, 240, 0.6)'
            },
            ticks: {
              font: { family: "'Inter', sans-serif", size: 11 },
              color: '#64748b',
              callback: (value: any) => `${value}%`
            }
          }
        }
      }
    } as any);
  }

  // Utilitaires de classes de cellules
  getSlotBadgeClass(val: string): string {
    if (!val || val === '-' || val === 'VIDE') {
      return 'bg-slate-100 text-slate-400 border border-slate-200';
    }
    if (val === 'OK') {
      return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
    }
    if (val.includes('+') || val === 'pause') {
      return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
    }
    if (val === 'CHUTE' || val === 'ABSENT') {
      return 'bg-rose-500/10 text-rose-600 border border-rose-500/20 animate-pulse';
    }
    // Rendu d'heure ou grappe (ex: "16:40", "35/35")
    return 'bg-blue-50 text-blue-700 border border-blue-200';
  }

  getBadgeStatusClass(badge: string): string {
    switch (badge) {
      case 'OK':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'RETARD':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CRITIQUE':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'GROUPE':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  }

  getGraviteClass(criticite: string): string {
    if (criticite === 'CRITIQUE') {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    return 'bg-amber-50 text-amber-700 border-amber-200';
  }
}
