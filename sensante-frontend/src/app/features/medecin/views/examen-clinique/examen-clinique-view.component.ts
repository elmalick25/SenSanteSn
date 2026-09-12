import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MedecinExamenService } from '../../services/medecin-examen.service';
import {
  ExamenCliniquePcime,
  SigneDangerItem,
  ValiderExamenRequest,
  ValiderExamenResponse
} from '../../models/medecin-examen.model';

@Component({
  selector: 'app-examen-clinique-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- ================================================================= -->
    <!-- 4 ÉTATS UI : LOADING / ERROR / EMPTY / SUCCESS                    -->
    <!-- ================================================================= -->

    <!-- 1. LOADING SKELETON -->
    <div *ngIf="isLoading()" class="space-y-4 animate-pulse p-4">
      <!-- Header Skeleton -->
      <div class="bg-white rounded-xl border border-[#DCE5E0] p-4 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-[#D2E8DC]"></div>
          <div class="space-y-2">
            <div class="h-5 bg-[#D2E8DC] rounded w-48"></div>
            <div class="h-3 bg-[#D2E8DC] rounded w-64"></div>
          </div>
        </div>
        <div class="flex gap-2">
          <div class="w-24 h-12 bg-[#D2E8DC] rounded-lg"></div>
          <div class="w-28 h-12 bg-[#D2E8DC] rounded-lg"></div>
          <div class="w-20 h-12 bg-[#D2E8DC] rounded-lg"></div>
          <div class="w-20 h-12 bg-[#D2E8DC] rounded-lg"></div>
        </div>
      </div>

      <!-- Subheader Skeleton -->
      <div class="h-8 bg-[#EDF6F1] rounded-lg border border-[#DCE5E0]"></div>

      <!-- 3 Columns Skeleton -->
      <div class="grid grid-cols-1 lg:grid-cols-10 gap-4">
        <div class="lg:col-span-3 bg-white rounded-xl border border-[#DCE5E0] p-4 h-96"></div>
        <div class="lg:col-span-3 bg-white rounded-xl border border-[#DCE5E0] p-4 h-96"></div>
        <div class="lg:col-span-4 bg-white rounded-xl border border-[#DCE5E0] p-4 h-96"></div>
      </div>
    </div>

    <!-- 2. ERROR STATE -->
    <div *ngIf="hasError() && !isLoading()"
         class="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center p-6 bg-white rounded-2xl border border-red-200 m-4 shadow-sm">
      <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-[#BA1A1A]">
        <span class="material-symbols-outlined text-3xl">error_outline</span>
      </div>
      <h2 class="text-xl font-bold text-[#0C1F18] text-balance">Échec de chargement de l'Examen Clinique PCIME</h2>
      <p class="text-sm text-[#404944] max-w-md text-pretty">
        Impossible de synchroniser l'arbre décisionnel pédiatrique avec le serveur central.
      </p>
      <button
        (click)="chargerExamen()"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F4C3A] text-white rounded-lg text-sm font-semibold hover:bg-[#003426] transition-colors whitespace-nowrap shadow-sm">
        <span class="material-symbols-outlined text-base">refresh</span>
        <span>Réessayer la synchronisation</span>
      </button>
    </div>

    <!-- 3. SUCCESS STATE : INTERFACE COMPLÈTE CONFORME MAQUETTE -->
    <div *ngIf="!isLoading() && !hasError() && examen() as ex" class="flex flex-col min-h-screen bg-[#F4F7F5] text-[#0C1F18]">

      <!-- =============================================================== -->
      <!-- TOP HEADER / PATIENT BAR                                        -->
      <!-- =============================================================== -->
      <header class="bg-white border-b border-[#DCE5E0] px-4 py-2.5 flex-shrink-0 z-20 shadow-sm">
        <div class="w-full flex flex-wrap items-center justify-between gap-y-2">

          <!-- Patient Identity Block -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-[#ACF1D5] text-[#0F4C3A] font-bold text-sm flex items-center justify-center border border-[#ACF1D5] shadow-sm flex-shrink-0">
              {{ getInitials(ex.patient.nomComplet) }}
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-base font-bold text-[#0C1F18] tracking-tight text-balance">{{ ex.patient.nomComplet }}</span>
                <span class="px-2 py-0.5 rounded-full bg-[#D7EDE2] text-[#0F4C3A] text-[11px] font-semibold whitespace-nowrap">
                  {{ ex.patient.ageLabel }}
                </span>
                <span class="px-2 py-0.5 rounded-full bg-[#ACF1D5] text-[#00513D] text-[11px] font-mono font-semibold whitespace-nowrap">
                  NIP:&nbsp;{{ ex.patient.nip }}
                </span>
              </div>
              <div class="text-xs text-[#404944] flex items-center gap-2 mt-0.5 flex-wrap">
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px]">family_restroom</span>
                  Tutrice&nbsp;: <strong class="font-medium text-[#0C1F18]">{{ ex.patient.tutriceNom }} ({{ ex.patient.tutriceLien }})</strong>
                </span>
                <span>•</span>
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px]">location_on</span>
                  {{ ex.patient.adresse }}
                </span>
              </div>
            </div>
          </div>

          <!-- Live Vitals Quick Metric Badges -->
          <div class="flex items-center gap-2 bg-[#F4F7F5] p-1 rounded-xl border border-[#DCE5E0] overflow-x-auto custom-scroll">
            <!-- Poids -->
            <div class="bg-white px-2.5 py-1 rounded-lg border border-[#DCE5E0]/70 min-w-[95px]">
              <span class="text-[10px] uppercase tracking-wider text-[#404944] font-semibold block whitespace-nowrap">Poids Actuel</span>
              <div class="flex items-baseline gap-1">
                <span class="text-lg font-bold text-[#0C1F18]">{{ ex.patient.poidsActuelKg | number:'1.3-3' }}</span>
                <span class="text-[10px] text-[#707974]">kg</span>
              </div>
              <span class="text-[10px] font-semibold text-[#BA1A1A] block whitespace-nowrap">Z:&nbsp;-2.1&nbsp;SD</span>
            </div>

            <!-- Périmètre Brachial (PB) MAM Alert -->
            <div class="bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 min-w-[115px]">
              <div class="flex items-center justify-between gap-1">
                <span class="text-[10px] uppercase tracking-wider text-amber-900 font-semibold whitespace-nowrap">Périmètre Brachial</span>
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0"></span>
              </div>
              <div class="flex items-baseline gap-1">
                <span class="text-lg font-bold text-amber-900">{{ ex.pbMesureMm }}</span>
                <span class="text-[10px] text-amber-800">mm</span>
              </div>
              <span class="text-[10px] font-bold text-amber-700 block whitespace-nowrap">MAM (115-124mm)</span>
            </div>

            <!-- Température -->
            <div class="bg-white px-2.5 py-1 rounded-lg border border-[#DCE5E0]/70 min-w-[85px]">
              <span class="text-[10px] uppercase tracking-wider text-[#404944] font-semibold block whitespace-nowrap">Temp.</span>
              <div class="flex items-baseline gap-1">
                <span class="text-lg font-bold text-[#0C1F18]">{{ ex.patient.temperatureC }}</span>
                <span class="text-[10px] text-[#707974]">°C</span>
              </div>
              <span class="text-[10px] text-[#266A54] font-medium block whitespace-nowrap">{{ ex.patient.temperatureLabel }}</span>
            </div>

            <!-- Fréq. Resp -->
            <div class="bg-white px-2.5 py-1 rounded-lg border border-[#DCE5E0]/70 min-w-[85px]">
              <span class="text-[10px] uppercase tracking-wider text-[#404944] font-semibold block whitespace-nowrap">Resp.</span>
              <div class="flex items-baseline gap-1">
                <span class="text-lg font-bold text-[#0C1F18]">{{ ex.patient.frequenceRespiratoire }}</span>
                <span class="text-[10px] text-[#707974]">/m</span>
              </div>
              <span class="text-[10px] text-[#266A54] font-medium block whitespace-nowrap">&lt;&nbsp;50/m&nbsp;OK</span>
            </div>
          </div>

          <!-- Consultation Status Tag & Action -->
          <div class="flex items-center gap-3">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ACF1D5]/40 text-[#0F4C3A] border border-[#ACF1D5] text-[11px] font-semibold whitespace-nowrap">
              <span class="w-2 h-2 rounded-full bg-[#0F4C3A] animate-ping"></span>
              Consultation Cabinet&nbsp;04 active
            </span>
            <button
              (click)="ouvrirAlerteTriage()"
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#BA1A1A] text-[#BA1A1A] bg-red-50 hover:bg-red-100 text-xs font-semibold transition-colors whitespace-nowrap"
              type="button">
              <span class="material-symbols-outlined text-[16px]">warning</span>
              <span>Alerte Triage</span>
            </button>
          </div>

        </div>
      </header>

      <!-- =============================================================== -->
      <!-- WORKSPACE FLOW SUB-HEADER / ALGORITHM BREADCRUMB               -->
      <!-- =============================================================== -->
      <div class="bg-[#EDF6F1] border-b border-[#DCE5E0] px-4 py-2 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
        <div class="flex items-center gap-2 text-xs">
          <span class="inline-flex items-center gap-1 font-bold text-[#0F4C3A] whitespace-nowrap">
            <span class="material-symbols-outlined text-[16px]">schema</span>
            {{ ex.protocoleTitre }}
          </span>
          <span class="text-[#707974]">/</span>
          <span class="text-[#404944] truncate">{{ ex.protocoleVersion }}</span>
        </div>
        <div class="flex items-center gap-3 text-[11px]">
          <span class="flex items-center gap-1 text-[#266A54] whitespace-nowrap">
            <span class="material-symbols-outlined text-[15px]">check_circle</span>
            {{ ex.synchronisationSource }}
          </span>
          <span class="px-2 py-0.5 rounded bg-[#D2E8DC] text-[#404944] font-mono whitespace-nowrap">
            Calculateur Z-Score OMS&nbsp;: Valide
          </span>
        </div>
      </div>

      <!-- =============================================================== -->
      <!-- 3-COLUMN CLINICAL DECISION FLOW LAYOUT                          -->
      <!-- =============================================================== -->
      <main class="flex-1 overflow-y-auto p-4 custom-scroll pb-24">
        <div class="w-full grid grid-cols-1 lg:grid-cols-10 gap-4 items-start">

          <!-- ============================================================= -->
          <!-- COLUMN 1 (30% -> 3 cols): Évaluation des Signes de Gravité  -->
          <!-- ============================================================= -->
          <section class="lg:col-span-3 space-y-3">

            <!-- Section Header Card -->
            <div class="bg-white rounded-xl border border-[#DCE5E0] p-3.5 shadow-sm">
              <div class="flex items-center justify-between border-b border-[#DCE5E0]/70 pb-2 mb-3">
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-[#0F4C3A] text-white flex items-center justify-center font-bold text-xs">1</span>
                  <h2 class="text-sm font-bold text-[#0C1F18] text-balance">Signes de Gravité &amp; Danger</h2>
                </div>
                <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold whitespace-nowrap">
                  {{ alerteCount() }}&nbsp;Alerte{{ alerteCount() > 1 ? 's' : '' }}
                </span>
              </div>

              <p class="text-xs text-[#404944] mb-3 text-pretty">
                Grille standardisée PCIME OMS&nbsp;: recherche active des critères formels d'évacuation d'urgence.
              </p>

              <!-- Status Pill Checklist Items -->
              <div class="space-y-2">
                <div
                  *ngFor="let s of ex.signesDanger"
                  (click)="toggleSigneDanger(s)"
                  [ngClass]="s.present ? 'border-2 border-amber-400 bg-amber-50/90 shadow-xs' : 'border border-[#DCE5E0] bg-[#EDF6F1]/40 hover:bg-[#EDF6F1]'"
                  class="p-2.5 rounded-lg flex items-start justify-between cursor-pointer transition-all">
                  <div class="pr-2">
                    <div class="flex items-center gap-1.5">
                      <span *ngIf="s.present" class="material-symbols-outlined text-amber-700 text-[16px]">error</span>
                      <span class="text-xs font-bold block" [ngClass]="s.present ? 'text-amber-950' : 'text-[#0C1F18]'">
                        {{ s.libelle }}
                      </span>
                    </div>
                    <span class="text-[11px] mt-0.5 block leading-tight text-pretty" [ngClass]="s.present ? 'text-amber-800' : 'text-[#404944]'">
                      {{ s.sousTitre }}
                    </span>
                  </div>
                  <span
                    [ngClass]="s.present ? 'bg-amber-200 text-amber-900' : 'bg-emerald-100 text-emerald-800'"
                    class="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5 whitespace-nowrap flex-shrink-0">
                    <span
                      [ngClass]="s.present ? 'bg-amber-600 animate-pulse' : 'bg-emerald-600'"
                      class="w-1.5 h-1.5 rounded-full"></span>
                    {{ s.present ? 'Présent' : 'Absent' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Secondary Exam Card: Oedèmes Kwashiorkor & Hydratation -->
            <div class="bg-white rounded-xl border border-[#DCE5E0] p-3.5 shadow-sm space-y-3">
              <div class="flex items-center justify-between border-b border-[#DCE5E0]/70 pb-2">
                <span class="text-sm font-bold text-[#0C1F18] flex items-center gap-1.5 text-balance">
                  <span class="material-symbols-outlined text-[#266A54] text-[18px]">water_drop</span>
                  Œdèmes &amp; Hydratation
                </span>
                <span class="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
                  {{ ex.oedemeHydratation.oedemesBilaterauxLabel }}
                </span>
              </div>

              <div class="grid grid-cols-1 gap-2 text-xs">
                <!-- Œdèmes bilatéraux (Kwashiorkor) -->
                <div class="p-2 rounded-lg bg-[#F4F7F5] border border-[#DCE5E0] flex items-center justify-between">
                  <div>
                    <span class="font-semibold text-[#0C1F18] block">Œdèmes bilatéraux du godet</span>
                    <span class="text-[11px] text-[#404944]">{{ ex.oedemeHydratation.godetTestDetails }}</span>
                  </div>
                  <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase whitespace-nowrap">
                    0 Œdème
                  </span>
                </div>

                <!-- Pli cutané abdominal -->
                <div class="p-2 rounded-lg bg-[#F4F7F5] border border-[#DCE5E0] flex items-center justify-between">
                  <div>
                    <span class="font-semibold text-[#0C1F18] block">Pli cutané abdominal</span>
                    <span class="text-[11px] text-[#404944]">{{ ex.oedemeHydratation.pliCutaneTestDetails }}</span>
                  </div>
                  <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold whitespace-nowrap">
                    {{ ex.oedemeHydratation.pliCutaneAbdominal }}
                  </span>
                </div>

                <!-- Diarrhée persistante déclarée -->
                <div class="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-amber-900 whitespace-nowrap">Diarrhée intermittente ({{ ex.oedemeHydratation.diarrheeJours }}j)</span>
                    <span class="text-[10px] font-bold text-amber-800 bg-amber-200 px-1.5 py-0.5 rounded whitespace-nowrap">{{ ex.oedemeHydratation.diarrheeType }}</span>
                  </div>
                  <p class="text-[11px] text-amber-800 mt-1 text-pretty">
                    {{ ex.oedemeHydratation.diarrheeDetails }}
                  </p>
                </div>
              </div>
            </div>

          </section>

          <!-- ============================================================= -->
          <!-- COLUMN 2 (30% -> 3 cols): Épreuve Nutritionnelle & Test ATPE -->
          <!-- ============================================================= -->
          <section class="lg:col-span-3 space-y-3">

            <!-- Main Big Visual Card: ATPE Protocol Test -->
            <div class="bg-white rounded-xl border-2 border-[#266A54] p-3.5 shadow-sm relative overflow-hidden">
              <div class="flex items-center justify-between border-b border-[#DCE5E0]/70 pb-2 mb-3">
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-[#266A54] text-white flex items-center justify-center font-bold text-xs">2</span>
                  <h2 class="text-sm font-bold text-[#0C1F18] text-balance">Test d'Appétit aux ATPE</h2>
                </div>
                <span class="px-2 py-0.5 rounded-full bg-[#ACF1D5] text-[#00513D] text-[10px] font-bold whitespace-nowrap">
                  Test Pivot OMS
                </span>
              </div>

              <!-- Active Visual Banner for Test Result -->
              <div class="bg-[#EDF6F1] rounded-xl border-2 border-[#0F4C3A] p-3.5 mb-3 text-center relative shadow-xs">
                <div class="w-12 h-12 mx-auto rounded-full bg-[#0F4C3A] text-white flex items-center justify-center mb-2 shadow">
                  <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'FILL' 1;">check</span>
                </div>
                <span class="text-base font-bold text-[#0F4C3A] block tracking-tight whitespace-nowrap">
                  {{ ex.testAppetit.statutBadge }}
                </span>
                <p class="text-xs font-medium text-[#266A54] mt-1 text-balance">
                  {{ ex.testAppetit.rationConsommeeLabel }}
                </p>
                <div class="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#266A54] rounded-full text-[11px] text-[#0F4C3A] font-semibold whitespace-nowrap shadow-xs">
                  <span class="material-symbols-outlined text-[14px]">timer</span>
                  {{ ex.testAppetit.observationDetails }}
                </div>
              </div>

              <!-- Protocol Execution Steps Card -->
              <div class="space-y-2 text-xs">
                <div class="p-2.5 rounded-lg bg-[#F4F7F5] border border-[#DCE5E0]">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-[#404944] block mb-1">Détails de l'Épreuve ATPE</span>
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div class="bg-white p-2 rounded border border-[#DCE5E0]/60">
                      <span class="text-[#707974] text-[10px] block whitespace-nowrap">Substance testée</span>
                      <span class="font-bold text-[#0C1F18] text-[11px] block">{{ ex.testAppetit.substanceTestee }}</span>
                    </div>
                    <div class="bg-white p-2 rounded border border-[#DCE5E0]/60">
                      <span class="text-[#707974] text-[10px] block whitespace-nowrap">Portion ingérée</span>
                      <span class="font-bold text-[#0F4C3A] text-[11px] block">{{ ex.testAppetit.portionIngeree }}</span>
                    </div>
                  </div>
                  <p class="text-[11px] text-[#404944] mt-2 italic leading-relaxed text-pretty">
                    {{ ex.testAppetit.observationClinique }}
                  </p>
                </div>

                <!-- Biometric Correlation Visual Matrix -->
                <div class="p-3 rounded-lg bg-white border border-[#DCE5E0] space-y-2">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-[#0F4C3A] flex items-center gap-1 whitespace-nowrap">
                    <span class="material-symbols-outlined text-[15px]">straighten</span>
                    Corrélation Biométrique &amp; Z-Score
                  </span>

                  <!-- PB Bar Scale Visual -->
                  <div class="space-y-1">
                    <div class="flex justify-between text-[11px] font-semibold">
                      <span class="text-[#BA1A1A] whitespace-nowrap">&lt;&nbsp;115&nbsp;mm (MAS)</span>
                      <span class="text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded font-bold whitespace-nowrap">{{ ex.pbZoneLabel }}</span>
                      <span class="text-emerald-700 whitespace-nowrap">&gt;&nbsp;125&nbsp;mm (Normal)</span>
                    </div>

                    <!-- Visual Bar Indicator -->
                    <div class="h-3 w-full bg-gray-200 rounded-full overflow-hidden flex relative">
                      <div class="w-[30%] bg-red-400" title="Zone Rouge &lt;115mm"></div>
                      <div class="w-[35%] bg-amber-400 relative" title="Zone Jaune 115-124mm">
                        <!-- Marker at 119 mm -->
                        <div class="absolute top-0 bottom-0 left-[40%] w-2 bg-amber-900 ring-2 ring-white"></div>
                      </div>
                      <div class="w-[35%] bg-emerald-400" title="Zone Verte &gt;125mm"></div>
                    </div>

                    <div class="flex justify-between text-[10px] text-[#707974]">
                      <span class="whitespace-nowrap">Sévère</span>
                      <span class="font-bold text-amber-900 whitespace-nowrap">Moussa Diop (Zone Jaune)</span>
                      <span class="whitespace-nowrap">Satisfaisant</span>
                    </div>
                  </div>

                  <!-- Z-Score Box -->
                  <div class="pt-2 border-t border-[#DCE5E0]/60 flex items-center justify-between text-xs">
                    <span class="text-[#404944] font-medium whitespace-nowrap">Poids / Taille (Z-Score)&nbsp;:</span>
                    <span class="font-bold text-[#BA1A1A] font-mono bg-red-50 border border-red-200 px-2 py-0.5 rounded whitespace-nowrap">
                      {{ ex.zScoreLabel }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </section>

          <!-- ============================================================= -->
          <!-- COLUMN 3 (40% -> 4 cols): Arbre d'Orientation & Protocole    -->
          <!-- ============================================================= -->
          <section class="lg:col-span-4 space-y-3">

            <!-- Algorithmic Header -->
            <div class="bg-white rounded-xl border border-[#DCE5E0] p-3.5 shadow-sm">
              <div class="flex items-center justify-between border-b border-[#DCE5E0]/70 pb-2 mb-3">
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-[#0F4C3A] text-white flex items-center justify-center font-bold text-xs">3</span>
                  <h2 class="text-sm font-bold text-[#0C1F18] text-balance">Arbre d'Orientation &amp; Thérapeutique</h2>
                </div>
                <span class="px-2 py-0.5 rounded-full bg-[#ACF1D5] text-[#00513D] text-[10px] font-bold whitespace-nowrap">
                  {{ brancheActiveCode() === 'CRENAS' ? 'Branche B Validée' : 'Branche A Retenue' }}
                </span>
              </div>

              <!-- Algorithmic Pathways Visual Branches -->
              <div class="space-y-3">

                <!-- BRANCH A: CRENI Hospitalisation -->
                <div
                  [ngClass]="brancheActiveCode() === 'CRENI' ? 'border-2 border-red-500 bg-red-50/70 shadow-sm' : 'border border-dashed border-[#DCE5E0] bg-[#F4F7F5]/60 opacity-65 hover:opacity-90'"
                  class="p-3 rounded-xl transition-all">
                  <div class="flex items-start justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-3 h-3 rounded-full bg-red-600 flex-shrink-0"></span>
                      <span class="text-xs font-bold text-[#0C1F18] whitespace-nowrap">Branche A&nbsp;: Transfert Hospitalier CRENI</span>
                    </div>
                    <span
                      [ngClass]="brancheActiveCode() === 'CRENI' ? 'bg-red-200 text-red-900 border-red-300' : 'bg-white text-[#707974] border-[#DCE5E0]'"
                      class="px-2 py-0.5 rounded border text-[10px] font-bold whitespace-nowrap">
                      {{ brancheActiveCode() === 'CRENI' ? 'Retenue' : 'Non Éligible' }}
                    </span>
                  </div>
                  <div class="text-[11px] text-[#404944] mt-1.5 pl-5">
                    <p class="font-medium" [class.line-through]="brancheActiveCode() !== 'CRENI'">
                      Condition&nbsp;: Signe de gravité (+) OU Test Appétit (-) OU Œdèmes bilatéraux (++)
                    </p>
                    <div class="mt-1 bg-white p-1.5 rounded text-[10px] text-[#707974] font-mono border border-[#DCE5E0]/40 text-pretty">
                      Protocole réf.&nbsp;: Lait F-75 (100 kcal/kg/j) + Réhydratation ReSoMal + Antibiothérapie IV (Ampicilline + Gentamicine).
                    </div>
                  </div>
                </div>

                <!-- BRANCH B: CRENAS Ambulatoire -->
                <div
                  [ngClass]="brancheActiveCode() === 'CRENAS' ? 'border-2 border-[#266A54] bg-[#EDF6F1]/70 shadow-sm' : 'border border-dashed border-[#DCE5E0] bg-[#F4F7F5]/60 opacity-65'"
                  class="p-3.5 rounded-xl relative transition-all">
                  <div *ngIf="brancheActiveCode() === 'CRENAS'" class="absolute -top-2.5 right-3 bg-[#0F4C3A] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow whitespace-nowrap">
                    <span class="material-symbols-outlined text-[13px]">check_circle</span>
                    Branche Retenue &amp; Conforme PCIME
                  </div>

                  <div class="flex items-center gap-2 mb-1">
                    <span class="w-3.5 h-3.5 rounded-full bg-amber-500 ring-4 ring-amber-200 flex-shrink-0"></span>
                    <h3 class="text-sm font-bold text-[#0F4C3A] whitespace-nowrap text-balance">
                      Branche B&nbsp;: Orientation CRENAS (Ambulatoire)
                    </h3>
                  </div>

                  <p class="text-xs text-[#0C1F18] pl-5 mb-2 font-medium text-pretty">
                    Critères satisfaits&nbsp;: Absence de complication létale • Test appétit (+) • PB 115-124&nbsp;mm • Mère coopérante.
                  </p>

                  <!-- DETAILED REFERENCE PROTOCOL BOX -->
                  <div class="mt-2 bg-white rounded-lg border border-[#ACF1D5] p-3 space-y-2 shadow-xs">
                    <div class="flex items-center justify-between border-b border-[#DCE5E0] pb-1.5">
                      <span class="text-[11px] font-bold uppercase tracking-wider text-[#0F4C3A] flex items-center gap-1 whitespace-nowrap">
                        <span class="material-symbols-outlined text-[15px]">medication</span>
                        Protocole Thérapeutique Immédiat Validé
                      </span>
                      <span class="text-[10px] font-bold text-[#266A54] bg-[#ACF1D5]/50 px-1.5 py-0.5 rounded whitespace-nowrap">
                        MSAS-CRENAS-2024
                      </span>
                    </div>

                    <!-- Structured Protocol Items -->
                    <div class="space-y-2 text-xs text-[#0C1F18]">

                      <!-- 1. Ration Plumpy'Nut -->
                      <div class="flex items-start gap-2 bg-[#F4F7F5] p-2 rounded border border-[#DCE5E0]/60">
                        <span class="w-5 h-5 rounded-full bg-[#ACF1D5] text-[#00513D] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">1</span>
                        <div>
                          <span class="font-bold text-[#0F4C3A] block">Ration Thérapeutique ATPE (Plumpy'Nut®)</span>
                          <p class="text-[#0C1F18] mt-0.5 text-pretty">
                            <strong class="text-[#266A54] font-bold">2 sachets par jour</strong> pendant 14 jours (Apport calorique ~1000&nbsp;kcal/j). Consommation fractionnée sans dilution aqueuse.
                          </p>
                        </div>
                      </div>

                      <!-- 2. Amoxicilline -->
                      <div class="flex items-start gap-2 bg-[#F4F7F5] p-2 rounded border border-[#DCE5E0]/60">
                        <span class="w-5 h-5 rounded-full bg-[#ACF1D5] text-[#00513D] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">2</span>
                        <div>
                          <span class="font-bold text-[#0F4C3A] block">Antibiothérapie de Couverture Systématique</span>
                          <p class="text-[#0C1F18] mt-0.5 text-pretty">
                            <strong>Amoxicilline suspension buvable 250mg/5ml&nbsp;:</strong> 50&nbsp;mg/kg/j = 125&nbsp;mg (2.5&nbsp;ml) matin et soir pendant 7 jours continus.
                          </p>
                        </div>
                      </div>

                      <!-- 3. Vitamine A & Déparasitage -->
                      <div class="flex items-start gap-2 bg-[#F4F7F5] p-2 rounded border border-[#DCE5E0]/60">
                        <span class="w-5 h-5 rounded-full bg-[#ACF1D5] text-[#00513D] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">3</span>
                        <div>
                          <span class="font-bold text-[#0F4C3A] block">Micronutriments &amp; Déparasitage</span>
                          <p class="text-[#0C1F18] mt-0.5 text-pretty">
                            <strong>Vitamine A&nbsp;:</strong> 1 dose unique de 100&nbsp;000&nbsp;UI sous capsule rouge au cabinet.
                            <strong>Albendazole / Mébendazole&nbsp;:</strong> Différé à M12 (nourrisson &lt; 1 an).
                          </p>
                        </div>
                      </div>

                      <!-- 4. Convocation & Suivi Relais -->
                      <div class="flex items-start gap-2 bg-amber-50 p-2 rounded border border-amber-200">
                        <span class="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">4</span>
                        <div>
                          <span class="font-bold text-amber-950 block">Suivi &amp; Convocation Terrain (J+14)</span>
                          <p class="text-amber-900 mt-0.5 text-pretty">
                            Convocation formelle au cabinet le <strong>Mardi 07 Novembre 2024 (J+14)</strong> pour pesée de contrôle et mesure PB. Notification envoyée au <strong>Relais Fatou Diop</strong> pour visite à domicile à J+3.
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>

          </section>

        </div>
      </main>

      <!-- =============================================================== -->
      <!-- DOCKED BOTTOM VALIDATION BAR                                    -->
      <!-- =============================================================== -->
      <footer class="h-16 bg-white border-t border-[#DCE5E0] px-4 flex items-center justify-between flex-shrink-0 z-30 shadow-md fixed bottom-0 left-0 right-0 lg:left-[256px]">

        <!-- Left Auxiliary Controls -->
        <div class="flex items-center gap-2">
          <button
            (click)="reinitialiserGrille()"
            class="px-3 py-2 rounded-lg border border-[#DCE5E0] text-[#404944] hover:text-[#0C1F18] hover:bg-[#F4F7F5] text-xs font-semibold transition-all active:scale-95 whitespace-nowrap"
            type="button">
            Réinitialiser la Grille
          </button>
          <button
            (click)="imprimerArbreClinique()"
            class="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#DCE5E0] text-[#0F4C3A] hover:bg-[#EDF6F1] text-xs font-semibold transition-all active:scale-95 whitespace-nowrap"
            type="button">
            <span class="material-symbols-outlined text-[16px]">print</span>
            <span>Imprimer Arbre Clinique PCIME</span>
          </button>
        </div>

        <!-- Center System Status Check -->
        <div class="hidden xl:flex items-center gap-2 text-xs font-medium text-[#266A54]">
          <span class="material-symbols-outlined text-[18px]">verified</span>
          <span class="whitespace-nowrap">{{ ex.statutValidationGlobal }}</span>
        </div>

        <!-- Right Major CTAs -->
        <div class="flex items-center gap-3">
          <button
            (click)="demanderAvisReferent()"
            class="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#DCE5E0] text-[#0C1F18] hover:bg-[#EDF6F1] text-xs font-semibold transition-colors whitespace-nowrap"
            type="button">
            <span class="material-symbols-outlined text-[18px]">share</span>
            <span>Avis Référent Pédiatrique</span>
          </button>

          <!-- Requested Bottom Primary Action -->
          <button
            (click)="validerEtPasserOrdonnance()"
            [disabled]="isValidating()"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0F4C3A] text-white hover:bg-[#266A54] text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap disabled:opacity-50"
            type="button">
            <span *ngIf="isValidating()" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Enregistrer &amp; Passer à l'Ordonnance</span>
            <span *ngIf="!isValidating()" class="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>

      </footer>

      <!-- Modale Avis Référent Pédiatrique -->
      <div *ngIf="showReferentModal()" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
        <div class="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl border border-[#DCE5E0]">
          <div class="flex items-center justify-between border-b border-[#DCE5E0] pb-3">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[#0F4C3A] text-2xl">share</span>
              <h3 class="text-base font-bold text-[#0C1F18]">Avis Référent Pédiatrique</h3>
            </div>
            <button (click)="showReferentModal.set(false)" class="text-[#707974] hover:text-[#0C1F18]">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <p class="text-xs text-[#404944] text-pretty">
            Solliciter la télé-expertise d'un pédiatre senior référent du District Sanitaire pour le cas de {{ ex.patient.nomComplet }} (NIP: {{ ex.patient.nip }}).
          </p>
          <textarea
            [(ngModel)]="avisReferentNotes"
            rows="3"
            placeholder="Précisez votre question clinique ou anomalie constatée..."
            class="w-full text-xs rounded-lg border border-[#DCE5E0] p-2.5 focus:ring-2 focus:ring-[#0F4C3A] focus:outline-hidden"></textarea>
          <div class="flex justify-end gap-2 pt-2">
            <button
              (click)="showReferentModal.set(false)"
              class="px-4 py-2 border border-[#DCE5E0] rounded-lg text-xs font-semibold text-[#404944] hover:bg-[#F4F7F5] whitespace-nowrap">
              Annuler
            </button>
            <button
              (click)="envoyerAvisReferent()"
              class="px-4 py-2 bg-[#0F4C3A] text-white rounded-lg text-xs font-bold hover:bg-[#266A54] whitespace-nowrap">
              Transmettre la demande
            </button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .custom-scroll::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    .custom-scroll::-webkit-scrollbar-track {
      background: #F4F7F5;
    }
    .custom-scroll::-webkit-scrollbar-thumb {
      background: #CBD5D1;
      border-radius: 4px;
    }
    .custom-scroll::-webkit-scrollbar-thumb:hover {
      background: #99d3ba;
    }
  `]
})
export class ExamenCliniqueViewComponent implements OnInit {

  private readonly examenService = inject(MedecinExamenService);
  private readonly router = inject(Router);

  // Signaux d'état
  readonly isLoading = signal<boolean>(true);
  readonly hasError = signal<boolean>(false);
  readonly isValidating = signal<boolean>(false);
  readonly showReferentModal = signal<boolean>(false);

  readonly examen = signal<ExamenCliniquePcime | null>(null);
  readonly brancheActiveCode = signal<string>('CRENAS');

  avisReferentNotes = '';

  // Calcul dynamique des alertes
  readonly alerteCount = computed(() => {
    const ex = this.examen();
    if (!ex || !ex.signesDanger) return 0;
    return ex.signesDanger.filter((s: SigneDangerItem) => s.present).length;
  });

  ngOnInit(): void {
    this.chargerExamen();
  }

  chargerExamen(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.examenService.getExamenEnCours().subscribe({
      next: (data: ExamenCliniquePcime) => {
        this.examen.set(data);
        this.brancheActiveCode.set(data.brancheRetenueCode || 'CRENAS');
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Erreur de chargement examen clinique:', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  toggleSigneDanger(signe: SigneDangerItem): void {
    signe.present = !signe.present;
    signe.alerte = signe.present;

    // Recalcul en direct de l'orientation PCIME
    this.evaluerOrientation();
  }

  private evaluerOrientation(): void {
    const ex = this.examen();
    if (!ex) return;

    // Critères CRENI selon PCIME OMS :
    // - Signes de gravité majeurs (Incapacité de boire, Convulsions, Léthargie, Tirage sous-costal)
    // - OU Test d'appétit négatif
    // - OU Œdèmes bilatéraux (Kwashiorkor)
    const signesCritiques = ex.signesDanger.filter(
      (s: SigneDangerItem) => s.present && s.code !== 'VOMISSEMENTS'
    );

    if (signesCritiques.length > 0 || ex.oedemeHydratation.oedemesGrade > 0) {
      this.brancheActiveCode.set('CRENI');
      ex.brancheRetenueCode = 'CRENI';
      ex.statutValidationGlobal = 'Alerte PCIME : Transfert Hospitalier CRENI requis';
    } else {
      this.brancheActiveCode.set('CRENAS');
      ex.brancheRetenueCode = 'CRENAS';
      ex.statutValidationGlobal = 'Arbre clinique complet : Branche CRENAS prête pour validation thérapeutique';
    }
  }

  reinitialiserGrille(): void {
    this.chargerExamen();
  }

  imprimerArbreClinique(): void {
    window.print();
  }

  ouvrirAlerteTriage(): void {
    alert('Alerte de triage transmise au poste d\'accueil et au pédiatre référent pour le box 04.');
  }

  demanderAvisReferent(): void {
    this.showReferentModal.set(true);
  }

  envoyerAvisReferent(): void {
    this.showReferentModal.set(false);
    alert('Demande d\'avis référent enregistrée avec succès. Notification transmise au superviseur.');
  }

  validerEtPasserOrdonnance(): void {
    const ex = this.examen();
    if (!ex) return;

    this.isValidating.set(true);

    const codesPresents: string[] = ex.signesDanger
      .filter((s: SigneDangerItem) => s.present)
      .map((s: SigneDangerItem) => s.code);

    const request: ValiderExamenRequest = {
      nip: ex.patient.nip,
      brancheChoisie: this.brancheActiveCode(),
      avisReferentDemande: false,
      avisReferentNotes: this.avisReferentNotes,
      codesSignesDangerPresents: codesPresents,
      observationMedecin: ex.testAppetit.observationClinique
    };

    this.examenService.validerExamen(request).subscribe({
      next: (res: ValiderExamenResponse) => {
        this.isValidating.set(false);
        // Redirection vers la vue 5 (Prescription)
        this.router.navigate(['/medecin/prescription'], {
          queryParams: { nip: res.nip, consultation: res.codeConsultation }
        });
      },
      error: (err: unknown) => {
        console.error('Erreur lors de la validation de l\'examen:', err);
        this.isValidating.set(false);
        // Redirection de courtoisie vers prescription en cas d'indisponibilité temporaire
        this.router.navigate(['/medecin/prescription'], {
          queryParams: { nip: ex.patient.nip }
        });
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return 'PT';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
}
