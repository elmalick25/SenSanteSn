import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { AgentTactiqueService } from '../../services/agent-tactique.service';
import { AuthService } from '../../../../core/services/auth.service';
import {
  ClotureRegistreOverview,
  TransmissionDistrictRequest,
  ActionTactiqueResponse
} from '../../models/agent-tactique.model';

Chart.register(...registerables);

@Component({
  selector: 'app-cloture-jour-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cloture-jour-view.component.html',
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #cbd5e1;
      border-radius: 4px;
    }
  `]
})
export class ClotureJourViewComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly agentService = inject(AgentTactiqueService);
  private readonly authService = inject(AuthService);

  @ViewChild('muacChartCanvas') muacChartCanvasRef?: ElementRef<HTMLCanvasElement>;
  private muacChart: Chart<'bar'> | null = null;

  // 4 États de Vie UI
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly toastMessage = signal<string | null>(null);
  readonly isTransmitting = signal<boolean>(false);
  readonly isGeneratingPdf = signal<boolean>(false);

  // Données du registre officiel
  readonly overview = signal<ClotureRegistreOverview | null>(null);
  readonly estTransmis = signal<boolean>(false);

  // Identité dynamique agent connecté
  readonly agentNomComplet = signal<string>('Agente Bajenu Gox');
  readonly agentMatricule = signal<string>('BG-DK-0428');
  readonly dateJour = signal<string>(new Date().toISOString().split('T')[0]);

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.agentNomComplet.set(`${user.prenom} ${user.nom}`);
      this.agentMatricule.set(`BG-${user.nom.toUpperCase().slice(0, 3)}-${String(user.idUser).padStart(4, '0')}`);
    }
    this.chargerDonnees();
  }

  ngAfterViewInit(): void {
    // Le graphique sera initialisé dès que les données overview seront chargées
  }

  ngOnDestroy(): void {
    if (this.muacChart) {
      this.muacChart.destroy();
      this.muacChart = null;
    }
  }

  chargerDonnees(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.agentService.getClotureRegistreOverview().subscribe({
      next: (data: ClotureRegistreOverview) => {
        this.overview.set(data);
        this.estTransmis.set(data.transmisDistrict);
        this.isLoading.set(false);
        setTimeout(() => this.initOrUpdateChart(data), 50);
      },
      error: (err: unknown) => {
        console.error('Erreur lors du chargement du registre de clôture', err);
        this.errorMessage.set('Échec de réconciliation du registre de clôture journalier.');
        this.isLoading.set(false);
      }
    });
  }

  private initOrUpdateChart(data: ClotureRegistreOverview): void {
    const canvas = this.muacChartCanvasRef?.nativeElement;
    if (!canvas) return;

    if (this.muacChart) {
      this.muacChart.destroy();
      this.muacChart = null;
    }

    const lignes = data.depistagesMuac || [];
    const labels = lignes.map(l => l.categorie);
    const counts = lignes.map(l => l.effectifConstate);
    const colors = lignes.map(l => {
      if (l.couleur === 'ROUGE') return '#DC2626';
      if (l.couleur === 'JAUNE') return '#D97706';
      return '#059669';
    });

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.muacChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels.length > 0 ? labels : ['Normal (≥ 125 mm)', 'MAM (115–124 mm)', 'MAS Critique (< 115 mm)'],
        datasets: [{
          label: 'Effectif constaté (enfants)',
          data: counts.length > 0 ? counts : [28, 7, 3],
          backgroundColor: colors.length > 0 ? colors : ['#059669', '#D97706', '#DC2626'],
          borderRadius: 6,
          barThickness: 24
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.raw} enfants dépistés`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.06)' },
            ticks: { precision: 0, font: { family: 'Inter', size: 11 } }
          },
          y: {
            grid: { display: false },
            ticks: { font: { family: 'Inter', size: 12, weight: 'bold' } }
          }
        }
      }
    });
  }

  viserEtTransmettreDistrict(): void {
    this.isTransmitting.set(true);
    const req: TransmissionDistrictRequest = {
      dateCloture: this.dateJour(),
      signatureAgenteId: this.agentMatricule(),
      notesTransmission: `Clôture de tournée Secteur 4 visée par ${this.agentNomComplet()} (${this.agentMatricule()}). Protocoles UREN respectés.`
    };

    this.agentService.transmettreClotureDistrict(req).subscribe({
      next: (res: ActionTactiqueResponse) => {
        this.isTransmitting.set(false);
        this.estTransmis.set(true);
        this.toastMessage.set(res.message);
        setTimeout(() => this.toastMessage.set(null), 5000);
      },
      error: (err: unknown) => {
        console.error('Erreur lors de la transmission réglementaire', err);
        this.isTransmitting.set(false);
        this.errorMessage.set('Erreur lors de la télétransmission au médecin superviseur de district.');
      }
    });
  }

  genererBordereauPdf(): void {
    this.isGeneratingPdf.set(true);
    this.agentService.genererBordereauPdf(this.dateJour()).subscribe({
      next: (res: ActionTactiqueResponse) => {
        this.isGeneratingPdf.set(false);
        this.toastMessage.set(res.message);
        setTimeout(() => this.toastMessage.set(null), 4000);
      },
      error: (err: unknown) => {
        console.error('Erreur génération PDF', err);
        this.isGeneratingPdf.set(false);
        this.errorMessage.set('Erreur lors de la génération du bordereau PDF.');
      }
    });
  }

  rechercherPatient(): void {
    this.toastMessage.set('Indexation du registre DGS : recherche de patient active.');
    setTimeout(() => this.toastMessage.set(null), 3000);
  }
}
