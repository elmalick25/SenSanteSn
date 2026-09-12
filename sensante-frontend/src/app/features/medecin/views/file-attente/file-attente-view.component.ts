import {
  Component, inject, signal, computed, OnInit, OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedecinFileAttenteService } from '../../services/medecin-file-attente.service';
import {
  FileAttenteVuePupitre,
  FileAttenteKpi,
  ConsultationEnCours,
  PatientFileAttente,
  PatientEnRoute,
  DossierAccueil,
  FaireEntrerResponse
} from '../../models/medecin-file-attente.model';

type FiltreGravite = 'TOUS' | 'MAS' | 'MAM' | 'ROUTINE';

@Component({
  selector: 'app-file-attente-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- ================================================================= -->
    <!-- 4 ÉTATS UI : LOADING / ERROR / EMPTY / SUCCESS                    -->
    <!-- ================================================================= -->

    <!-- 1. LOADING SKELETON -->
    <div *ngIf="isLoading()" class="space-y-4 animate-pulse">
      <!-- KPI Ribbon Skeleton -->
      <div class="bg-white rounded-xl border border-[#CBD5D1] p-4 flex gap-3">
        <div class="h-16 bg-[#D2E8DC] rounded-lg flex-1"></div>
        <div class="h-16 bg-[#D2E8DC] rounded-lg flex-1"></div>
        <div class="h-16 bg-[#D2E8DC] rounded-lg flex-1"></div>
        <div class="h-16 bg-[#D2E8DC] rounded-lg flex-1"></div>
      </div>
      <!-- Split Master-Detail Skeleton -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[75vh]">
        <div class="lg:col-span-5 bg-white rounded-xl border border-[#CBD5D1] p-4 space-y-3">
          <div class="h-20 bg-[#EFF6FF] rounded-xl border border-blue-200"></div>
          <div class="h-28 bg-[#D2E8DC] rounded-xl"></div>
          <div class="h-28 bg-[#D2E8DC] rounded-xl"></div>
          <div class="h-20 bg-[#D2E8DC] rounded-xl"></div>
        </div>
        <div class="lg:col-span-7 bg-white rounded-xl border border-[#CBD5D1] p-4 space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div class="h-44 bg-[#D2E8DC] rounded-xl"></div>
            <div class="h-44 bg-[#D2E8DC] rounded-xl"></div>
          </div>
          <div class="h-20 bg-[#D2E8DC] rounded-xl"></div>
          <div class="h-28 bg-[#D2E8DC] rounded-xl"></div>
          <div class="h-12 bg-[#D2E8DC] rounded-xl"></div>
        </div>
      </div>
    </div>

    <!-- 2. ERROR STATE -->
    <div *ngIf="hasError() && !isLoading()" class="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center p-6 bg-white rounded-2xl border border-red-200">
      <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600">
        <span class="material-symbols-outlined text-3xl">error_outline</span>
      </div>
      <h2 class="text-xl font-bold text-[#0C1F18] text-balance">Échec de synchronisation du Pupitre</h2>
      <p class="text-sm text-[#404944] max-w-md text-pretty">
        Impossible d'établir la liaison sécurisée avec le serveur de file d'attente du dispensaire.
      </p>
      <button
        (click)="chargerPupitre()"
        class="inline-flex items-center gap-2 px-4 py-2 bg-[#0F4C3A] text-white rounded-lg text-sm font-semibold hover:bg-[#266A54] transition-colors whitespace-nowrap cursor-pointer shadow-sm">
        <span class="material-symbols-outlined text-base">refresh</span>
        <span>Réessayer la synchronisation</span>
      </button>
    </div>

    <!-- 3. EMPTY STATE -->
    <div *ngIf="!isLoading() && !hasError() && totalPatients() === 0" class="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center p-8 bg-white rounded-2xl border border-[#CBD5D1]">
      <div class="w-16 h-16 rounded-full bg-[#E8FFF3] flex items-center justify-center text-[#0F4C3A]">
        <span class="material-symbols-outlined text-3xl">done_all</span>
      </div>
      <h2 class="text-xl font-bold text-[#0C1F18] text-balance">File d'Attente Complètement Traitée</h2>
      <p class="text-sm text-[#404944] max-w-md text-pretty">
        Aucun enfant en attente ou en route pour le Cabinet 04. Tous les patients de la vacation ont été pris en charge.
      </p>
      <button
        (click)="chargerPupitre()"
        class="inline-flex items-center gap-2 px-4 py-2 bg-[#E8FFF3] text-[#0F4C3A] border border-[#ACF1D5] rounded-lg text-sm font-semibold hover:bg-[#ACF1D5]/40 transition-colors whitespace-nowrap cursor-pointer">
        <span class="material-symbols-outlined text-base">sync</span>
        <span>Actualiser le pointage</span>
      </button>
    </div>

    <!-- 4. SUCCESS STATE : PUPITRE COMPLET CONFORME À LA MAQUETTE -->
    <div *ngIf="!isLoading() && !hasError() && data()" class="space-y-4">

      <!-- =================================================================== -->
      <!-- BANDEAU OPÉRATIONNEL : KPIs TEMPS RÉEL & FILTRES RAPIDES             -->
      <!-- =================================================================== -->
      <section class="bg-white border border-[#CBD5D1] rounded-xl px-4 py-3 shadow-xs">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">

          <!-- Grille des 4 Métriques Cliniques -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-1 max-w-4xl">

            <!-- 1. En route -->
            <div class="bg-[#F8FAF9] border border-[#CBD5D1]/80 rounded-lg px-3 py-2 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[#64748B] text-[22px]">directions_walk</span>
                <div>
                  <div class="text-[10px] text-[#5A6E65] uppercase font-bold tracking-wider whitespace-nowrap">En route</div>
                  <div class="text-[16px] text-[#0C1F18] font-bold">
                    {{ data()?.kpis?.enRoute }}
                    <span class="text-[11px] font-normal text-[#5A6E65]">enfants</span>
                  </div>
                </div>
              </div>
              <span class="text-[10px] font-semibold text-[#5A6E65] bg-[#DDF3E8] px-1.5 py-0.5 rounded whitespace-nowrap">
                {{ data()?.kpis?.labelEnRoute }}
              </span>
            </div>

            <!-- 2. En salle d'attente (avec badge MAS prioritaire) -->
            <div class="bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg px-3 py-2 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[#16A34A] text-[22px]">chair</span>
                <div>
                  <div class="text-[10px] text-[#166534] uppercase font-bold tracking-wider whitespace-nowrap">Salle d'attente</div>
                  <div class="text-[16px] text-[#166534] font-bold">
                    {{ data()?.kpis?.enSalleAttente }}
                    <span class="text-[11px] font-bold text-[#DC2626]">({{ data()?.kpis?.masEnSalle }}&nbsp;MAS)</span>
                  </div>
                </div>
              </div>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] whitespace-nowrap">
                Priorité
              </span>
            </div>

            <!-- 3. En consultation -->
            <div class="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg px-3 py-2 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[#2563EB] text-[22px]">stethoscope</span>
                <div>
                  <div class="text-[10px] text-[#1E40AF] uppercase font-bold tracking-wider whitespace-nowrap">En consultation</div>
                  <div class="text-[16px] text-[#1E40AF] font-bold">
                    {{ data()?.kpis?.enConsultation }}
                    <span class="text-[11px] font-normal text-[#1E40AF]">Cab. 04</span>
                  </div>
                </div>
              </div>
              <span class="text-[10px] font-bold text-[#2563EB] bg-[#DBEAFE] px-1.5 py-0.5 rounded whitespace-nowrap">
                {{ data()?.consultationEnCours ? data()?.consultationEnCours?.chronoActuel : 'Libre' }}
              </span>
            </div>

            <!-- 4. Temps d'attente moyen -->
            <div class="bg-white border border-[#CBD5D1]/80 rounded-lg px-3 py-2 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[#0F4C3A] text-[22px]">timer</span>
                <div>
                  <div class="text-[10px] text-[#5A6E65] uppercase font-bold tracking-wider whitespace-nowrap">Attente Moy.</div>
                  <div class="text-[16px] text-[#0F4C3A] font-bold">
                    {{ data()?.kpis?.tempsAttenteMoyenMin }}
                    <span class="text-[11px] font-normal text-[#5A6E65]">min</span>
                  </div>
                </div>
              </div>
              <span class="text-[10px] font-semibold text-[#16A34A] bg-[#F0FDF4] px-1.5 py-0.5 rounded whitespace-nowrap">
                {{ data()?.kpis?.diffQuotaAttente }}
              </span>
            </div>
          </div>

          <!-- Actions Droite : Interphone & Filtres par Gravité -->
          <div class="flex items-center gap-2 flex-shrink-0 self-end lg:self-center">
            <button
              (click)="declencherInterphone()"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CBD5D1] bg-white text-[#0F4C3A] hover:bg-[#F4F7F5] transition-colors text-xs font-semibold whitespace-nowrap cursor-pointer shadow-2xs">
              <span class="material-symbols-outlined text-[16px]">volume_up</span>
              <span>Interphone Salle</span>
            </button>

            <!-- Pill Tabs Filtres -->
            <div class="flex items-center bg-[#DDF3E8]/60 p-1 rounded-lg border border-[#CBD5D1] gap-1">
              <button
                (click)="setFilter('TOUS')"
                [ngClass]="getFilterClasses('TOUS')"
                class="px-2.5 py-1 text-[11px] rounded-md transition-colors whitespace-nowrap cursor-pointer">
                Tous ({{ totalTous() }})
              </button>
              <button
                (click)="setFilter('MAS')"
                [ngClass]="getFilterClasses('MAS')"
                class="px-2.5 py-1 text-[11px] rounded-md transition-colors whitespace-nowrap cursor-pointer">
                MAS ({{ totalMas() }})
              </button>
              <button
                (click)="setFilter('MAM')"
                [ngClass]="getFilterClasses('MAM')"
                class="px-2.5 py-1 text-[11px] rounded-md transition-colors whitespace-nowrap cursor-pointer">
                MAM ({{ totalMam() }})
              </button>
              <button
                (click)="setFilter('ROUTINE')"
                [ngClass]="getFilterClasses('ROUTINE')"
                class="px-2.5 py-1 text-[11px] rounded-md transition-colors whitespace-nowrap cursor-pointer">
                Routine ({{ totalRoutine() }})
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- =================================================================== -->
      <!-- MASTER-DETAIL MAIN SPLIT CONTAINER (45% Gauche / 55% Droite)        -->
      <!-- =================================================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">

        <!-- ================================================================= -->
        <!-- VOLET GAUCHE (45% / 5 Cols) : FILE CLINIQUE ACTIVE                -->
        <!-- ================================================================= -->
        <section class="lg:col-span-5 flex flex-col bg-white rounded-xl border border-[#CBD5D1] shadow-sm overflow-hidden min-h-[680px]">

          <!-- Header File Active -->
          <div class="px-4 py-2.5 bg-[#F4F7F5] border-b border-[#CBD5D1] flex items-center justify-between flex-shrink-0">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[#0F4C3A] text-[20px]">view_timeline</span>
              <h2 class="text-sm font-bold text-[#0C1F18] text-balance">File Clinique Active</h2>
              <span class="px-2 py-0.5 rounded-full bg-[#ACF1D5] text-[#003426] text-[11px] font-bold whitespace-nowrap">
                {{ totalTous() }} Présents / En route
              </span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
              <span class="text-[11px] text-[#166534] font-semibold whitespace-nowrap">Triage Automatique MAS</span>
            </div>
          </div>

          <!-- Contenu Scrollable de la File -->
          <div class="flex-1 overflow-y-auto p-3 space-y-3">

            <!-- 1. CARTE PATIENT EN CONSULTATION (Cabinet 04) -->
            <div *ngIf="data()?.consultationEnCours as enCours"
                 class="rounded-xl border-2 border-blue-500 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-3 shadow-xs">
              <div class="flex items-center justify-between pb-2 border-b border-blue-100">
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                  <span class="text-[12px] font-bold text-blue-800 uppercase tracking-wide whitespace-nowrap">
                    En cours — Cabinet 04 (Dr. Fall)
                  </span>
                </div>
                <!-- Countdown Pill -->
                <div class="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-xs font-bold whitespace-nowrap">
                  <span class="material-symbols-outlined text-[14px]">timer</span>
                  <span>{{ enCours.chronoActuel }}</span>
                </div>
              </div>

              <!-- Infos Patient en cours -->
              <div class="mt-2.5 flex items-center justify-between gap-2">
                <div class="flex items-center gap-2.5 min-w-0">
                  <img
                    class="w-10 h-10 rounded-full object-cover border-2 border-blue-500 flex-shrink-0"
                    [src]="enCours.avatarEnfant || 'https://ui-avatars.com/api/?name=Patient&background=0D9488&color=fff'"
                    alt="Patient en cours"
                    (error)="onAvatarError($event)"
                  />
                  <div class="min-w-0">
                    <div class="text-sm font-bold text-[#0C1F18] truncate">{{ enCours.nomComplet }}</div>
                    <div class="text-[11px] text-[#404944] truncate">{{ enCours.ageLabel }} • Accomp: {{ enCours.nomAccompagnant }}</div>
                  </div>
                </div>
                <div class="text-right flex-shrink-0">
                  <span class="text-[11px] font-bold text-blue-700 bg-white border border-blue-200 px-2 py-0.5 rounded whitespace-nowrap">
                    PB: {{ enCours.pbMm }}&nbsp;mm
                  </span>
                  <div class="text-[10px] text-gray-600 mt-0.5 whitespace-nowrap">
                    T° {{ enCours.temperatureC }}&nbsp;°C • {{ enCours.poidsKg }}&nbsp;kg
                  </div>
                </div>
              </div>

              <!-- Jauge de progression & Bouton Clôturer -->
              <div class="mt-2.5 pt-2 border-t border-blue-100 flex items-center justify-between gap-2">
                <div class="flex-1">
                  <div class="w-full bg-blue-100 h-1.5 rounded-full overflow-hidden">
                    <div class="bg-blue-600 h-full rounded-full transition-all duration-300"
                         [style.width.%]="enCours.progressionPourcent"></div>
                  </div>
                </div>
                <button
                  (click)="cloturerConsultation()"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[11px] font-semibold transition-all flex-shrink-0 whitespace-nowrap cursor-pointer shadow-xs">
                  <span class="material-symbols-outlined text-[14px]">done_all</span>
                  <span>Clôturer</span>
                </button>
              </div>
            </div>

            <!-- 2. SECTION PATIENTS PRÉSENTS EN SALLE D'ATTENTE -->
            <div class="space-y-2.5">
              <div class="flex items-center justify-between pt-1">
                <div class="flex items-center gap-1.5 text-[#0F4C3A] text-xs font-bold uppercase tracking-wider">
                  <span class="material-symbols-outlined text-[18px] text-[#16A34A]">groups</span>
                  <span>Présents en Salle d'Attente ({{ patientsFiltres().length }})</span>
                </div>
                <span class="text-[11px] text-[#5A6E65] font-semibold whitespace-nowrap">Classés par gravité clinique</span>
              </div>

              <!-- Boucle Patients Filtrés -->
              <div
                *ngFor="let patient of patientsFiltres()"
                (click)="selectionnerPatient(patient)"
                [ngClass]="getPatientCardClasses(patient)"
                class="rounded-xl p-3 shadow-xs transition-all relative cursor-pointer">

                <!-- Badge Actif Suivant Assigné -->
                <div *ngIf="patient.idPatient === selectedPatientId()"
                     class="absolute -top-2.5 right-3 bg-[#0F4C3A] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 whitespace-nowrap">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#ACF1D5]"></span>
                  <span>Fiche Active &amp; Suivant Assigné</span>
                </div>

                <div class="flex items-start gap-2.5">
                  <!-- Avatar Double (Enfant + Accompagnant si dispo) -->
                  <div class="relative flex-shrink-0">
                    <img
                      class="w-11 h-11 rounded-full object-cover border-2"
                      [ngClass]="patient.prioriteGravite === 'MAS' ? 'border-red-600' : 'border-[#0F4C3A]'"
                      [src]="patient.avatarEnfant || 'https://ui-avatars.com/api/?name=Enfant&background=0D9488&color=fff'"
                      alt="Photo patient"
                      (error)="onAvatarError($event)"
                    />
                    <img
                      *ngIf="patient.avatarAccompagnant"
                      class="w-5 h-5 rounded-full object-cover border border-white absolute -bottom-1 -right-1 shadow-xs"
                      [src]="patient.avatarAccompagnant"
                      alt="Accompagnant"
                      (error)="onAvatarError($event)"
                    />
                  </div>

                  <!-- Détails Patient -->
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between">
                      <div class="text-sm font-bold text-[#0C1F18] truncate">{{ patient.nomComplet }}</div>
                      <span class="text-xs font-bold"
                            [ngClass]="patient.prioriteGravite === 'MAS' ? 'text-red-600' : 'text-[#0F4C3A]'">
                        {{ patient.heureArrivee }}
                      </span>
                    </div>

                    <div class="text-[11px] text-[#404944] truncate">
                      {{ patient.ageLabel }} • Accomp: {{ patient.nomAccompagnant }} ({{ patient.lienAccompagnant }})
                    </div>

                    <div class="flex items-center gap-2 mt-1 flex-wrap">
                      <!-- Badge Gravité -->
                      <span
                        *ngIf="patient.prioriteGravite === 'MAS'"
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold border border-red-200 whitespace-nowrap">
                        <span class="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                        <span>{{ patient.badgeLabel }}</span>
                      </span>

                      <span
                        *ngIf="patient.prioriteGravite === 'MAM'"
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200 whitespace-nowrap">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                        <span>{{ patient.badgeLabel }}</span>
                      </span>

                      <span
                        *ngIf="patient.prioriteGravite === 'ROUTINE'"
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-200 whitespace-nowrap">
                        <span class="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                        <span>{{ patient.badgeLabel }}</span>
                      </span>

                      <span class="text-[10px] text-green-800 font-medium whitespace-nowrap">
                        Attente: {{ patient.tempsAttenteMin }}&nbsp;min
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Footer Carte Patient : NIP + Action Ergonomique -->
                <div class="mt-2.5 pt-2 border-t border-[#CBD5D1]/40 flex items-center justify-between gap-2">
                  <span class="text-[10px] font-mono text-[#707974] whitespace-nowrap">NIP:&nbsp;{{ patient.nip }}</span>

                  <!-- Boutons d'action contextuelle -->
                  <div class="flex items-center gap-1.5">
                    <button
                      *ngIf="patient.prioriteGravite === 'MAS'"
                      (click)="prioriserPatient(patient.idPatient, $event)"
                      class="px-3 py-1 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-[11px] font-bold rounded-md flex items-center gap-1 shadow-2xs whitespace-nowrap cursor-pointer transition-all">
                      <span class="material-symbols-outlined text-[14px]">priority_high</span>
                      <span>Prioriser &amp; Appeler</span>
                    </button>

                    <button
                      *ngIf="patient.prioriteGravite !== 'MAS'"
                      (click)="faireEntrerPatient(patient.idPatient, $event)"
                      class="px-3 py-1.5 bg-[#0F4C3A] hover:bg-[#266A54] active:scale-95 text-white text-[12px] font-bold rounded-lg shadow-xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
                      <span class="material-symbols-outlined text-[16px]">meeting_room</span>
                      <span>Faire Entrer</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. SECTION COLLAPSIBLE : EN ROUTE VERS LE CENTRE -->
            <div class="rounded-xl border border-[#CBD5D1] bg-[#F8FAF9] p-3 space-y-2">
              <div
                (click)="toggleEnRoute()"
                class="flex items-center justify-between cursor-pointer select-none">
                <div class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[#64748B] text-[18px]">directions_walk</span>
                  <span class="text-[13px] font-bold text-[#0C1F18] whitespace-nowrap">
                    En route vers le Centre ({{ data()?.patientsEnRoute?.length }})
                  </span>
                </div>
                <div class="flex items-center gap-1 text-[11px] text-[#707974] font-semibold">
                  <span class="hidden sm:inline">Dakar-Plateau / Médina</span>
                  <span class="material-symbols-outlined text-[16px]">
                    {{ isEnRouteOpen() ? 'expand_less' : 'expand_more' }}
                  </span>
                </div>
              </div>

              <!-- Mini Cartes En Route (Conditionnées à l'état de l'accordéon) -->
              <div *ngIf="isEnRouteOpen()" class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div
                  *ngFor="let enfant of data()?.patientsEnRoute"
                  class="bg-white border border-[#CBD5D1] rounded-lg p-2 flex items-center gap-2 shadow-2xs">
                  <img
                    class="w-8 h-8 rounded-full object-cover border border-[#CBD5D1] flex-shrink-0"
                    [src]="enfant.avatarEnfant || 'https://ui-avatars.com/api/?name=Enfant&background=3B82F6&color=fff'"
                    alt="Enfant en route"
                    (error)="onAvatarError($event)"
                  />
                  <div class="min-w-0 flex-1">
                    <div class="text-[12px] font-bold text-[#0C1F18] truncate">{{ enfant.nomComplet }} ({{ enfant.ageLabel }})</div>
                    <div class="text-[10px] text-[#0F4C3A] font-semibold flex items-center gap-0.5 truncate">
                      <span class="material-symbols-outlined text-[12px]">local_shipping</span>
                      <span class="truncate">{{ enfant.transportLabel }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <!-- ================================================================= -->
        <!-- VOLET DROIT (55% / 7 Cols) : DOSSIER D'ACCUEIL & DOUBLE-IDENTITÉ  -->
        <!-- ================================================================= -->
        <section *ngIf="dossierActifValide() as dossier; else emptyDossierTpl"
                 class="lg:col-span-7 flex flex-col bg-white rounded-xl border border-[#CBD5D1] shadow-sm overflow-hidden min-h-[680px]">

          <!-- Header Dossier d'Accueil -->
          <div class="px-5 py-3 bg-[#F4F7F5] border-b border-[#CBD5D1] flex items-center justify-between flex-shrink-0 flex-wrap gap-2">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-[#0F4C3A] text-white flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-[20px]">badge</span>
              </div>
              <div>
                <h2 class="text-sm font-bold text-[#0C1F18] leading-tight text-balance">
                  Dossier d'Accueil &amp; Double-Identité Numérique
                </h2>
                <span class="text-[11px] text-[#266A54] font-medium text-pretty">
                  Contrôle biométrique, tutorat légal &amp; antécédents Zéro Attente
                </span>
              </div>
            </div>

            <!-- Badges de Certification Haute Sécurité -->
            <div class="flex items-center gap-1.5 flex-shrink-0">
              <span class="px-2 py-0.5 rounded bg-green-100 text-green-800 text-[11px] font-bold border border-green-300 flex items-center gap-1 whitespace-nowrap">
                <span class="material-symbols-outlined text-[13px]">verified</span>
                <span>ID Vérifiée</span>
              </span>
              <span class="px-2 py-0.5 rounded bg-[#ACF1D5] text-[#003426] text-[11px] font-bold border border-[#266A54] flex items-center gap-1 whitespace-nowrap">
                <span class="material-symbols-outlined text-[13px]">fingerprint</span>
                <span>Biométrie Conforme</span>
              </span>
            </div>
          </div>

          <!-- Corps du Dossier (Scrollable) -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">

            <!-- 1. CARTES JUMELLES : DOUBLE IDENTITÉ BIOMÉTRIQUE (ENFANT & TUTRICE) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">

              <!-- CARTE 1 : ENFANT (BÉNÉFICIAIRE) -->
              <div class="border-2 border-[#0F4C3A]/25 rounded-xl p-3.5 bg-[#FAFDFB] relative shadow-2xs">
                <div class="flex items-center justify-between pb-2 mb-2.5 border-b border-[#CBD5D1]/60">
                  <span class="inline-flex items-center gap-1.5 text-[#0F4C3A] text-xs font-bold uppercase tracking-wider">
                    <span class="material-symbols-outlined text-[18px]">child_care</span>
                    <span>Enfant (Bénéficiaire)</span>
                  </span>
                  <span class="text-[10px] font-bold text-white bg-[#0F4C3A] px-2 py-0.5 rounded-full whitespace-nowrap">Patient</span>
                </div>

                <div class="flex items-center gap-3.5">
                  <img
                    *ngIf="dossier.enfant?.avatarUrl"
                    class="w-16 h-16 rounded-full object-cover border-2 border-[#0F4C3A] shadow-xs flex-shrink-0"
                    [src]="dossier.enfant.avatarUrl"
                    (error)="onAvatarError($event)"
                    alt="Photo identité enfant"
                  />
                  <div *ngIf="!dossier.enfant.avatarUrl"
                       class="w-16 h-16 rounded-full bg-[#E8F3EE] border-2 border-[#0F4C3A] flex items-center justify-center text-[#0F4C3A] flex-shrink-0">
                    <span class="material-symbols-outlined text-2xl">child_care</span>
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="text-[15px] font-bold text-[#0C1F18] truncate">{{ dossier.enfant.nomComplet || 'Enfant non renseigné' }}</div>
                    <div class="text-xs text-[#404944] font-medium">{{ dossier.enfant.ageLabel || '--' }} (Né le {{ dossier.enfant.dateNaissance || '--' }})</div>
                    <div class="text-xs text-[#404944]">Sexe: {{ dossier.enfant.sexe || '--' }}</div>
                    <div class="mt-1 font-mono text-[11px] font-bold text-[#0F4C3A] bg-[#E8F3EE] px-2 py-0.5 rounded inline-block whitespace-nowrap">
                      NIP: {{ dossier.enfant.nip || 'NON ATTRIBUÉ' }}
                    </div>
                  </div>
                </div>

                <!-- Données démographiques & vaccinales -->
                <div class="mt-3 pt-2.5 border-t border-[#CBD5D1]/60 space-y-1 text-xs">
                  <div class="flex justify-between">
                    <span class="text-[#404944]">Groupe Sanguin:</span>
                    <span class="font-mono font-bold text-[#0C1F18]">{{ dossier.enfant.groupeSanguin || '--' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-[#404944]">Rang dans fratrie:</span>
                    <span class="font-medium text-[#0C1F18]">{{ dossier.enfant.rangFratrie || '--' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-[#404944]">Couverture Vaccinale:</span>
                    <span class="text-green-600 font-bold flex items-center gap-0.5 whitespace-nowrap">
                      <span class="material-symbols-outlined text-[14px]">check_circle</span>
                      {{ dossier.enfant.couvertureVaccinale || 'À jour' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- CARTE 2 : TUTRICE / PARENT DÉCLARÉ -->
              <div class="border-2 border-[#ACF1D5] rounded-xl p-3.5 bg-[#FAFDFB] relative shadow-2xs">
                <div class="flex items-center justify-between pb-2 mb-2.5 border-b border-[#CBD5D1]/60">
                  <span class="inline-flex items-center gap-1.5 text-[#00513D] text-xs font-bold uppercase tracking-wider">
                    <span class="material-symbols-outlined text-[18px]">person</span>
                    <span>Parent / Tutrice Déclarée</span>
                  </span>
                  <span class="text-[10px] font-bold text-[#00513D] bg-[#ACF1D5] px-2 py-0.5 rounded-full whitespace-nowrap">Accompagnant</span>
                </div>

                <div class="flex items-center gap-3.5">
                  <img
                    *ngIf="dossier.tuteur.avatarUrl"
                    class="w-16 h-16 rounded-full object-cover border-2 border-[#ACF1D5] shadow-xs flex-shrink-0"
                    [src]="dossier.tuteur.avatarUrl"
                    (error)="onAvatarError($event)"
                    alt="Photo tuteur"
                  />
                  <div *ngIf="!dossier.tuteur.avatarUrl"
                       class="w-16 h-16 rounded-full bg-[#E8FFF3] border-2 border-[#ACF1D5] flex items-center justify-center text-[#0F4C3A] flex-shrink-0">
                    <span class="material-symbols-outlined text-2xl">account_circle</span>
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="text-[15px] font-bold text-[#0C1F18] truncate">{{ dossier.tuteur.nomComplet || 'Accompagnant non renseigné' }}</div>
                    <div class="text-xs text-[#404944] font-medium truncate">{{ dossier.tuteur.lienParente || 'Tutrice légale' }}</div>
                    <div class="text-xs text-[#404944] truncate">Résidence: {{ dossier.tuteur.adresse || '--' }}</div>
                    <div class="mt-1 font-mono text-[11px] font-bold text-[#2D705A] bg-[#DDF3E8] px-2 py-0.5 rounded inline-block whitespace-nowrap">
                      CNI: {{ dossier.tuteur.cni || 'NON RENSEIGNÉ' }}
                    </div>
                  </div>
                </div>

                <!-- Données administratives & mandat -->
                <div class="mt-3 pt-2.5 border-t border-[#CBD5D1]/60 space-y-1 text-xs">
                  <div class="flex justify-between items-center">
                    <span class="text-[#404944]">Téléphone mobile:</span>
                    <span class="font-mono font-bold text-[#0F4C3A] whitespace-nowrap">{{ dossier.tuteur.telephone || '--' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-[#404944]">Prise en charge:</span>
                    <span class="font-bold text-green-600 whitespace-nowrap">{{ dossier.tuteur.priseEnCharge }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-[#404944]">Délégation parentale:</span>
                    <span class="text-green-600 font-semibold flex items-center gap-0.5 whitespace-nowrap">
                      <span class="material-symbols-outlined text-[14px]">check_circle</span>
                      {{ dossier.tuteur.delegationParentale }}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            <!-- 2. BENTO RIBBON DES CONSTANTES VITALES DU POINTAGE -->
            <div class="rounded-xl border border-[#CBD5D1] bg-[#F8FAF9] p-3.5 shadow-2xs">
              <div class="flex items-center justify-between pb-2 border-b border-[#CBD5D1]/60 mb-2.5">
                <span class="text-xs font-bold text-[#0C1F18] uppercase tracking-wide flex items-center gap-1.5 whitespace-nowrap">
                  <span class="material-symbols-outlined text-[18px] text-[#0F4C3A]">vital_signs</span>
                  <span>Constantes Vitales du Pointage ({{ dossier.constantes.heurePointage }} — {{ dossier.constantes.agentPointage }})</span>
                </span>
                <span class="text-[11px] text-[#707974] font-mono whitespace-nowrap">
                  {{ dossier.constantes.materielPointage }}
                </span>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <!-- Constante 1: Poids -->
                <div class="bg-white border border-[#CBD5D1] rounded-lg p-2.5 text-center shadow-xs">
                  <div class="text-[10px] text-[#5A6E65] uppercase font-bold whitespace-nowrap">Poids actuel</div>
                  <div class="text-[20px] font-bold text-[#0C1F18] mt-0.5 whitespace-nowrap">{{ dossier.constantes.poidsKg }}&nbsp;kg</div>
                  <div class="text-[10px] font-bold text-red-600 mt-0.5 whitespace-nowrap">{{ dossier.constantes.variationPoids }}</div>
                </div>

                <!-- Constante 2: Périmètre Brachial (PB) -->
                <div [ngClass]="getPbCardClasses(dossier.constantes.pbMm)"
                     class="border-2 rounded-lg p-2.5 text-center shadow-xs">
                  <div class="text-[10px] uppercase font-bold whitespace-nowrap"
                       [ngClass]="getPbTextClasses(dossier.constantes.pbMm)">
                    Périmètre Brachial (PB)
                  </div>
                  <div class="text-[20px] font-bold mt-0.5 whitespace-nowrap"
                       [ngClass]="getPbValueClasses(dossier.constantes.pbMm)">
                    {{ dossier.constantes.pbMm }}&nbsp;mm
                  </div>
                  <div class="text-[10px] font-bold rounded px-1.5 mt-0.5 inline-block whitespace-nowrap"
                       [ngClass]="getPbBadgeClasses(dossier.constantes.pbMm)">
                    {{ dossier.constantes.statutPb }}
                  </div>
                </div>

                <!-- Constante 3: Température -->
                <div class="bg-white border border-[#CBD5D1] rounded-lg p-2.5 text-center shadow-xs">
                  <div class="text-[10px] text-[#5A6E65] uppercase font-bold whitespace-nowrap">Température</div>
                  <div class="text-[20px] font-bold text-[#0C1F18] mt-0.5 whitespace-nowrap">{{ dossier.constantes.temperatureC }}&nbsp;°C</div>
                  <div class="text-[10px] font-semibold mt-0.5 whitespace-nowrap"
                       [ngClass]="dossier.constantes.temperatureC < 38 ? 'text-green-600' : 'text-red-600'">
                    {{ dossier.constantes.statutTemperature }}
                  </div>
                </div>

                <!-- Constante 4: Test Appétit ATPE -->
                <div [ngClass]="dossier.constantes.testAppetit === 'Positif' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'"
                     class="border rounded-lg p-2.5 text-center shadow-xs">
                  <div class="text-[10px] uppercase font-bold whitespace-nowrap"
                       [ngClass]="dossier.constantes.testAppetit === 'Positif' ? 'text-green-800' : 'text-red-800'">
                    Test Appétit ATPE
                  </div>
                  <div class="text-[18px] font-bold mt-0.5 whitespace-nowrap"
                       [ngClass]="dossier.constantes.testAppetit === 'Positif' ? 'text-green-600' : 'text-red-600'">
                    {{ dossier.constantes.testAppetit }}
                  </div>
                  <div class="text-[10px] font-semibold mt-0.5 whitespace-nowrap"
                       [ngClass]="dossier.constantes.testAppetit === 'Positif' ? 'text-green-600' : 'text-red-600'">
                    {{ dossier.constantes.detailAppetit }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. MOTIF DE RÉFÉRENCE & TRANSMISSION DU RELAIS -->
            <div class="rounded-xl border-l-4 border-[#0F4C3A] border-y border-r border-[#CBD5D1] bg-[#F8FAF9] p-3.5 space-y-2 shadow-2xs">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[#0F4C3A] text-[20px]">assignment_turned_in</span>
                  <span class="text-sm font-bold text-[#0C1F18] text-balance">
                    Motif de Référence &amp; Note du Relais {{ dossier.transmission.relaisNom }}
                  </span>
                </div>
                <span class="text-[11px] font-mono text-[#0F4C3A] bg-[#DDF3E8] px-2 py-0.5 rounded font-bold whitespace-nowrap">
                  Créneau Garanti: {{ dossier.transmission.creneauGaranti }}
                </span>
              </div>

              <p class="text-[12.5px] leading-relaxed text-[#0C1F18] text-pretty">
                <span class="font-bold text-[#0F4C3A]">
                  Transmission Relais Communautaire ({{ dossier.transmission.relaisNom }} — {{ dossier.transmission.relaisQuartier }}) :
                </span>
                "{{ dossier.transmission.motifComplet }}"
              </p>

              <div class="pt-2 border-t border-[#CBD5D1]/60 flex items-center justify-between text-[11px] text-[#404944] font-medium flex-wrap gap-1">
                <div class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[15px] text-green-600">verified_user</span>
                  <span>Pointage validé à <strong>{{ dossier.transmission.heureAdmission }}</strong> par {{ dossier.transmission.infirmiereAdmission }}</span>
                </div>
                <span class="text-[#0F4C3A] font-bold">{{ dossier.transmission.protocoleNom }}</span>
              </div>
            </div>

            <!-- 4. ALERTE CLINIQUE DÉCISIONNELLE -->
            <div *ngIf="dossier.alerte.hasAlerte"
                 class="rounded-lg bg-red-50 border border-red-200 p-2.5 flex items-center justify-between text-red-600 gap-2 flex-wrap">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px] flex-shrink-0">warning</span>
                <span class="text-xs font-bold text-pretty">{{ dossier.alerte.titre }}</span>
              </div>
              <button
                (click)="ouvrirProtocoleOms()"
                class="text-xs underline hover:text-red-800 font-semibold whitespace-nowrap cursor-pointer">
                {{ dossier.alerte.protocoleDocLabel }}
              </button>
            </div>

          </div>

          <!-- FOOTER D'ACTIONS CLINIQUES STICKY -->
          <footer class="px-5 py-3 bg-[#F4F7F5] border-t border-[#CBD5D1] flex items-center gap-3 flex-shrink-0">
            <!-- CTA Principal : Faire entrer au Cabinet 04 -->
            <button
              (click)="faireEntrerPatient(dossier.idPatient)"
              [disabled]="isSubmitting()"
              class="flex-1 py-3 px-4 rounded-xl bg-[#0F4C3A] hover:bg-[#266A54] active:scale-[0.99] text-white text-sm font-bold shadow transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer disabled:opacity-50">
              <span class="material-symbols-outlined text-[22px]">meeting_room</span>
              <span>Faire entrer au Cabinet 04 (Lancer Consultation)</span>
            </button>

            <!-- CTA Secondaire : Dossier Complet -->
            <button
              (click)="consulterDossierComplet(dossier.idPatient)"
              class="py-3 px-4 rounded-xl border border-[#CBD5D1] bg-white hover:bg-[#E8F3EE] text-[#0F4C3A] text-[13px] font-bold transition-colors flex items-center gap-1.5 shadow-2xs whitespace-nowrap cursor-pointer">
              <span class="material-symbols-outlined text-[18px]">folder_open</span>
              <span>Dossier Complet</span>
            </button>

            <!-- CTA Tertiaire : Alerter Triage -->
            <button
              (click)="alerterInfirmierTriage()"
              class="p-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              title="Alerter l'Infirmier de Triage">
              <span class="material-symbols-outlined text-[20px]">notifications_active</span>
              <span class="hidden xl:inline">Alerter Triage</span>
            </button>
          </footer>

        </section>

        <!-- État vide si aucun patient sélectionné dans la file -->
        <ng-template #emptyDossierTpl>
          <section class="lg:col-span-7 flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-[#CBD5D1] p-10 text-center min-h-[500px]">
            <div class="w-16 h-16 rounded-2xl bg-[#E8F3EE] flex items-center justify-center text-[#0F4C3A] mb-4 shadow-xs">
              <span class="material-symbols-outlined text-3xl">patient_list</span>
            </div>
            <h3 class="text-base font-bold text-[#0C1F18] mb-1.5 text-balance">Aucun patient sélectionné</h3>
            <p class="text-xs text-[#404944] max-w-sm text-pretty leading-relaxed">
              Sélectionnez un enfant dans la file d'attente à gauche pour charger sa double identité biométrique, ses antécédents et démarrer la consultation.
            </p>
          </section>
        </ng-template>
    </div>
  `
})
export class FileAttenteViewComponent implements OnInit, OnDestroy {

  private readonly fileAttenteService = inject(MedecinFileAttenteService);

  // Signaux d'état
  readonly isLoading = signal<boolean>(true);
  readonly hasError = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);
  readonly data = signal<FileAttenteVuePupitre | null>(null);

  readonly selectedPatientId = signal<number>(1);
  readonly activeFilter = signal<FiltreGravite>('TOUS');
  readonly isEnRouteOpen = signal<boolean>(true);

  // Timer interval pour la consultation en cours
  private timerInterval?: ReturnType<typeof setInterval>;

  // Signaux calculés
  readonly totalTous = computed(() => this.data()?.patientsEnAttente.length ?? 0);
  readonly totalMas = computed(() =>
    this.data()?.patientsEnAttente.filter(p => p.prioriteGravite === 'MAS').length ?? 0
  );
  readonly totalMam = computed(() =>
    this.data()?.patientsEnAttente.filter(p => p.prioriteGravite === 'MAM').length ?? 0
  );
  readonly totalRoutine = computed(() =>
    this.data()?.patientsEnAttente.filter(p => p.prioriteGravite === 'ROUTINE').length ?? 0
  );

  readonly totalPatients = computed(() => {
    const d = this.data();
    if (!d) return 0;
    return d.patientsEnAttente.length + (d.consultationEnCours ? 1 : 0);
  });

  readonly dossierActifValide = computed(() => {
    const d = this.data();
    if (!d || !d.dossierActif || d.dossierActif.idPatient === 0) {
      return null;
    }
    return d.dossierActif;
  });

  readonly patientsFiltres = computed(() => {
    const d = this.data();
    if (!d) return [];
    const filter = this.activeFilter();
    if (filter === 'TOUS') {
      return d.patientsEnAttente;
    }
    return d.patientsEnAttente.filter(p => p.prioriteGravite === filter);
  });

  ngOnInit(): void {
    this.chargerPupitre();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  chargerPupitre(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.fileAttenteService.getVuePupitre().subscribe({
      next: (res: FileAttenteVuePupitre) => {
        this.data.set(res);
        if (res.dossierActif) {
          this.selectedPatientId.set(res.dossierActif.idPatient);
        }
        this.isLoading.set(false);
        this.demarrerChrono();
      },
      error: (err: unknown) => {
        console.error('Erreur chargement file d\'attente:', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  setFilter(filter: FiltreGravite): void {
    this.activeFilter.set(filter);
  }

  toggleEnRoute(): void {
    this.isEnRouteOpen.update(v => !v);
  }

  selectionnerPatient(patient: PatientFileAttente): void {
    this.selectedPatientId.set(patient.idPatient);
    this.fileAttenteService.getDossierAccueil(patient.idPatient).subscribe({
      next: (dossier: DossierAccueil) => {
        this.data.update(current => {
          if (!current) return current;
          return { ...current, dossierActif: dossier };
        });
      },
      error: (err: unknown) => {
        console.error('Erreur chargement dossier patient:', err);
      }
    });
  }

  faireEntrerPatient(idPatient: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isSubmitting.set(true);
    this.fileAttenteService.faireEntrer(idPatient).subscribe({
      next: (_res: FaireEntrerResponse) => {
        this.isSubmitting.set(false);
        this.chargerPupitre();
      },
      error: (err: unknown) => {
        this.isSubmitting.set(false);
        console.error('Erreur lors de l\'admission du patient:', err);
      }
    });
  }

  prioriserPatient(idPatient: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isSubmitting.set(true);
    this.fileAttenteService.prioriserEtAppeler(idPatient).subscribe({
      next: (_res: FaireEntrerResponse) => {
        this.isSubmitting.set(false);
        this.chargerPupitre();
      },
      error: (err: unknown) => {
        this.isSubmitting.set(false);
        console.error('Erreur lors de la priorisation du patient:', err);
      }
    });
  }

  cloturerConsultation(): void {
    this.fileAttenteService.cloturerConsultation().subscribe({
      next: () => {
        this.chargerPupitre();
      },
      error: (err: unknown) => {
        console.error('Erreur clôture consultation:', err);
      }
    });
  }

  declencherInterphone(): void {
    alert('📢 Interphone activé :\n"Dr. Babacar Fall (Cabinet 04) invite le patient suivant à se présenter."');
  }

  alerterInfirmierTriage(): void {
    alert('🚨 Signal d\'alerte transmis à l\'Infirmière Aïssatou Sow (Poste de Triage & PMI Kamara).');
  }

  consulterDossierComplet(idPatient: number): void {
    alert(`📂 Ouverture du Dossier Médical Informatisé pour le patient #${idPatient}.`);
  }

  ouvrirProtocoleOms(): void {
    alert('📘 Référentiel OMS 2024 : Prise en charge intégrée de la Malnutrition Aiguë Sévère sans complications métaboliques.');
  }

  // Helpers de classes dynamiques
  getFilterClasses(filter: FiltreGravite): string {
    const isSelected = this.activeFilter() === filter;
    if (filter === 'TOUS') {
      return isSelected ? 'bg-white shadow-2xs text-[#0F4C3A] font-bold' : 'text-[#404944] font-medium hover:bg-white/60';
    }
    if (filter === 'MAS') {
      return isSelected ? 'bg-red-600 text-white font-bold' : 'text-red-600 font-semibold hover:bg-red-100';
    }
    if (filter === 'MAM') {
      return isSelected ? 'bg-amber-100 text-amber-800 font-bold' : 'text-amber-700 font-semibold hover:bg-amber-100';
    }
    return isSelected ? 'bg-white text-green-700 font-bold' : 'text-[#404944] font-semibold hover:bg-white/60';
  }

  getPatientCardClasses(patient: PatientFileAttente): string {
    const isSelected = patient.idPatient === this.selectedPatientId();
    if (isSelected) {
      return 'border-2 border-[#0F4C3A] bg-[#E8F3EE]/40 ring-2 ring-[#0F4C3A]/20';
    }
    if (patient.prioriteGravite === 'MAS') {
      return 'border border-red-200 bg-gradient-to-r from-red-50 to-white hover:border-red-400';
    }
    return 'border border-[#CBD5D1] bg-white hover:border-[#0F4C3A]/60';
  }

  getPbCardClasses(pbMm: number): string {
    if (pbMm < 115) return 'bg-red-50 border-red-300';
    if (pbMm < 125) return 'bg-amber-50 border-amber-300';
    return 'bg-green-50 border-green-300';
  }

  getPbTextClasses(pbMm: number): string {
    if (pbMm < 115) return 'text-red-700';
    if (pbMm < 125) return 'text-amber-800';
    return 'text-green-800';
  }

  getPbValueClasses(pbMm: number): string {
    if (pbMm < 115) return 'text-red-600';
    if (pbMm < 125) return 'text-amber-600';
    return 'text-green-600';
  }

  getPbBadgeClasses(pbMm: number): string {
    if (pbMm < 115) return 'bg-red-100 text-red-700';
    if (pbMm < 125) return 'bg-amber-200 text-amber-900';
    return 'bg-green-100 text-green-800';
  }

  onAvatarError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'https://ui-avatars.com/api/?name=Patient&background=0D9488&color=fff';
    }
  }

  private demarrerChrono(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = setInterval(() => {
      this.data.update(curr => {
        if (!curr || !curr.consultationEnCours) return curr;
        return curr;
      });
    }, 1000);
  }
}
