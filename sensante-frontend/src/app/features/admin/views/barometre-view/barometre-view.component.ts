import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarometreService } from '../../../../core/services/barometre.service';
import { HealthToastService } from '../../../../core/services/health-toast.service';
import { BarometreNationalOverview } from '../../../../core/models/barometre.model';
import { BarometreKpisComponent } from './components/barometre-kpis.component';
import { EnrollmentChartComponent } from './components/enrollment-chart.component';
import { RegionalRankingListComponent } from './components/regional-ranking-list.component';
import { PseCommitmentsCardComponent } from './components/pse-commitments-card.component';

@Component({
  selector: 'app-barometre-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BarometreKpisComponent,
    EnrollmentChartComponent,
    RegionalRankingListComponent,
    PseCommitmentsCardComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-[1720px] mx-auto min-h-screen flex flex-col gap-6">
      <!-- 1. En-tête de Pilotage & Sélecteurs Stratégiques -->
      <header class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <span class="material-symbols-outlined text-[24px]">insights</span>
            </div>
            <div>
              <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display text-balance">
                Baromètre National de Santé Publique &amp; Impact Sanitaire
              </h1>
              <p class="text-xs sm:text-sm text-slate-500 text-pretty">
                Observatoire stratégique consolidé du Ministère de la Santé et de l'Action Sociale (MSAS) • République du Sénégal
              </p>
            </div>
          </div>
        </div>

        <!-- Contrôles interactifs : Année, Trimestre & Export PDF -->
        <div class="flex flex-wrap items-center gap-3">
          <!-- Sélecteur Année -->
          <div class="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700">
            <span class="material-symbols-outlined text-[16px] text-slate-500">calendar_today</span>
            <label for="yearSelect" class="sr-only">Exercice budgétaire</label>
            <select 
              id="yearSelect"
              [(ngModel)]="selectedYear" 
              (change)="onFilterChange()"
              class="bg-transparent border-0 focus:ring-0 text-xs font-bold text-slate-900 cursor-pointer"
            >
              <option value="2024">Exercice 2024</option>
              <option value="2023">Exercice 2023</option>
              <option value="2022-2024">Triennal 2022-2024</option>
            </select>
          </div>

          <!-- Sélecteur Trimestre -->
          <div class="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700">
            <span class="material-symbols-outlined text-[16px] text-slate-500">schedule</span>
            <label for="quarterSelect" class="sr-only">Trimestre</label>
            <select 
              id="quarterSelect"
              [(ngModel)]="selectedQuarter" 
              (change)="onFilterChange()"
              class="bg-transparent border-0 focus:ring-0 text-xs font-bold text-slate-900 cursor-pointer"
            >
              <option value="T4">T4 (Octobre - Décembre)</option>
              <option value="T3">T3 (Juillet - Septembre)</option>
              <option value="T2">T2 (Avril - Juin)</option>
              <option value="T1">T1 (Janvier - Mars)</option>
            </select>
          </div>

          <!-- Bouton Actualiser -->
          <button
            type="button"
            (click)="loadOverview(false)"
            [disabled]="isLoading()"
            class="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Actualiser les données"
          >
            <span [class.animate-spin]="isLoading()" class="material-symbols-outlined text-[18px]">refresh</span>
          </button>

          <!-- Bouton Export Rapport PDF -->
          <button
            type="button"
            (click)="exportStrategicPdf()"
            [disabled]="isExportingPdf()"
            class="inline-flex items-center gap-2 px-4 py-2 bg-[#003426] hover:bg-[#004734] text-white text-xs font-bold rounded-xl shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer whitespace-nowrap"
          >
            @if (isExportingPdf()) {
              <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Génération en cours...</span>
            } @else {
              <span class="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              <span>Rapport Stratégique PDF</span>
            }
          </button>
        </div>
      </header>

      <!-- 2. Gestion des 4 États UI -->
      @if (isLoading()) {
        <!-- SKELETON STATE -->
        <div class="space-y-6 animate-pulse">
          <!-- KPI Skeletons -->
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            <div class="h-40 bg-slate-200/80 rounded-2xl"></div>
            <div class="h-40 bg-slate-200/80 rounded-2xl"></div>
            <div class="h-40 bg-slate-200/80 rounded-2xl"></div>
            <div class="h-40 bg-slate-200/80 rounded-2xl"></div>
          </div>
          <!-- Dual Grid Skeletons -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div class="lg:col-span-7 h-96 bg-slate-200/80 rounded-2xl"></div>
            <div class="lg:col-span-5 h-96 bg-slate-200/80 rounded-2xl"></div>
          </div>
          <!-- PSE Skeleton -->
          <div class="h-64 bg-slate-200/80 rounded-2xl"></div>
        </div>
      } @else {
        @if (hasError()) {
          <!-- ERROR STATE -->
          <div class="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center max-w-lg mx-auto my-12">
            <div class="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <span class="material-symbols-outlined text-[26px]">error</span>
            </div>
            <h2 class="text-base font-bold text-rose-900 mb-1">
              Erreur de chargement du Baromètre
            </h2>
            <p class="text-xs text-rose-700 mb-4 text-pretty">
              {{ errorMessage() || 'Impossible d\\'interroger les flux décisionnels MSAS. Veuillez vérifier votre connexion.' }}
            </p>
            <button
              type="button"
              (click)="loadOverview(true)"
              class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer"
            >
              Réessayer
            </button>
          </div>
        } @else {
          @if (overview(); as data) {
            <!-- SUCCESS STATE : Contenu réel connecté -->
            <div class="space-y-6">
              <!-- Section 1 : 4 Big-Number KPI Cards -->
              <app-barometre-kpis [kpis]="data.kpis"></app-barometre-kpis>

              <!-- Section 2 : Dual Analytics Grid (Col 7 / Col 5) -->
              <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <!-- Col 7 : Évolution Cumulative Chart.js (Règle 13) -->
                <div class="lg:col-span-7 flex flex-col">
                  <app-enrollment-chart 
                    [series]="data.enrollmentSeries"
                    [averageMonthlyGain]="data.averageMonthlyGain"
                    [nationalTargetCoverage]="data.nationalTargetCoverage"
                  ></app-enrollment-chart>
                </div>

                <!-- Col 5 : Classement des 14 Régions Médicales -->
                <div class="lg:col-span-5 flex flex-col">
                  <app-regional-ranking-list 
                    [rankings]="data.regionalRankings"
                    (onOpenInterventionPlan)="openInterventionPlanModal()"
                  ></app-regional-ranking-list>
                </div>
              </section>

              <!-- Section 3 : Engagements Stratégiques PSE Santé 2024 -->
              <section>
                <app-pse-commitments-card 
                  [pillars]="data.psePillars"
                  [globalPerformanceIndex]="data.globalPerformanceIndex"
                ></app-pse-commitments-card>
              </section>
            </div>
          } @else {
            <!-- EMPTY STATE -->
            <div class="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto my-12 shadow-xs">
              <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <span class="material-symbols-outlined text-[28px]">query_stats</span>
              </div>
              <h2 class="text-base font-bold text-slate-800 mb-1">
                Aucune donnée barométrique disponible
              </h2>
              <p class="text-xs text-slate-500 mb-4 text-pretty">
                Aucun indicateur consolidé n'a été publié pour l'exercice {{ selectedYear }} ({{ selectedQuarter }}).
              </p>
              <button
                type="button"
                (click)="loadOverview(true)"
                class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer"
              >
                Actualiser
              </button>
            </div>
          }
        }
      }

      <!-- Modale / Panneau Plan d'Intervention d'Urgence Kolda-Kédougou -->
      @if (isInterventionModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div class="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div class="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div class="flex items-center gap-2.5">
                <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <span class="material-symbols-outlined text-[24px]">emergency</span>
                </div>
                <div>
                  <h3 class="text-base font-bold text-slate-900 tracking-tight text-balance">
                    Plan d'Appui d'Urgence PNA — Kolda &amp; Kédougou
                  </h3>
                  <p class="text-xs text-slate-500">
                    Déploiement opérationnel d'urgence sous seuil OMS 80.0%
                  </p>
                </div>
              </div>
              <button 
                type="button"
                (click)="closeInterventionPlanModal()"
                class="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div class="space-y-3 text-xs text-slate-600">
              <div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
                <span class="material-symbols-outlined text-amber-700 text-[18px]">verified_user</span>
                <div>
                  <strong class="font-bold">Priorité Nationale MSAS :</strong>
                  <p class="mt-0.5">
                    Activation immédiate du corridor logistique prioritaire PNA Tambacounda &rarr; Saraya &rarr; Médina Yoro Foulah.
                  </p>
                </div>
              </div>

              <ul class="space-y-2 pt-1 font-medium">
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0"></span>
                  <span><strong>12 000 cartons ATPE</strong> alloués par la Pharmacie Nationale d'Approvisionnement.</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0"></span>
                  <span><strong>14 binômes mobiles</strong> Badienou Gokh et infirmiers chefs de poste déployés.</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0"></span>
                  <span><strong>Synchronisation hors-ligne</strong> SenSanté Offline activée sur les tablettes des postes de brousse.</span>
                </li>
              </ul>
            </div>

            <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button 
                type="button"
                (click)="closeInterventionPlanModal()"
                class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                Fermer
              </button>
              <button 
                type="button"
                (click)="confirmInterventionDispatch()"
                class="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                Confirmer l'Ordre de Mission DRSP
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class BarometreViewComponent implements OnInit {
  private readonly barometreService = inject(BarometreService);
  private readonly toast = inject(HealthToastService);

  overview = signal<BarometreNationalOverview | null>(null);
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);
  errorMessage = signal<string>('');
  isExportingPdf = signal<boolean>(false);
  isInterventionModalOpen = signal<boolean>(false);

  selectedYear = '2024';
  selectedQuarter = 'T4';

  ngOnInit(): void {
    this.loadOverview(true);
  }

  loadOverview(initial = false): void {
    if (initial) {
      this.isLoading.set(true);
    }
    this.hasError.set(false);

    this.barometreService.getOverview(this.selectedYear, this.selectedQuarter).subscribe({
      next: (data: BarometreNationalOverview) => {
        this.overview.set(data);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Erreur baromètre:', err);
        this.hasError.set(true);
        this.errorMessage.set('Échec de communication avec les services de santé publique MSAS.');
        this.isLoading.set(false);
        this.toast.show('Impossible de synchroniser le baromètre national.', 'error');
      }
    });
  }

  onFilterChange(): void {
    this.loadOverview(true);
  }

  exportStrategicPdf(): void {
    this.isExportingPdf.set(true);
    this.barometreService.exportStrategicPdf(this.selectedYear, this.selectedQuarter).subscribe({
      next: (res: { status: string; reportUrl: string; generatedAt: string; message: string }) => {
        this.isExportingPdf.set(false);
        this.toast.show(
          `Rapport stratégique ${this.selectedYear}-${this.selectedQuarter} généré avec succès. Téléchargement sécurisé initié.`,
          'success'
        );
      },
      error: (err: unknown) => {
        console.error('Erreur export PDF:', err);
        this.isExportingPdf.set(false);
        this.toast.show('Échec de la génération du rapport stratégique PDF.', 'error');
      }
    });
  }

  openInterventionPlanModal(): void {
    this.isInterventionModalOpen.set(true);
  }

  closeInterventionPlanModal(): void {
    this.isInterventionModalOpen.set(false);
  }

  confirmInterventionDispatch(): void {
    this.isInterventionModalOpen.set(false);
    this.toast.show(
      "Ordre de mission prioritaire validé : 12 000 cartons ATPE et équipes d'intervention déployés vers Kolda & Kédougou.",
      'success'
    );
  }
}
