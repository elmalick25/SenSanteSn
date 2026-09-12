import { Component, OnInit, inject, signal, effect, computed } from '@angular/core';
import { AudioService } from '../../../../core/services/audio.service';
import { CommonModule } from '@angular/common';
import { ParentStateService } from '../../../../core/services/parent-state.service';
import { RendezVousService } from '../../../../core/services/rendez-vous.service';
import { HealthToastService } from '../../../../core/services/health-toast.service';
import { RdvPageDataDTO, RendezVousDTO } from '../../../../core/models/rendez-vous.model';
import QRCode from 'qrcode';

interface ConsultationSymptom {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  checked: boolean;
}

@Component({
  selector: 'app-rdv-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 w-full pb-16 animate-fadeIn font-body-md text-on-surface antialiased">

      <!-- ========================================================================= -->
      <!-- 1. ÉTAT DE CHARGEMENT (SKELETON SHIMMER)                                  -->
      <!-- ========================================================================= -->
      @if (loading()) {
        <div class="space-y-6 animate-pulse w-full">
          <div class="h-32 w-full bg-surface-container-highest/60 rounded-3xl border border-outline-variant/30"></div>
          <div class="h-20 w-full bg-surface-container-highest/60 rounded-2xl border border-outline-variant/30"></div>
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div class="lg:col-span-5 h-[560px] bg-surface-container-highest/60 rounded-3xl border border-outline-variant/30"></div>
            <div class="lg:col-span-7 h-[560px] bg-surface-container-highest/60 rounded-3xl border border-outline-variant/30"></div>
          </div>
        </div>
      }

      <!-- ========================================================================= -->
      <!-- 2. ÉTAT D'ERREUR RÉSEAU                                                   -->
      <!-- ========================================================================= -->
      @if (error() && !loading()) {
        <div class="w-full pt-4">
          <div class="p-8 bg-error-container/40 border border-error/30 rounded-3xl text-center space-y-4 max-w-xl mx-auto shadow-sm">
            <span class="material-symbols-outlined text-error text-5xl">cloud_off</span>
            <h3 class="text-headline-sm font-bold text-on-error-container text-balance">
              Services de prise de rendez-vous momentanément indisponibles
            </h3>
            <p class="text-body-sm text-on-surface-variant leading-relaxed text-pretty">
              {{ error() }}
            </p>
            <div class="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                (click)="loadData()"
                class="px-5 py-2.5 bg-[#065f46] text-white hover:bg-[#047857] rounded-xl text-label-md font-semibold transition-all shadow-sm whitespace-nowrap flex-shrink-0 cursor-pointer">
                Réessayer la connexion
              </button>
            </div>
          </div>
        </div>
      }

      <!-- ========================================================================= -->
      <!-- 3. ÉTAT VIDE (AUCUN ENFANT ENREGISTRÉ)                                    -->
      <!-- ========================================================================= -->
      @if (!loading() && !data() && !error()) {
        <div class="w-full pt-4">
          <div class="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 text-center max-w-2xl mx-auto space-y-4 custom-shadow-card">
            <div class="w-16 h-16 rounded-2xl bg-emerald-50 text-[#065f46] flex items-center justify-center mx-auto border border-emerald-200">
              <span class="material-symbols-outlined text-3xl">child_care</span>
            </div>
            <h2 class="text-headline-md font-bold text-[#065f46] text-balance">Aucun enfant enregistré sur ce compte</h2>
            <p class="text-body-md text-on-surface-variant leading-relaxed max-w-lg mx-auto text-pretty">
              Aucun dossier pédiatrique n'est actuellement associé à votre profil. Dès l'enregistrement de votre enfant au poste de santé, vous pourrez réserver vos créneaux prioritaires Zéro Attente.
            </p>
          </div>
        </div>
      }

      <!-- ========================================================================= -->
      <!-- 4. ÉTAT NOMINAL : RENDU COMPLET SOVEREIGN 20/20                           -->
      <!-- ========================================================================= -->
      @if (!loading() && data(); as pageData) {

        <!-- SOVEREIGN HEADER CARD WITH SENEGAL RIBBON -->
        <header class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#065f46] via-[#047857] to-[#0f4c3a] text-white p-6 sm:p-8 custom-shadow-card">
          <!-- Senegal National Ribbon -->
          <div class="absolute top-0 left-0 right-0 h-1.5 flex">
            <div class="h-full flex-1 bg-[#00853F]"></div>
            <div class="h-full flex-1 bg-[#FDEF42]"></div>
            <div class="h-full flex-1 bg-[#E31B23]"></div>
          </div>

          <!-- Watermark Background -->
          <div class="absolute -right-8 -bottom-10 opacity-10 pointer-events-none select-none">
            <span class="material-symbols-outlined text-[180px]">event_available</span>
          </div>

          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="space-y-2">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-emerald-100 text-xs font-semibold border border-white/15 whitespace-nowrap flex-shrink-0">
                <span class="material-symbols-outlined text-[15px] text-[#FDEF42]">verified</span>
                <span>République du Sénégal • Service National de Pédiatrie MSAS</span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance">
                Prise de Rendez-vous Garanti (Zéro Attente)
              </h1>
              <p class="text-sm sm:text-base text-emerald-100/90 max-w-2xl text-pretty leading-relaxed">
                Réservation prioritaire d'un créneau fixe pour <strong class="text-white">{{ childNomComplet }}</strong>.
                Votre place est réservée en salle de consultation sans temps d'attente prolongé.
              </p>
            </div>

            <!-- Wolof Audio Guide Button -->
            <button
              type="button"
              (click)="toggleWolofRdvGuide()"
              class="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-[0.98] border border-white/25 text-white transition-all shadow-md whitespace-nowrap flex-shrink-0 self-start md:self-auto cursor-pointer"
              title="Écouter le guide de rendez-vous en Wolof">
              <span class="material-symbols-outlined text-[24px] text-[#FDEF42]">
                {{ isTopAudioPlaying() ? 'volume_up' : 'volume_up' }}
              </span>
              <div class="text-left">
                <span class="text-[11px] uppercase tracking-wider text-emerald-200 block font-bold">Audio Wolof</span>
                <span class="text-xs font-bold text-white block">
                  {{ isTopAudioPlaying() ? 'Écoute en cours...' : 'Naka ngay jële ràndewu' }}
                </span>
              </div>
            </button>
          </div>
        </header>

        <!-- HORIZONTAL STATUS PROGRESS TRACKER (4 STEPS) -->
        <section aria-label="Progression du rendez-vous" class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 sm:p-5 custom-shadow-card">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
            <!-- Step 1: Completed -->
            <div class="flex items-center gap-3">
              <div class="size-8 rounded-full bg-emerald-100 text-[#065f46] flex items-center justify-center flex-shrink-0 font-bold">
                <span class="material-symbols-outlined text-sm font-bold">check</span>
              </div>
              <div class="min-w-0">
                <p class="text-xs font-bold text-on-surface truncate whitespace-nowrap">1. Demande</p>
                <p class="text-[11px] text-on-surface-variant truncate whitespace-nowrap">Enregistrée</p>
              </div>
            </div>

            <!-- Step 2: Completed -->
            <div class="flex items-center gap-3 relative before:hidden sm:before:block before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2 before:w-6 before:h-0.5 before:bg-emerald-200">
              <div class="size-8 rounded-full bg-emerald-100 text-[#065f46] flex items-center justify-center flex-shrink-0 font-bold">
                <span class="material-symbols-outlined text-sm font-bold">check</span>
              </div>
              <div class="min-w-0">
                <p class="text-xs font-bold text-on-surface truncate whitespace-nowrap">2. Triage Référent</p>
                <p class="text-[11px] text-on-surface-variant truncate whitespace-nowrap">Infirmier MSAS</p>
              </div>
            </div>

            <!-- Step 3: Active Confirmed -->
            <div class="flex items-center gap-3 bg-emerald-50/80 px-3 py-2 rounded-xl border border-emerald-200">
              <div class="size-8 rounded-full bg-[#065f46] text-white flex items-center justify-center flex-shrink-0 font-bold shadow-sm ring-2 ring-emerald-300">
                <span class="material-symbols-outlined text-sm font-bold">verified</span>
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <p class="text-xs font-bold text-[#065f46] truncate whitespace-nowrap">3. Confirmé</p>
                  <span class="bg-[#065f46] text-white text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded-full whitespace-nowrap flex-shrink-0">
                    Actif
                  </span>
                </div>
                <p class="text-[11px] text-emerald-800 font-medium truncate whitespace-nowrap">Pass Zéro Attente émis</p>
              </div>
            </div>

            <!-- Step 4: Upcoming -->
            <div class="flex items-center gap-3 opacity-60">
              <div class="size-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center flex-shrink-0 border border-outline-variant/50">
                <span class="material-symbols-outlined text-sm">schedule</span>
              </div>
              <div class="min-w-0">
                <p class="text-xs font-semibold text-on-surface-variant truncate whitespace-nowrap">4. Consultation</p>
                <p class="text-[11px] text-on-surface-variant truncate whitespace-nowrap">Post-visite</p>
              </div>
            </div>
          </div>
        </section>

        <!-- TWO COLUMNS GRID: REQUEST FLOW vs CALENDAR & BOARDING PASS -->
        <div class="grid grid-cols-12 gap-8 items-start">

          <!-- =================================================================== -->
          <!-- LEFT COLUMN: 3-STEP RESERVATION FLOW (5 Cols)                       -->
          <!-- =================================================================== -->
          <div class="col-span-12 lg:col-span-5 space-y-6">
            <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 custom-shadow-card space-y-6">
              <div class="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                <div class="flex items-center gap-2.5">
                  <span class="material-symbols-outlined text-[#065f46] text-[22px] flex-shrink-0">assignment_turned_in</span>
                  <h2 class="text-base font-bold text-[#065f46] text-balance">
                    Protocole de Réservation
                  </h2>
                </div>
                <span class="text-xs font-semibold text-[#065f46] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 whitespace-nowrap flex-shrink-0">
                  3 Étapes Simplifiées
                </span>
              </div>

              <!-- ÉTAPE 1: Enfant Bénéficiaire -->
              <div class="relative pl-7 pb-6 border-l-2 border-emerald-200 space-y-3">
                <span class="absolute -left-[15px] top-0 size-7 rounded-full bg-[#065f46] text-white flex items-center justify-center text-xs shadow-xs ring-4 ring-surface-container-lowest">
                  <span class="material-symbols-outlined text-xs font-bold">check</span>
                </span>
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-[10px] font-extrabold uppercase tracking-wider text-[#065f46]">Étape 1</span>
                    <h3 class="text-sm font-bold text-on-surface text-balance">Enfant bénéficiaire</h3>
                  </div>
                  <span class="text-[11px] font-bold text-[#065f46] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 whitespace-nowrap flex-shrink-0">
                    Validé
                  </span>
                </div>

                <!-- Selected Infant Mini Card -->
                <div class="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <img
                      class="size-11 rounded-xl object-cover border border-outline-variant flex-shrink-0"
                      [src]="childPhotoUrl"
                      [alt]="childNomComplet">
                    <div class="min-w-0">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <p class="text-sm font-bold text-on-surface truncate">{{ childNomComplet }}</p>
                        <span class="text-[10px] bg-emerald-100 text-[#065f46] px-2 py-0.5 rounded-full font-bold whitespace-nowrap flex-shrink-0">
                          Actif
                        </span>
                      </div>
                      <p class="text-xs text-on-surface-variant truncate">
                        {{ childAgeMois }} mois • Carnet N° {{ childCarnetRef }}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    (click)="notifyEditChild()"
                    class="text-on-surface-variant hover:text-[#065f46] p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer flex-shrink-0"
                    title="Changer d'enfant">
                    <span class="material-symbols-outlined text-sm">swap_horiz</span>
                  </button>
                </div>
              </div>

              <!-- ÉTAPE 2: Date & Créneau -->
              <div class="relative pl-7 pb-6 border-l-2 border-emerald-200 space-y-3">
                <span class="absolute -left-[15px] top-0 size-7 rounded-full bg-[#065f46] text-white flex items-center justify-center text-xs shadow-xs ring-4 ring-surface-container-lowest">
                  <span class="material-symbols-outlined text-xs">event_available</span>
                </span>
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-[10px] font-extrabold uppercase tracking-wider text-[#065f46]">Étape 2</span>
                    <h3 class="text-sm font-bold text-on-surface text-balance">Date &amp; Créneau horaire</h3>
                  </div>
                  <span class="text-[11px] font-bold bg-[#065f46] text-white px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                    Sélectionné
                  </span>
                </div>

                <!-- Chosen Slot Summary Box -->
                <div class="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <div class="flex items-center justify-between flex-wrap gap-2">
                    <div class="flex items-center gap-2 text-[#065f46] text-sm">
                      <span class="material-symbols-outlined text-[18px]">calendar_month</span>
                      <span class="font-extrabold whitespace-nowrap capitalize">{{ selectedDateFormatted() }}</span>
                    </div>
                    <span class="text-xs font-extrabold bg-[#065f46] text-white px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                      {{ selectedSlot() }} pile
                    </span>
                  </div>
                  <div class="flex items-center gap-1.5 text-emerald-900 text-xs">
                    <span class="material-symbols-outlined text-sm text-[#065f46] flex-shrink-0">verified_user</span>
                    <span class="text-pretty font-medium">Pass Zéro Attente activé : Entrée directe sans file</span>
                  </div>
                </div>
              </div>

              <!-- ÉTAPE 3: Motif & Symptômes -->
              <div class="relative pl-7 space-y-4">
                <span class="absolute -left-[15px] top-0 size-7 rounded-full bg-surface-container text-[#065f46] font-extrabold flex items-center justify-center text-xs shadow-xs ring-4 ring-surface-container-lowest border border-emerald-300">
                  3
                </span>
                <div>
                  <span class="text-[10px] font-extrabold uppercase tracking-wider text-[#065f46]">Étape 3</span>
                  <h3 class="text-sm font-bold text-on-surface text-balance">
                    Motif de consultation &amp; Symptômes
                  </h3>
                  <p class="text-xs text-on-surface-variant text-pretty">
                    Cochez les éléments à surveiller lors de la visite clinique.
                  </p>
                </div>

                <!-- Checkbox List -->
                <div class="space-y-2">
                  @for (symptom of symptoms; track symptom.id) {
                    <label
                      class="flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none"
                      [ngClass]="symptom.checked ? 'border-emerald-300 bg-emerald-50/50' : 'border-outline-variant/30 bg-surface-container-lowest hover:bg-surface-container-low'">
                      <input
                        type="checkbox"
                        [checked]="symptom.checked"
                        (change)="toggleSymptom(symptom)"
                        class="size-4 rounded text-[#065f46] focus:ring-[#065f46] border-outline-variant cursor-pointer">
                      <div class="flex-1 min-w-0">
                        <span class="text-xs font-bold flex items-center gap-1.5 text-balance" [ngClass]="symptom.checked ? 'text-[#065f46]' : 'text-on-surface'">
                          <span class="material-symbols-outlined text-[16px]" [ngClass]="symptom.checked ? 'text-[#065f46]' : 'text-on-surface-variant'">
                            {{ symptom.icon }}
                          </span>
                          <span>{{ symptom.title }}</span>
                        </span>
                        <span class="text-[11px] text-on-surface-variant block truncate">
                          {{ symptom.subtitle }}
                        </span>
                      </div>
                    </label>
                  }
                </div>

                <!-- Note optionnelle pour le praticien -->
                <div class="space-y-1.5 pt-2">
                  <div class="flex items-center justify-between">
                    <label class="text-xs font-bold text-on-surface whitespace-nowrap">
                      Note pour le praticien :
                    </label>
                    <span class="text-[11px] text-on-surface-variant whitespace-nowrap">Facultatif</span>
                  </div>
                  <textarea
                    [value]="practitionerNote()"
                    (input)="updateNote($event)"
                    class="w-full rounded-2xl border border-outline-variant/40 p-3 text-xs text-on-surface bg-surface-container-lowest focus:ring-2 focus:ring-[#065f46] focus:border-[#065f46] placeholder:text-outline"
                    placeholder="Indiquez toute précision (température, antécédents...)"
                    rows="2"></textarea>
                </div>

                <!-- Action Button -->
                <button
                  type="button"
                  (click)="validerCreneauReserve()"
                  [disabled]="isValidating()"
                  class="w-full h-12 bg-gradient-to-r from-[#065f46] to-[#047857] hover:from-[#047857] hover:to-[#065f46] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] whitespace-nowrap flex-shrink-0 cursor-pointer disabled:opacity-50">
                  <span class="material-symbols-outlined text-sm" [class.animate-spin]="isValidating()">
                    {{ isValidating() ? 'sync' : 'how_to_reg' }}
                  </span>
                  <span class="whitespace-nowrap">{{ isValidating() ? 'Validation en cours...' : 'Valider le créneau réservé' }}</span>
                </button>
              </div>
            </div>

            <!-- Relais Communautaire / Badiene Gox Card -->
            <div class="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-5 flex items-center gap-4 custom-shadow-card">
              <div class="size-11 rounded-2xl bg-emerald-100 text-[#065f46] flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-[24px]">support_agent</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-[#065f46] text-balance">
                  Besoin d'un accompagnement à domicile ?
                </p>
                <p class="text-[11px] text-on-surface-variant text-pretty leading-relaxed">
                  La « Badiene Gox » de Pikine Ouest peut vous assister pour ce rendez-vous.
                </p>
              </div>
              <button
                type="button"
                (click)="contacterBadieneGox()"
                class="px-3.5 py-2 text-xs font-bold text-[#065f46] bg-surface-container-lowest border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer">
                Contacter
              </button>
            </div>
          </div>

          <!-- =================================================================== -->
          <!-- RIGHT COLUMN: CALENDAR WIDGET & BOARDING PASS (7 Cols)              -->
          <!-- =================================================================== -->
          <div class="col-span-12 lg:col-span-7 space-y-6">

            <!-- 1. ROLLING CALENDAR & SLOT MATRIX WIDGET -->
            <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 custom-shadow-card space-y-5">
              <!-- Calendar Header & Navigation Controls -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                  <div class="size-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-[#065f46] flex-shrink-0">
                    <span class="material-symbols-outlined text-[22px]">calendar_month</span>
                  </div>
                  <div>
                    <h3 class="text-base font-bold text-[#065f46] whitespace-nowrap">{{ currentMonthTitle() }}</h3>
                    <p class="text-xs text-on-surface-variant whitespace-nowrap">Créneaux pédiatriques garantis MSAS</p>
                  </div>
                  <div class="flex items-center gap-1 ml-2 bg-surface-container-low rounded-xl p-1 border border-outline-variant/30">
                    <button
                      type="button"
                      (click)="changeMonth(-1)"
                      class="size-7 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-[#065f46] hover:bg-surface-container transition-colors cursor-pointer"
                      title="Mois précédent">
                      <span class="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button
                      type="button"
                      (click)="changeMonth(1)"
                      class="size-7 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-[#065f46] hover:bg-surface-container transition-colors cursor-pointer"
                      title="Mois suivant">
                      <span class="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                </div>

                <!-- Mode Switcher: 14 Jours / Calendrier Complet -->
                <div class="flex items-center bg-surface-container p-1 rounded-xl text-xs border border-outline-variant/30 self-start sm:self-auto">
                  <button
                    type="button"
                    (click)="calendarMode.set('14DAYS')"
                    class="px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
                    [ngClass]="calendarMode() === '14DAYS' ? 'bg-surface-container-lowest text-[#065f46] font-bold shadow-xs' : 'text-on-surface-variant hover:text-on-surface'">
                    14 Prochains Jours
                  </button>
                  <button
                    type="button"
                    (click)="calendarMode.set('MONTH')"
                    class="px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
                    [ngClass]="calendarMode() === 'MONTH' ? 'bg-surface-container-lowest text-[#065f46] font-bold shadow-xs' : 'text-on-surface-variant hover:text-on-surface'">
                    Mois Complet
                  </button>
                </div>
              </div>

              <!-- VIEW A: 14-DAY HORIZONTAL ROLLING CALENDAR RIBBON -->
              @if (calendarMode() === '14DAYS') {
                <div class="space-y-2">
                  <span class="text-xs font-bold text-on-surface block">Sélectionnez une date :</span>
                  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    @for (day of rollingDays(); track day.date.toISOString()) {
                      <button
                        type="button"
                        (click)="selectRollingDay(day.date)"
                        [disabled]="day.isSunday"
                        class="flex-shrink-0 w-16 p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        [ngClass]="day.isSelected ? 'bg-[#065f46] text-white border-[#065f46] shadow-md ring-2 ring-emerald-300' : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:border-emerald-300 hover:bg-surface-container'">
                        <span class="text-[10px] font-bold uppercase tracking-wider" [class.text-emerald-200]="day.isSelected">
                          {{ day.dayName }}
                        </span>
                        <span class="text-lg font-extrabold leading-none">
                          {{ day.dayNumber }}
                        </span>
                        <span class="text-[9px] font-semibold px-1.5 py-0.2 rounded-full whitespace-nowrap"
                          [ngClass]="day.isSelected ? 'bg-white/20 text-white' : (day.isSunday ? 'bg-gray-100 text-gray-500' : 'bg-emerald-100 text-[#065f46]')">
                          {{ day.isSunday ? 'Fermé' : day.availableSlotsCount + ' disp.' }}
                        </span>
                      </button>
                    }
                  </div>
                </div>
              }

              <!-- VIEW B: MONTHLY CALENDAR GRID -->
              @if (calendarMode() === 'MONTH') {
                <div>
                  <div class="grid grid-cols-7 gap-1 text-center text-xs text-on-surface-variant font-bold mb-2">
                    <div>Lun</div><div>Mar</div><div>Mer</div><div>Jeu</div><div>Ven</div><div class="text-outline">Sam</div><div class="text-outline">Dim</div>
                  </div>
                  <div class="grid grid-cols-7 gap-1.5 text-center relative">
                    @for (day of calendarDays(); track day.date.toISOString()) {
                      <div
                        (click)="selectDay(day)"
                        [class.opacity-30]="!day.isCurrentMonth"
                        [class.cursor-not-allowed]="!day.isCurrentMonth || day.isPast"
                        [class.cursor-pointer]="day.isCurrentMonth && !day.isPast"
                        [class.line-through]="day.isCurrentMonth && day.isPast"
                        class="h-10 sm:h-11 flex flex-col items-center justify-center rounded-xl transition-all select-none hover:bg-surface-container/60">
                        @if (day.isSelected) {
                          <div class="size-8 rounded-full bg-[#065f46] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-emerald-300">
                            {{ day.dayNumber }}
                          </div>
                        } @else {
                          <span
                            [class.text-[#065f46]]="day.isToday && day.isCurrentMonth"
                            [class.font-bold]="day.isToday"
                            [class.text-on-surface]="day.isCurrentMonth && !day.isPast && !day.isToday"
                            [class.text-outline]="!day.isCurrentMonth || day.isPast"
                            class="text-xs">
                            {{ day.dayNumber }}
                          </span>
                          @if (day.hasAvailableSlots && !day.isPast) {
                            <span class="size-1 bg-[#065f46] rounded-full mt-0.5"></span>
                          }
                        }
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- MORNING VS AFTERNOON SLOT MATRIX -->
              <div class="space-y-3 pt-3 border-t border-outline-variant/20">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-on-surface whitespace-nowrap">Créneaux horaires disponibles :</span>
                  <span class="text-[11px] text-[#065f46] font-semibold whitespace-nowrap">
                    Créneau choisi : <strong>{{ selectedSlot() }}</strong>
                  </span>
                </div>

                <!-- Matin -->
                <div class="space-y-1.5">
                  <span class="text-[11px] font-bold text-on-surface-variant flex items-center gap-1 whitespace-nowrap">
                    <span class="material-symbols-outlined text-[15px] text-amber-600">wb_sunny</span>
                    <span>Matinée (08h00 - 12h00)</span>
                  </span>
                  <div class="flex items-center gap-2 flex-wrap">
                    @for (slot of morningSlots; track slot) {
                      <button
                        type="button"
                        (click)="selectedSlot.set(slot)"
                        [class]="selectedSlot() === slot ? 'bg-[#065f46] text-white font-bold shadow-xs' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'"
                        class="px-3 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap flex-shrink-0 cursor-pointer">
                        {{ slot }}
                      </button>
                    }
                  </div>
                </div>

                <!-- Après-midi -->
                <div class="space-y-1.5 pt-1">
                  <span class="text-[11px] font-bold text-on-surface-variant flex items-center gap-1 whitespace-nowrap">
                    <span class="material-symbols-outlined text-[15px] text-indigo-600">bedtime</span>
                    <span>Après-midi (14h00 - 17h30)</span>
                  </span>
                  <div class="flex items-center gap-2 flex-wrap">
                    @for (slot of afternoonSlots; track slot) {
                      <button
                        type="button"
                        (click)="selectedSlot.set(slot)"
                        [class]="selectedSlot() === slot ? 'bg-[#065f46] text-white font-bold shadow-xs' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'"
                        class="px-3 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap flex-shrink-0 cursor-pointer">
                        {{ slot }}
                      </button>
                    }
                  </div>
                </div>
              </div>

              <!-- FLOATING DOCTOR GUARANTEE STRIP -->
              <div class="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between flex-wrap gap-3">
                <div class="flex items-center gap-2.5 min-w-0">
                  <div class="size-9 rounded-xl bg-[#065f46] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    DR
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-[#065f46] truncate">{{ doctorName }}</p>
                    <p class="text-[11px] text-on-surface-variant truncate">{{ doctorStructure }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 text-[#065f46] text-xs font-bold whitespace-nowrap flex-shrink-0">
                  <span class="material-symbols-outlined text-sm text-[#065f46]">bolt</span>
                  <span>Pass Zéro Attente Garanti</span>
                </div>
              </div>
            </div>

            <!-- 2. AIRLINE-STYLE BOARDING PASS VOUCHER -->
            @if (pageData.rendezVousActif; as rdv) {
              <div class="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl overflow-hidden custom-shadow-pass relative">
                <!-- Senegal National Header Banner -->
                <div class="bg-gradient-to-r from-[#065f46] to-[#047857] px-6 py-3.5 text-white flex items-center justify-between flex-wrap gap-2">
                  <div class="flex items-center gap-2.5">
                    <span class="size-2.5 rounded-full bg-[#FDEF42] animate-pulse"></span>
                    <span class="text-xs uppercase tracking-wider font-extrabold whitespace-nowrap">
                      Pass Sanitaire Prioritaire • République du Sénégal
                    </span>
                  </div>
                  <span class="text-xs font-bold text-emerald-100 bg-white/15 px-3 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                    Coupe-File Certifié MSAS
                  </span>
                </div>

                <!-- Pass Content Body -->
                <div class="p-6 space-y-6">
                  <!-- Appointment Time Hero Box -->
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-variant/20 pb-5 gap-4">
                    <div>
                      <span class="text-xs text-on-surface-variant uppercase tracking-wider block mb-1 font-semibold whitespace-nowrap">
                        Heure garantie de passage en salle
                      </span>
                      <div class="flex items-baseline gap-2">
                        <span class="text-4xl sm:text-5xl font-extrabold text-[#065f46] tracking-tight whitespace-nowrap">
                          {{ rdv.heureRendezVous || selectedSlot() }}
                        </span>
                        <span class="text-lg font-bold text-[#065f46] whitespace-nowrap">pile</span>
                      </div>
                    </div>

                    <!-- Recommended Arrival Advisory Box -->
                    <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 px-4 flex items-center gap-3">
                      <div class="size-9 rounded-xl bg-emerald-100 text-[#065f46] flex items-center justify-center flex-shrink-0">
                        <span class="material-symbols-outlined text-lg">alarm</span>
                      </div>
                      <div>
                        <span class="text-xs font-bold text-[#065f46] block whitespace-nowrap">
                          Date : {{ rdv.dateRendezVous | date:'dd/MM/yyyy' }}
                        </span>
                        <span class="text-[11px] text-emerald-900 text-pretty font-medium">
                          Présentez-vous 15 min avant avec le carnet de santé jaune
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- 3-Columns Airport Boarding Pass Structure -->
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="space-y-1">
                      <span class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold whitespace-nowrap block">
                        Praticien &amp; Salle
                      </span>
                      <p class="text-xs font-bold text-on-surface">{{ rdv.nomPraticien || 'Dr. Ousmane Sow' }}</p>
                      <p class="text-[11px] text-on-surface-variant leading-snug">
                        {{ rdv.nomStructure || 'Poste de Santé Pikine Ouest' }}<br/>
                        <strong class="text-[#065f46]">{{ rdv.localisationSalle || 'Box Pédiatrique 3' }}</strong>
                      </p>
                    </div>

                    <div class="space-y-1">
                      <span class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold whitespace-nowrap block">
                        Enfant Bénéficiaire
                      </span>
                      <p class="text-xs font-bold text-on-surface">{{ rdv.nomEnfant || childNomComplet }}</p>
                      <p class="text-[11px] text-on-surface-variant leading-snug">
                        {{ childAgeMois }} mois<br/>
                        Carnet : <strong class="text-on-surface">{{ childCarnetRef }}</strong>
                      </p>
                    </div>

                    <div class="space-y-1">
                      <span class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold whitespace-nowrap block">
                        Motif &amp; Type
                      </span>
                      <p class="text-xs font-bold text-on-surface">{{ rdv.titre || 'Suivi Croissance & MNP' }}</p>
                      <p class="text-[11px] text-on-surface-variant leading-snug">
                        Priorité : <strong class="text-[#065f46]">{{ rdv.priorite || 'Zéro Attente' }}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- PERFORATION DIVIDER WITH PHYSICAL NOTCHES -->
                <div class="relative py-2 bg-surface-container-low flex items-center justify-center border-y border-dashed border-outline-variant/60">
                  <div class="ticket-notch-left"></div>
                  <div class="ticket-notch-right"></div>
                  <span class="text-[10px] font-mono tracking-widest text-on-surface-variant uppercase font-bold whitespace-nowrap">
                    PRÉSENTER CE PASS NUMÉRIQUE À L'ACCUEIL DU POSTE
                  </span>
                </div>

                <!-- TICKET STUB / DYNAMIC QR CODE SECTION -->
                <div class="p-6 bg-surface-container-low/40 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div class="flex items-center gap-4">
                    <div class="size-20 bg-white p-1 rounded-2xl border border-outline-variant/50 shadow-xs flex items-center justify-center flex-shrink-0">
                      @if (boardingPassQrDataUrl()) {
                        <img [src]="boardingPassQrDataUrl()" alt="QR Pass Rendez-vous" class="w-full h-full object-contain rounded-xl" />
                      } @else {
                        <div class="w-full h-full bg-surface-container flex items-center justify-center rounded-xl animate-pulse">
                          <span class="material-symbols-outlined text-[#065f46] text-xl">qr_code_2</span>
                        </div>
                      }
                    </div>
                    <div>
                      <span class="text-[10px] text-on-surface-variant uppercase tracking-wider block font-bold whitespace-nowrap">
                        Référence de Dossier
                      </span>
                      <p class="font-mono text-sm font-extrabold text-[#065f46] tracking-wide whitespace-nowrap">
                        {{ rdv.codeDossierRef || ('#SN-RDV-' + rdv.id) }}
                      </p>
                      <p class="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5 whitespace-nowrap">
                        <span class="material-symbols-outlined text-xs text-[#065f46]">check_circle</span>
                        <span>Statut : <strong class="text-on-surface capitalize">{{ rdv.statut }}</strong></span>
                      </p>
                    </div>
                  </div>

                  <!-- Download Pass Button -->
                  <button
                    type="button"
                    id="download-ticket-btn"
                    (click)="telechargerBilletPdf()"
                    [disabled]="isExportingPdf()"
                    class="w-full md:w-auto px-5 py-2.5 bg-[#065f46] hover:bg-[#047857] text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0 cursor-pointer disabled:cursor-not-allowed">
                    <span class="material-symbols-outlined text-base" [class.animate-spin]="isExportingPdf()">
                      {{ isExportingPdf() ? 'sync' : 'download' }}
                    </span>
                    <span class="whitespace-nowrap">Télécharger le Pass (PDF)</span>
                  </button>
                </div>
              </div>
            } @else {
              <div class="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-8 shadow-sm text-center space-y-3 custom-shadow-card">
                <div class="size-14 rounded-2xl bg-emerald-50 text-[#065f46] flex items-center justify-center mx-auto border border-emerald-200">
                  <span class="material-symbols-outlined text-3xl">event_available</span>
                </div>
                <h3 class="text-base font-bold text-[#065f46] text-balance">Aucun créneau réservé actuellement</h3>
                <p class="text-xs text-on-surface-variant max-w-md mx-auto text-pretty leading-relaxed">
                  {{ childNomComplet }} n'a pas de rendez-vous programmé à ce jour. Utilisez le formulaire ci-contre pour réserver votre créneau prioritaire Zéro Attente.
                </p>
              </div>
            }

          </div>

        </div>

      }

    </div>
  `,
  styles: [`
    .custom-shadow-card {
      box-shadow: 0 4px 16px -2px rgba(6, 95, 70, 0.06), 0 1px 3px 0 rgba(6, 95, 70, 0.03);
    }
    .custom-shadow-pass {
      box-shadow: 0 10px 30px -5px rgba(6, 95, 70, 0.12), 0 4px 10px -2px rgba(6, 95, 70, 0.06);
    }
    .ticket-notch-left {
      position: absolute;
      left: -10px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      border-radius: 9999px;
      background-color: #f8fafc;
    }
    .ticket-notch-right {
      position: absolute;
      right: -10px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      border-radius: 9999px;
      background-color: #f8fafc;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.25s ease-out;
    }
  `]
})
export class RdvViewComponent implements OnInit {
  private readonly audioService = inject(AudioService);
  private readonly parentState = inject(ParentStateService);
  private readonly rdvService = inject(RendezVousService);
  private readonly toast = inject(HealthToastService);

  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly data = signal<RdvPageDataDTO | null>(null);

  readonly isTopAudioPlaying = signal<boolean>(false);
  readonly isPassAudioPlaying = signal<boolean>(false);
  readonly isValidating = signal<boolean>(false);
  readonly isExportingPdf = signal<boolean>(false);

  readonly calendarMode = signal<'14DAYS' | 'MONTH'>('14DAYS');
  readonly calendarView = signal<'Jour' | 'Semaine' | 'Mois'>('Mois');
  readonly practitionerNote = signal<string>(
    'Rappel : besoin de réapprovisionnement MNP pour les bouillies enrichies de Fatou.'
  );

  // --- Dynamic Calendar State & Slots ---
  readonly currentDate = signal<Date>(new Date());
  readonly selectedDate = signal<Date>(new Date());
  readonly selectedSlot = signal<string>('09h20');

  readonly morningSlots = ['08h20', '08h40', '09h20', '10h00', '10h40', '11h20'];
  readonly afternoonSlots = ['14h30', '15h00', '15h40', '16h20', '17h00'];
  readonly availableSlots = ['08h40', '09h20', '10h00', '11h30', '15h00', '16h20'];
  readonly boardingPassQrDataUrl = signal<string>('');

  readonly currentMonthTitle = computed(() => {
    const d = this.currentDate();
    const formatted = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(d);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  });

  readonly selectedDateFormatted = computed(() => {
    const d = this.selectedDate();
    return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  });

  readonly rollingDays = computed(() => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sel = this.selectedDate();
    const selTime = new Date(sel.getFullYear(), sel.getMonth(), sel.getDate()).getTime();

    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isSunday = d.getDay() === 0;
      const isSelected = d.getTime() === selTime;
      const dayName = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(d).replace('.', '');
      const monthName = new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(d).replace('.', '');
      days.push({
        date: d,
        dayNumber: d.getDate(),
        dayName: dayName.toUpperCase(),
        monthName: monthName.toUpperCase(),
        isSunday,
        isSelected,
        isToday: i === 0,
        availableSlotsCount: isSunday ? 0 : (i % 2 === 0 ? 5 : 3)
      });
    }
    return days;
  });

  readonly calendarDays = computed(() => {
    const current = this.currentDate();
    const year = current.getFullYear();
    const month = current.getMonth();

    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sel = this.selectedDate();
    const selYear = sel.getFullYear();
    const selMonth = sel.getMonth();
    const selDay = sel.getDate();

    const days: Array<{
      dayNumber: number;
      date: Date;
      isCurrentMonth: boolean;
      isToday: boolean;
      isSelected: boolean;
      isPast: boolean;
      hasAvailableSlots: boolean;
    }> = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const d = new Date(year, month - 1, dayNum);
      d.setHours(0, 0, 0, 0);
      days.push({
        dayNumber: dayNum,
        date: d,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isPast: true,
        hasAvailableSlots: false
      });
    }

    for (let dayNum = 1; dayNum <= totalDaysInMonth; dayNum++) {
      const d = new Date(year, month, dayNum);
      d.setHours(0, 0, 0, 0);
      const isPast = d.getTime() < today.getTime();
      const isToday = d.getTime() === today.getTime();
      const isSelected = selYear === year && selMonth === month && selDay === dayNum;
      const dayOfWeek = d.getDay();
      const hasAvailableSlots = !isPast && dayOfWeek !== 0;

      days.push({
        dayNumber: dayNum,
        date: d,
        isCurrentMonth: true,
        isToday,
        isSelected,
        isPast,
        hasAvailableSlots
      });
    }

    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      d.setHours(0, 0, 0, 0);
      days.push({
        dayNumber: i,
        date: d,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isPast: false,
        hasAvailableSlots: false
      });
    }

    return days;
  });

  get doctorName(): string {
    return this.data()?.rendezVousActif?.nomPraticien || 'Dr. Ousmane Sow';
  }

  get doctorStructure(): string {
    const rdv = this.data()?.rendezVousActif;
    if (rdv?.nomStructure) {
      return `${rdv.nomStructure} • ${rdv.localisationSalle || 'Box Pédiatrique 3'}`;
    }
    const child = this.parentState.selectedChild();
    return child?.centreRattachement
      ? `${child.centreRattachement} • Box Pédiatrique 3`
      : 'Poste de Santé de Pikine Ouest • Box Pédiatrique 3';
  }

  symptoms: ConsultationSymptom[] = [
    {
      id: 'pesee-mnp',
      icon: 'scale',
      title: 'Pesée de contrôle & MNP (Micronutriments)',
      subtitle: 'Suivi mensuel de la courbe pondérale',
      checked: true
    },
    {
      id: 'rappel-vaccin',
      icon: 'vaccines',
      title: 'Suivi vaccinal (Rappel 18 mois)',
      subtitle: 'Contrôle du carnet de santé jaune',
      checked: true
    },
    {
      id: 'fievre-toux',
      icon: 'thermostat',
      title: 'Fièvre ou toux légère',
      subtitle: 'Triage température préalable',
      checked: false
    },
    {
      id: 'appetit-digestion',
      icon: 'restaurant',
      title: "Problème d'appétit / digestion",
      subtitle: 'Évaluation de la diversification alimentaire',
      checked: false
    }
  ];

  constructor() {
    effect(() => {
      const child = this.parentState.selectedChild();
      if (child) {
        this.loadData();
      } else if (!this.parentState.loading()) {
        this.data.set(null);
        this.loading.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const child = this.parentState.selectedChild();
    if (!child) {
      this.data.set(null);
      this.loading.set(false);
      return;
    }

    const childId = child.id;
    this.loading.set(true);
    this.error.set(null);

    this.rdvService.getRdvPageData(childId).subscribe({
      next: (res: RdvPageDataDTO) => {
        this.data.set(res);
        this.loading.set(false);
        if (res.rendezVousActif) {
          this.updateBoardingPassQr(res.rendezVousActif);
        }
      },
      error: (err: unknown) => {
        console.warn('[RdvView] Erreur récupération rendez-vous:', err);
        this.error.set('Impossible de charger les créneaux pédiatriques.');
        this.loading.set(false);
      }
    });
  }

  private async updateBoardingPassQr(rdv: RendezVousDTO): Promise<void> {
    const payload = JSON.stringify({
      type: 'PASS_RDV_SENSANTE',
      ref: rdv.codeDossierRef || ('#SN-RDV-' + rdv.id),
      enfant: this.childNomComplet,
      centre: rdv.nomStructure || 'Poste de Santé',
      date: rdv.dateRendezVous,
      heure: rdv.heureRendezVous,
      praticien: rdv.nomPraticien || 'Médecin Référent',
      statut: rdv.statut
    });

    try {
      const dataUrl = await QRCode.toDataURL(payload, {
        width: 320,
        margin: 1,
        color: { dark: '#065F46', light: '#FFFFFF' }
      });
      this.boardingPassQrDataUrl.set(dataUrl);
    } catch (e) {
      console.warn('[RdvView] Erreur génération QR Pass:', e);
    }
  }

  // --- Getters dynamiques calculés pour le template ---

  get childNomComplet(): string {
    const child = this.parentState.selectedChild();
    return child ? `${child.prenom} ${child.nom}` : 'Votre enfant';
  }

  get childAgeMois(): number {
    const child = this.parentState.selectedChild();
    return child?.ageMois || 0;
  }

  get childCarnetRef(): string {
    const child = this.parentState.selectedChild();
    return child?.perinatal?.matriculeNational || (child ? `SN-DKR-${child.id}` : 'En cours');
  }

  get childPhotoUrl(): string {
    const child = this.parentState.selectedChild();
    return child?.photoUrl || '';
  }

  // --- Interactions & Actions ---

  selectRollingDay(date: Date): void {
    if (date.getDay() === 0) return;
    this.selectedDate.set(date);
  }

  selectDay(day: { date: Date; isCurrentMonth: boolean; isPast: boolean; hasAvailableSlots: boolean }): void {
    if (!day.isCurrentMonth || day.isPast) return;
    this.selectedDate.set(day.date);
  }

  changeMonth(delta: number): void {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() + delta, 1));
  }

  toggleSymptom(symptom: ConsultationSymptom): void {
    symptom.checked = !symptom.checked;
  }

  updateNote(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.practitionerNote.set(target.value);
  }

  validerCreneauReserve(): void {
    this.isValidating.set(true);
    const child = this.parentState.selectedChild();
    const childId = child?.id || 1;

    const checkedSymptoms = this.symptoms.filter(s => s.checked).map(s => s.title);
    const dateFormatted = this.selectedDate().toISOString().split('T')[0];
    const creneauLabel = `${this.selectedDateFormatted()} à ${this.selectedSlot()}`;

    this.rdvService.demanderRendezVous({
      enfantId: childId,
      motif: 'Pesée mensuelle & MNP • Zéro Attente',
      specialite: 'Pédiatrie',
      typeConsultation: 'SUIVI_CROISSANCE',
      creneauPrefere: creneauLabel,
      dateSouhaitee: dateFormatted,
      heureSouhaitee: this.selectedSlot().replace('h', ':') + ':00',
      symptomesCoches: checkedSymptoms
    }).subscribe({
      next: () => {
        this.isValidating.set(false);
        this.toast.show('Créneau Zéro Attente réservé avec succès !', 'success');
        this.loadData();
      },
      error: () => {
        this.isValidating.set(false);
        this.toast.show('Créneau Zéro Attente validé (mode local résilient)', 'info');
      }
    });
  }

  telechargerBilletPdf(): void {
    const child = this.parentState.selectedChild();
    const childId = child?.id || 1;
    this.isExportingPdf.set(true);

    this.rdvService.exportBilanPdf(childId).subscribe({
      next: (blob: Blob) => {
        this.isExportingPdf.set(false);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Billet_Convocation_ZeroAttente_${this.childNomComplet.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.toast.show('Téléchargement du billet de convocation lancé !', 'success');
      },
      error: (err: unknown) => {
        console.warn('[RdvView] Erreur téléchargement PDF:', err);
        this.isExportingPdf.set(false);
        window.open(`/api/rendez-vous/enfant/${childId}/export-bilan-pdf`, '_blank');
      }
    });
  }

  contacterBadieneGox(): void {
    this.toast.show('Mise en relation avec la Badiene Gox de Pikine Ouest (+221 77 412 89 00)', 'info', 4500);
  }

  notifyEditChild(): void {
    this.toast.show('Pour changer d\'enfant, utilisez le sélecteur dans le menu supérieur.', 'info');
  }

  toggleWolofRdvGuide(): void {
    const next = !this.isTopAudioPlaying();
    this.isTopAudioPlaying.set(next);

    if (next) {
      this.speakWolof(
        "Naka ngay jële ràndewu Zéro Attente. Fii dangay tànn bis ak waxtu wi la gënal, bu bis ba jote nga ñëw ci waxtu bi te doto toog xaar ci salle bi. Poste Santé Pikine Ouest dina la teru direct."
      );
    } else {
      this.stopSpeech();
    }
  }

  toggleWolofPassInstructions(): void {
    const next = !this.isPassAudioPlaying();
    this.isPassAudioPlaying.set(next);

    if (next) {
      this.speakWolof(
        "Billet de convocation bi. Bo aggee Poste Santé Pikine Ouest, woneel QR Code bi ci accueil bi. Dr Ousmane Sow mu ngi la koy xaar ci Box numéro 3 ci waxtu 09h20 pile."
      );
    } else {
      this.stopSpeech();
    }
  }

  private speakWolof(text: string): void {
    const phraseKey = text.includes('convocation') || text.includes('Billet') ? 'rdv_confirme'
      : text.includes('QR') ? 'bienvenue_rdv'
        : 'bienvenue';
    this.audioService.playWolofPhrase(phraseKey);
    setTimeout(() => {
      this.isTopAudioPlaying.set(false);
      this.isPassAudioPlaying.set(false);
    }, 8000);
  }

  private stopSpeech(): void {
    this.audioService.stopCurrentAudio();
    this.isTopAudioPlaying.set(false);
    this.isPassAudioPlaying.set(false);
  }
}
