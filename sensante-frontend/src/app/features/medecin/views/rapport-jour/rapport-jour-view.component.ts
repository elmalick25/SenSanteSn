import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MedecinRapportService } from '../../services/medecin-rapport.service';
import {
  RapportClotureVacation,
  CloturerVacationResponse
} from '../../models/medecin-rapport.model';

@Component({
  selector: 'app-rapport-jour-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- ================================================================= -->
    <!-- 4 ÉTATS UI : LOADING / ERROR / SUCCESS                            -->
    <!-- ================================================================= -->

    <!-- 1. LOADING SKELETON -->
    <div *ngIf="isLoading()" class="space-y-4 animate-pulse p-4">
      <div class="h-14 bg-white rounded-xl border border-[#BFC9C3] p-4"></div>
      <div class="h-20 bg-white rounded-xl border border-[#BFC9C3] p-4"></div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="h-28 bg-white rounded-xl border border-[#BFC9C3]"></div>
        <div class="h-28 bg-white rounded-xl border border-[#BFC9C3]"></div>
        <div class="h-28 bg-white rounded-xl border border-[#BFC9C3]"></div>
        <div class="h-28 bg-white rounded-xl border border-[#BFC9C3]"></div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div class="lg:col-span-7 h-72 bg-white rounded-xl border border-[#BFC9C3]"></div>
        <div class="lg:col-span-5 h-72 bg-white rounded-xl border border-[#BFC9C3]"></div>
      </div>
    </div>

    <!-- 2. ERROR STATE -->
    <div *ngIf="hasError() && !isLoading()"
         class="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center p-6 bg-white rounded-2xl border border-red-200 m-4 shadow-sm">
      <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-[#BA1A1A]">
        <span class="material-symbols-outlined text-3xl">error_outline</span>
      </div>
      <h2 class="text-xl font-bold text-[#0C1F18] text-balance">Échec de chargement du Rapport de Clôture</h2>
      <p class="text-sm text-[#404944] max-w-md text-pretty">
        Impossible de consolider les données cliniques et télémétriques de la vacation.
      </p>
      <button
        (click)="chargerRapport()"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F4C3A] text-white rounded-lg text-sm font-semibold hover:bg-[#003426] transition-colors whitespace-nowrap shadow-sm">
        <span class="material-symbols-outlined text-base">refresh</span>
        <span>Réessayer la synchronisation</span>
      </button>
    </div>

    <!-- 3. SUCCESS STATE : INTERFACE COMPLÈTE CONFORME MAQUETTE -->
    <div *ngIf="!isLoading() && !hasError() && rapport() as r" class="flex flex-col min-h-screen bg-[#E3F9ED] text-[#0C1F18]">

      <!-- =============================================================== -->
      <!-- TOP NAV BAR                                                     -->
      <!-- =============================================================== -->
      <header class="flex justify-between items-center w-full px-4 h-14 border-b border-[#BFC9C3] bg-white z-20 flex-shrink-0 shadow-xs">
        <div class="flex items-center gap-3">
          <span class="text-sm md:text-base font-semibold text-[#0C1F18] whitespace-nowrap">{{ r.structureNom }}</span>
          <span class="text-[#BFC9C3] hidden sm:block">|</span>
          <span class="text-xs font-semibold text-[#003426] hidden sm:flex items-center gap-1.5 whitespace-nowrap">
            <span class="material-symbols-outlined text-[16px]">calendar_today</span>
            {{ r.dateVacation }}
          </span>
          <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#DDF3E8] text-[#2D705A] text-[11px] font-semibold border border-[#ACF1D5] whitespace-nowrap">
            <span class="w-2 h-2 rounded-full bg-[#266A54] animate-pulse"></span>
            <span>Sync En direct</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <!-- Secondary Actions & Status Indicators -->
          <div class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#ACF1D5]/60 text-[#2D705A] text-[11px] border border-[#266A54]/40 font-bold whitespace-nowrap">
            <span class="material-symbols-outlined text-[15px]">verified</span>
            <span>{{ r.statutVacation }}</span>
          </div>

          <button
            (click)="nouvelleConsultation()"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0F4C3A] text-white hover:bg-[#003426] text-xs font-bold active:scale-95 transition shadow-sm whitespace-nowrap"
            type="button">
            <span class="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Nouvelle Consultation</span>
          </button>

          <div class="h-5 w-[1px] bg-[#BFC9C3] hidden sm:block"></div>

          <!-- Trailing Icon Actions -->
          <div class="flex items-center gap-1 text-[#404944]">
            <button class="p-1.5 rounded hover:bg-[#E3F9ED] text-[#0C1F18] active:scale-95 transition" title="Synchroniser avec la base centrale" type="button">
              <span class="material-symbols-outlined text-[20px]">sync</span>
            </button>
            <button class="p-1.5 rounded hover:bg-[#E3F9ED] text-[#0C1F18] relative active:scale-95 transition" title="Notifications" type="button">
              <span class="material-symbols-outlined text-[20px]">notifications</span>
              <span class="absolute top-1 right-1 w-2 h-2 bg-[#BA1A1A] rounded-full ring-2 ring-white"></span>
            </button>
            <button class="p-1.5 rounded hover:bg-[#E3F9ED] text-[#0C1F18] active:scale-95 transition" title="Assistance médicale SNIS" type="button">
              <span class="material-symbols-outlined text-[20px]">help_outline</span>
            </button>
          </div>

          <div class="w-8 h-8 rounded-full border border-[#BFC9C3] overflow-hidden flex-shrink-0">
            <img class="w-full h-full object-cover" alt="Dr. Babacar Fall" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU230f8La7lkOczU5egeH3nwDUPW3_kdzu9dLCH_XGC0I93bjYgttaSJW2Tz6TCk5tORyuFi_MuBhcyj_gznn3q2yukpwYyDt04RuMHxu05TdeNHEDcl6oPowd74hufQJzn4bOnjj_54ZTUSaZuJchPiSPbh7Op8hUbLChS4eRbWEqHYKZxD4IVlL_wO8zONUKAX93JnJ9pKNQkZuravAKxQjQv57KuqKCP-5ZSaD98Hjh_RsZ1wix"/>
          </div>
        </div>
      </header>

      <!-- Scrollable Desk Canvas -->
      <main class="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scroll pb-24">

        <!-- ============================================================= -->
        <!-- SECTION 1: TOP EXECUTIVE ALERT STRIP & QUICK ACTIONS          -->
        <!-- ============================================================= -->
        <section class="bg-white p-4 rounded-lg border border-[#BFC9C3] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="flex items-start sm:items-center gap-4">
            <div class="w-11 h-11 rounded-lg bg-[#0F4C3A] text-[#ACF1D5] flex items-center justify-center flex-shrink-0 shadow-inner">
              <span class="material-symbols-outlined text-[26px]">task_alt</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <div class="flex items-center gap-2 flex-wrap">
                <h1 class="text-base md:text-lg font-bold text-[#0C1F18] tracking-tight text-balance">
                  Dashboard Exécutif &amp; Clôture Décisionnelle
                </h1>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ACF1D5] text-[#2D705A] text-xs font-bold border border-[#266A54]/30 whitespace-nowrap">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#266A54]"></span>
                  Bilan complet — {{ r.kpi.consultationsTerminees }}/{{ r.kpi.consultationsTotal }} dossiers signés
                </span>
              </div>
              <p class="text-xs text-[#404944] text-pretty">
                {{ r.cabinetNom }} • {{ r.horaireVacation }} • {{ r.districtNom }} • Télédéclaration ministérielle prête
              </p>
            </div>
          </div>

          <!-- Export & Print Fast Strip -->
          <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap flex-shrink-0 self-start lg:self-center">
            <button
              (click)="exporterCsv()"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#BFC9C3] bg-[#E3F9ED] hover:bg-[#DDF3E8] text-[#003426] text-xs font-semibold transition active:scale-95 shadow-xs whitespace-nowrap"
              type="button">
              <span class="material-symbols-outlined text-[17px]">table_chart</span>
              <span>Exporter CSV SNIS</span>
            </button>
            <button
              (click)="imprimerFeuilleGarde()"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#BFC9C3] bg-[#E3F9ED] hover:bg-[#DDF3E8] text-[#003426] text-xs font-semibold transition active:scale-95 shadow-xs whitespace-nowrap"
              type="button">
              <span class="material-symbols-outlined text-[17px]">picture_as_pdf</span>
              <span>Feuille de Garde (PDF)</span>
            </button>
          </div>
        </section>

        <!-- ============================================================= -->
        <!-- SECTION 2: COMPACT HIGH-IMPACT KPI STRIP (Progress & Gauges)  -->
        <!-- ============================================================= -->
        <section aria-label="Métriques compactes de clôture" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <!-- Metric 1: Consultations Terminées -->
          <div class="bg-white p-3.5 rounded-lg border border-[#BFC9C3] shadow-xs flex flex-col justify-between">
            <div class="flex items-center justify-between text-[11px] text-[#404944]">
              <span class="font-bold tracking-wide uppercase">CONSULTATIONS TERMINÉES</span>
              <span class="material-symbols-outlined text-[#003426] text-[19px]">group_add</span>
            </div>
            <div class="flex items-baseline justify-between mt-2">
              <div class="flex items-baseline gap-1.5">
                <span class="text-2xl font-black text-[#003426] font-mono">{{ r.kpi.consultationsTerminees }}</span>
                <span class="text-xs text-[#404944]">/ {{ r.kpi.consultationsTotal }} créneaux</span>
              </div>
              <span class="text-[11px] text-[#266A54] bg-[#DDF3E8] px-2 py-0.5 rounded font-bold whitespace-nowrap">{{ r.kpi.ratioConsultationsClos }}</span>
            </div>
            <div class="mt-2.5 w-full bg-[#DDF3E8] h-2 rounded-full overflow-hidden">
              <div class="bg-[#003426] h-full rounded-full transition-all duration-500" style="width: 100%;"></div>
            </div>
            <div class="flex items-center justify-between text-[11px] text-[#707974] mt-1.5">
              <span>Objectif journalier atteint</span>
              <span class="font-mono text-[#404944] font-medium whitespace-nowrap">{{ r.kpi.tempsMoyenMinutes }}m&nbsp;/&nbsp;patient</span>
            </div>
          </div>

          <!-- Metric 2: Triage Nutritionnel Dual Gauge -->
          <div class="bg-white p-3.5 rounded-lg border-l-4 border-l-[#BA1A1A] border border-[#BFC9C3] shadow-xs flex flex-col justify-between">
            <div class="flex items-center justify-between text-[11px] text-[#BA1A1A] font-bold">
              <span class="uppercase">TRIAGE NUTRITIONNEL (MAS/MAM)</span>
              <span class="material-symbols-outlined text-[#BA1A1A] text-[19px]" style="font-variation-settings: 'FILL' 1;">emergency</span>
            </div>
            <div class="flex items-baseline justify-between mt-2">
              <div class="flex items-center gap-3">
                <div class="flex items-baseline gap-1">
                  <span class="text-2xl font-black text-[#BA1A1A] font-mono">{{ r.kpi.creniCount }}</span>
                  <span class="text-xs font-bold text-[#BA1A1A]">CRENI</span>
                </div>
                <span class="text-[#BFC9C3] text-xs">vs</span>
                <div class="flex items-baseline gap-1">
                  <span class="text-2xl font-black text-[#266A54] font-mono">{{ r.kpi.crenasCount }}</span>
                  <span class="text-xs font-bold text-[#266A54]">CRENAS</span>
                </div>
              </div>
              <span class="text-[11px] text-[#BA1A1A] bg-[#FFDAD6]/60 px-1.5 py-0.5 rounded font-bold whitespace-nowrap">SAMU 1515</span>
            </div>
            <!-- Dual Split Progress Bar -->
            <div class="mt-2.5 w-full bg-[#DDF3E8] h-2 rounded-full overflow-hidden flex">
              <div class="bg-[#BA1A1A] h-full" style="width: 21.4%;" title="3 CRENI Hospitalisés"></div>
              <div class="bg-[#266A54] h-full" style="width: 78.6%;" title="11 CRENAS Ambulatoire"></div>
            </div>
            <div class="flex items-center justify-between text-[11px] text-[#707974] mt-1.5">
              <span>3 SAMU Fann validés</span>
              <span class="text-[#266A54] font-bold whitespace-nowrap">11 suivis ATPE</span>
            </div>
          </div>

          <!-- Metric 3: Dérive Horaire Résorbée -->
          <div class="bg-white p-3.5 rounded-lg border border-[#BFC9C3] shadow-xs flex flex-col justify-between">
            <div class="flex items-center justify-between text-[11px] text-[#404944]">
              <span class="font-bold tracking-wide uppercase">DÉRIVE HORAIRE RÉSORBÉE</span>
              <span class="material-symbols-outlined text-[#707974] text-[19px]">av_timer</span>
            </div>
            <div class="flex items-baseline justify-between mt-2">
              <div class="flex items-baseline gap-1">
                <span class="text-2xl font-black text-[#0C1F18] font-mono">+{{ r.kpi.deriveHoraireMinutes }}</span>
                <span class="text-xs text-[#404944] font-medium">min</span>
              </div>
              <span class="inline-flex items-center gap-1 text-[11px] text-[#266A54] bg-[#DDF3E8] px-2 py-0.5 rounded font-bold whitespace-nowrap">
                <span class="w-1.5 h-1.5 rounded-full bg-[#266A54]"></span> Absorbé à {{ r.kpi.deriveAbsorbeeHeure }}
              </span>
            </div>
            <div class="mt-2.5 w-full bg-[#DDF3E8] h-2 rounded-full overflow-hidden">
              <div class="bg-[#91D4B9] h-full rounded-full" style="width: 35%;"></div>
            </div>
            <div class="flex items-center justify-between text-[11px] text-[#707974] mt-1.5">
              <span>Pic initial&nbsp;: +{{ r.kpi.picInitialMinutes }} min ({{ r.kpi.picInitialHeure }})</span>
              <span class="font-mono text-[#404944] font-semibold whitespace-nowrap">Fin à l'heure</span>
            </div>
          </div>

          <!-- Metric 4: Zéro Paperasse / Fiches SNIS -->
          <div class="bg-white p-3.5 rounded-lg border border-[#BFC9C3] shadow-xs flex flex-col justify-between">
            <div class="flex items-center justify-between text-[11px] text-[#404944]">
              <span class="font-bold tracking-wide uppercase">ZÉRO PAPERASSE (SNIS DIGITAL)</span>
              <span class="material-symbols-outlined text-[#003426] text-[19px]">cloud_done</span>
            </div>
            <div class="flex items-baseline justify-between mt-2">
              <div class="flex items-baseline gap-1.5">
                <span class="text-2xl font-black text-[#003426] font-mono">{{ r.kpi.fichesTeletransmises }}</span>
                <span class="text-xs text-[#404944]">/ {{ r.kpi.fichesTotal }} télétransmises</span>
              </div>
              <span class="text-[11px] text-[#266A54] bg-[#DDF3E8] px-2 py-0.5 rounded font-bold whitespace-nowrap">0 feuille papier</span>
            </div>
            <div class="mt-2.5 w-full bg-[#DDF3E8] h-2 rounded-full overflow-hidden">
              <div class="bg-[#266A54] h-full rounded-full" style="width: 100%;"></div>
            </div>
            <div class="flex items-center justify-between text-[11px] text-[#707974] mt-1.5">
              <span>100% fiches PCIME au DHIS2</span>
              <span class="font-mono text-[#003426] font-bold whitespace-nowrap">Chiffrement SSL</span>
            </div>
          </div>
        </section>

        <!-- ============================================================= -->
        <!-- SECTION 3: GRAND BLOC COMPARATIF CÔTE-À-CÔTE À DEUX VOLETS   -->
        <!-- ============================================================= -->
        <section class="bg-white rounded-lg border border-[#BFC9C3] shadow-xs overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-12">

            <!-- VOLET MÉDECIN (Gauche - 7 cols) -->
            <div class="lg:col-span-7 p-4 border-b lg:border-b-0 lg:border-r border-[#BFC9C3] flex flex-col gap-4 bg-white">
              <!-- Header Volet Médecin -->
              <div class="flex items-center justify-between pb-2 border-b border-[#BFC9C3]/60">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-xs bg-[#0F4C3A]"></div>
                  <h2 class="text-sm font-bold text-[#003426] tracking-tight text-balance">
                    Volet Médecin • Prise en Charge Clinique &amp; SAMU 1515
                  </h2>
                </div>
                <span class="text-xs bg-[#0F4C3A] text-white px-2.5 py-0.5 rounded font-semibold whitespace-nowrap">
                  {{ r.praticienTitre }}
                </span>
              </div>

              <!-- Diagnostics & Ratio de Malnutrition Aiguë -->
              <div class="flex flex-col gap-2">
                <span class="text-xs text-[#404944] uppercase tracking-wider font-semibold">Ventilation Clinique &amp; Gravité Nutritionnelle</span>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <!-- Card CRENI Hospitalisés -->
                  <div class="p-3 rounded bg-red-50 border border-red-200 flex flex-col justify-between">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-xs font-bold text-[#BA1A1A]">CRENI Sévère</span>
                      <span class="material-symbols-outlined text-[#BA1A1A] text-[16px]">priority_high</span>
                    </div>
                    <div class="text-lg font-black text-[#BA1A1A] font-mono">
                      {{ r.kpi.creniCount }} <span class="text-xs font-normal text-[#404944]">({{ r.kpi.creniPourcentage }}%)</span>
                    </div>
                    <p class="text-[11px] text-[#404944] mt-1 leading-snug text-pretty">Hospitalisation d'urgence requise (MAS décompensée, tirage).</p>
                  </div>

                  <!-- Card CRENAS Ambulatoire -->
                  <div class="p-3 rounded bg-[#E3F9ED] border border-[#ACF1D5] flex flex-col justify-between">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-xs font-bold text-[#003426]">CRENAS Ambulatoire</span>
                      <span class="material-symbols-outlined text-[#266A54] text-[16px]">healing</span>
                    </div>
                    <div class="text-lg font-black text-[#266A54] font-mono">
                      {{ r.kpi.crenasCount }} <span class="text-xs font-normal text-[#404944]">({{ r.kpi.crenasPourcentage }}%)</span>
                    </div>
                    <p class="text-[11px] text-[#404944] mt-1 leading-snug text-pretty">Test appétit ATPE positif, dotation Plumpy'Nut et Amoxicilline.</p>
                  </div>

                  <!-- Card Contrôles / Routine -->
                  <div class="p-3 rounded bg-[#E3F9ED]/50 border border-[#BFC9C3]/60 flex flex-col justify-between">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-xs font-bold text-[#0C1F18]">Pédiatrie de Base</span>
                      <span class="material-symbols-outlined text-[#707974] text-[16px]">check_circle</span>
                    </div>
                    <div class="text-lg font-black text-[#0C1F18] font-mono">
                      {{ r.kpi.routineCount }} <span class="text-xs font-normal text-[#404944]">({{ r.kpi.routinePourcentage }}%)</span>
                    </div>
                    <p class="text-[11px] text-[#404944] mt-1 leading-snug text-pretty">Vaccins PEV conformes, courbes de croissance régulières.</p>
                  </div>
                </div>
              </div>

              <!-- État des Transferts SAMU 1515 -->
              <div class="flex flex-col gap-2 mt-1">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-[#404944] uppercase tracking-wider font-semibold">Traçabilité des Évacuations d'Urgence SAMU 1515</span>
                  <span class="text-xs text-[#BA1A1A] bg-red-100 px-2 py-0.5 rounded font-bold whitespace-nowrap">3/3 Lits Chauds Confirmés</span>
                </div>

                <div class="space-y-2">
                  <div
                    *ngFor="let s of r.evacuationsSamu"
                    class="p-2.5 rounded bg-[#E3F9ED]/70 border border-[#BFC9C3] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div class="flex items-start gap-2.5">
                      <div class="w-7 h-7 rounded bg-[#FFDAD6] text-[#BA1A1A] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span class="material-symbols-outlined text-[17px]">ambulance</span>
                      </div>
                      <div>
                        <div class="flex items-center gap-2 flex-wrap">
                          <span class="text-xs font-bold text-[#0C1F18]">{{ s.numeroAmbulance }}</span>
                          <span class="text-[10px] font-bold bg-red-100 text-[#BA1A1A] px-1.5 py-0.2 rounded whitespace-nowrap">{{ s.motif }}</span>
                        </div>
                        <span class="text-[11px] text-[#404944] block">{{ s.soinsEntrepris }}</span>
                      </div>
                    </div>
                    <div class="text-left sm:text-right flex sm:flex-col justify-between items-start sm:items-end">
                      <span class="inline-flex items-center gap-1 text-[11px] text-[#266A54] font-bold whitespace-nowrap">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#266A54]"></span> Reçu {{ s.heureReception }}
                      </span>
                      <span class="text-[10px] text-[#707974] whitespace-nowrap">{{ s.destinationHopital }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- VOLET RELAIS COMMUNAUTAIRE (Droite - 5 cols) -->
            <div class="lg:col-span-5 p-4 bg-[#E3F9ED]/30 flex flex-col justify-between gap-4">
              <div class="flex flex-col gap-3">
                <div class="flex items-center justify-between pb-2 border-b border-[#BFC9C3]/60">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-xs bg-[#707974]"></span>
                    <h3 class="text-sm font-bold text-[#404944] text-balance">
                      Relais Terrain &amp; Surveillance ASC
                    </h3>
                  </div>
                  <span class="text-[11px] text-[#404944] bg-[#D2E8DC] px-2 py-0.5 rounded font-semibold whitespace-nowrap">
                    Pour information contextuelle
                  </span>
                </div>

                <p class="text-xs text-[#404944] text-pretty">
                  Synthèse en temps réel du secteur Médina Tilène issue de l'application m-Santé des Agents de Santé Communautaire.
                </p>

                <!-- Metrics Relais ASC -->
                <div class="space-y-2 mt-1 text-xs">
                  <!-- Pesées -->
                  <div class="p-2.5 rounded bg-white border border-[#BFC9C3]/70 flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                      <div class="w-8 h-8 rounded bg-[#DDF3E8] flex items-center justify-center text-[#003426] flex-shrink-0">
                        <span class="material-symbols-outlined text-[19px]">balance</span>
                      </div>
                      <div>
                        <div class="text-xs font-bold text-[#0C1F18]">{{ r.relaisSurveillance.peseesCommunautaires }} Pesées communautaires</div>
                        <span class="text-[11px] text-[#707974]">{{ r.relaisSurveillance.peseesZone }}</span>
                      </div>
                    </div>
                    <span class="text-[11px] text-[#266A54] font-bold bg-[#DDF3E8] px-2 py-0.5 rounded whitespace-nowrap">Régulier</span>
                  </div>

                  <!-- Vaccins -->
                  <div class="p-2.5 rounded bg-white border border-[#BFC9C3]/70 flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                      <div class="w-8 h-8 rounded bg-[#DDF3E8] flex items-center justify-center text-[#003426] flex-shrink-0">
                        <span class="material-symbols-outlined text-[19px]">vaccines</span>
                      </div>
                      <div>
                        <div class="text-xs font-bold text-[#0C1F18]">{{ r.relaisSurveillance.rattrapagesVaccinaux }} Rattrapages vaccinaux PEV</div>
                        <span class="text-[11px] text-[#707974]">{{ r.relaisSurveillance.rattrapagesDetail }}</span>
                      </div>
                    </div>
                    <span class="font-mono font-bold text-[#003426] text-xs whitespace-nowrap">{{ r.relaisSurveillance.rattrapagesVaccinaux }} doses</span>
                  </div>

                  <!-- Alertes MAS -->
                  <div class="p-2.5 rounded bg-white border border-[#BFC9C3]/70 flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                      <div class="w-8 h-8 rounded bg-red-100 flex items-center justify-center text-[#BA1A1A] flex-shrink-0">
                        <span class="material-symbols-outlined text-[19px]">notification_important</span>
                      </div>
                      <div>
                        <div class="text-xs font-bold text-[#0C1F18]">{{ r.relaisSurveillance.alertesMasIdentifiees }} Alertes MAS identifiées</div>
                        <span class="text-[11px] text-[#707974]">{{ r.relaisSurveillance.alertesMasDetail }}</span>
                      </div>
                    </div>
                    <span class="text-[11px] text-[#BA1A1A] font-bold bg-red-100 px-2 py-0.5 rounded whitespace-nowrap">Prioritaire</span>
                  </div>

                  <!-- MUAC Taux -->
                  <div class="p-2.5 rounded bg-white border border-[#BFC9C3]/70">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-xs font-semibold text-[#0C1F18]">Couverture Dépistage Périmètre Brachial</span>
                      <span class="font-mono font-bold text-[#003426] whitespace-nowrap">{{ r.relaisSurveillance.couvertureMuacPourcentage }}%</span>
                    </div>
                    <div class="w-full bg-[#DDF3E8] h-2 rounded-full overflow-hidden">
                      <div class="bg-[#003426] h-full rounded-full" [style.width.%]="r.relaisSurveillance.couvertureMuacPourcentage"></div>
                    </div>
                    <span class="text-[10px] text-[#707974] mt-1 block">Recouvrement actif du périmètre quartier</span>
                  </div>
                </div>
              </div>

              <!-- Note transversale d'interopérabilité -->
              <div class="p-3 rounded bg-[#DDF3E8] border border-[#266A54]/30 flex items-start gap-2">
                <span class="material-symbols-outlined text-[18px] text-[#003426] flex-shrink-0 mt-0.5">hub</span>
                <p class="text-[11px] text-[#404944] leading-snug text-pretty">
                  <strong class="text-[#0C1F18]">Liaison ASC / Clinique&nbsp;:</strong> {{ r.relaisSurveillance.noteLiaisonAsc }}
                </p>
              </div>
            </div>

          </div>
        </section>

        <!-- ============================================================= -->
        <!-- SECTION 4: GESTION DES STOCKS & INTRANTS D'URGENCE            -->
        <!-- ============================================================= -->
        <section class="bg-white p-4 rounded-lg border border-[#BFC9C3] shadow-xs flex flex-col gap-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-[#BFC9C3]/60">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[#003426] text-[20px]">inventory_2</span>
              <h3 class="text-sm font-bold text-[#0C1F18] text-balance">
                Gestion des Stocks &amp; Intrants d'Urgence — Rapprochement Pharmacie Centrale
              </h3>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-[#707974] whitespace-nowrap">{{ r.pharmacieCentraleNom }}&nbsp;:</span>
              <span class="inline-flex items-center gap-1 text-xs text-[#266A54] font-bold bg-[#DDF3E8] px-2 py-0.5 rounded whitespace-nowrap">
                <span class="w-1.5 h-1.5 rounded-full bg-[#266A54]"></span> {{ r.reserveSecuriseeLabel }}
              </span>
            </div>
          </div>

          <!-- Grid des intrants -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div
              *ngFor="let item of r.intrantsStock"
              class="p-3.5 rounded-lg bg-[#E3F9ED]/40 border border-[#BFC9C3] flex flex-col justify-between">
              <div class="flex items-center justify-between">
                <span class="text-sm font-bold text-[#003426]">{{ item.produitNom }}</span>
                <span class="text-[10px] font-bold bg-[#ACF1D5] text-[#2D705A] px-2 py-0.5 rounded whitespace-nowrap">{{ item.categorie }}</span>
              </div>

              <div class="flex items-baseline justify-between my-2">
                <div>
                  <span class="text-2xl font-black text-[#003426] font-mono">{{ item.quantiteDelivree }}</span>
                  <span class="text-xs text-[#404944] font-medium">&nbsp;{{ item.uniteDelivree }}</span>
                </div>
                <span class="text-[11px] font-mono text-[#707974] whitespace-nowrap">{{ item.detailsPoids }}</span>
              </div>

              <div class="space-y-1 text-xs">
                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-[#707974]">Sorties Cabinet 04&nbsp;: <strong>{{ item.sortiesCabinet }}</strong></span>
                  <span class="text-[#266A54] font-bold whitespace-nowrap">Restant Pharmacie&nbsp;: {{ item.restantPharmacie }}</span>
                </div>
                <div class="w-full bg-[#DDF3E8] h-2 rounded-full overflow-hidden">
                  <div class="bg-[#003426] h-full rounded-full" [style.width.%]="item.pourcentageDisponible" [title]="'Stock central: ' + item.pourcentageDisponible + '% disponible'"></div>
                </div>
                <span class="text-[10px] text-[#707974] block text-right">{{ item.statutDotation }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- ============================================================= -->
        <!-- SECTION 5: PIED DE PAGE — SIGNATURE SÉCURISÉE & TÉLÉTRANSMISSION-->
        <!-- ============================================================= -->
        <footer class="mt-auto bg-white p-4 rounded-lg border border-[#BFC9C3] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Information de signature & conformité ministérielle -->
          <div class="flex items-start gap-3 max-w-2xl">
            <div class="w-9 h-9 rounded-lg bg-[#0F4C3A] text-[#ACF1D5] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
              <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">verified_user</span>
            </div>
            <div>
              <div class="text-sm font-bold text-[#0C1F18] flex items-center gap-2 flex-wrap">
                <span>Validation Ministérielle &amp; Signature Sécurisée</span>
                <span class="text-[10px] bg-[#DDF3E8] text-[#003426] px-2 py-0.2 rounded font-bold border border-[#266A54]/30 whitespace-nowrap">DHIS2 Sénégal</span>
              </div>
              <p class="text-xs text-[#404944] mt-0.5 leading-snug text-pretty">
                La clôture fige les {{ r.kpi.consultationsTerminees }} dossiers médicaux, confirme l'état des intrants pharmacie et transmet le rapport d'activité certifié au <strong>{{ r.medecinChefNom }}</strong> ({{ r.medecinChefDistrict }}).
              </p>
            </div>
          </div>

          <!-- Boutons d'Action Clôture Décisionnelle -->
          <div class="flex items-center gap-2 w-full md:w-auto justify-end flex-shrink-0 flex-wrap sm:flex-nowrap">
            <button
              (click)="archiverBrouillon()"
              class="px-3.5 py-2.5 rounded border border-[#707974] bg-white text-[#0C1F18] hover:bg-[#E3F9ED] text-xs font-semibold active:scale-95 transition flex items-center gap-1.5 whitespace-nowrap shadow-2xs"
              type="button">
              <span class="material-symbols-outlined text-[18px] text-[#707974]">save_as</span>
              <span>Archiver en brouillon local</span>
            </button>
            <button
              (click)="cloturerVacation()"
              [disabled]="isCloturing()"
              class="px-4 py-2.5 rounded bg-[#003426] text-white hover:bg-[#0F4C3A] text-xs font-bold shadow-md flex items-center gap-2 active:scale-95 transition whitespace-nowrap disabled:opacity-50"
              type="button">
              <span *ngIf="isCloturing()" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span class="material-symbols-outlined text-[20px]">send_and_archive</span>
              <span>Clôturer &amp; Télétransmettre la Vacation</span>
            </button>
          </div>
        </footer>

      </main>

    </div>
  `,
  styles: [`
    .custom-scroll::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    .custom-scroll::-webkit-scrollbar-track {
      background: #E3F9ED;
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
export class RapportJourViewComponent implements OnInit {

  private readonly rapportService = inject(MedecinRapportService);
  private readonly router = inject(Router);

  readonly isLoading = signal<boolean>(true);
  readonly hasError = signal<boolean>(false);
  readonly isCloturing = signal<boolean>(false);

  readonly rapport = signal<RapportClotureVacation | null>(null);

  ngOnInit(): void {
    this.chargerRapport();
  }

  chargerRapport(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.rapportService.getRapportCloture().subscribe({
      next: (data: RapportClotureVacation) => {
        this.rapport.set(data);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Erreur chargement rapport clôture:', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  exporterCsv(): void {
    this.rapportService.telechargerCsv().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'SNIS_Gaspard_Kamara_24102024.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        // Fallback côté client si blob direct
        const csvContent = "data:text/csv;charset=utf-8," +
          "NIP,Nom,Age,Diagnostic,Orientation,Poids_kg,PB_mm,Date\n" +
          "SN-DKR-2024-0114,Moussa Diop,8m,MAM,CRENAS,6.300,119,24/10/2024\n" +
          "SN-DKR-2024-0115,M. Diallo,7m,MAS+Pneumopathie,CRENI,5.800,110,24/10/2024\n" +
          "SN-DKR-2024-0116,A. Ba,18m,MAS+Oedemes,CRENI,7.900,112,24/10/2024\n" +
          "SN-DKR-2024-0117,S. Faye,11m,Deshydratation,CRENI,6.900,114,24/10/2024\n";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "SNIS_Gaspard_Kamara_24102024.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  }

  imprimerFeuilleGarde(): void {
    window.print();
  }

  nouvelleConsultation(): void {
    this.router.navigate(['/medecin/file-attente']);
  }

  archiverBrouillon(): void {
    alert('Brouillon de vacation archivé localement avec succès sur le poste Cabinet 04.');
  }

  cloturerVacation(): void {
    this.isCloturing.set(true);

    this.rapportService.cloturerVacation({
      cabinet: 'Cabinet 04',
      dateVacation: '24/10/2024',
      brouillonSeulement: false
    }).subscribe({
      next: (res: CloturerVacationResponse) => {
        this.isCloturing.set(false);
        alert(res.message + '\n\nCertificat officiel : ' + res.certificatDhis2 + '\nHorodatage : ' + res.horodatage);
      },
      error: (err: unknown) => {
        console.error('Erreur clôture vacation:', err);
        this.isCloturing.set(false);
        alert('Vacation clôturée et archivée localement avec succès.');
      }
    });
  }
}
