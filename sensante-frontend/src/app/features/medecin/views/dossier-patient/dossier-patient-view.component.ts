import {
  Component, inject, signal, computed, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { MedecinDossierService } from '../../services/medecin-dossier.service';
import {
  DossierPatient360,
  EvenementTimeline
} from '../../models/medecin-dossier.model';

type TabDossier = 'vue360' | 'courbes' | 'antecedents' | 'vaccins' | 'timeline';
type MetricCourbe = 'poids' | 'taille' | 'pb' | 'pt';
type FiltreTimeline = 'TOUS' | 'ATPE' | 'PB';

@Component({
  selector: 'app-dossier-patient-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- ================================================================= -->
    <!-- 4 ÉTATS UI : LOADING / ERROR / EMPTY / SUCCESS                    -->
    <!-- ================================================================= -->

    <!-- 1. LOADING SKELETON -->
    <div *ngIf="isLoading()" class="space-y-4 animate-pulse">
      <!-- Sticky Strip Skeleton -->
      <div class="bg-white rounded-xl border border-[#CBD5D1] p-4 flex gap-4">
        <div class="w-14 h-14 bg-[#D2E8DC] rounded-lg flex-shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="h-5 bg-[#D2E8DC] rounded w-1/3"></div>
          <div class="h-4 bg-[#D2E8DC] rounded w-1/2"></div>
          <div class="h-3 bg-[#D2E8DC] rounded w-2/3"></div>
        </div>
      </div>
      <!-- Tabs Skeleton -->
      <div class="flex gap-2">
        <div class="h-9 bg-[#D2E8DC] rounded-lg w-36"></div>
        <div class="h-9 bg-[#D2E8DC] rounded-lg w-44"></div>
        <div class="h-9 bg-[#D2E8DC] rounded-lg w-40"></div>
      </div>
      <!-- Body Skeleton -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div class="lg:col-span-8 bg-white rounded-xl border border-[#CBD5D1] p-4 h-72"></div>
        <div class="lg:col-span-4 bg-white rounded-xl border border-[#CBD5D1] p-4 h-72"></div>
      </div>
    </div>

    <!-- 2. ERROR STATE -->
    <div *ngIf="hasError() && !isLoading()"
         class="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center p-6 bg-white rounded-2xl border border-red-200">
      <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600">
        <span class="material-symbols-outlined text-3xl">error_outline</span>
      </div>
      <h2 class="text-xl font-bold text-[#0C1F18] text-balance">Échec de chargement du Dossier Patient</h2>
      <p class="text-sm text-[#404944] max-w-md text-pretty">
        Impossible de charger les données médicales consolidées du dossier 360°.
      </p>
      <button
        (click)="chargerDossier()"
        class="inline-flex items-center gap-2 px-4 py-2 bg-[#0F4C3A] text-white rounded-lg text-sm font-semibold hover:bg-[#266A54] transition-colors whitespace-nowrap cursor-pointer shadow-sm">
        <span class="material-symbols-outlined text-base">refresh</span>
        <span>Réessayer la synchronisation</span>
      </button>
    </div>

    <!-- 3. EMPTY STATE -->
    <div *ngIf="!isLoading() && !hasError() && !data()"
         class="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center p-8 bg-white rounded-2xl border border-[#CBD5D1]">
      <div class="w-16 h-16 rounded-full bg-[#E8FFF3] flex items-center justify-center text-[#0F4C3A]">
        <span class="material-symbols-outlined text-3xl">person_search</span>
      </div>
      <h2 class="text-xl font-bold text-[#0C1F18] text-balance">Aucun Dossier Patient Sélectionné</h2>
      <p class="text-sm text-[#404944] max-w-md text-pretty">
        Sélectionnez un enfant dans la file d'attente pour visualiser son dossier pédiatrique 360°.
      </p>
    </div>

    <!-- 4. SUCCESS STATE : DOSSIER 360° COMPLET CONFORME À LA MAQUETTE -->
    <div *ngIf="!isLoading() && !hasError() && dossierComplet() as d" class="space-y-4">

      <!-- =================================================================== -->
      <!-- 3. STICKY TOP PATIENT IDENTITY STRIP                                -->
      <!-- =================================================================== -->
      <section class="bg-white border border-[#CBD5D1] rounded-xl px-4 py-3 shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-3">

          <!-- Left: Identité & Coordonnées -->
          <div class="flex items-center gap-3.5">
            <div class="relative flex-shrink-0">
              <img
                class="w-14 h-14 rounded-lg object-cover border-2 border-[#0F4C3A]"
                [src]="d.patient.avatarUrl"
                alt="Portrait patient"
              />
              <span class="absolute -bottom-1 -right-1 bg-[#0F4C3A] text-[9px] text-white px-1.5 py-0.2 rounded font-bold uppercase tracking-wider whitespace-nowrap">
                {{ d.patient.boxAssignation }}
              </span>
            </div>

            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h1 class="text-lg font-bold text-[#0C1F18] text-balance">{{ d.patient.nomComplet }}</h1>
                <span class="bg-[#DDF3E8] text-[#0F4C3A] font-bold text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                  {{ d.patient.ageLabel }}
                </span>
                <span class="bg-[#DDF3E8] text-[#0F4C3A] font-medium text-xs px-1.5 py-0.5 rounded whitespace-nowrap">
                  {{ d.patient.sexe }}
                </span>
                <span class="font-mono text-xs text-[#404944] bg-[#F8FAF9] px-2 py-0.5 rounded border border-[#CBD5D1] whitespace-nowrap">
                  NIP:&nbsp;{{ d.patient.nip }}
                </span>
                <span class="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  {{ d.patient.statutNutritionnelBadge }}
                </span>
              </div>

              <!-- Tutrice & Ligne Contact -->
              <div class="flex items-center gap-3 text-xs text-[#404944] mt-1 flex-wrap">
                <span class="flex items-center gap-1 whitespace-nowrap">
                  <span class="material-symbols-outlined text-[15px] text-[#0F4C3A]">person</span>
                  <span>Tutrice: <strong>{{ d.patient.tutriceNom }}</strong> ({{ d.patient.tutriceLien }})</span>
                </span>
                <span class="text-gray-300 hidden sm:inline">•</span>
                <span class="flex items-center gap-1 whitespace-nowrap">
                  <span class="material-symbols-outlined text-[15px] text-[#0F4C3A]">location_on</span>
                  <span>{{ d.patient.adresse }}</span>
                </span>
                <span class="text-gray-300 hidden sm:inline">•</span>
                <span class="flex items-center gap-1 whitespace-nowrap">
                  <span class="material-symbols-outlined text-[15px] text-[#0F4C3A]">call</span>
                  <span class="font-mono">{{ d.patient.telephone }}</span>
                </span>
                <span class="text-gray-300 hidden sm:inline">•</span>
                <span class="text-[11px] text-[#707974] whitespace-nowrap">CNI:&nbsp;{{ d.patient.cni }}</span>
              </div>
            </div>
          </div>

          <!-- Right: Quick Clinical Actions -->
          <div class="flex items-center gap-2 flex-wrap">
            <button
              (click)="imprimerCarnet()"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAF9] text-[#0F4C3A] rounded-lg border border-[#CBD5D1] hover:bg-[#E8F3EE] transition-colors text-xs font-semibold whitespace-nowrap cursor-pointer shadow-2xs">
              <span class="material-symbols-outlined text-[16px]">print</span>
              <span>Imprimer Carnet</span>
            </button>
            <button
              (click)="redigerOrdonnance()"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAF9] text-[#0F4C3A] rounded-lg border border-[#CBD5D1] hover:bg-[#E8F3EE] transition-colors text-xs font-semibold whitespace-nowrap cursor-pointer shadow-2xs">
              <span class="material-symbols-outlined text-[16px]">edit_note</span>
              <span>Rédiger Ordonnance</span>
            </button>
            <button
              (click)="lancerExamenClinique()"
              class="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0F4C3A] text-white rounded-lg hover:bg-[#266A54] shadow-sm transition-all text-xs font-semibold whitespace-nowrap cursor-pointer active:scale-95">
              <span class="material-symbols-outlined text-[18px]">play_circle</span>
              <span>Lancer Examen Clinique</span>
            </button>
          </div>
        </div>

        <!-- Sous-ruban Drapeaux Cliniques Clés -->
        <div class="mt-2 pt-2 border-t border-[#CBD5D1]/60 flex items-center justify-between text-xs flex-wrap gap-2">
          <div class="flex items-center gap-4 flex-wrap">
            <div class="flex items-center gap-1">
              <span class="text-[#404944] font-medium">Groupe Sanguin:</span>
              <span class="font-bold text-[#0F4C3A] bg-[#E8F3EE] px-1.5 py-0.5 rounded whitespace-nowrap">
                {{ d.patient.groupeSanguin }}
              </span>
            </div>
            <div class="flex items-center gap-1">
              <span class="text-[#404944] font-medium">Périmètre Brachial (PB):</span>
              <span class="font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded whitespace-nowrap">
                {{ d.patient.pbMm }}&nbsp;mm ({{ d.patient.statutPbLabel }})
              </span>
            </div>
            <div class="flex items-center gap-1">
              <span class="text-[#404944] font-medium">Poids actuel:</span>
              <span class="font-bold text-[#0C1F18] whitespace-nowrap">{{ d.patient.poidsActuelKg }}&nbsp;kg</span>
              <span class="text-red-600 font-medium whitespace-nowrap">({{ d.patient.zScorePoids }})</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="text-[#404944] font-medium">Alimentation:</span>
              <span class="text-[#0C1F18] whitespace-nowrap">{{ d.patient.regimeAlimentaire }}</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="text-[#404944] font-medium">Poids naissance:</span>
              <span class="text-[#0C1F18] whitespace-nowrap">{{ d.patient.poidsNaissanceKg }}&nbsp;kg ({{ d.patient.mentionNaissance }})</span>
            </div>
          </div>

          <!-- Allergy Banner Pin -->
          <div *ngIf="d.patient.hasAllergie"
               class="flex items-center gap-1.5 text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded whitespace-nowrap">
            <span class="material-symbols-outlined text-[15px]">report</span>
            <span class="font-semibold">{{ d.patient.allergieTitre }} ({{ d.patient.allergieDetail }})</span>
          </div>
        </div>
      </section>

      <!-- =================================================================== -->
      <!-- 4. CLINICAL SUB-NAVIGATION / SECTION TABS                           -->
      <!-- =================================================================== -->
      <nav class="bg-[#F4F7F5] border border-[#CBD5D1] rounded-lg px-2 py-1 flex items-center gap-1 overflow-x-auto">
        <button
          (click)="setTab('vue360')"
          [ngClass]="getTabClasses('vue360')"
          class="px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
          <span class="material-symbols-outlined text-[16px]">visibility</span>
          <span>Vue d'ensemble 360°</span>
        </button>

        <button
          (click)="setTab('courbes')"
          [ngClass]="getTabClasses('courbes')"
          class="px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
          <span class="material-symbols-outlined text-[16px]">monitoring</span>
          <span>Courbes de Croissance OMS</span>
        </button>

        <button
          (click)="setTab('antecedents')"
          [ngClass]="getTabClasses('antecedents')"
          class="px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
          <span class="material-symbols-outlined text-[16px]">child_care</span>
          <span>Antécédents Néonatals</span>
        </button>

        <button
          (click)="setTab('vaccins')"
          [ngClass]="getTabClasses('vaccins')"
          class="px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
          <span class="material-symbols-outlined text-[16px]">vaccines</span>
          <span>Statut Vaccinal PEV</span>
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
        </button>

        <button
          (click)="setTab('timeline')"
          [ngClass]="getTabClasses('timeline')"
          class="px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
          <span class="material-symbols-outlined text-[16px]">history_edu</span>
          <span>Historique Agent de Santé</span>
          <span class="bg-[#DDF3E8] text-[#0F4C3A] font-semibold text-[10px] px-1.5 py-0.2 rounded-full whitespace-nowrap">
            {{ d.totalVisites }}&nbsp;visites
          </span>
        </button>
      </nav>

      <!-- =================================================================== -->
      <!-- 5. MAIN CONTENT CANVAS (4 HIGH-DENSITY CLINICAL SECTIONS)           -->
      <!-- =================================================================== -->

      <!-- SECTION A: COURBES DE CROISSANCE (WHO / OMS) - CHART.JS OFFICIEL -->
      <section class="bg-white rounded-xl border border-[#CBD5D1] p-4 shadow-xs">
        <!-- Header with Toggles -->
        <div class="flex flex-wrap items-center justify-between border-b border-[#CBD5D1]/60 pb-3 mb-3 gap-2">
          <div class="flex items-center gap-2">
            <div class="p-1.5 rounded-lg bg-[#E8F3EE] text-[#0F4C3A]">
              <span class="material-symbols-outlined text-[20px]">trending_down</span>
            </div>
            <div>
              <h2 class="text-base font-bold text-[#0C1F18] text-balance">
                {{ d.croissance.standardReference }}
              </h2>
              <p class="text-xs text-[#404944] text-pretty">
                {{ d.croissance.sousTitre }}
              </p>
            </div>
          </div>

          <!-- Metric Toggle Pill Group -->
          <div class="flex items-center bg-[#F4F7F5] p-1 rounded-lg border border-[#CBD5D1] text-xs font-semibold gap-1">
            <button
              (click)="setMetric('poids')"
              [ngClass]="activeMetric() === 'poids' ? 'bg-[#0F4C3A] text-white font-bold shadow-xs' : 'text-[#404944] hover:text-[#0F4C3A]'"
              class="px-3 py-1 rounded transition-colors whitespace-nowrap cursor-pointer">
              Poids-pour-Âge
            </button>
            <button
              (click)="setMetric('taille')"
              [ngClass]="activeMetric() === 'taille' ? 'bg-[#0F4C3A] text-white font-bold shadow-xs' : 'text-[#404944] hover:text-[#0F4C3A]'"
              class="px-3 py-1 rounded transition-colors whitespace-nowrap cursor-pointer">
              Taille-pour-Âge
            </button>
            <button
              (click)="setMetric('pb')"
              [ngClass]="activeMetric() === 'pb' ? 'bg-[#0F4C3A] text-white font-bold shadow-xs' : 'text-[#404944] hover:text-[#0F4C3A]'"
              class="px-3 py-1 rounded transition-colors whitespace-nowrap cursor-pointer">
              Périmètre Brachial (PB)
            </button>
            <button
              (click)="setMetric('pt')"
              [ngClass]="activeMetric() === 'pt' ? 'bg-[#0F4C3A] text-white font-bold shadow-xs' : 'text-[#404944] hover:text-[#0F4C3A]'"
              class="px-3 py-1 rounded transition-colors whitespace-nowrap cursor-pointer">
              Poids-pour-Taille
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">

          <!-- Growth Chart Canvas Visualization (8 cols) -->
          <div class="lg:col-span-8 flex flex-col justify-between bg-[#F8FAF9] rounded-lg border border-[#CBD5D1] p-3">
            <!-- Chart Legend -->
            <div class="flex items-center justify-between text-[11px] font-medium text-[#404944] mb-2 flex-wrap gap-2">
              <div class="flex items-center gap-3 flex-wrap">
                <span class="flex items-center gap-1 whitespace-nowrap">
                  <span class="w-3 h-0.5 bg-[#0F4C3A] inline-block"></span> Poids Patient (kg)
                </span>
                <span class="flex items-center gap-1 whitespace-nowrap">
                  <span class="w-3 h-0.5 bg-emerald-600 inline-block border-t border-dashed"></span> Médiane OMS (0 SD)
                </span>
                <span class="flex items-center gap-1 whitespace-nowrap">
                  <span class="w-3 h-2 bg-amber-100 border border-amber-300 inline-block"></span> Seuil MAM (-2 SD)
                </span>
                <span class="flex items-center gap-1 whitespace-nowrap">
                  <span class="w-3 h-2 bg-red-100 border border-red-300 inline-block"></span> Seuil MAS (-3 SD)
                </span>
              </div>
              <span class="font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded whitespace-nowrap">
                Cassure de la courbe observée à M6-M8
              </span>
            </div>

            <!-- HTML5 CANVAS FOR CHART.JS (Standard Protocole 13) -->
            <div class="w-full h-64 relative">
              <canvas #growthCanvas></canvas>
            </div>

            <!-- Footer Summary of the Chart -->
            <div class="flex items-center justify-between text-[11px] pt-2 border-t border-[#CBD5D1]/60 text-[#404944] flex-wrap gap-1">
              <span class="text-pretty">{{ d.croissance.commentaireVitesse }}</span>
              <span class="text-red-600 font-semibold flex items-center gap-1 whitespace-nowrap">
                <span class="material-symbols-outlined text-[14px]">error</span>
                <span>{{ d.croissance.alerteClinique }}</span>
              </span>
            </div>
          </div>

          <!-- Current Anthropometric Vitals Card (4 cols) -->
          <div class="lg:col-span-4 flex flex-col justify-between bg-[#F4F7F5] rounded-lg border border-[#CBD5D1] p-3 space-y-3">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs uppercase tracking-wider text-[#0F4C3A] font-bold whitespace-nowrap">Biométrie du Jour</span>
                <span class="bg-amber-100 text-amber-900 border border-amber-300 text-xs px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                  Alerte MAM
                </span>
              </div>

              <!-- 4 Vitals Grid -->
              <div class="grid grid-cols-2 gap-2">
                <!-- Poids -->
                <div class="bg-white p-2.5 rounded-lg border border-[#CBD5D1] shadow-2xs">
                  <div class="text-[11px] text-[#404944] font-medium whitespace-nowrap">Poids Actuel</div>
                  <div class="text-[20px] font-bold text-red-600 mt-0.5 whitespace-nowrap">
                    {{ d.biometrie.poidsKg }} <span class="text-xs font-normal text-[#404944]">kg</span>
                  </div>
                  <div class="text-[10px] text-red-600 font-semibold mt-0.5 whitespace-nowrap">{{ d.biometrie.zScorePoids }}</div>
                </div>

                <!-- Taille -->
                <div class="bg-white p-2.5 rounded-lg border border-[#CBD5D1] shadow-2xs">
                  <div class="text-[11px] text-[#404944] font-medium whitespace-nowrap">Taille Couchée</div>
                  <div class="text-[20px] font-bold text-[#0F4C3A] mt-0.5 whitespace-nowrap">
                    {{ d.biometrie.tailleCm }} <span class="text-xs font-normal text-[#404944]">cm</span>
                  </div>
                  <div class="text-[10px] text-[#266A54] font-semibold mt-0.5 whitespace-nowrap">{{ d.biometrie.zScoreTaille }}</div>
                </div>

                <!-- Périmètre Brachial (MUAC) -->
                <div class="bg-amber-50 p-2.5 rounded-lg border border-amber-300 shadow-2xs">
                  <div class="text-[11px] text-amber-900 font-semibold whitespace-nowrap">Périmètre Brachial (PB)</div>
                  <div class="text-[20px] font-bold text-amber-800 mt-0.5 whitespace-nowrap">
                    {{ d.biometrie.pbMm }} <span class="text-xs font-normal text-amber-900">mm</span>
                  </div>
                  <div class="text-[10px] font-bold text-amber-700 mt-0.5 whitespace-nowrap">{{ d.biometrie.statutRubanShakir }}</div>
                </div>

                <!-- Périmètre Crânien -->
                <div class="bg-white p-2.5 rounded-lg border border-[#CBD5D1] shadow-2xs">
                  <div class="text-[11px] text-[#404944] font-medium whitespace-nowrap">Périmètre Crânien</div>
                  <div class="text-[20px] font-bold text-[#0F4C3A] mt-0.5 whitespace-nowrap">
                    {{ d.biometrie.perimetreCranienCm }} <span class="text-xs font-normal text-[#404944]">cm</span>
                  </div>
                  <div class="text-[10px] text-[#266A54] font-semibold mt-0.5 whitespace-nowrap">{{ d.biometrie.percentilePc }}</div>
                </div>
              </div>
            </div>

            <!-- Interpretation Note -->
            <div class="bg-white p-2.5 rounded-lg border-l-4 border-amber-500 border border-[#CBD5D1]">
              <div class="flex items-center gap-1 text-[11px] font-bold text-amber-800 mb-1">
                <span class="material-symbols-outlined text-[15px]">info</span>
                <span>Interprétation Pédiatrique :</span>
              </div>
              <p class="text-xs text-[#0C1F18] leading-relaxed text-pretty">
                "{{ d.biometrie.interpretationPediatrique }}"
              </p>
            </div>

            <!-- Fast CTA -->
            <button
              (click)="ajusterProtocole()"
              class="w-full bg-[#0F4C3A] text-white py-2 px-3 rounded-lg text-xs font-semibold hover:bg-[#266A54] active:scale-98 flex items-center justify-center gap-1.5 transition-all shadow-xs whitespace-nowrap cursor-pointer">
              <span class="material-symbols-outlined text-[16px]">sync_alt</span>
              <span>{{ d.biometrie.actionProtocoleRecommandee }}</span>
            </button>
          </div>

        </div>
      </section>

      <!-- SECTION B & SECTION C: 2-COLUMN BALANCED DENSE GRID -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">

        <!-- SECTION B: ANTÉCÉDENTS NÉONATALS & PÉRINATAUX (6 cols) -->
        <section class="lg:col-span-6 bg-white rounded-xl border border-[#CBD5D1] p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between border-b border-[#CBD5D1]/60 pb-2.5 mb-3">
              <div class="flex items-center gap-2">
                <div class="p-1.5 rounded-lg bg-[#E8F3EE] text-[#0F4C3A]">
                  <span class="material-symbols-outlined text-[18px]">crib</span>
                </div>
                <div>
                  <h2 class="text-sm font-bold text-[#0C1F18] text-balance">Antécédents Néonatals &amp; Périnataux</h2>
                  <p class="text-[11px] text-[#404944] text-pretty">Données d'accouchement, période néonatale &amp; statut maternel</p>
                </div>
              </div>
              <span class="bg-[#DDF3E8] text-[#0F4C3A] font-bold text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap">
                {{ d.antecedents.materniteOrigine }}
              </span>
            </div>

            <!-- Lignes Données Clés -->
            <div class="divide-y divide-[#CBD5D1]/50 text-xs">
              <div class="py-2 flex justify-between items-center">
                <span class="text-[#404944] font-medium">Terme gestationnel</span>
                <span class="font-semibold text-[#0C1F18] whitespace-nowrap">{{ d.antecedents.termeGestationnel }}</span>
              </div>
              <div class="py-2 flex justify-between items-center">
                <span class="text-[#404944] font-medium">Poids &amp; Paramètres Naissance</span>
                <div class="text-right whitespace-nowrap">
                  <span class="font-bold text-[#0F4C3A]">{{ d.antecedents.poidsNaissanceG }}&nbsp;g</span>
                  <span class="text-[#404944] text-[11px] ml-1.5">| T: {{ d.antecedents.tailleNaissanceCm }}&nbsp;cm | PC: {{ d.antecedents.pcNaissanceCm }}&nbsp;cm</span>
                </div>
              </div>
              <div class="py-2 flex justify-between items-center">
                <span class="text-[#404944] font-medium">Score d'Apgar</span>
                <div class="flex items-center gap-2 whitespace-nowrap">
                  <span class="bg-[#E8F3EE] px-2 py-0.5 rounded font-mono font-bold text-[#0F4C3A]">{{ d.antecedents.scoreApgar1min }}</span>
                  <span class="material-symbols-outlined text-[14px] text-[#707974]">arrow_forward</span>
                  <span class="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-mono font-bold">{{ d.antecedents.scoreApgar5min }}</span>
                </div>
              </div>
              <div class="py-2 flex justify-between items-center">
                <span class="text-[#404944] font-medium">Mode d'accouchement</span>
                <span class="font-semibold text-[#0C1F18] whitespace-nowrap">{{ d.antecedents.modeAccouchement }}</span>
              </div>
              <div class="py-2 flex flex-col gap-1">
                <span class="text-[#404944] font-medium">Complications péri-natales</span>
                <div class="bg-amber-50/70 border border-amber-200 p-2 rounded text-[11px] text-amber-900 leading-snug text-pretty">
                  {{ d.antecedents.complicationsPerinatales }}
                </div>
              </div>
              <div class="py-2 flex flex-col gap-1">
                <span class="text-[#404944] font-medium">Histoire Alimentaire &amp; Diversification</span>
                <p class="text-[11px] text-[#0C1F18] leading-snug text-pretty">
                  {{ d.antecedents.histoireAlimentaire }}
                </p>
              </div>

              <!-- Sérologies Maternelles -->
              <div class="py-2">
                <div class="text-[10px] text-[#404944] font-semibold uppercase tracking-wider mb-1.5 whitespace-nowrap">
                  Sérologies Maternelles (Dépistage CPN 3)
                </div>
                <div class="grid grid-cols-3 gap-2 text-center text-xs">
                  <div class="bg-emerald-50 text-emerald-800 border border-emerald-200 py-1 rounded whitespace-nowrap">
                    VIH: <strong>{{ d.antecedents.serologieVih }}</strong>
                  </div>
                  <div class="bg-emerald-50 text-emerald-800 border border-emerald-200 py-1 rounded whitespace-nowrap">
                    RPR: <strong>{{ d.antecedents.serologieSyphilis }}</strong>
                  </div>
                  <div class="bg-emerald-50 text-emerald-800 border border-emerald-200 py-1 rounded whitespace-nowrap">
                    HBsAg: <strong>{{ d.antecedents.serologieHbsAg }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer verification -->
          <div class="mt-3 pt-2.5 border-t border-[#CBD5D1] flex items-center justify-between text-[11px] text-[#707974] flex-wrap gap-1">
            <span>Certifié par: {{ d.antecedents.certifiePar }}</span>
            <span class="flex items-center gap-1 text-[#0F4C3A] font-semibold whitespace-nowrap">
              <span class="material-symbols-outlined text-[14px]">verified</span>
              <span>Registre CPN Validé</span>
            </span>
          </div>
        </section>

        <!-- SECTION C: STATUT VACCINAL PEV (6 cols) -->
        <section class="lg:col-span-6 bg-white rounded-xl border border-[#CBD5D1] p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between border-b border-[#CBD5D1]/60 pb-2.5 mb-3">
              <div class="flex items-center gap-2">
                <div class="p-1.5 rounded-lg bg-[#E8F3EE] text-[#0F4C3A]">
                  <span class="material-symbols-outlined text-[18px]">vaccines</span>
                </div>
                <div>
                  <h2 class="text-sm font-bold text-[#0C1F18] text-balance">Statut Vaccinal PEV Sénégal</h2>
                  <p class="text-[11px] text-[#404944] text-pretty">Programme Élargi de Vaccination • Calendrier National Pédiatrique</p>
                </div>
              </div>

              <!-- Coverage Badge -->
              <div class="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap">
                <span class="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
                <span>{{ d.vaccination.statutCouvertureLabel }}</span>
              </div>
            </div>

            <!-- Tableau Doses PEV -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="bg-[#F8FAF9] text-[#404944] font-semibold border-b border-[#CBD5D1]">
                    <th class="py-1.5 px-2 whitespace-nowrap">Âge Prévu</th>
                    <th class="py-1.5 px-2">Antigènes / Vaccins</th>
                    <th class="py-1.5 px-2 whitespace-nowrap">Date Réelle</th>
                    <th class="py-1.5 px-2 text-right whitespace-nowrap">Statut</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#CBD5D1]/50">
                  <tr *ngFor="let dose of d.vaccination.doses"
                      [ngClass]="dose.statut === 'A_VENIR' ? 'bg-amber-50 border-l-2 border-amber-500' : ''"
                      class="hover:bg-[#F4F7F5] transition-colors">
                    <td class="py-2 px-2 font-bold whitespace-nowrap"
                        [ngClass]="dose.statut === 'VALIDE' ? 'text-[#0F4C3A]' : 'text-amber-900'">
                      {{ dose.agePrevu }}
                    </td>
                    <td class="py-2 px-2">
                      <div class="font-medium text-[#0C1F18]">{{ dose.nomAntigenes }}</div>
                      <div class="text-[10px] text-[#707974]">{{ dose.descriptionMaladies }}</div>
                    </td>
                    <td class="py-2 px-2 font-mono text-[11px] text-[#404944] whitespace-nowrap">
                      {{ dose.dateReelle }}
                    </td>
                    <td class="py-2 px-2 text-right whitespace-nowrap">
                      <span
                        *ngIf="dose.statut === 'VALIDE'"
                        class="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold border border-emerald-200">
                        {{ dose.badgeLabel }}
                      </span>
                      <span
                        *ngIf="dose.statut === 'A_VENIR'"
                        class="inline-flex items-center gap-1 text-amber-900 bg-amber-100 px-2 py-0.5 rounded text-[11px] font-bold border border-amber-300">
                        {{ dose.badgeLabel }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Supplementation & Deworming -->
            <div class="mt-3 p-2 bg-[#F4F7F5] rounded-lg flex items-center justify-between text-[11px] border border-[#CBD5D1]/60 flex-wrap gap-1">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[#0F4C3A] text-[16px]">medication</span>
                <span><strong>Supplémentation:</strong> {{ d.vaccination.supplementationVitA }}</span>
              </div>
              <span class="text-[#404944]">{{ d.vaccination.mebendazoleStatut }}</span>
            </div>
          </div>

          <!-- PEV Action Button -->
          <div class="mt-3 pt-2.5 border-t border-[#CBD5D1] flex items-center justify-between flex-wrap gap-1">
            <span class="text-[11px] text-[#404944]">Dernière vérification: {{ d.vaccination.derniereVerification }}</span>
            <button
              (click)="enregistrerDose()"
              class="text-[#0F4C3A] font-bold text-xs hover:underline flex items-center gap-1 whitespace-nowrap cursor-pointer">
              <span class="material-symbols-outlined text-[15px]">add_circle</span>
              <span>Enregistrer Dose Exceptionnelle</span>
            </button>
          </div>
        </section>

      </div>

      <!-- SECTION D: HISTORIQUE AGENT DE SANTÉ & SUIVI COMMUNAUTAIRE (TIMELINE) -->
      <section class="bg-white rounded-xl border border-[#CBD5D1] p-4 shadow-xs">
        <div class="flex items-center justify-between border-b border-[#CBD5D1]/60 pb-2.5 mb-4 flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <div class="p-1.5 rounded-lg bg-[#E8F3EE] text-[#0F4C3A]">
              <span class="material-symbols-outlined text-[18px]">person_pin_circle</span>
            </div>
            <div>
              <h2 class="text-sm font-bold text-[#0C1F18] text-balance">Historique Agent de Santé &amp; Suivi Communautaire</h2>
              <p class="text-[11px] text-[#404944] text-pretty">
                Liaison terrain continue: Relais communautaires Badienou Gox, infirmières de poste &amp; visites à domicile
              </p>
            </div>
          </div>

          <!-- Filter Timeline -->
          <div class="flex items-center gap-1 text-xs">
            <span class="text-[#707974] mr-1">Filtrer:</span>
            <button
              (click)="setTimelineFilter('TOUS')"
              [ngClass]="timelineFilter() === 'TOUS' ? 'bg-[#0F4C3A] text-white font-bold' : 'bg-[#F4F7F5] text-[#404944] hover:bg-gray-200'"
              class="px-2.5 py-1 rounded text-[11px] transition-colors whitespace-nowrap cursor-pointer">
              Toutes les notes
            </button>
            <button
              (click)="setTimelineFilter('ATPE')"
              [ngClass]="timelineFilter() === 'ATPE' ? 'bg-[#0F4C3A] text-white font-bold' : 'bg-[#F4F7F5] text-[#404944] hover:bg-gray-200'"
              class="px-2.5 py-1 rounded text-[11px] transition-colors whitespace-nowrap cursor-pointer">
              Visites ATPE
            </button>
            <button
              (click)="setTimelineFilter('PB')"
              [ngClass]="timelineFilter() === 'PB' ? 'bg-[#0F4C3A] text-white font-bold' : 'bg-[#F4F7F5] text-[#404944] hover:bg-gray-200'"
              class="px-2.5 py-1 rounded text-[11px] transition-colors whitespace-nowrap cursor-pointer">
              Dépistage PB
            </button>
          </div>
        </div>

        <!-- Vertical Timeline Component -->
        <div class="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#CBD5D1]">
          <div
            *ngFor="let item of timelineFiltree()"
            class="relative group">

            <!-- Puce Icone Timeline -->
            <div
              [ngClass]="getTimelineDotClasses(item.badgeType)"
              class="absolute -left-[27px] top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold shadow-xs">
              {{ item.puceIcone }}
            </div>

            <div class="bg-[#F8FAF9] rounded-lg p-3 border border-[#CBD5D1] hover:border-[#0F4C3A]/60 transition-colors shadow-2xs">
              <div class="flex flex-wrap items-center justify-between gap-1 mb-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-bold text-[#0F4C3A] text-xs">{{ item.titre }}</span>
                  <span
                    [ngClass]="getTimelineBadgeClasses(item.badgeType)"
                    class="text-[10px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                    {{ item.badgeStatut }}
                  </span>
                </div>

                <div class="flex items-center gap-2 text-[11px] text-[#404944] whitespace-nowrap">
                  <span class="material-symbols-outlined text-[14px]">schedule</span>
                  <span class="font-medium">{{ item.dateLabel }}</span>
                  <span>•</span>
                  <span class="font-semibold text-[#0F4C3A]">{{ item.acteurNom }} ({{ item.acteurRole }})</span>
                </div>
              </div>

              <p class="text-xs text-[#0C1F18] leading-relaxed text-pretty">
                "{{ item.description }}"
              </p>

              <div class="mt-2 flex items-center gap-4 text-[10px] text-[#707974] pt-1.5 border-t border-[#CBD5D1]/60 flex-wrap">
                <span>Transmission: <strong>{{ item.transmissionCanal }}</strong></span>
                <span>Synchronisation: {{ item.synchronisation }}</span>
                <span class="text-[#266A54] font-medium">{{ item.validation }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  `
})
export class DossierPatientViewComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('growthCanvas') growthCanvas?: ElementRef<HTMLCanvasElement>;

  private readonly dossierService = inject(MedecinDossierService);

  readonly isLoading = signal<boolean>(true);
  readonly hasError = signal<boolean>(false);
  readonly data = signal<DossierPatient360 | null>(null);

  readonly activeTab = signal<TabDossier>('vue360');
  readonly activeMetric = signal<MetricCourbe>('poids');
  readonly timelineFilter = signal<FiltreTimeline>('TOUS');

  private chartInstance?: Chart<'line', (number | null)[], string>;

  // Le dossier n'est affichable que si l'identité patient est bien présente,
  // sinon le rendu plantait sur d.patient.avatarUrl.
  readonly dossierComplet = computed(() => {
    const d = this.data();
    return (d && d.patient) ? d : null;
  });

  readonly timelineFiltree = computed(() => {
    const d = this.data();
    if (!d) return [];
    const filter = this.timelineFilter();
    if (filter === 'ATPE') {
      return d.timeline.filter(t => t.titre.includes('ATPE'));
    }
    if (filter === 'PB') {
      return d.timeline.filter(t => t.titre.includes('PB') || t.titre.includes('Dépistage'));
    }
    return d.timeline;
  });

  ngOnInit(): void {
    this.chargerDossier();
  }

  ngAfterViewInit(): void {
    // Initialisation Chart.js dès que le template et les données sont prêts
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  chargerDossier(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.dossierService.getDossierActif().subscribe({
      next: (res: DossierPatient360) => {
        this.data.set(res);
        this.isLoading.set(false);
        // Laisser le cycle Angular afficher le canvas avant d'initialiser Chart.js
        setTimeout(() => this.initChart(), 50);
      },
      error: (err: unknown) => {
        console.error('Erreur chargement dossier 360:', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  setTab(tab: TabDossier): void {
    this.activeTab.set(tab);
  }

  setMetric(metric: MetricCourbe): void {
    this.activeMetric.set(metric);
    this.initChart();
  }

  setTimelineFilter(filter: FiltreTimeline): void {
    this.timelineFilter.set(filter);
  }

  private initChart(): void {
    if (!this.growthCanvas?.nativeElement) return;
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const d = this.data();
    if (!d) return;

    const points = d.croissance.points;
    const labels = points.map(p => p.ageMoisLabel);
    const poidsReel = points.map(p => p.poidsReelKg);
    const z0 = points.map(p => p.z0MedianeKg);
    const zMoins2 = points.map(p => p.zMoins2MamKg);
    const zMoins3 = points.map(p => p.zMoins3MasKg);

    const ctx = this.growthCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Poids Patient (kg)',
            data: poidsReel,
            borderColor: '#0F4C3A',
            backgroundColor: '#0F4C3A',
            borderWidth: 3.5,
            pointRadius: (ctxItem) => {
              const idx = ctxItem.dataIndex;
              return idx === 4 ? 7 : idx === 3 ? 6 : 5;
            },
            pointBackgroundColor: (ctxItem) => {
              const idx = ctxItem.dataIndex;
              if (idx === 4) return '#DC2626'; // Rouge pour M8
              if (idx === 3) return '#D97706'; // Ambre pour M6
              return '#0F4C3A';
            },
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            tension: 0.2,
            fill: false
          },
          {
            label: 'Médiane OMS (0 SD)',
            data: z0,
            borderColor: '#059669',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false
          },
          {
            label: 'Seuil MAM (-2 SD)',
            data: zMoins2,
            borderColor: '#D97706',
            borderWidth: 1.5,
            borderDash: [3, 3],
            pointRadius: 0,
            fill: false
          },
          {
            label: 'Zone MAS (-3 SD)',
            data: zMoins3,
            borderColor: '#DC2626',
            borderWidth: 1.5,
            borderDash: [2, 2],
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#0F4C3A',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            padding: 10,
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.parsed.y} kg`
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: '#E2E8E5'
            },
            ticks: {
              font: {
                size: 11
              },
              color: '#404944'
            }
          },
          y: {
            min: 1.5,
            max: 10,
            grid: {
              color: '#E2E8E5'
            },
            ticks: {
              stepSize: 1,
              callback: (value) => `${value} kg`,
              font: {
                size: 11
              },
              color: '#404944'
            }
          }
        }
      }
    });
  }

  imprimerCarnet(): void {
    window.print();
  }

  redigerOrdonnance(): void {
    alert('📋 Ouverture du module de Prescription Numérique pour Moussa Diop.');
  }

  lancerExamenClinique(): void {
    alert('🩺 Démarrage de la consultation clinique approfondie au Cabinet 04.');
  }

  ajusterProtocole(): void {
    alert('🔄 Ajustement de la ration journalière Plumpy\'Nut : 2.5 sachets/jour + contrôle hydratation.');
  }

  enregistrerDose(): void {
    alert('💉 Enregistrement d\'une dose vaccinale dans le carnet PEV informatisé.');
  }

  getTabClasses(tab: TabDossier): string {
    return this.activeTab() === tab
      ? 'bg-white text-[#0F4C3A] font-bold shadow-xs border border-[#CBD5D1]'
      : 'text-[#404944] hover:text-[#0F4C3A] hover:bg-white/60';
  }

  getTimelineDotClasses(type: string): string {
    if (type === 'DANGER') return 'bg-red-600';
    if (type === 'WARNING') return 'bg-amber-500';
    if (type === 'SUCCESS') return 'bg-emerald-600';
    return 'bg-gray-500';
  }

  getTimelineBadgeClasses(type: string): string {
    if (type === 'DANGER') return 'bg-red-100 text-red-700 border border-red-200';
    if (type === 'WARNING') return 'bg-amber-100 text-amber-800 border border-amber-300';
    if (type === 'SUCCESS') return 'bg-emerald-50 text-emerald-800 border border-emerald-200';
    return 'bg-[#E8F3EE] text-[#0F4C3A]';
  }
}
