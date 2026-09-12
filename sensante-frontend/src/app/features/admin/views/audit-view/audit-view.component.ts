import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AuditStats,
  GeneratedReportResult,
  LegalAuditLog,
  MacroFlowPoint,
  RegionalCompliance
} from '../../../../core/models/audit.model';
import { AuditService } from '../../../../core/services/audit.service';
import { AuditScorecardsComponent } from './components/audit-scorecards.component';
import { AuditMacroChartComponent } from './components/audit-macro-chart.component';
import { RegionalComplianceTableComponent } from './components/regional-compliance-table.component';
import { LegalAuditRegisterComponent } from './components/legal-audit-register.component';

@Component({
  selector: 'app-audit-view',
  standalone: true,
  imports: [
    CommonModule,
    AuditScorecardsComponent,
    AuditMacroChartComponent,
    RegionalComplianceTableComponent,
    LegalAuditRegisterComponent
  ],
  template: `
    <div class="space-y-6">
      
      <!-- SUB-HEADER BAR : FIL D'ARIANE MINISTÉRIEL & ACTIONS RÉGALIENNES -->
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <!-- Fil d'Ariane & Badge Souveraineté -->
        <div class="flex flex-wrap items-center gap-3 text-xs">
          <div class="flex items-center gap-1.5 text-slate-500 font-medium">
            <span>Cabinet Ministériel</span>
            <span class="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Inspection Générale de la Santé</span>
            <span class="material-symbols-outlined text-[14px]">chevron_right</span>
            <span class="text-primary font-bold">Synthèse Exécutive SSI &amp; Conformité Légale</span>
          </div>

          <span class="hidden sm:inline-block h-4 w-px bg-slate-200"></span>

          <!-- Pilule Haute Souveraineté -->
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold whitespace-nowrap">
            <span class="material-symbols-outlined text-sm text-emerald-700">verified_user</span>
            <span>Certifié CNDH &amp; Référentiel National MSAS</span>
          </div>
        </div>

        <!-- Actions Utilitaires à Droite -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Période d'audit -->
          <div class="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium whitespace-nowrap">
            <span class="material-symbols-outlined text-sm text-slate-500">calendar_today</span>
            <span>Période : T4 2024 (Consolidé)</span>
          </div>

          <!-- Bouton Export Rapport Ministériel PDF Signé -->
          <button
            type="button"
            [disabled]="isGeneratingReport"
            (click)="onGenerateOfficialReport()"
            class="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-semibold shadow-sm transition-all whitespace-nowrap active:scale-[0.98] disabled:opacity-50"
          >
            <span *ngIf="!isGeneratingReport" class="material-symbols-outlined text-[16px]">print</span>
            <span *ngIf="isGeneratingReport" class="material-symbols-outlined text-[16px] animate-spin">refresh</span>
            <span>{{ isGeneratingReport ? 'Génération du sceau...' : 'Rapport Officiel Ministériel (PDF Signé)' }}</span>
          </button>
        </div>
      </header>

      <!-- ÉTAT 1 : CHARGEMENT -->
      <div *ngIf="isLoading" class="space-y-6">
        <div class="h-44 bg-slate-200 rounded-2xl animate-pulse"></div>
        <div class="h-72 bg-slate-200 rounded-2xl animate-pulse"></div>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-7 h-64 bg-slate-200 rounded-2xl animate-pulse"></div>
          <div class="lg:col-span-5 h-64 bg-slate-200 rounded-2xl animate-pulse"></div>
        </div>
      </div>

      <!-- ÉTAT 2 : ERREUR -->
      <div *ngIf="errorMessage && !isLoading" class="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-3">
        <span class="material-symbols-outlined text-rose-600 text-[36px]">error</span>
        <h3 class="text-sm font-bold text-rose-900">Erreur lors de la récupération des audits SSI</h3>
        <p class="text-xs text-rose-700">{{ errorMessage }}</p>
        <button
          type="button"
          (click)="loadAllAuditData()"
          class="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors whitespace-nowrap"
        >
          Réessayer
        </button>
      </div>

      <!-- ÉTAT 3 & 4 : RENDU NOMINAL -->
      <div *ngIf="!isLoading && !errorMessage" class="space-y-6">
        
        <!-- ======================= SECTION 1 : BANNIÈRE EXÉCUTIVE & SCORECARDS SSI ======================= -->
        <section class="bg-gradient-to-r from-primary to-[#0c382a] text-white rounded-2xl p-6 shadow-sm flex flex-col gap-6">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-3xl text-emerald-300">assured_workload</span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h1 class="text-headline-lg font-headline-lg font-bold tracking-tight text-white text-balance">
                    Tableau de Bord Stratégique — Conformité SSI &amp; Protection des Données
                  </h1>
                  <span class="px-2 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400 text-[11px] font-semibold text-emerald-200 uppercase tracking-wider whitespace-nowrap">
                    Audit Légal Q4
                  </span>
                </div>
                <p class="text-xs text-emerald-100/90 mt-1 text-pretty max-w-3xl">
                  À l'attention de Monsieur le Ministre, de l'Inspection Générale de la Santé et des Directeurs Régionaux de la Santé (DRS)
                </p>
              </div>
            </div>

            <!-- Horodatage officiel d'arbitrage -->
            <div class="flex flex-col items-start lg:items-end justify-between text-left lg:text-right border-t lg:border-t-0 pt-3 lg:pt-0 border-white/10 shrink-0">
              <span class="text-[11px] uppercase tracking-wider text-emerald-300 font-bold">
                Horodatage officiel d'arbitrage
              </span>
              <span class="text-sm font-bold text-white font-code-num">
                {{ stats?.horodatageArbitrage || '07 Novembre 2024 — 11:42:18 GMT' }}
              </span>
              <span class="text-[11px] text-emerald-200/80">
                Souveraineté des serveurs : {{ stats?.serveurSouverain || 'Datacenter National ADIE (Diamniadio)' }}
              </span>
            </div>
          </div>

          <!-- 4 Scorecards Stratégiques -->
          <app-audit-scorecards [stats]="stats"></app-audit-scorecards>
        </section>

        <!-- ======================= SECTION 2 : CHART.JS MACROSCOPIQUE 30 JOURS ======================= -->
        <app-audit-macro-chart [dataPoints]="macroFlow"></app-audit-macro-chart>

        <!-- ======================= SECTION 3 : GRILLE RÉGIONALE & REGISTRE PROBATOIRE ======================= -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Grille Régionale (7 cols) -->
          <div class="lg:col-span-7">
            <app-regional-compliance-table [regionalData]="regionalList"></app-regional-compliance-table>
          </div>

          <!-- Registre Certifié des Audits Légaux (5 cols) -->
          <div class="lg:col-span-5">
            <app-legal-audit-register
              [legalLogs]="legalLogs"
              (downloadPdf)="onDownloadPdf($event)"
              (downloadAllZip)="onDownloadAllZip()"
            ></app-legal-audit-register>
          </div>
        </div>

      </div>

      <!-- NOTIFICATION TOAST SUCCÈS -->
      <div
        *ngIf="toastMessage"
        class="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200"
      >
        <span class="material-symbols-outlined text-emerald-400 text-[18px]">verified</span>
        <span>{{ toastMessage }}</span>
      </div>

    </div>
  `
})
export class AuditViewComponent implements OnInit {
  private readonly auditService = inject(AuditService);

  isLoading = false;
  isGeneratingReport = false;
  errorMessage = '';
  toastMessage = '';

  stats: AuditStats | null = null;
  regionalList: RegionalCompliance[] = [];
  macroFlow: MacroFlowPoint[] = [];
  legalLogs: LegalAuditLog[] = [];

  ngOnInit(): void {
    this.loadAllAuditData();
  }

  loadAllAuditData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.auditService.getStats().subscribe({
      next: (s: AuditStats) => (this.stats = s),
      error: (e: any) => console.error('Erreur stats audit:', e)
    });

    this.auditService.getRegionalCompliance().subscribe({
      next: (r: RegionalCompliance[]) => (this.regionalList = r),
      error: (e: any) => console.error('Erreur grille régionale:', e)
    });

    this.auditService.getMacroFlow().subscribe({
      next: (m: MacroFlowPoint[]) => (this.macroFlow = m),
      error: (e: any) => console.error('Erreur flux macro:', e)
    });

    this.auditService.getLegalRegister().subscribe({
      next: (l: LegalAuditLog[]) => {
        this.legalLogs = l;
        this.isLoading = false;
      },
      error: (e: any) => {
        this.errorMessage = e?.message || 'Erreur lors du chargement des registres légaux.';
        this.isLoading = false;
      }
    });
  }

  onGenerateOfficialReport(): void {
    this.isGeneratingReport = true;
    this.auditService.generateOfficialReport().subscribe({
      next: (res: GeneratedReportResult) => {
        this.isGeneratingReport = false;
        this.showToast(`Rapport certifié ${res.reference} scellé avec succès (SHA-256: ${res.certificatSha256}).`);
      },
      error: () => {
        this.isGeneratingReport = false;
        this.showToast('Erreur lors de la génération du rapport officiel.');
      }
    });
  }

  onDownloadPdf(log: LegalAuditLog): void {
    this.showToast(`Téléchargement du procès-verbal certifié : ${log.titre} (${log.hashSha256})...`);
  }

  onDownloadAllZip(): void {
    this.showToast('Génération de l\'archive ZIP certifiée des scellés juridiques (SHA-256)...');
  }

  private showToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => {
      this.toastMessage = '';
    }, 4500);
  }
}
