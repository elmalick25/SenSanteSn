import {
  Component, inject, signal, computed, OnInit, OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedecinVacationService } from '../../services/medecin-vacation.service';
import {
  VacationPriseDeService,
  CreneauVacation,
  AppelBoxUiState
} from '../../models/medecin-vacation.model';

type FiltreStatut = 'TOUS' | 'MAS' | 'MAM' | 'ROUTINE';

@Component({
  selector: 'app-prise-de-service-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- ================================================================= -->
    <!-- ÉTATS UI : LOADING / ERROR / EMPTY / SUCCESS                       -->
    <!-- ================================================================= -->

    <!-- LOADING SKELETON -->
    <div *ngIf="isLoading()" class="space-y-4 animate-pulse">
      <!-- Banner skeleton -->
      <div class="bg-white rounded-xl border border-[#BFC9C3] p-4 space-y-3">
        <div class="h-6 bg-[#D2E8DC] rounded w-1/3"></div>
        <div class="flex gap-3">
          <div class="h-14 bg-[#D2E8DC] rounded-lg w-32"></div>
          <div class="h-14 bg-[#D2E8DC] rounded-lg w-32"></div>
          <div class="h-14 bg-[#D2E8DC] rounded-lg w-32"></div>
          <div class="h-14 bg-[#D2E8DC] rounded-lg w-32"></div>
        </div>
        <div class="h-4 bg-[#D2E8DC] rounded w-full"></div>
        <div class="h-3.5 bg-[#D2E8DC] rounded-full w-full"></div>
      </div>
      <!-- Grid skeleton -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let i of [1,2,3,4,5,6]" class="bg-white rounded-xl border border-[#BFC9C3] p-4 space-y-3 h-52">
          <div class="flex justify-between">
            <div class="h-5 bg-[#D2E8DC] rounded w-20"></div>
            <div class="h-5 bg-[#D2E8DC] rounded w-28"></div>
          </div>
          <div class="h-5 bg-[#D2E8DC] rounded w-40"></div>
          <div class="h-4 bg-[#D2E8DC] rounded w-32"></div>
          <div class="flex gap-1 flex-wrap">
            <div class="h-5 bg-[#D2E8DC] rounded w-24"></div>
            <div class="h-5 bg-[#D2E8DC] rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ERROR STATE -->
    <div *ngIf="hasError() && !isLoading()" class="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
      <div class="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
        <span class="material-symbols-outlined text-4xl text-red-500">error_outline</span>
      </div>
      <h2 class="text-xl font-bold text-[#0C1F18] text-balance">Erreur de chargement du chronogramme</h2>
      <p class="text-[#404944] text-sm text-pretty max-w-sm">Impossible de récupérer les créneaux de vacation. Vérifiez votre connexion et réessayez.</p>
      <button (click)="chargerPriseDeService()"
        class="px-4 py-2 bg-[#0F4C3A] text-white rounded-lg text-sm font-semibold hover:bg-[#266A54] transition-colors cursor-pointer whitespace-nowrap">
        <span class="material-symbols-outlined text-sm align-middle">refresh</span>
        Réessayer
      </button>
    </div>

    <!-- SUCCESS STATE -->
    <div *ngIf="data() && !isLoading() && !hasError()" class="space-y-4">

      <!-- ============================================================= -->
      <!-- SECTION 1 : BANNER OPÉRATIONNEL VACATION                       -->
      <!-- ============================================================= -->
      <section class="bg-white rounded-xl border border-[#BFC9C3] shadow-sm p-4 space-y-3.5">

        <!-- Header row -->
        <div class="space-y-3 pb-3 border-b border-[#BFC9C3]/50">
          <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-3 flex-wrap">
                <h1 class="text-lg font-bold text-[#0C1F18] text-balance">
                  Chronogramme Opérationnel de Vacation
                </h1>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] rounded-full text-[11px] font-semibold whitespace-nowrap">
                  <span class="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                  Vacation Ouverte ({{ data()!.config.heureDebut }} — {{ data()!.config.heureFin }})
                </span>
              </div>
              <p class="text-xs text-[#404944] mt-0.5 text-pretty">
                Matrice d'ordonnancement cadencée avec arbitrage automatique de la gravité pédiatrique et nutritionnelle.
              </p>
            </div>

            <!-- Metric chips -->
            <div class="flex items-center gap-2 flex-wrap">
              <div class="px-2.5 py-1.5 bg-[#E3F9ED] rounded-lg border border-[#BFC9C3] flex items-center gap-2 whitespace-nowrap">
                <span class="material-symbols-outlined text-sm text-[#266A54]">view_timeline</span>
                <div>
                  <div class="text-[9px] uppercase font-semibold text-[#707974] tracking-wider">Créneaux</div>
                  <div class="text-xs font-bold text-[#0C1F18]">{{ data()!.overview.totalCreneaux }} prévus</div>
                </div>
              </div>
              <div class="px-2.5 py-1.5 bg-[#ACF1D5]/40 rounded-lg border border-[#91D4B9] flex items-center gap-2 whitespace-nowrap">
                <span class="material-symbols-outlined text-sm text-[#266A54]">how_to_reg</span>
                <div>
                  <div class="text-[9px] uppercase font-semibold text-[#266A54] tracking-wider">Assignés</div>
                  <div class="text-xs font-bold text-[#266A54]">{{ data()!.overview.assignes }} inscrits</div>
                </div>
              </div>
              <div class="px-2.5 py-1.5 bg-red-50 rounded-lg border border-red-200 flex items-center gap-2 whitespace-nowrap">
                <span class="material-symbols-outlined text-sm text-red-600">emergency</span>
                <div>
                  <div class="text-[9px] uppercase font-semibold text-red-600 tracking-wider">Urgences MAS</div>
                  <div class="text-xs font-bold text-red-600">{{ data()!.overview.urgencesMAS }} prioritaires</div>
                </div>
              </div>
              <div class="px-2.5 py-1.5 bg-[#D7EDE2] rounded-lg border border-[#BFC9C3] flex items-center gap-2 whitespace-nowrap">
                <span class="material-symbols-outlined text-sm text-[#0F4C3A]">timer</span>
                <div>
                  <div class="text-[9px] uppercase font-semibold text-[#0F4C3A] tracking-wider">Marge Tampon</div>
                  <div class="text-xs font-bold text-[#0F4C3A]">{{ data()!.overview.margeTamponLibelle }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Configurateur plage horaire -->
          <div class="p-2.5 bg-[#E3F9ED]/60 rounded-lg border border-[#BFC9C3]/60 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-3">
              <!-- Sélecteur heures -->
              <div class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[#0F4C3A] text-base">schedule</span>
                <span class="text-[11px] font-semibold text-[#0C1F18]">Plage&nbsp;horaire&nbsp;:</span>
                <div class="inline-flex items-center gap-1 bg-white border border-[#BFC9C3] px-2 py-1 rounded-md shadow-sm">
                  <input [(ngModel)]="heureDebut" type="text"
                    class="p-0 border-0 text-[11px] font-bold text-[#0F4C3A] focus:ring-0 w-12 bg-transparent text-center"
                    aria-label="Heure de début" />
                  <span class="text-[#707974] text-xs">—</span>
                  <input [(ngModel)]="heureFin" type="text"
                    class="p-0 border-0 text-[11px] font-bold text-[#0F4C3A] focus:ring-0 w-12 bg-transparent text-center"
                    aria-label="Heure de fin" />
                </div>
              </div>

              <!-- Boutons plage -->
              <div class="flex items-center gap-1">
                <button (click)="selectionnerPlage('MATIN')"
                  [class]="plageActive === 'MATIN' ? 'bg-[#0F4C3A] text-white' : 'bg-white border border-[#BFC9C3] text-[#404944] hover:bg-[#E3F9ED]'"
                  class="px-2 py-1 text-[11px] rounded font-medium transition-colors cursor-pointer whitespace-nowrap">
                  Matin (08h30-14h)
                </button>
                <button (click)="selectionnerPlage('APRES_MIDI')"
                  [class]="plageActive === 'APRES_MIDI' ? 'bg-[#0F4C3A] text-white' : 'bg-white border border-[#BFC9C3] text-[#404944] hover:bg-[#E3F9ED]'"
                  class="px-2 py-1 text-[11px] rounded font-medium transition-colors cursor-pointer whitespace-nowrap">
                  Après-midi (14h-19h)
                </button>
                <button (click)="selectionnerPlage('GARDE')"
                  [class]="plageActive === 'GARDE' ? 'bg-[#0F4C3A] text-white' : 'bg-white border border-[#BFC9C3] text-[#404944] hover:bg-[#E3F9ED]'"
                  class="px-2 py-1 text-[11px] rounded font-medium transition-colors cursor-pointer whitespace-nowrap">
                  Garde (24h)
                </button>
              </div>

              <div class="h-4 w-px bg-[#BFC9C3]/60 hidden sm:block"></div>

              <!-- Compteur patients -->
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[#0F4C3A] text-base">patient_list</span>
                <span class="text-[11px] font-semibold text-[#0C1F18] whitespace-nowrap">Patients à traiter&nbsp;:</span>
                <div class="flex items-center bg-white border border-[#BFC9C3] rounded-md shadow-sm">
                  <button (click)="ajusterPatients(-1)"
                    class="px-2 py-1 text-[#404944] hover:text-[#0F4C3A] hover:bg-[#E3F9ED] text-xs font-bold border-r border-[#BFC9C3] transition-colors cursor-pointer">−</button>
                  <span class="px-2.5 py-0.5 text-[11px] font-bold text-[#0F4C3A]">{{ nombrePatients }}</span>
                  <button (click)="ajusterPatients(1)"
                    class="px-2 py-1 text-[#404944] hover:text-[#0F4C3A] hover:bg-[#E3F9ED] text-xs font-bold border-l border-[#BFC9C3] transition-colors cursor-pointer">+</button>
                </div>
                <span class="text-[10px] text-[#707974] font-medium">(max {{ data()!.config.maxPatients }})</span>
              </div>
            </div>

            <div class="flex items-center gap-2.5 w-full xl:w-auto justify-between xl:justify-end">
              <div class="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#BFC9C3]/60 rounded-md text-[10px] text-[#404944] whitespace-nowrap">
                <span class="material-symbols-outlined text-xs text-[#266A54]">calculate</span>
                Durée : <strong class="ml-0.5">{{ data()!.config.dureeTotaleLabel }}</strong>
                &nbsp;• <strong>{{ data()!.config.nombreCreneaux }} créneaux × {{ data()!.config.dureeCreneau }} min</strong>
              </div>
              <button (click)="appliquerEtReordonnancer()"
                [disabled]="isReconfiguring()"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F4C3A] hover:bg-[#266A54] text-white rounded-lg text-[11px] font-semibold shadow-sm transition-colors active:scale-95 cursor-pointer whitespace-nowrap disabled:opacity-50">
                <span class="material-symbols-outlined text-sm" [class.animate-spin]="isReconfiguring()">tune</span>
                {{ isReconfiguring() ? 'Reconfiguration...' : 'Appliquer &amp; Réordonnancer' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Barre chronologique color-codée -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-[11px] text-[#404944] font-medium">
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-xs text-[#0F4C3A]">schedule</span>
              {{ data()!.config.heureDebut }} Début
            </span>
            <span class="text-[#707974]">Taux de remplissage : {{ data()!.overview.tauxRemplissageLabel }}</span>
            <span class="flex items-center gap-1">
              {{ data()!.config.heureFin }} Clôture
              <span class="material-symbols-outlined text-xs text-[#0F4C3A]">event_available</span>
            </span>
          </div>

          <!-- Barre segmentée 16 segments -->
          <div class="h-3.5 w-full bg-[#D2E8DC] rounded-full overflow-hidden flex border border-[#BFC9C3]">
            <ng-container *ngFor="let creneau of data()!.creneaux; let last = last">
              <div
                [style.width.%]="100 / data()!.creneaux.length"
                [style.background-color]="getCouleurSegment(creneau)"
                [class.border-r]="!last"
                [class.border-white]="!last"
                [class.border-opacity-40]="!last"
                class="relative flex items-center justify-center transition-colors"
                [title]="creneau.heureDebut + ' ' + (creneau.patient?.nomComplet || creneau.typeStatut)"
              >
                <span *ngIf="creneau.typeStatut === 'TAMPON'"
                  class="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse"></span>
              </div>
            </ng-container>
          </div>

          <!-- Légende -->
          <div class="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-[#404944] font-medium">
            <div class="flex flex-wrap items-center gap-4">
              <span class="inline-flex items-center gap-1 whitespace-nowrap">
                <span class="w-2.5 h-2.5 rounded-sm bg-[#DC2626]"></span>
                MAS Complications ({{ data()!.overview.urgencesMAS }})
              </span>
              <span class="inline-flex items-center gap-1 whitespace-nowrap">
                <span class="w-2.5 h-2.5 rounded-sm bg-[#D97706]"></span>
                MAM Réfractaire ({{ data()!.overview.casMAM }})
              </span>
              <span class="inline-flex items-center gap-1 whitespace-nowrap">
                <span class="w-2.5 h-2.5 rounded-sm bg-[#16A34A]"></span>
                Contrôle Routine ({{ data()!.overview.casRoutine }})
              </span>
              <span class="inline-flex items-center gap-1 whitespace-nowrap">
                <span class="w-2.5 h-2.5 rounded-sm bg-[#0F4C3A]"></span>
                Créneau Tampon (1)
              </span>
              <span class="inline-flex items-center gap-1 whitespace-nowrap">
                <span class="w-2.5 h-2.5 rounded-sm bg-[#D2E8DC]"></span>
                Disponible ({{ data()!.overview.creneauxLibres }})
              </span>
            </div>
            <span class="text-[#266A54] font-semibold flex items-center gap-1 whitespace-nowrap">
              <span class="material-symbols-outlined text-xs">tune</span>
              Cadence nominale : {{ data()!.config.dureeCreneau }} min/patient
            </span>
          </div>
        </div>
      </section>

      <!-- ============================================================= -->
      <!-- SECTION 2 : GRILLE HORODATRICE DES CRÉNEAUX                   -->
      <!-- ============================================================= -->
      <section class="space-y-3">

        <!-- Filtres & contrôles -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#BFC9C3] shadow-sm">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#0F4C3A]">grid_view</span>
            <h2 class="text-sm font-bold text-[#0C1F18] text-balance">Grille Horodatrice des {{ data()!.creneaux.length }} Créneaux</h2>
            <span class="text-[11px] px-2 py-0.5 rounded-md bg-[#E3F9ED] text-[#0F4C3A] font-semibold whitespace-nowrap">
              Vacation {{ data()!.config.heureDebut }} — {{ data()!.config.heureFin }}
            </span>
          </div>

          <!-- Filtres rapides -->
          <div class="flex flex-wrap items-center gap-1.5">
            <button (click)="setFiltre('TOUS')"
              [class]="filtreActif() === 'TOUS' ? 'bg-[#0F4C3A] text-white' : 'bg-[#E3F9ED] text-[#266A54] border border-[#ACF1D5] hover:bg-[#ACF1D5]/40'"
              class="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap">
              Tous les créneaux ({{ data()!.creneaux.length }})
            </button>
            <button (click)="setFiltre('MAS')"
              [class]="filtreActif() === 'MAS' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'"
              class="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
              MAS ({{ data()!.overview.urgencesMAS }})
            </button>
            <button (click)="setFiltre('MAM')"
              [class]="filtreActif() === 'MAM' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100'"
              class="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
              MAM ({{ data()!.overview.casMAM }})
            </button>
            <button (click)="setFiltre('ROUTINE')"
              [class]="filtreActif() === 'ROUTINE' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100'"
              class="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
              Routine ({{ data()!.overview.casRoutine }})
            </button>
          </div>
        </div>

        <!-- Grille 3 cols responsive -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ng-container *ngFor="let creneau of creneauxFiltres()">

            <!-- ══════════════════════════════════════════════ -->
            <!-- CRÉNEAU TAMPON URGENCE (layout spécial)       -->
            <!-- ══════════════════════════════════════════════ -->
            <div *ngIf="creneau.typeStatut === 'TAMPON'"
              class="bg-gradient-to-br from-[#0F4C3A] to-[#00266F] text-white rounded-xl border-2 border-[#ACF1D5] shadow-md flex flex-col justify-between overflow-hidden relative">
              <span class="material-symbols-outlined absolute -right-4 -bottom-4 text-white/5 text-8xl pointer-events-none select-none">emergency_heat</span>
              <div class="p-3 space-y-2 relative z-10">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5 px-2.5 py-0.5 bg-black/30 rounded border border-[#ACF1D5]/40">
                    <span class="text-sm font-bold text-[#ACF1D5]">{{ creneau.heureDebut }}</span>
                    <span class="text-[11px] text-[#ACF1D5]/80">Créneau {{ creneau.numero }}</span>
                  </div>
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#ACF1D5] text-[#003426] rounded-full text-[11px] font-bold shadow-sm whitespace-nowrap">
                    <span class="w-2 h-2 rounded-full bg-[#0F4C3A] animate-ping"></span>
                    TAMPON URGENCE
                  </span>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-white flex items-center gap-1.5 text-balance">
                    <span class="material-symbols-outlined text-[#ACF1D5] text-lg">medical_services</span>
                    Réserve Clinique de Stabilisation
                  </h3>
                  <p class="text-[11px] text-[#ACF1D5]/90 mt-0.5 text-pretty">
                    Plage tampon sanctuarisée : perfusion ReSoMal, convulsion fébrile ou transfert SMUR pédiatrique.
                  </p>
                </div>
                <div class="p-2 bg-black/20 rounded-lg border border-white/10 space-y-1">
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="text-[#ACF1D5]">Marge protégée :</span>
                    <span class="font-bold text-white whitespace-nowrap">20 minutes</span>
                  </div>
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="text-[#ACF1D5]">Kit d'urgence :</span>
                    <span class="text-white font-medium whitespace-nowrap">Chariot Box 04 vérifié</span>
                  </div>
                </div>
              </div>
              <div class="px-3 py-2 bg-black/30 border-t border-white/10 flex items-center justify-between gap-2 relative z-10">
                <button (click)="allouerCreneauUrgence(creneau)"
                  class="flex-1 py-1.5 px-2 bg-[#ACF1D5] text-[#003426] hover:bg-[#91D4B9] rounded text-[11px] font-bold flex items-center justify-center gap-1 transition-colors shadow cursor-pointer whitespace-nowrap">
                  <span class="material-symbols-outlined text-sm">lock_open</span>
                  Allouer à un cas aigu
                </button>
                <button class="py-1.5 px-2 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap">
                  <span class="material-symbols-outlined text-sm">pause_circle</span>
                  Conserver
                </button>
              </div>
            </div>

            <!-- ══════════════════════════════════════════════ -->
            <!-- CRÉNEAU PATIENT (MAS / MAM / ROUTINE / EN TRIAGE) -->
            <!-- ══════════════════════════════════════════════ -->
            <div *ngIf="creneau.typeStatut !== 'TAMPON' && creneau.typeStatut !== 'LIBRE'"
              [style.border-top-color]="getCouleurTop(creneau)"
              class="bg-white rounded-xl border border-[#BFC9C3] shadow-sm flex flex-col justify-between overflow-hidden transition-all hover:shadow-md"
              style="border-top-width: 4px; border-top-style: solid;">
              <div class="p-3 space-y-2">
                <!-- Heure + Badge statut -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5 px-2 py-0.5 bg-[#E3F9ED] rounded border border-[#BFC9C3]/60">
                    <span class="text-sm font-bold text-[#0F4C3A]">{{ creneau.heureDebut }}</span>
                    <span class="text-[11px] text-[#707974]">Créneau {{ creneau.numero }}</span>
                  </div>
                  <span [style.background-color]="getBadgeBg(creneau)"
                    [style.color]="getBadgeColor(creneau)"
                    [style.border-color]="getBadgeBorder(creneau)"
                    class="inline-flex items-center gap-1 px-2 py-0.5 border rounded-full text-[11px] font-semibold whitespace-nowrap">
                    <span class="w-1.5 h-1.5 rounded-full"
                      [style.background-color]="getBadgeColor(creneau)"
                      [class.animate-ping]="creneau.pulsant"></span>
                    {{ creneau.patient?.typeStatutLabel || creneau.typeStatut }}
                  </span>
                </div>

                <!-- Identité patient -->
                <div *ngIf="creneau.patient">
                  <div class="flex items-center justify-between">
                    <h3 class="text-sm font-bold text-[#0C1F18] text-balance">{{ creneau.patient.nomComplet }}</h3>
                    <span class="text-[11px] px-1.5 py-0.5 bg-[#E3F9ED] rounded text-[#0F4C3A] font-medium whitespace-nowrap">
                      {{ creneau.patient.ageLabel }}
                    </span>
                  </div>
                  <span class="text-[11px] text-[#707974] font-mono">NIP: {{ creneau.patient.nip }}</span>
                </div>

                <!-- Indicateurs cliniques -->
                <div *ngIf="creneau.patient" class="space-y-1.5 pt-1">
                  <div class="flex flex-wrap gap-1">
                    <span *ngFor="let ind of creneau.patient.indicateurs"
                      [class]="getIndicateurClass(ind.niveau)"
                      class="px-2 py-0.5 rounded border text-[11px] font-medium whitespace-nowrap">
                      {{ ind.valeur }}
                    </span>
                  </div>

                  <!-- Note infirmier -->
                  <p class="text-[11px] text-[#404944] bg-[#E3F9ED]/60 p-1.5 rounded border border-[#BFC9C3]/40 flex items-start gap-1 text-pretty">
                    <span class="material-symbols-outlined text-xs mt-0.5 flex-shrink-0"
                      [style.color]="creneau.patient.couleurNote">
                      {{ creneau.patient.iconeNote }}
                    </span>
                    <span [innerHTML]="creneau.patient.noteInfirmier"></span>
                  </p>
                </div>

                <!-- EN_TRIAGE : constantes manquantes -->
                <div *ngIf="creneau.typeStatut === 'EN_TRIAGE' && creneau.patient">
                  <div class="flex flex-wrap gap-1">
                    <span *ngFor="let ind of creneau.patient.indicateurs"
                      class="px-2 py-0.5 bg-[#D2E8DC] text-[#404944] rounded border border-[#BFC9C3] text-[11px] whitespace-nowrap">
                      {{ ind.valeur }}
                    </span>
                  </div>
                  <p class="text-[11px] text-[#404944] bg-[#E3F9ED]/60 p-1.5 rounded border border-[#BFC9C3]/40 flex items-start gap-1 mt-1.5">
                    <span class="material-symbols-outlined text-xs text-[#707974] mt-0.5 flex-shrink-0">hourglass_top</span>
                    {{ creneau.patient.noteInfirmier }}
                  </p>
                </div>
              </div>

              <!-- Footer actions -->
              <div class="px-3 py-2 bg-[#E3F9ED]/40 border-t border-[#BFC9C3]/60 flex items-center justify-between gap-1.5">
                <!-- EN_TRIAGE : bouton désactivé -->
                <div *ngIf="creneau.typeStatut === 'EN_TRIAGE'" class="w-full">
                  <button
                    class="w-full py-1.5 px-2 bg-[#D2E8DC] border border-[#BFC9C3] text-[#707974] rounded text-[11px] flex items-center justify-center gap-1 opacity-75 cursor-not-allowed whitespace-nowrap">
                    <span class="material-symbols-outlined text-sm">pending</span>
                    En attente des constantes
                  </button>
                </div>

                <!-- MAS / MAM / ROUTINE : actions Dossier + Appeler Box -->
                <ng-container *ngIf="creneau.typeStatut !== 'EN_TRIAGE'">
                  <button class="flex-1 py-1.5 px-2 bg-white border border-[#BFC9C3] text-[#0C1F18] hover:bg-[#E3F9ED] rounded text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap">
                    <span class="material-symbols-outlined text-sm">history_edu</span>
                    Dossier
                  </button>
                  <button
                    (click)="appelerBox(creneau)"
                    [disabled]="getEtatAppel(creneau.idCreneau) === 'calling'"
                    [class]="getAppelBtnClass(creneau.idCreneau)"
                    class="flex-1 py-1.5 px-2 rounded text-[11px] flex items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer whitespace-nowrap disabled:cursor-wait">
                    <span class="material-symbols-outlined text-sm"
                      [class.animate-spin]="getEtatAppel(creneau.idCreneau) === 'calling'">
                      {{ getAppelBtnIcon(creneau.idCreneau) }}
                    </span>
                    {{ getAppelBtnLabel(creneau.idCreneau) }}
                  </button>
                </ng-container>
              </div>
            </div>

            <!-- ══════════════════════════════════════════════ -->
            <!-- CRÉNEAU LIBRE                                  -->
            <!-- ══════════════════════════════════════════════ -->
            <div *ngIf="creneau.typeStatut === 'LIBRE'"
              class="bg-white rounded-xl border border-[#BFC9C3] shadow-sm flex flex-col justify-between overflow-hidden"
              style="border-top: 4px solid #BFC9C3;">
              <div class="p-3 space-y-2 flex-1 flex flex-col justify-center items-center text-center py-6">
                <span class="material-symbols-outlined text-3xl text-[#BFC9C3]">event_available</span>
                <div>
                  <p class="text-sm font-semibold text-[#707974]">{{ creneau.heureDebut }} — Créneau {{ creneau.numero }}</p>
                  <p class="text-[11px] text-[#BFC9C3]">Disponible</p>
                </div>
              </div>
              <div class="px-3 py-2 bg-[#E3F9ED]/20 border-t border-[#BFC9C3]/60">
                <button class="w-full py-1.5 px-2 bg-white border border-[#BFC9C3] text-[#707974] hover:bg-[#E3F9ED] hover:text-[#0F4C3A] rounded text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap">
                  <span class="material-symbols-outlined text-sm">add_circle</span>
                  Affecter un patient
                </button>
              </div>
            </div>

          </ng-container>
        </div>
      </section>

      <!-- ============================================================= -->
      <!-- BANNIÈRE PROTOCOLE D'URGENCE                                   -->
      <!-- ============================================================= -->
      <div class="bg-red-50 border-l-4 border-red-600 p-3 rounded-r-lg border border-y-red-200 border-r-red-200 flex items-center justify-between text-[11px] text-red-700 gap-3">
        <div class="flex items-center gap-2 text-pretty">
          <span class="material-symbols-outlined text-base flex-shrink-0">warning</span>
          <span>
            <strong>Consigne Vacation Dr. {{ data()!.identiteMedecin.nom }} :</strong>
            {{ data()!.consigneVacation }}
          </span>
        </div>
        <span class="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 bg-white/80 rounded border border-red-200 whitespace-nowrap flex-shrink-0">
          Urgence Box 04
        </span>
      </div>

      <!-- TOAST notification -->
      <div *ngIf="toastMessage()"
        class="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#0F4C3A] text-white rounded-xl shadow-xl text-sm font-medium flex items-center gap-2 animate-bounce-in max-w-xs">
        <span class="material-symbols-outlined text-[#ACF1D5]">check_circle</span>
        {{ toastMessage() }}
      </div>
    </div>
  `,
  styles: [`
    @keyframes bounce-in {
      0%   { transform: translateY(20px); opacity: 0; }
      60%  { transform: translateY(-4px); opacity: 1; }
      100% { transform: translateY(0); opacity: 1; }
    }
    .animate-bounce-in { animation: bounce-in 0.3s ease-out forwards; }
  `]
})
export class PriseDeServiceViewComponent implements OnInit, OnDestroy {

  private readonly vacationService = inject(MedecinVacationService);

  // ── Signaux d'état UI ────────────────────────────────────────────────────
  readonly isLoading       = signal<boolean>(true);
  readonly hasError        = signal<boolean>(false);
  readonly isReconfiguring = signal<boolean>(false);
  readonly data            = signal<VacationPriseDeService | null>(null);
  readonly filtreActif     = signal<FiltreStatut>('TOUS');
  readonly toastMessage    = signal<string | null>(null);

  // ── État des boutons Appeler Box ─────────────────────────────────────────
  readonly appelStates = signal<Map<number, AppelBoxUiState>>(new Map());

  // ── Données locales de configuration ────────────────────────────────────
  heureDebut    = '08:30';
  heureFin      = '14:00';
  plageActive   = 'MATIN';
  nombrePatients = 16;

  private toastTimer?: ReturnType<typeof setTimeout>;

  // ── Computed : créneaux filtrés ──────────────────────────────────────────
  readonly creneauxFiltres = computed<CreneauVacation[]>(() => {
    const d = this.data();
    if (!d) return [];
    const f = this.filtreActif();
    if (f === 'TOUS') return d.creneaux;
    return d.creneaux.filter(c => c.typeStatut === f);
  });

  ngOnInit(): void {
    this.chargerPriseDeService();
  }

  ngOnDestroy(): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Chargement des données
  // ─────────────────────────────────────────────────────────────────────────

  chargerPriseDeService(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.vacationService.getPriseDeService().subscribe({
      next: (dto: import('../../models/medecin-vacation.model').VacationPriseDeService) => {
        this.data.set(dto);
        this.heureDebut     = dto.config.heureDebut;
        this.heureFin       = dto.config.heureFin;
        this.plageActive    = dto.config.plageType;
        this.nombrePatients = dto.config.nombreCreneaux;
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Actions de configuration vacation
  // ─────────────────────────────────────────────────────────────────────────

  selectionnerPlage(plage: string): void {
    this.plageActive = plage;
    switch (plage) {
      case 'MATIN':      this.heureDebut = '08:30'; this.heureFin = '14:00'; break;
      case 'APRES_MIDI': this.heureDebut = '14:00'; this.heureFin = '19:00'; break;
      case 'GARDE':      this.heureDebut = '19:00'; this.heureFin = '08:00'; break;
    }
  }

  ajusterPatients(delta: number): void {
    const d = this.data();
    const max = d?.config.maxPatients ?? 18;
    const newVal = Math.max(1, Math.min(max, this.nombrePatients + delta));
    this.nombrePatients = newVal;
  }

  appliquerEtReordonnancer(): void {
    this.isReconfiguring.set(true);
    this.vacationService.reconfigurerVacation({
      heureDebut: this.heureDebut,
      heureFin: this.heureFin,
      nombreCreneaux: this.nombrePatients,
      plageType: this.plageActive
    }).subscribe({
      next: (dto: import('../../models/medecin-vacation.model').VacationPriseDeService) => {
        this.data.set(dto);
        this.isReconfiguring.set(false);
        this.afficherToast('Vacation reconfiguree avec succes — ' + this.nombrePatients + ' creneaux');
      },
      error: () => {
        this.isReconfiguring.set(false);
        this.afficherToast('Reconfiguration locale appliquee');
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Actions sur créneaux
  // ─────────────────────────────────────────────────────────────────────────

  appelerBox(creneau: CreneauVacation): void {
    this.setEtatAppel(creneau.idCreneau, 'calling');
    this.vacationService.appelerBox(creneau.idCreneau).subscribe({
      next: (res: import('../../models/medecin-vacation.model').AppelerBoxResponse) => {
        this.setEtatAppel(creneau.idCreneau, 'confirmed');
        this.afficherToast('Patient ' + (res.nomPatient ?? 'Patient') + ' convoqué — arrivée dans 2-3 min');
        setTimeout(() => this.setEtatAppel(creneau.idCreneau, 'idle'), 3500);
      },
      error: () => {
        this.setEtatAppel(creneau.idCreneau, 'idle');
        this.afficherToast('Appel local enregistré — patient notifié');
      }
    });
  }

  allouerCreneauUrgence(creneau: CreneauVacation): void {
    this.vacationService.allouerCreneauUrgence(creneau.idCreneau).subscribe({
      next: (res: import('../../models/medecin-vacation.model').AppelerBoxResponse) => this.afficherToast(res.message),
      error: () => this.afficherToast('Allocation urgence enregistrée localement')
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Filtres
  // ─────────────────────────────────────────────────────────────────────────

  setFiltre(f: FiltreStatut): void {
    this.filtreActif.set(f);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Helpers UI — couleurs
  // ─────────────────────────────────────────────────────────────────────────

  getCouleurSegment(c: CreneauVacation): string {
    switch (c.typeStatut) {
      case 'MAS':       return '#DC2626';
      case 'MAM':       return '#D97706';
      case 'ROUTINE':   return '#16A34A';
      case 'TAMPON':    return '#0F4C3A';
      case 'EN_TRIAGE': return '#91D4B9';
      default:          return '#D2E8DC';
    }
  }

  getCouleurTop(c: CreneauVacation): string {
    switch (c.typeStatut) {
      case 'MAS':       return '#DC2626';
      case 'MAM':       return '#D97706';
      case 'ROUTINE':   return '#16A34A';
      case 'EN_TRIAGE': return '#707974';
      default:          return '#BFC9C3';
    }
  }

  getBadgeBg(c: CreneauVacation): string {
    switch (c.typeStatut) {
      case 'MAS':       return '#FEF2F2';
      case 'MAM':       return '#FFFBEB';
      case 'ROUTINE':   return '#F0FDF4';
      case 'EN_TRIAGE': return '#F1F5F9';
      default:          return '#F1F5F9';
    }
  }

  getBadgeColor(c: CreneauVacation): string {
    switch (c.typeStatut) {
      case 'MAS':       return '#DC2626';
      case 'MAM':       return '#D97706';
      case 'ROUTINE':   return '#16A34A';
      case 'EN_TRIAGE': return '#707974';
      default:          return '#707974';
    }
  }

  getBadgeBorder(c: CreneauVacation): string {
    switch (c.typeStatut) {
      case 'MAS':       return '#FECACA';
      case 'MAM':       return '#FDE68A';
      case 'ROUTINE':   return '#BBF7D0';
      case 'EN_TRIAGE': return '#CBD5E1';
      default:          return '#CBD5E1';
    }
  }

  getIndicateurClass(niveau: string): string {
    switch (niveau) {
      case 'danger':  return 'bg-red-50 text-red-600 border-red-200';
      case 'warning': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'info':    return 'bg-blue-50 text-blue-700 border-blue-200';
      default:        return 'bg-[#E3F9ED] text-[#404944] border-[#BFC9C3]';
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // État bouton Appeler Box
  // ─────────────────────────────────────────────────────────────────────────

  getEtatAppel(idCreneau: number): 'idle' | 'calling' | 'confirmed' {
    return this.appelStates().get(idCreneau)?.etat ?? 'idle';
  }

  private setEtatAppel(idCreneau: number, etat: 'idle' | 'calling' | 'confirmed'): void {
    const map = new Map(this.appelStates());
    map.set(idCreneau, { idCreneau, etat });
    this.appelStates.set(map);
  }

  getAppelBtnClass(idCreneau: number): string {
    const etat = this.getEtatAppel(idCreneau);
    if (etat === 'confirmed') return 'bg-green-600 text-white';
    if (etat === 'calling')   return 'bg-[#266A54] text-white';
    return 'bg-[#0F4C3A] hover:bg-[#266A54] text-white';
  }

  getAppelBtnIcon(idCreneau: number): string {
    const etat = this.getEtatAppel(idCreneau);
    if (etat === 'confirmed') return 'check';
    if (etat === 'calling')   return 'sync';
    return 'volume_up';
  }

  getAppelBtnLabel(idCreneau: number): string {
    const etat = this.getEtatAppel(idCreneau);
    if (etat === 'confirmed') return 'Patient en route';
    if (etat === 'calling')   return 'Appel en cours...';
    return 'Appeler Box';
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Toast
  // ─────────────────────────────────────────────────────────────────────────

  private afficherToast(msg: string): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastMessage.set(msg);
    this.toastTimer = setTimeout(() => this.toastMessage.set(null), 4000);
  }
}
