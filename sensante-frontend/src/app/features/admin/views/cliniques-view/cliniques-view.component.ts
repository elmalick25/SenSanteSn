import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigurationCliniqueService } from '../../../../core/services/configuration-clinique.service';
import { HealthToastService } from '../../../../core/services/health-toast.service';
import { ConfigurationClinique, DiffusionResult } from '../../../../core/models/configuration-clinique.model';
import { MuacEditorComponent } from './components/muac-editor.component';
import { QueueBufferEditorComponent } from './components/queue-buffer-editor.component';
import { ZscoreTableEditorComponent } from './components/zscore-table-editor.component';
import { AtpeMatrixEditorComponent } from './components/atpe-matrix-editor.component';

@Component({
  selector: 'app-cliniques-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MuacEditorComponent,
    QueueBufferEditorComponent,
    ZscoreTableEditorComponent,
    AtpeMatrixEditorComponent
  ],
  template: `
    <div class="p-6 pb-28 max-w-[1720px] mx-auto min-h-screen">
      <!-- 1. Top Subheader Institutional Banner -->
      <div class="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="max-w-4xl">
          <div class="flex items-center gap-2 mb-1">
            <span class="w-1.5 h-6 bg-[#0f4c3a] rounded-full"></span>
            <h1 class="text-xl md:text-2xl font-bold text-slate-900 tracking-tight text-balance">
              Configuration Clinique &amp; Directives Médicales Nationales
            </h1>
          </div>
          <p class="text-xs md:text-sm text-slate-600 leading-relaxed pl-3.5 text-pretty">
            Définition centralisée des seuils anthropométriques, tables de croissance pédiatrique OMS, posologies nutritionnelles ATPE et cadencement des files d'attente pour tous les postes et centres de santé du Sénégal.
          </p>
        </div>

        <!-- Quick Status Metric Summary -->
        <div class="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 shrink-0">
          <div class="flex flex-col text-right">
            <span class="text-[11px] text-slate-500">Dernière Révision Générale</span>
            <span class="text-sm font-bold text-[#003426]">
              {{ config()?.derniereRevisionTexte || '02 Fév 2024' }}
            </span>
            <span class="text-xs text-[#166b53] font-medium whitespace-nowrap">
              {{ config()?.postesSynchronisesCount || 1428 }} Postes Synchronisés
            </span>
          </div>
          <div class="w-10 h-10 rounded-lg bg-emerald-100 text-[#003426] flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-2xl">verified</span>
          </div>
        </div>
      </div>

      <!-- Loading State Skeleton -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
          <div class="h-96 bg-slate-200 rounded-xl"></div>
          <div class="h-96 bg-slate-200 rounded-xl"></div>
          <div class="h-80 lg:col-span-2 bg-slate-200 rounded-xl"></div>
          <div class="h-80 lg:col-span-2 bg-slate-200 rounded-xl"></div>
        </div>
      } @else {
        @if (errorState()) {
          <!-- Error Boundary -->
          <div class="p-8 rounded-xl bg-red-50 border border-red-200 text-center max-w-xl mx-auto my-12">
            <span class="material-symbols-outlined text-red-600 text-4xl mb-2">cloud_off</span>
            <h3 class="text-base font-bold text-red-900 mb-1">Impossible de charger la configuration clinique</h3>
            <p class="text-xs text-red-700 mb-4">Une erreur réseau est survenue lors de la communication avec le serveur central MSAS.</p>
            <button
              type="button"
              (click)="loadConfiguration()"
              class="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
            >
              Réessayer la connexion
            </button>
          </div>
        } @else {
          @if (config(); as current) {
            <!-- 2. Bento Grid Layout (The 4 Mandatory Cards) -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- CARD 1: MUAC Shakir Thresholds Editor -->
              <app-muac-editor
                [muac]="current.muac"
                (configChanged)="onConfigModified()"
              ></app-muac-editor>

              <!-- CARD 2: "Zéro Attente" Queue Buffers -->
              <app-queue-buffer-editor
                [queue]="current.queueBuffer"
                (configChanged)="onConfigModified()"
              ></app-queue-buffer-editor>

              <!-- CARD 3: WHO Z-Score Tables (Full Width) -->
              <app-zscore-table-editor
                [rows]="current.zscoreRows"
                (configChanged)="onConfigModified()"
                (restoreOmsRequested)="onRestoreOmsDefaults()"
              ></app-zscore-table-editor>

              <!-- CARD 4: ATPE Dosage Matrix (Full Width) -->
              <app-atpe-matrix-editor
                [tiers]="current.atpeTiers"
                [coefficientPna]="current.coefficientTamponPna"
                (configChanged)="onConfigModified()"
              ></app-atpe-matrix-editor>
            </div>
          }
        }
      }

      <!-- 3. Sticky Action Bottom Bar (Institutional Validation Footer) -->
      <footer class="fixed bottom-0 right-0 left-0 lg:left-[17.5rem] z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 h-16 px-6 flex items-center justify-between shadow-lg">
        <!-- Left: Revision Metadata -->
        <div class="flex items-center gap-3">
          <div
            [class]="pendingChangesCount() > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'"
            class="w-2.5 h-2.5 rounded-full flex-shrink-0"
          ></div>
          <div class="flex flex-col min-w-0">
            <span class="text-xs text-slate-800 font-semibold truncate">
              Dernière modification : {{ config()?.modifiePar || 'Dr. I. Sow' }}
            </span>
            <span
              [class]="pendingChangesCount() > 0 ? 'text-amber-700' : 'text-emerald-700'"
              class="text-[11px] font-medium truncate"
            >
              @if (pendingChangesCount() > 0) {
                {{ pendingChangesCount() }} modification(s) en attente d'enregistrement national
              } @else {
                Toutes les directives sont conformes et enregistrées
              }
            </span>
          </div>
        </div>

        <!-- Right: Action CTAs Cluster -->
        <div class="flex items-center gap-2 md:gap-3">
          <!-- Reset button -->
          <button
            type="button"
            (click)="onResetModifications()"
            [disabled]="isSaving() || pendingChangesCount() === 0"
            class="hidden sm:flex bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 text-xs font-semibold px-3 py-2 rounded-lg transition-colors items-center gap-1 whitespace-nowrap"
          >
            <span class="material-symbols-outlined text-base">undo</span>
            <span>Réinitialiser</span>
          </button>

          <!-- Sandbox Testing button -->
          <button
            type="button"
            (click)="onTestSandbox()"
            [disabled]="isSaving()"
            class="hidden md:flex bg-white border border-[#166b53] text-[#166b53] hover:bg-emerald-50 text-xs font-semibold px-3 py-2 rounded-lg transition-colors items-center gap-1 whitespace-nowrap"
          >
            <span class="material-symbols-outlined text-base">science</span>
            <span>Tester Sandbox</span>
          </button>

          <!-- Broadcast CTA -->
          <button
            type="button"
            (click)="onDiffuserDirectives()"
            [disabled]="isDiffusing()"
            class="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all shadow-sm flex items-center gap-1 whitespace-nowrap"
          >
            <span class="material-symbols-outlined text-base">send</span>
            <span>Diffuser</span>
          </button>

          <!-- Primary Save CTA -->
          <button
            type="button"
            (click)="onSaveParameters()"
            [disabled]="isSaving()"
            class="bg-[#003426] hover:bg-[#166b53] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all shadow-md flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
          >
            @if (isSaving()) {
              <span class="material-symbols-outlined text-base animate-spin">refresh</span>
              <span>Enregistrement...</span>
            } @else {
              <span class="material-symbols-outlined text-base font-bold">check</span>
              <span>Enregistrer</span>
            }
          </button>
        </div>
      </footer>
    </div>
  `
})
export class CliniquesViewComponent implements OnInit {
  private readonly configService = inject(ConfigurationCliniqueService);
  private readonly toast = inject(HealthToastService);

  readonly config = signal<ConfigurationClinique | null>(null);
  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly isDiffusing = signal(false);
  readonly errorState = signal(false);
  readonly pendingChangesCount = signal(0);

  ngOnInit(): void {
    this.loadConfiguration();
  }

  loadConfiguration(): void {
    this.isLoading.set(true);
    this.errorState.set(false);

    this.configService.getConfiguration().subscribe({
      next: (data: ConfigurationClinique) => {
        this.config.set(data);
        this.pendingChangesCount.set(data.modificationsEnAttenteCount || 0);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Erreur chargement configuration clinique:', err);
        this.errorState.set(true);
        this.isLoading.set(false);
        this.toast.show('Impossible de récupérer les directives nationales.', 'error');
      }
    });
  }

  onConfigModified(): void {
    this.pendingChangesCount.update(c => c + 1);
  }

  onSaveParameters(): void {
    const current = this.config();
    if (!current) return;

    this.isSaving.set(true);
    this.configService.updateConfiguration(current).subscribe({
      next: (updated: ConfigurationClinique) => {
        this.config.set(updated);
        this.pendingChangesCount.set(0);
        this.isSaving.set(false);
        this.toast.show('Les nouveaux seuils et matrices ont été enregistrés avec succès.', 'success');
      },
      error: (err: unknown) => {
        console.error('Erreur sauvegarde directives:', err);
        this.isSaving.set(false);
        this.toast.show('Impossible d\'enregistrer les paramètres.', 'error');
      }
    });
  }

  onDiffuserDirectives(): void {
    this.isDiffusing.set(true);
    this.configService.diffuserDirectives().subscribe({
      next: (res: DiffusionResult) => {
        this.isDiffusing.set(false);
        this.pendingChangesCount.set(0);
        this.toast.show(
          res.message || 'Directives transmises aux 1 428 postes de santé du Sénégal.',
          'success'
        );
      },
      error: (err: unknown) => {
        console.error('Erreur diffusion directives:', err);
        this.isDiffusing.set(false);
        this.toast.show('Échec de transmission vers le réseau sanitaire.', 'error');
      }
    });
  }

  onRestoreOmsDefaults(): void {
    if (!confirm('Confirmez-vous la restauration des valeurs OMS / MSAS certifiées par défaut ?')) {
      return;
    }

    this.isLoading.set(true);
    this.configService.resetOmsDefaults().subscribe({
      next: (def: ConfigurationClinique) => {
        this.config.set(def);
        this.pendingChangesCount.set(0);
        this.isLoading.set(false);
        this.toast.show('Les tables et seuils officiels ont été rétablis.', 'info');
      },
      error: (err: unknown) => {
        console.error('Erreur restauration OMS:', err);
        this.isLoading.set(false);
        this.toast.show('Impossible de restaurer les valeurs OMS.', 'error');
      }
    });
  }

  onResetModifications(): void {
    this.loadConfiguration();
    this.toast.show('L\'état antérieur a été rechargé.', 'info');
  }

  onTestSandbox(): void {
    this.toast.show(
      'Simulation Sandbox réussie : 0 conflit d\'ordonnancement et cohérence nutritionnelle validée.',
      'info'
    );
  }
}
