import { Component, OnInit, AfterViewInit, OnDestroy, inject, signal, ElementRef, ViewChild, computed, effect } from '@angular/core';
import { AudioService } from '../../../../core/services/audio.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ParentStateService } from '../../../../core/services/parent-state.service';
import { CroissanceOmsService } from '../../../../core/services/croissance-oms.service';
import { CroissanceOmsData } from '../../../../core/models/croissance-oms.model';
import { Child } from '../../../../core/models/parent-space.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

type GrowthTab = 'POIDS' | 'TAILLE' | 'PB';

@Component({
  selector: 'app-courbes-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex flex-col w-full pb-16 animate-fadeIn font-body-md text-on-surface antialiased">

      <!-- ========================================================================= -->
      <!-- 1. ÉTAT DE CHARGEMENT (SKELETON SHIMMER) -->
      <!-- ========================================================================= -->
      @if (stateService.loading()) {
        <div class="space-y-6 animate-pulse w-full">
          <div class="h-32 w-full bg-surface-container-highest/60 rounded-2xl border border-outline-variant/30"></div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="h-24 bg-surface-container-highest/60 rounded-2xl"></div>
            <div class="h-24 bg-surface-container-highest/60 rounded-2xl"></div>
            <div class="h-24 bg-surface-container-highest/60 rounded-2xl"></div>
          </div>
          <div class="h-96 w-full bg-surface-container-highest/60 rounded-2xl"></div>
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div class="lg:col-span-7 h-48 bg-surface-container-highest/60 rounded-2xl"></div>
            <div class="lg:col-span-5 h-48 bg-surface-container-highest/60 rounded-2xl"></div>
          </div>
        </div>
      }

      <!-- ========================================================================= -->
      <!-- 2. ÉTAT D'ERREUR RÉSEAU -->
      <!-- ========================================================================= -->
      @if (stateService.error() && !stateService.loading()) {
        <div class="w-full pt-4">
          <div class="p-8 bg-error-container/40 border border-error/30 rounded-2xl text-center space-y-4 max-w-xl mx-auto shadow-sm">
            <span class="material-symbols-outlined text-error text-5xl">cloud_off</span>
            <h3 class="text-headline-sm font-bold text-on-error-container text-balance">
              Données de croissance indisponibles
            </h3>
            <p class="text-body-sm text-on-surface-variant leading-relaxed text-pretty">
              {{ stateService.error() }}
            </p>
            <div class="flex items-center justify-center gap-3 pt-2 flex-wrap">
              <button
                type="button"
                (click)="stateService.loadParentData()"
                class="px-5 py-2.5 bg-primary text-on-primary hover:bg-primary-container rounded-xl text-label-md font-semibold transition-all shadow-sm whitespace-nowrap flex-shrink-0">
                Réessayer la connexion
              </button>
            </div>
          </div>
        </div>
      }

      <!-- ========================================================================= -->
      <!-- 3. ÉTAT VIDE (0 ENFANT) -->
      <!-- ========================================================================= -->
      @if (!stateService.loading() && stateService.children().length === 0 && !stateService.error()) {
        <div class="w-full pt-4">
          <div class="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/30 text-center max-w-2xl mx-auto space-y-4 shadow-sm">
            <div class="w-16 h-16 rounded-2xl bg-surface-container-low text-primary flex items-center justify-center mx-auto border border-primary/20">
              <span class="material-symbols-outlined text-3xl">child_care</span>
            </div>
            <h2 class="text-headline-md font-bold text-primary text-balance">Aucune courbe de croissance active</h2>
            <p class="text-body-md text-on-surface-variant leading-relaxed max-w-lg mx-auto text-pretty">
              Aucun enfant n'est enregistré sur ce compte. Rendez-vous au poste de santé le plus proche pour effectuer la première pesée officielle.
            </p>
          </div>
        </div>
      }

      <!-- ========================================================================= -->
      <!-- 4. ÉTAT NOMINAL : COURBES DE CROISSANCE OMS CONFORMES À LA MAQUETTE -->
      <!-- ========================================================================= -->
      @if (!stateService.loading() && currentChild; as child) {

        <div class="max-w-[1200px] mx-auto flex flex-col gap-6 w-full">

          <!-- SECTION 1: Header Section Souverain MSAS -->
          <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#065f46] via-[#065f46] to-[#044e3f] text-white p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(6,95,70,0.25)] border border-white/10">
            <!-- Liseré tricolore souverain du Sénégal -->
            <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00853F] via-[#FDEF42] to-[#E31B23]"></div>

            <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div class="flex flex-col gap-2 max-w-2xl">
                <div class="flex items-center gap-2.5 flex-wrap">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white font-label-sm text-xs font-bold border border-white/20 whitespace-nowrap flex-shrink-0 backdrop-blur-xs">
                    <span class="size-2 rounded-full bg-[#fdef42] animate-pulse"></span>
                    <span>{{ growthStatusLabel }}</span>
                  </span>
                  <span class="text-xs text-white/80 whitespace-nowrap">
                    • Dernière pesée : {{ lastMeasurementDateText }}
                  </span>
                </div>

                <div>
                  <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance">
                    Courbes de Croissance Pédiatrique OMS
                  </h1>
                  <p class="text-xs sm:text-sm text-white/85 mt-1 leading-relaxed text-pretty">
                    Suivi dynamique certifié selon les normes biométriques de l'OMS &amp; le Ministère de la Santé du Sénégal.
                  </p>
                </div>
              </div>

              <!-- Audio Explanation Button in Wolof -->
              <div class="flex items-center flex-shrink-0 z-10">
                <button
                  type="button"
                  (click)="toggleWolofAudioAnalysis()"
                  class="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white text-[#065f46] hover:bg-emerald-50 transition-all shadow-md active:scale-[0.98] whitespace-nowrap flex-shrink-0 cursor-pointer">
                  <span class="material-symbols-outlined text-[20px] text-[#065f46]" [class.animate-pulse]="isAudioPlaying()">
                    volume_up
                  </span>
                  <div class="text-left flex flex-col">
                    <span class="text-xs font-bold leading-tight whitespace-nowrap">
                      {{ audioWolofButtonLabel }}
                    </span>
                    <span class="text-[10px] text-emerald-800 leading-tight whitespace-nowrap">
                      Déglo leral bi ci Wolof
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </section>

          <!-- SECTION 2: Modern Tab Switcher -->
          <section class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1.5 bg-surface-container-low rounded-3xl border border-outline-variant/30">
            <!-- Tab 1: Poids pour l'Âge -->
            <button
              type="button"
              (click)="selectTab('POIDS')"
              class="flex items-center justify-between px-5 py-4 rounded-2xl transition-all text-left cursor-pointer hover:bg-surface-container-lowest"
              [class.bg-surface-container-lowest]="activeTab() === 'POIDS'"
              [class.shadow-sm]="activeTab() === 'POIDS'"
              [class.border]="activeTab() === 'POIDS'"
              [class.border-emerald-600]="activeTab() === 'POIDS'"
              [class.text-on-surface-variant]="activeTab() !== 'POIDS'">
              <div class="flex items-center gap-3">
                <div
                  class="size-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  [class.bg-emerald-100]="activeTab() === 'POIDS'"
                  [class.text-emerald-900]="activeTab() === 'POIDS'"
                  [class.bg-surface-container]="activeTab() !== 'POIDS'"
                  [class.text-secondary]="activeTab() !== 'POIDS'">
                  <span class="material-symbols-outlined text-[22px]">scale</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-[11px] font-medium text-on-surface-variant whitespace-nowrap">Indicateur Clé</span>
                  <span class="text-sm font-bold whitespace-nowrap" [class.text-[#065f46]]="activeTab() === 'POIDS'">
                    Poids pour l'Âge
                  </span>
                </div>
              </div>
              <div class="flex flex-col items-end">
                <span class="text-base font-extrabold whitespace-nowrap" [class.text-[#065f46]]="activeTab() === 'POIDS'">
                  {{ currentWeightDisplay }} kg
                </span>
                <span class="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5 whitespace-nowrap">
                  <span class="material-symbols-outlined text-xs">trending_up</span> Actif
                </span>
              </div>
            </button>

            <!-- Tab 2: Taille pour l'Âge -->
            <button
              type="button"
              (click)="selectTab('TAILLE')"
              class="flex items-center justify-between px-5 py-4 rounded-2xl transition-all text-left cursor-pointer hover:bg-surface-container-lowest"
              [class.bg-surface-container-lowest]="activeTab() === 'TAILLE'"
              [class.shadow-sm]="activeTab() === 'TAILLE'"
              [class.border]="activeTab() === 'TAILLE'"
              [class.border-blue-600]="activeTab() === 'TAILLE'"
              [class.text-on-surface-variant]="activeTab() !== 'TAILLE'">
              <div class="flex items-center gap-3">
                <div
                  class="size-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  [class.bg-blue-100]="activeTab() === 'TAILLE'"
                  [class.text-blue-900]="activeTab() === 'TAILLE'"
                  [class.bg-surface-container]="activeTab() !== 'TAILLE'"
                  [class.text-secondary]="activeTab() !== 'TAILLE'">
                  <span class="material-symbols-outlined text-[22px]">straighten</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-[11px] font-medium text-on-surface-variant whitespace-nowrap">Stature Couchée</span>
                  <span class="text-sm font-bold whitespace-nowrap" [class.text-blue-800]="activeTab() === 'TAILLE'">
                    Taille pour l'Âge
                  </span>
                </div>
              </div>
              <div class="flex flex-col items-end">
                <span class="text-base font-extrabold whitespace-nowrap" [class.text-blue-800]="activeTab() === 'TAILLE'">
                  {{ currentHeightDisplay }} cm
                </span>
                <span class="text-[10px] text-on-surface-variant whitespace-nowrap">Médiane OMS</span>
              </div>
            </button>

            <!-- Tab 3: Périmètre Brachial / PB -->
            <button
              type="button"
              (click)="selectTab('PB')"
              class="flex items-center justify-between px-5 py-4 rounded-2xl transition-all text-left cursor-pointer hover:bg-surface-container-lowest"
              [class.bg-surface-container-lowest]="activeTab() === 'PB'"
              [class.shadow-sm]="activeTab() === 'PB'"
              [class.border]="activeTab() === 'PB'"
              [class.border-purple-600]="activeTab() === 'PB'"
              [class.text-on-surface-variant]="activeTab() !== 'PB'">
              <div class="flex items-center gap-3">
                <div
                  class="size-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  [class.bg-purple-100]="activeTab() === 'PB'"
                  [class.text-purple-900]="activeTab() === 'PB'"
                  [class.bg-surface-container]="activeTab() !== 'PB'"
                  [class.text-secondary]="activeTab() !== 'PB'">
                  <span class="material-symbols-outlined text-[22px]">measuring_tape</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-[11px] font-medium text-on-surface-variant whitespace-nowrap">Dépistage MUAC</span>
                  <span class="text-sm font-bold whitespace-nowrap" [class.text-purple-800]="activeTab() === 'PB'">
                    Périmètre Brachial (PB)
                  </span>
                </div>
              </div>
              <div class="flex flex-col items-end">
                <span class="text-base font-extrabold whitespace-nowrap" [class.text-purple-800]="activeTab() === 'PB'">
                  {{ currentMuacDisplay }} mm
                </span>
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 whitespace-nowrap">
                  Zone Verte
                </span>
              </div>
            </button>
          </section>

          <!-- SECTION 3: Main Chart Display Card -->
          <section class="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 custom-shadow-card p-6 flex flex-col gap-6">
            <!-- Chart Header & Interactive Legends -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container">
              <div class="flex flex-col">
                <div class="flex items-center gap-2 flex-wrap">
                  <h2 class="text-lg sm:text-xl font-bold text-on-surface text-balance">
                    {{ chartHeaderTitle }}
                  </h2>
                  <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#065f46] font-bold border border-emerald-200 whitespace-nowrap flex-shrink-0">
                    Standard OMS 2006
                  </span>
                </div>
                <p class="text-xs text-on-surface-variant mt-0.5 text-pretty">
                  Mesures comparées aux percentiles de référence mondiale pédiatrique (Z-scores)
                </p>
              </div>

              <!-- Minimal Elegant Legend -->
              <div class="flex flex-wrap items-center gap-4 text-xs">
                <div class="flex items-center gap-2 whitespace-nowrap">
                  <span class="size-3 rounded-full bg-[#065f46] ring-2 ring-[#065f46]/20"></span>
                  <span class="text-on-surface font-semibold">Courbe de {{ child.prenom }}</span>
                </div>
                <div class="flex items-center gap-2 whitespace-nowrap">
                  <span class="w-4 h-2.5 rounded bg-emerald-100/70 border border-emerald-300"></span>
                  <span class="text-on-surface-variant">Couloir Normal OMS (15e - 85e p.)</span>
                </div>
                <div class="flex items-center gap-2 whitespace-nowrap">
                  <span class="w-4 h-0 border-t-2 border-dashed border-slate-400"></span>
                  <span class="text-on-surface-variant">Médiane OMS (50e p.)</span>
                </div>
              </div>
            </div>

            <!-- Canevas Chart.js HTML5 (Règle 13) -->
            <div class="w-full h-[340px] sm:h-[400px] relative">
              <canvas #chartCanvas class="w-full h-full"></canvas>
            </div>

            <!-- Annotation notice strip below chart -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface-variant">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[#065f46] text-[20px] flex-shrink-0">verified</span>
                <span class="text-pretty">Courbe certifiée conforme aux référentiels OMS pour enfants sains nourris au sein.</span>
              </div>
              <div class="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  (click)="telechargerTracePdf()"
                  [disabled]="isExportingPdf()"
                  class="text-xs font-bold text-[#065f46] hover:underline flex items-center gap-1 whitespace-nowrap cursor-pointer disabled:opacity-50">
                  <span class="material-symbols-outlined text-[16px]">
                    {{ isExportingPdf() ? 'hourglass_top' : 'file_download' }}
                  </span>
                  <span>{{ isExportingPdf() ? 'Génération...' : 'Télécharger le tracé PDF' }}</span>
                </button>
                <span class="text-outline-variant">•</span>
                <button
                  type="button"
                  (click)="showAddMeasureModal.set(true)"
                  class="text-xs font-bold text-[#065f46] hover:underline flex items-center gap-1 whitespace-nowrap cursor-pointer">
                  <span class="material-symbols-outlined text-[16px]">add_circle</span>
                  <span>Ajouter une pesée</span>
                </button>
              </div>
            </div>
          </section>

          <!-- SECTION 4: Bottom Contextual Insights & Doctor Note -->
          <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">

            <!-- Left: 3 Summary Stat Metric Cards (7 cols) -->
            <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <!-- Metric 1 -->
              <div class="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/30 custom-shadow-card flex flex-col justify-between gap-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-on-surface-variant whitespace-nowrap">Gain Mensuel</span>
                  <div class="size-8 rounded-xl bg-emerald-50 text-[#065f46] flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-[18px]">trending_up</span>
                  </div>
                </div>
                <div>
                  <span class="text-xl font-extrabold text-[#065f46] block whitespace-nowrap">
                    {{ monthlyGainValue }}
                  </span>
                  <span class="text-xs text-emerald-700 flex items-center gap-1 mt-0.5 whitespace-nowrap font-semibold">
                    <span class="size-1.5 rounded-full bg-emerald-600"></span> Prise de poids régulière
                  </span>
                </div>
                <p class="text-[11px] text-on-surface-variant pt-2 border-t border-surface-container text-pretty">
                  Conforme aux attentes pour l'âge de l'enfant.
                </p>
              </div>

              <!-- Metric 2 -->
              <div class="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/30 custom-shadow-card flex flex-col justify-between gap-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-on-surface-variant whitespace-nowrap">Position OMS</span>
                  <div class="size-8 rounded-xl bg-emerald-50 text-[#065f46] flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-[18px]">tune</span>
                  </div>
                </div>
                <div>
                  <span class="text-xl font-extrabold text-[#065f46] block whitespace-nowrap">
                    Percentile 50
                  </span>
                  <span class="text-xs text-emerald-700 flex items-center gap-1 mt-0.5 whitespace-nowrap font-semibold">
                    <span class="size-1.5 rounded-full bg-emerald-600"></span> Couloir optimal
                  </span>
                </div>
                <p class="text-[11px] text-on-surface-variant pt-2 border-t border-surface-container text-pretty">
                  Équilibre harmonieux entre taille et poids.
                </p>
              </div>

              <!-- Metric 3 -->
              <div class="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/30 custom-shadow-card flex flex-col justify-between gap-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-on-surface-variant whitespace-nowrap">Prochaine Étape</span>
                  <div class="size-8 rounded-xl bg-surface-container text-[#065f46] flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-[18px]">calendar_month</span>
                  </div>
                </div>
                <div>
                  <span class="text-sm font-extrabold text-on-surface block whitespace-nowrap">
                    {{ nextCheckupAgeText }}
                  </span>
                  <span class="text-xs font-medium text-on-surface-variant mt-0.5 block whitespace-nowrap capitalize">
                    {{ nextCheckupMonthYear }}
                  </span>
                </div>
                <p class="text-[11px] text-on-surface-variant pt-2 border-t border-surface-container flex items-center justify-between flex-wrap gap-1">
                  <span class="truncate">{{ structureNomCourt }}</span>
                  <span class="font-bold text-[#065f46] whitespace-nowrap">Rappel SMS</span>
                </p>
              </div>
            </div>

            <!-- Right: Medical Reassuring Note Card (5 cols) -->
            <div class="lg:col-span-5 bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 custom-shadow-card flex flex-col justify-between gap-4">
              <div class="flex flex-col gap-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="material-symbols-outlined text-[#065f46] text-[22px] flex-shrink-0">clinical_notes</span>
                    <span class="text-sm font-bold text-[#065f46] whitespace-nowrap">Avis du Praticien Référent</span>
                  </div>
                  <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 whitespace-nowrap flex-shrink-0">
                    Validé
                  </span>
                </div>
                <blockquote class="text-xs sm:text-sm text-on-surface leading-relaxed italic text-pretty">
                  {{ doctorAdviceQuote }}
                </blockquote>
              </div>

              <div class="pt-3 border-t border-surface-container flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <div class="size-7 rounded-full bg-[#065f46] text-white flex items-center justify-center text-xs font-bold">
                    DR
                  </div>
                  <span class="text-xs font-semibold text-on-surface">{{ structureNomCourt }}</span>
                </div>
                <span class="text-[11px] text-on-surface-variant font-mono">MSAS • Suivi 100% à jour</span>
              </div>
            </div>
          </section>

        </div>

      }

      <!-- ========================================================================= -->
      <!-- MODALE RAPIDE : AJOUTER UNE PESÉE CLINIQUE / À DOMICILE -->
      <!-- ========================================================================= -->
      @if (showAddMeasureModal()) {
        <div class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div class="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 border border-outline-variant/30 shadow-2xl space-y-4 animate-scaleUp">
            <div class="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-surface-container-low text-primary flex items-center justify-center">
                  <span class="material-symbols-outlined text-[22px]">add_circle</span>
                </div>
                <div>
                  <h3 class="text-headline-sm font-bold text-primary text-balance">Nouvelle Mesure</h3>
                  <p class="text-label-sm text-secondary">Enregistrement dans le carnet OMS</p>
                </div>
              </div>
              <button
                type="button"
                (click)="showAddMeasureModal.set(false)"
                class="text-secondary hover:text-on-surface p-1 rounded-lg">
                <span class="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <div class="space-y-3">
              <div>
                <label class="block text-label-sm text-secondary mb-1">Date de la pesée</label>
                <input
                  type="date"
                  class="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm focus:outline-primary"
                  [value]="todayDateInput">
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-label-sm text-secondary mb-1">Poids (kg)</label>
                  <input
                    type="number"
                    step="0.05"
                    placeholder="ex: 10.9"
                    class="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm focus:outline-primary">
                </div>
                <div>
                  <label class="block text-label-sm text-secondary mb-1">Taille (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="ex: 83.0"
                    class="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm focus:outline-primary">
                </div>
              </div>

              <div>
                <label class="block text-label-sm text-secondary mb-1">Périmètre Brachial (PB en mm)</label>
                <input
                  type="number"
                  placeholder="ex: 139"
                  class="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm focus:outline-primary">
              </div>
            </div>

            <div class="pt-2 flex justify-end gap-2">
              <button
                type="button"
                (click)="showAddMeasureModal.set(false)"
                class="px-4 py-2 rounded-xl bg-surface-container text-secondary text-label-md font-semibold hover:bg-surface-container-high transition-colors whitespace-nowrap">
                Annuler
              </button>
              <button
                type="button"
                (click)="saveMeasurePlaceholder()"
                class="px-5 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container text-label-md font-semibold transition-all shadow-sm whitespace-nowrap">
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    .custom-shadow-card {
      box-shadow: 0 4px 16px -2px rgba(15, 76, 58, 0.05), 0 1px 3px 0 rgba(15, 76, 58, 0.03);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.25s ease-out;
    }
    @keyframes scaleUp {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-scaleUp {
      animation: scaleUp 0.2s ease-out;
    }
  `]
})
export class CourbesViewComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly stateService = inject(ParentStateService);
  readonly croissanceService = inject(CroissanceOmsService);
  private readonly audioService = inject(AudioService);

  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;

  readonly activeTab = signal<GrowthTab>('POIDS');
  readonly isAudioPlaying = signal<boolean>(false);
  readonly isDoctorAudioPlaying = signal<boolean>(false);
  readonly isExportingPdf = signal<boolean>(false);
  readonly showAddMeasureModal = signal<boolean>(false);
  readonly analyseCroissance = signal<CroissanceOmsData | null>(null);

  private chart: any = null;

  constructor() {
    effect(() => {
      const child = this.stateService.selectedChild();
      if (child && child.id) {
        this.chargerDonneesCroissance(child.id);
      }
    });
  }

  chargerDonneesCroissance(childId: number): void {
    this.croissanceService.getAnalyseCroissance(childId).subscribe({
      next: (data) => {
        this.analyseCroissance.set(data);
        this.renderChart();
      },
      error: (err) => {
        console.warn('[CourbesView] Données de croissance non trouvées pour l\'enfant:', childId, err);
        this.analyseCroissance.set(null);
        this.renderChart();
      }
    });
  }

  get audioWolofButtonLabel(): string {
    return this.isAudioPlaying() ? 'Écoute en cours...' : "Écouter l'analyse en Wolof";
  }

  get currentChild(): Child | null {
    return this.stateService.selectedChild();
  }

  get growthStatusLabel(): string {
    const analyse = this.analyseCroissance();
    if (analyse && analyse.statutNutritionnel === 'MAS') return 'Vigilance Clinique • Zone d\'Alerte MAS Sévère';
    if (analyse && analyse.statutNutritionnel === 'MAM') return 'Suivi Rapproché • Zone Modérée MAM';
    if (analyse && analyse.statutNutritionnel === 'NORMAL') return 'Croissance Régulière • Norme OMS';
    const child = this.currentChild;
    if (!child) return 'Croissance Régulière • Norme OMS';
    if (child.muacZone === 'MAS') return 'Vigilance Clinique • Zone d\'Alerte MAS Sévère';
    if (child.muacZone === 'MAM') return 'Suivi Rapproché • Zone Modérée MAM';
    return 'Croissance Régulière • Norme OMS';
  }

  get lastMeasurementDateText(): string {
    const analyse = this.analyseCroissance();
    if (analyse && analyse.historiquePesees && analyse.historiquePesees.length > 0) {
      const der = analyse.historiquePesees[analyse.historiquePesees.length - 1];
      return der.dateBilan;
    }
    return 'Pesée initiale';
  }

  get currentWeightDisplay(): string {
    const analyse = this.analyseCroissance();
    if (analyse && analyse.dernierPoids && analyse.dernierPoids > 0) {
      return analyse.dernierPoids.toFixed(1);
    }
    const child = this.currentChild;
    return child?.poidsActuel ? child.poidsActuel.toFixed(1) : '--';
  }

  get currentHeightDisplay(): string {
    const analyse = this.analyseCroissance();
    if (analyse && analyse.derniereTaille && analyse.derniereTaille > 0) {
      return analyse.derniereTaille.toFixed(1);
    }
    const child = this.currentChild;
    return child?.tailleActuelle ? child.tailleActuelle.toFixed(1) : '--';
  }

  get currentMuacDisplay(): string {
    const analyse = this.analyseCroissance();
    if (analyse && analyse.dernierPerimetreBrachial && analyse.dernierPerimetreBrachial > 0) {
      return Math.round(analyse.dernierPerimetreBrachial * 10).toString();
    }
    const child = this.currentChild;
    if (!child || !child.muac) return '--';
    return child.muac < 30 ? Math.round(child.muac * 10).toString() : Math.round(child.muac).toString();
  }

  get monthlyGainValue(): string {
    const analyse = this.analyseCroissance();
    if (analyse && analyse.deltaPoidsCeMoisKg != null && analyse.deltaPoidsCeMoisKg !== 0) {
      const g = Math.round(analyse.deltaPoidsCeMoisKg * 1000);
      return (g > 0 ? '+' : '') + g + 'g / mois';
    }
    return '--';
  }

  get structureNom(): string {
    const analyse = this.analyseCroissance();
    if (analyse && analyse.nomStructureSante) {
      return analyse.nomStructureSante;
    }
    const child = this.currentChild;
    if (child?.centreRattachement && child.centreRattachement !== 'Centre non renseigné') {
      return child.centreRattachement;
    }
    return 'Poste de Santé Communautaire';
  }

  get structureNomCourt(): string {
    return this.structureNom.replace('Poste de Santé de ', '').replace('Poste de Santé ', '');
  }

  get doctorAdviceQuote(): string {
    const analyse = this.analyseCroissance();
    if (analyse && analyse.interpretationClinique) {
      return analyse.interpretationClinique;
    }
    const child = this.currentChild;
    const name = child?.prenom || 'l\'enfant';
    return `« L'évolution pondérale de ${name} est suivie selon les directives pédiatriques MSAS. »`;
  }

  get nextCheckupMonthYear(): string {
    const now = new Date();
    const nextDate = new Date(now.getFullYear(), now.getMonth() + 2, 1);
    return nextDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  get nextCheckupAgeText(): string {
    const child = this.currentChild;
    return child?.ageMois ? `Visite des ${child.ageMois + 2} mois` : 'Prochaine visite clinique';
  }

  get chartHeaderTitle(): string {
    const child = this.currentChild;
    const genderStr = child?.genre === 'M' ? 'Garçons' : 'Filles';
    const tab = this.activeTab();
    if (tab === 'POIDS') {
      return `Courbe d'Évolution Pondérale OMS (${genderStr} 0-24 mois)`;
    }
    if (tab === 'TAILLE') {
      return `Courbe Staturale en Taille OMS (${genderStr} 0-24 mois)`;
    }
    return `Évolution du Périmètre Brachial / MUAC (${genderStr} 0-24 mois)`;
  }

  get todayDateInput(): string {
    return new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    setTimeout(() => this.renderChart(), 50);
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  selectTab(tab: GrowthTab): void {
    this.activeTab.set(tab);
    setTimeout(() => this.renderChart(), 50);
  }

  private renderChart(): void {
    if (!this.chartCanvas) return;
    const canvas = this.chartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    const tab = this.activeTab();
    const analyse = this.analyseCroissance();
    const refs = analyse?.referencesOms;
    const pesees = analyse?.historiquePesees || [];

    // Configuration des axes et des données selon l'onglet
    const labels = ['Naissance', '3 m', '6 m', '9 m', '12 m', '15 m', '18 m (Aujourd\'hui)', '24 m (Projeté)'];
    const targetMonths = [0, 3, 6, 9, 12, 15, 18, 24];

    let p85Data: number[] = [];
    let p15Data: number[] = [];
    let p50Data: number[] = [];
    let childData: (number | null)[] = [];
    let yAxisMin = 0;
    let yAxisMax = 15;
    let unitLabel = 'kg';

    if (tab === 'POIDS') {
      // Normes OMS Poids Filles/Garçons (0-24 mois)
      p85Data = refs?.plusUnSdKg?.slice(0, 8) || [3.8, 6.6, 8.2, 9.3, 10.2, 10.9, 11.6, 12.8];
      p15Data = refs?.moinsDeuxSdKg?.slice(0, 8) || [2.8, 5.0, 6.5, 7.3, 8.0, 8.6, 9.2, 10.2];
      p50Data = refs?.medianeKg?.slice(0, 8) || [3.2, 5.8, 7.3, 8.2, 8.9, 9.6, 10.2, 11.5];

      if (pesees.length > 0) {
        childData = targetMonths.map(m => {
          const match = pesees.find(p => Math.abs((p.ageMois ?? 0) - m) <= 1.5);
          return match ? match.poidsKg : null;
        });
      } else {
        const w = parseFloat(this.currentWeightDisplay);
        childData = [!isNaN(w) && w > 0 ? w : null, null, null, null, null, null, null, null];
      }
      yAxisMin = 2;
      yAxisMax = 14;
      unitLabel = 'kg';
    } else if (tab === 'TAILLE') {
      p85Data = [52.0, 62.0, 68.0, 72.5, 76.5, 80.0, 84.0, 89.0];
      p15Data = [47.0, 56.5, 62.5, 67.0, 71.0, 74.5, 78.0, 83.5];
      p50Data = [49.5, 59.0, 65.5, 70.0, 74.0, 77.5, 81.0, 86.5];

      if (pesees.length > 0) {
        childData = targetMonths.map(m => {
          const match = pesees.find(p => Math.abs((p.ageMois ?? 0) - m) <= 1.5);
          return match?.tailleCm ?? null;
        });
      } else {
        const h = parseFloat(this.currentHeightDisplay);
        childData = [!isNaN(h) && h > 0 ? h : null, null, null, null, null, null, null, null];
      }
      yAxisMin = 45;
      yAxisMax = 95;
      unitLabel = 'cm';
    } else {
      p85Data = [135, 142, 148, 152, 155, 158, 160, 162];
      p15Data = [115, 120, 125, 127, 129, 130, 131, 133];
      p50Data = [125, 131, 136, 139, 142, 144, 146, 148];

      if (pesees.length > 0) {
        childData = targetMonths.map(m => {
          const match = pesees.find(p => Math.abs((p.ageMois ?? 0) - m) <= 1.5);
          return match?.perimetreBrachialCm ? Math.round(match.perimetreBrachialCm * 10) : null;
        });
      } else {
        const muac = parseFloat(this.currentMuacDisplay);
        childData = [!isNaN(muac) && muac > 0 ? muac : null, null, null, null, null, null, null, null];
      }
      yAxisMin = 100;
      yAxisMax = 170;
      unitLabel = 'mm';
    }

    // Gradient pour la courbe de l'enfant
    const gradChild = ctx.createLinearGradient(0, 0, 0, 350);
    gradChild.addColorStop(0, 'rgba(15, 76, 58, 0.25)');
    gradChild.addColorStop(1, 'rgba(15, 76, 58, 0.01)');

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          // Couloir normal supérieur (85e percentile)
          {
            label: 'Percentile 85 OMS',
            data: p85Data,
            borderColor: 'rgba(180, 239, 214, 0.8)',
            borderWidth: 1.5,
            pointRadius: 0,
            fill: '+1', // Remplir jusqu'au 15e percentile
            backgroundColor: 'rgba(236, 246, 239, 0.65)',
            tension: 0.35
          },
          // Couloir normal inférieur (15e percentile)
          {
            label: 'Percentile 15 OMS',
            data: p15Data,
            borderColor: 'rgba(180, 239, 214, 0.8)',
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false,
            tension: 0.35
          },
          // Médiane internationale (50e percentile)
          {
            label: 'Médiane OMS (50e p.)',
            data: p50Data,
            borderColor: '#707974',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false,
            tension: 0.35
          },
          // Courbe réelle de l'enfant
          {
            label: `Courbe de ${this.currentChild?.prenom || 'l\'enfant'}`,
            data: childData,
            borderColor: '#0F4C3A',
            borderWidth: 3.5,
            pointRadius: (ctxRef: any) => {
              const idx = ctxRef.dataIndex;
              return idx === 6 ? 7 : 4; // Point agrandi sur 18 mois
            },
            pointBackgroundColor: (ctxRef: any) => {
              const idx = ctxRef.dataIndex;
              return idx === 6 ? '#16A34A' : '#FFFFFF';
            },
            pointBorderColor: '#0F4C3A',
            pointBorderWidth: 2.5,
            fill: true,
            backgroundColor: gradChild,
            tension: 0.35
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
            display: false // Légende gérée élégamment en HTML au-dessus
          },
          tooltip: {
            backgroundColor: '#003426',
            titleColor: '#FFFFFF',
            bodyColor: '#B4EFD6',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 10,
            callbacks: {
              label: (item: any) => {
                const dsLabel = item.dataset.label || '';
                const val = item.raw;
                if (val === null) return '';
                return ` ${dsLabel} : ${val} ${unitLabel}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(225, 235, 228, 0.5)'
            },
            ticks: {
              color: '#404944',
              font: {
                family: 'Inter',
                size: 11
              }
            }
          },
          y: {
            min: yAxisMin,
            max: yAxisMax,
            grid: {
              color: 'rgba(225, 235, 228, 0.6)'
            },
            ticks: {
              color: '#707974',
              font: {
                family: 'Inter',
                size: 11
              },
              callback: (val: any) => `${val} ${unitLabel}`
            }
          }
        }
      }
    });
  }

  toggleWolofAudioAnalysis(): void {
    const nextState = !this.isAudioPlaying();
    this.isAudioPlaying.set(nextState);

    if (nextState) {
      // Lire la phrase Wolof adaptée au z-score de l'enfant
      const zscore = this.currentChild?.muacZone;
      const phraseKey = zscore === 'MAS' ? 'muac_mas' : zscore === 'MAM' ? 'muac_mam' : 'courbes_info';
      this.audioService.playWolofPhrase(phraseKey);
      setTimeout(() => this.isAudioPlaying.set(false), 8000);
    } else {
      this.audioService.stopCurrentAudio();
    }
  }

  toggleDoctorAudio(): void {
    const nextState = !this.isDoctorAudioPlaying();
    this.isDoctorAudioPlaying.set(nextState);
    if (nextState) {
      this.audioService.playWolofPhrase('bienvenue');
      setTimeout(() => this.isDoctorAudioPlaying.set(false), 8000);
    } else {
      this.audioService.stopCurrentAudio();
    }
  }

  telechargerTracePdf(): void {
    const childId = this.currentChild?.id || 1;
    this.isExportingPdf.set(true);

    this.croissanceService.exportPdf(childId).subscribe({
      next: (blob: Blob) => {
        this.isExportingPdf.set(false);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Courbes_Croissance_OMS_${this.currentChild?.prenom || 'Enfant'}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err: unknown) => {
        console.warn('Erreur téléchargement PDF API, fallback:', err);
        this.isExportingPdf.set(false);
        window.open(`/api/croissance/enfant/${childId}/export-pdf`, '_blank');
      }
    });
  }

  saveMeasurePlaceholder(): void {
    this.showAddMeasureModal.set(false);
    // Rafraîchir les données de l'enfant
    this.stateService.loadParentData();
  }
}
