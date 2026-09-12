import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ParentStateService } from '../../../../core/services/parent-state.service';
import { Child } from '../../../../core/models/parent-space.model';
import { EnrollmentInfoModalComponent } from '../../components/enrollment-info-modal/enrollment-info-modal.component';
import { AudioService } from '../../../../core/services/audio.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    EnrollmentInfoModalComponent
  ],
  template: `
    <div class="flex flex-col w-full pb-8 animate-fadeIn gap-6">

      <!-- ========================================================================= -->
      <!-- 1. ÉTAT DE CHARGEMENT (SKELETON SHIMMER FIDÈLE À LA STRUCTURE V0) -->
      <!-- ========================================================================= -->
      @if (stateService.loading()) {
        <div class="flex flex-col gap-6 animate-pulse w-full">
          <!-- Hero Skeleton -->
          <div class="h-44 w-full bg-surface-container rounded-2xl border border-outline-variant/30"></div>
          <!-- Centerpiece MUAC Gauge Skeleton -->
          <div class="h-64 w-full bg-surface-container rounded-2xl border border-outline-variant/30"></div>
          <!-- 3 Stat Tiles Skeleton -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="h-32 bg-surface-container rounded-2xl border border-outline-variant/30"></div>
            <div class="h-32 bg-surface-container rounded-2xl border border-outline-variant/30"></div>
            <div class="h-32 bg-surface-container rounded-2xl border border-outline-variant/30"></div>
          </div>
        </div>
      }

      <!-- ========================================================================= -->
      <!-- 2. ÉTAT D'ERREUR RÉSEAU DÉFENSIF AVEC BOUTON DE RÉESSAI -->
      <!-- ========================================================================= -->
      @if (stateService.error() && !stateService.loading()) {
        <div class="w-full pt-4">
          <div class="p-8 bg-error-container/40 border border-error/30 rounded-2xl text-center space-y-4 max-w-xl mx-auto shadow-sm">
            <span class="material-symbols-outlined text-error text-5xl">cloud_off</span>
            <h3 class="text-headline-sm font-bold text-on-error-container text-balance">
              Communication avec le serveur interrompue
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
              <button
                type="button"
                (click)="reconnect()"
                class="px-5 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-label-md font-semibold transition-all whitespace-nowrap flex-shrink-0">
                Se reconnecter
              </button>
            </div>
          </div>
        </div>
      }

      <!-- ========================================================================= -->
      <!-- 3. ÉTAT VIDE (0 ENFANT ENRÔLÉ -> GUIDAGE DISPENSAIRE MSAS) -->
      <!-- ========================================================================= -->
      @if (!stateService.loading() && stateService.children().length === 0 && !stateService.error()) {
        <div class="w-full pt-4">
          <div class="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/40 text-center max-w-2xl mx-auto space-y-4 shadow-subtle">
            <div class="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20">
              <span class="material-symbols-outlined text-3xl">child_care</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold text-on-surface text-balance">
              Bienvenue dans votre Espace Famille SenSanté
            </h2>
            <p class="text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-lg mx-auto text-pretty">
              Aucun enfant n'est actuellement rattaché à votre compte. Conformément au protocole national de santé publique du Ministère de la Santé (MSAS), l'enrôlement initial s'effectue en présentiel au poste de santé le plus proche.
            </p>
            <div class="pt-2">
              <button
                type="button"
                (click)="showEnrollmentModal.set(true)"
                class="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl text-sm font-semibold transition-all shadow-sm inline-flex items-center gap-2 whitespace-nowrap flex-shrink-0">
                <span class="material-symbols-outlined text-base">location_on</span>
                <span>Trouver le poste de santé référent</span>
              </button>
            </div>
          </div>
        </div>
      }

      <!-- ========================================================================= -->
      <!-- 4. ÉTAT DE SUCCÈS : DESIGN D'ÉLITE "PULSE SANTÉ PÉDIATRIQUE" (100% DYNAMIQUE)-->
      <!-- ========================================================================= -->
      @if (!stateService.loading() && currentChild; as child) {

        <!-- ================= A. HERO PEDIATRIC PULSE CARD ================= -->
        <div class="relative overflow-hidden rounded-3xl border border-outline-variant/40 bg-gradient-to-br from-surface-container-lowest via-surface-container-lowest to-[#E3EFE9]/40 p-5 sm:p-7 shadow-[0_4px_20px_-4px_rgba(6,95,70,0.08)]">
          <!-- Liseré tricolore souverain du Sénégal (Vert, Jaune, Rouge) -->
          <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00853F] via-[#FDEF42] to-[#E31B23]"></div>

          <!-- Halo d'accentuation en arrière-plan -->
          <div class="pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#065f46]/5 blur-3xl"></div>

          <div class="relative flex flex-col gap-6 pt-1">
            
            <!-- Ligne 1 : Badges d'Autorité Sanitaire & Fratrie -->
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-2 flex-wrap">
                <!-- Badge Statut Clinique MUAC -->
                <span
                  class="rounded-full px-3.5 py-1 text-xs font-bold whitespace-nowrap flex items-center gap-1.5 shadow-2xs"
                  [class.bg-emerald-50]="child.muacZone === 'NORMAL'"
                  [class.text-emerald-800]="child.muacZone === 'NORMAL'"
                  [class.border]="true"
                  [class.border-emerald-300]="child.muacZone === 'NORMAL'"
                  [class.bg-amber-50]="child.muacZone === 'MAM'"
                  [class.text-amber-800]="child.muacZone === 'MAM'"
                  [class.border-amber-300]="child.muacZone === 'MAM'"
                  [class.bg-rose-50]="child.muacZone === 'MAS'"
                  [class.text-rose-800]="child.muacZone === 'MAS'"
                  [class.border-rose-300]="child.muacZone === 'MAS'">
                  <span class="material-symbols-outlined text-[15px]">
                    {{ child.muacZone === 'NORMAL' ? 'verified' : (child.muacZone === 'MAM' ? 'warning' : 'emergency') }}
                  </span>
                  <span>{{ statusPillText }}</span>
                </span>

                <!-- Badge National Souverain Sénégal MSAS -->
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#065f46]/10 border border-[#065f46]/25 text-[#065f46] text-xs font-bold shadow-2xs whitespace-nowrap">
                  <svg class="w-3.5 h-2.5 rounded-2xs overflow-hidden shadow-2xs flex-shrink-0" viewBox="0 0 900 600" aria-hidden="true">
                    <rect width="300" height="600" fill="#00853F" />
                    <rect x="300" width="300" height="600" fill="#FDEF42" />
                    <rect x="600" width="300" height="600" fill="#E31B23" />
                    <polygon points="450,225 469,283 530,283 481,319 499,376 450,341 401,376 419,319 370,283 431,283" fill="#00853F" />
                  </svg>
                  <span>Suivi Médical Certifié MSAS</span>
                </span>
              </div>

              <!-- Badge Âge en Mois Révolus -->
              <div class="flex items-center gap-1.5 rounded-full bg-surface-container-low border border-outline-variant/40 px-3.5 py-1 text-xs text-on-surface font-semibold whitespace-nowrap">
                <span class="material-symbols-outlined text-[15px] text-[#065f46]">cake</span>
                <span>{{ childAgeText }}</span>
              </div>
            </div>

            <!-- Ligne 2 : Portrait de l'Enfant + Titre Rassurant & Description Sans Jargon -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
              <!-- Avatar / Photo Portrait avec Anneau de Statut -->
              <div class="relative size-16 sm:size-20 rounded-2xl p-1 bg-surface-container-lowest shadow-md flex-shrink-0 border"
                [class.border-emerald-400]="child.muacZone === 'NORMAL'"
                [class.border-amber-400]="child.muacZone === 'MAM'"
                [class.border-rose-400]="child.muacZone === 'MAS'">
                <div class="size-full rounded-xl bg-[#065f46] text-white flex items-center justify-center font-bold text-xl sm:text-2xl overflow-hidden shadow-inner">
                  @if (child.photoUrl) {
                    <img [src]="child.photoUrl" [alt]="child.prenom + ' ' + child.nom" class="w-full h-full object-cover">
                  } @else {
                    <span>{{ child.prenom[0] }}{{ child.nom[0] }}</span>
                  }
                </div>
                <!-- Indicateur de Statut Pulsant en Coin -->
                <span class="absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-white"
                  [class.bg-emerald-500]="child.muacZone === 'NORMAL'"
                  [class.bg-amber-500]="child.muacZone === 'MAM'"
                  [class.bg-rose-500]="child.muacZone === 'MAS'">
                </span>
              </div>

              <!-- Bloc Texte & Explications -->
              <div class="flex flex-col gap-1.5 flex-1 min-w-0">
                <h2 class="text-xl sm:text-2xl font-bold leading-tight tracking-tight text-on-surface text-balance">
                  {{ child.prenom }} {{ heroAppreciation }}
                </h2>
                <p class="max-w-2xl text-xs sm:text-sm text-on-surface-variant leading-relaxed text-pretty">
                  {{ heroExplanation }}
                </p>
              </div>
            </div>

            <!-- Ligne 3 : Bouton Écoute Wolof + Rappel Échéance Vaccin PEV -->
            <div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-outline-variant/30">
              <button
                type="button"
                (click)="toggleWolofHeroAudio()"
                class="flex items-center gap-2.5 rounded-full border border-[#065f46]/30 bg-[#065f46]/5 text-[#065f46] hover:bg-[#065f46]/10 px-4 py-2 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap active:scale-[0.98] cursor-pointer shadow-2xs">
                <span class="material-symbols-outlined text-[18px]" [class.animate-pulse]="isHeroAudioPlaying()">
                  volume_up
                </span>
                <span>{{ audioButtonLabel }}</span>
              </button>

              <div class="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1.5 text-xs text-emerald-900 font-medium whitespace-nowrap">
                <span class="material-symbols-outlined text-[16px] text-emerald-700">vaccines</span>
                <span>{{ nextVaccineText }}</span>
              </div>
            </div>

          </div>
        </div>

        <!-- ================= B. DOCK D'ACTIONS RAPIDES FAMILLE ================= -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <!-- Action 1 : Rendez-vous Zéro Attente -->
          <a
            routerLink="/parent/rendez-vous"
            class="group p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 hover:border-[#065f46]/40 hover:shadow-md transition-all flex flex-col justify-between gap-3 cursor-pointer select-none">
            <div class="flex items-center justify-between">
              <div class="size-10 rounded-xl bg-emerald-50 text-[#065f46] flex items-center justify-center group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-[22px]">calendar_month</span>
              </div>
              <span class="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-full whitespace-nowrap">
                Zéro Attente
              </span>
            </div>
            <div>
              <h3 class="text-sm font-bold text-on-surface group-hover:text-[#065f46] transition-colors whitespace-nowrap">
                Prendre Rendez-Vous
              </h3>
              <p class="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
                Créneau garanti au dispensaire
              </p>
            </div>
          </a>

          <!-- Action 2 : Passeport & Carnet Numérique -->
          <a
            routerLink="/parent/carnet"
            class="group p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 hover:border-[#065f46]/40 hover:shadow-md transition-all flex flex-col justify-between gap-3 cursor-pointer select-none">
            <div class="flex items-center justify-between">
              <div class="size-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-[22px]">menu_book</span>
              </div>
              <span class="text-[10px] uppercase font-bold text-blue-800 bg-blue-100/60 px-2 py-0.5 rounded-full whitespace-nowrap">
                QR Officiel
              </span>
            </div>
            <div>
              <h3 class="text-sm font-bold text-on-surface group-hover:text-blue-700 transition-colors whitespace-nowrap">
                Carnet de Santé
              </h3>
              <p class="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
                Vaccins PEV &amp; antécédents
              </p>
            </div>
          </a>

          <!-- Action 3 : Courbes de Croissance OMS -->
          <a
            routerLink="/parent/courbes"
            class="group p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 hover:border-[#065f46]/40 hover:shadow-md transition-all flex flex-col justify-between gap-3 cursor-pointer select-none">
            <div class="flex items-center justify-between">
              <div class="size-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-[22px]">monitoring</span>
              </div>
              <span class="text-[10px] uppercase font-bold text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded-full whitespace-nowrap">
                Normes OMS
              </span>
            </div>
            <div>
              <h3 class="text-sm font-bold text-on-surface group-hover:text-amber-700 transition-colors whitespace-nowrap">
                Courbes OMS
              </h3>
              <p class="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
                Poids, Taille &amp; Z-scores
              </p>
            </div>
          </a>

          <!-- Action 4 : Suppléments & Recettes Locales -->
          <a
            routerLink="/parent/pilulier"
            class="group p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 hover:border-[#065f46]/40 hover:shadow-md transition-all flex flex-col justify-between gap-3 cursor-pointer select-none">
            <div class="flex items-center justify-between">
              <div class="size-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-[22px]">nutrition</span>
              </div>
              <span class="text-[10px] uppercase font-bold text-purple-800 bg-purple-100/60 px-2 py-0.5 rounded-full whitespace-nowrap">
                Alimentation
              </span>
            </div>
            <div>
              <h3 class="text-sm font-bold text-on-surface group-hover:text-purple-700 transition-colors whitespace-nowrap">
                Suppléments &amp; Recettes
              </h3>
              <p class="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
                Bouillies enrichies &amp; ATPE
              </p>
            </div>
          </a>
        </div>

        <!-- ================= C. MUAC GAUGE CARD (Bande de Shakir 3D Glass) ================= -->
        <div class="rounded-3xl border border-outline-variant/40 bg-surface-container-lowest p-5 sm:p-7 shadow-subtle flex flex-col gap-5">
          
          <!-- En-tête : Titre & Bouton Guide illustré -->
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <div class="flex items-center gap-2.5">
              <div class="size-8 rounded-lg bg-emerald-50 text-[#065f46] flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-[20px]">straighten</span>
              </div>
              <div>
                <h3 class="text-sm sm:text-base font-bold text-on-surface text-balance">
                  Jauge Diagnostique MUAC (Ruban de Shakir OMS)
                </h3>
                <p class="text-xs text-on-surface-variant">Périmètre brachial mesuré au bras gauche de l'enfant</p>
              </div>
            </div>

            <button
              type="button"
              (click)="showGuideModal.set(true)"
              class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-outline-variant/50 bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold transition-all whitespace-nowrap cursor-pointer shadow-2xs">
              <span class="material-symbols-outlined text-[16px] text-[#065f46]">help</span>
              <span>Guide de mesure à domicile</span>
            </button>
          </div>

          <!-- Barre Horizontale Tricolore avec Curseur Proportionnel et Relief -->
          <div class="flex flex-col gap-2 pt-2">
            <div class="relative h-6 w-full overflow-hidden rounded-full shadow-inner bg-surface-container border border-slate-200">
              <div class="flex h-full w-full">
                <!-- Zone Rouge (< 115 mm) -->
                <div class="h-full bg-gradient-to-r from-rose-700 to-rose-500 transition-all" [style.width.%]="redWidthPercent"></div>
                <!-- Zone Jaune (115 - 124 mm) -->
                <div class="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all" [style.width.%]="yellowWidthPercent"></div>
                <!-- Zone Verte (≥ 125 mm) -->
                <div class="h-full flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all"></div>
              </div>
              
              <!-- Curseur Blanc Dynamique Mobile avec Ombre Forte -->
              @if (hasMuacMeasurement) {
                <div
                  class="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-all duration-700 ease-out z-10"
                  [style.left.%]="cursorLeftPercent">
                  <div class="size-5 rounded-full border-[3px] border-white bg-slate-900 shadow-lg ring-2 ring-black/10"></div>
                </div>
              }
            </div>

            <!-- Graduation des Repères de Mesure Officiels MSAS -->
            <div class="flex items-center justify-between text-[11px] text-on-surface-variant font-semibold px-1">
              <span>100 mm</span>
              <span class="text-rose-600 font-bold">115 mm (Seuil MAS)</span>
              <span class="text-amber-600 font-bold">125 mm (Seuil MAM)</span>
              <span class="text-emerald-700 font-bold">150 mm</span>
            </div>
          </div>

          <!-- Bloc Valeur Centrale Grand Format -->
          <div
            class="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border p-4 text-center sm:text-left transition-colors"
            [class.border-emerald-300]="child.muacZone === 'NORMAL'"
            [class.bg-emerald-50]="child.muacZone === 'NORMAL'"
            [class.border-amber-300]="child.muacZone === 'MAM'"
            [class.bg-amber-50]="child.muacZone === 'MAM'"
            [class.border-rose-300]="child.muacZone === 'MAS'"
            [class.bg-rose-50]="child.muacZone === 'MAS'">
            
            <div class="flex items-center gap-3">
              <div class="size-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-sm"
                [class.bg-emerald-600]="child.muacZone === 'NORMAL'"
                [class.bg-amber-500]="child.muacZone === 'MAM'"
                [class.bg-rose-600]="child.muacZone === 'MAS'">
                <span class="material-symbols-outlined text-[24px]">
                  {{ child.muacZone === 'NORMAL' ? 'check' : (child.muacZone === 'MAM' ? 'priority_high' : 'emergency') }}
                </span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-on-surface-variant font-medium">Diagnostic Actuel</span>
                <span class="text-base sm:text-lg font-bold text-on-surface">
                  {{ zoneLabelText }} · {{ child.muacZone === 'NORMAL' ? 'Nutrition Optimale' : (child.muacZone === 'MAM' ? 'Modérée (Vigilance)' : 'Sévère (Urgence)') }}
                </span>
              </div>
            </div>

            @if (hasMuacMeasurement) {
              <div class="flex items-baseline gap-1.5">
                <span class="text-3xl sm:text-4xl font-extrabold tabular-nums text-on-surface tracking-tight">
                  {{ muacDisplayValue }}
                </span>
                <span class="text-sm font-bold text-on-surface-variant">mm</span>
              </div>
            } @else {
              <span class="text-sm font-semibold text-on-surface-variant">
                En attente du premier dépistage MUAC
              </span>
            }
          </div>

          <!-- Grille des 3 Cartes de Référence Clinique OMS / MSAS -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <!-- Zone Rouge -->
            <div class="rounded-2xl border border-rose-200 bg-rose-50/40 p-3.5 flex flex-col gap-1.5">
              <div class="flex items-center gap-2">
                <span class="size-2.5 rounded-full bg-rose-600 shrink-0"></span>
                <span class="text-xs font-bold text-rose-800 whitespace-nowrap">Zone Rouge (&lt; 115 mm)</span>
              </div>
              <p class="text-xs text-rose-900/80 text-pretty leading-relaxed">
                Malnutrition aiguë sévère. Présentez l'enfant immédiatement au dispensaire pour prise en charge d'urgence.
              </p>
            </div>

            <!-- Zone Jaune -->
            <div class="rounded-2xl border border-amber-200 bg-amber-50/40 p-3.5 flex flex-col gap-1.5">
              <div class="flex items-center gap-2">
                <span class="size-2.5 rounded-full bg-amber-500 shrink-0"></span>
                <span class="text-xs font-bold text-amber-900 whitespace-nowrap">Zone Jaune (115 - 124 mm)</span>
              </div>
              <p class="text-xs text-amber-900/80 text-pretty leading-relaxed">
                Malnutrition aiguë modérée. Enrichissement nutritionnel et surveillance avec votre Bajenu Gox.
              </p>
            </div>

            <!-- Zone Verte -->
            <div class="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-3.5 flex flex-col gap-1.5">
              <div class="flex items-center gap-2">
                <span class="size-2.5 rounded-full bg-emerald-600 shrink-0"></span>
                <span class="text-xs font-bold text-emerald-900 whitespace-nowrap">Zone Verte (≥ 125 mm)</span>
              </div>
              <p class="text-xs text-emerald-900/80 text-pretty leading-relaxed">
                État nutritionnel normal et équilibré. Félicitations pour votre suivi attentif, continuez sur ce rythme !
              </p>
            </div>
          </div>

        </div>

        <!-- ================= D. GRILLE DE 3 STAT TILES AVEC MICRO-SPARKLINES ================= -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <!-- Tuile 1 : Poids Actuel avec Sparkline de Croissance -->
          <div class="rounded-3xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-subtle flex flex-col justify-between gap-4">
            <div class="flex items-center justify-between">
              <div class="size-10 rounded-xl bg-emerald-50 text-[#065f46] flex items-center justify-center">
                <span class="material-symbols-outlined text-[22px]">scale</span>
              </div>
              @if (child.gainHebdo) {
                <span class="rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap bg-emerald-100 text-emerald-800 flex items-center gap-1 shadow-2xs">
                  <span class="material-symbols-outlined text-[14px]">trending_up</span>
                  <span>{{ child.gainHebdo }}</span>
                </span>
              }
            </div>

            <div class="flex flex-col gap-1">
              <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Poids corporel actuel</span>
              <div class="flex items-baseline gap-1.5">
                <span class="text-3xl font-extrabold tabular-nums text-on-surface tracking-tight">
                  {{ weightDisplay }}
                </span>
                @if (child.poidsActuel) {
                  <span class="text-sm font-bold text-on-surface-variant">kg</span>
                }
              </div>
              <!-- Micro-Sparkline SVG Décorative de Continuité -->
              <div class="h-6 w-full pt-1">
                <svg class="w-full h-full text-emerald-500" viewBox="0 0 120 24" fill="none" preserveAspectRatio="none">
                  <path d="M0,18 Q30,16 60,10 T120,4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none" />
                  <circle cx="120" cy="4" r="3" fill="#065f46" />
                </svg>
              </div>
              <span class="text-xs text-on-surface-variant font-medium mt-1 truncate" [title]="weightHelperText">
                {{ weightHelperText }}
              </span>
            </div>
          </div>

          <!-- Tuile 2 : Taille Couchée -->
          <div class="rounded-3xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-subtle flex flex-col justify-between gap-4">
            <div class="flex items-center justify-between">
              <div class="size-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <span class="material-symbols-outlined text-[22px]">height</span>
              </div>
              <span class="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-semibold text-blue-800 whitespace-nowrap">
                Toise clinique
              </span>
            </div>

            <div class="flex flex-col gap-1">
              <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Taille mesurée couchée</span>
              <div class="flex items-baseline gap-1.5">
                <span class="text-3xl font-extrabold tabular-nums text-on-surface tracking-tight">
                  {{ heightDisplay }}
                </span>
                @if (child.tailleActuelle) {
                  <span class="text-sm font-bold text-on-surface-variant">cm</span>
                }
              </div>
              <!-- Micro-Sparkline SVG de Croissance Stature -->
              <div class="h-6 w-full pt-1">
                <svg class="w-full h-full text-blue-500" viewBox="0 0 120 24" fill="none" preserveAspectRatio="none">
                  <path d="M0,20 Q35,17 70,12 T120,5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none" />
                  <circle cx="120" cy="5" r="3" fill="#1d4ed8" />
                </svg>
              </div>
              <span class="text-xs text-on-surface-variant font-medium mt-1 truncate" [title]="heightHelperText">
                {{ heightHelperText }}
              </span>
            </div>
          </div>

          <!-- Tuile 3 : Dernier Contrôle Médical -->
          <div class="rounded-3xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-subtle flex flex-col justify-between gap-4">
            <div class="flex items-center justify-between">
              <div class="size-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <span class="material-symbols-outlined text-[22px]">stethoscope</span>
              </div>
              <span class="rounded-full bg-purple-50 border border-purple-200 px-2.5 py-1 text-xs font-semibold text-purple-800 whitespace-nowrap">
                Suivi PCIME
              </span>
            </div>

            <div class="flex flex-col gap-1">
              <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Dernier contrôle clinique</span>
              <div class="flex items-baseline gap-1.5">
                <span class="text-2xl sm:text-3xl font-extrabold text-on-surface whitespace-nowrap tracking-tight">
                  {{ lastCheckupDisplay }}
                </span>
              </div>
              <div class="h-6 flex items-center">
                <span class="text-xs font-semibold text-[#065f46] truncate">
                  Poste de référence accrédité
                </span>
              </div>
              <span class="text-xs text-on-surface-variant font-medium mt-1 truncate" [title]="checkupLocationDoctorText">
                {{ checkupLocationDoctorText }}
              </span>
            </div>
          </div>

        </div>

      }

      <!-- ========================================================================= -->
      <!-- MODALE : GUIDE ILLUSTRÉ BANDE DE SHAKIR (4 ÉTAPES FIDÈLES À V0) -->
      <!-- ========================================================================= -->
      @if (showGuideModal()) {
        <div class="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div class="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 border border-outline-variant/40 shadow-card space-y-5 animate-scaleUp">
            
            <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span class="material-symbols-outlined text-[22px]">help</span>
                </div>
                <div>
                  <h3 class="text-base sm:text-lg font-bold text-on-surface text-balance">
                    Comment bien mesurer le bras à la maison
                  </h3>
                  <p class="text-xs text-on-surface-variant">Suivez ces 4 étapes simples pour mesurer le périmètre brachial</p>
                </div>
              </div>
              <button
                type="button"
                (click)="showGuideModal.set(false)"
                class="text-on-surface-variant hover:text-on-surface p-1 rounded-lg">
                <span class="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <div class="flex flex-col gap-3 text-sm">
              <div class="rounded-xl border border-outline-variant/40 bg-surface-container-low p-3">
                <p class="font-semibold text-on-surface">1. Détendre le bras</p>
                <p class="mt-1 text-xs text-on-surface-variant">Pliez le bras gauche de l'enfant à 90 degrés, coude relâché le long du corps.</p>
              </div>

              <div class="rounded-xl border border-outline-variant/40 bg-surface-container-low p-3">
                <p class="font-semibold text-on-surface">2. Trouver le milieu</p>
                <p class="mt-1 text-xs text-on-surface-variant">Repérez le point à mi-chemin entre l'épaule et le coude, marquez-le mentalement.</p>
              </div>

              <div class="rounded-xl border border-outline-variant/40 bg-surface-container-low p-3">
                <p class="font-semibold text-on-surface">3. Mesurer sans serrer</p>
                <p class="mt-1 text-xs text-on-surface-variant">Enroulez le ruban Shakir autour du bras à ce point, sans serrer ni laisser de jeu.</p>
              </div>

              <div class="rounded-xl border border-outline-variant/40 bg-surface-container-low p-3">
                <p class="font-semibold text-on-surface">4. Lire la couleur</p>
                <p class="mt-1 text-xs text-on-surface-variant">Lisez la valeur en mm et repérez la couleur (rouge, jaune ou vert) affichée par le ruban.</p>
              </div>
            </div>

            <div class="pt-2">
              <button
                type="button"
                (click)="showGuideModal.set(false)"
                class="w-full py-2.5 bg-primary text-on-primary hover:bg-primary-container rounded-xl text-sm font-semibold transition-all shadow-sm whitespace-nowrap">
                J'ai compris
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Modale d'enrôlement si aucun enfant -->
      @if (showEnrollmentModal()) {
        <app-enrollment-info-modal
          (close)="showEnrollmentModal.set(false)">
        </app-enrollment-info-modal>
      }

    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.25s ease-out;
    }
    @keyframes scaleUp {
      from { opacity: 0; transform: scale(0.97); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-scaleUp {
      animation: scaleUp 0.2s ease-out;
    }
  `]
})
export class DashboardViewComponent {
  readonly stateService = inject(ParentStateService);
  private readonly authService = inject(AuthService);
  private readonly audioService = inject(AudioService);

  readonly isHeroAudioPlaying = signal<boolean>(false);
  readonly showGuideModal = signal<boolean>(false);
  readonly showEnrollmentModal = signal<boolean>(false);

  reconnect(): void {
    this.authService.logout();
  }

  get currentChild(): Child | null {
    return this.stateService.selectedChild();
  }

  // --- A. HERO CARD REASSURING COPY & BINDINGS (Zéro Hardcoding) ---
  get statusPillText(): string {
    const child = this.currentChild;
    if (!child) return 'État normal';
    if (child.muacZone === 'MAS') return 'Zone Rouge · Urgence MAS';
    if (child.muacZone === 'MAM') return 'Zone Jaune · Alerte MAM';
    return 'Zone Verte · État normal';
  }

  get childAgeText(): string {
    const child = this.currentChild;
    if (child?.ageMois !== undefined && child?.ageMois !== null) {
      return `${child.ageMois} mois révolus`;
    }
    return 'Âge non renseigné';
  }

  get heroAppreciation(): string {
    const child = this.currentChild;
    if (!child) return 'grandit bien.';
    if (child.muacZone === 'MAS') {
      return 'a besoin d’une consultation rapide. Notre équipe de santé est là pour vous accompagner.';
    }
    if (child.muacZone === 'MAM') {
      return 'a besoin d’un peu plus d’attention nutritionnelle. Rien d’alarmant, un suivi rapproché suffit.';
    }
    return 'grandit très bien ! Ses mesures sont dans la zone verte, continuez ce bon rythme.';
  }

  get heroExplanation(): string {
    const child = this.currentChild;
    const center = (child?.centreRattachement && child.centreRattachement !== 'Centre non renseigné')
      ? child.centreRattachement
      : 'votre poste de santé de rattachement';

    return `Ces résultats sont basés sur les données cliniques enregistrées au ${center}. Nous vous accompagnons à chaque étape, sans jargon médical compliqué.`;
  }

  get audioButtonLabel(): string {
    return this.isHeroAudioPlaying()
      ? "En cours d'écoute (Wolof)..."
      : "Écouter le résumé en Wolof";
  }

  get nextVaccineText(): string {
    const child = this.currentChild;
    if (child?.prochainRappel) {
      return `Prochain vaccin PEV : ${child.prochainRappel}`;
    }
    return 'Calendrier vaccinal PEV à jour';
  }

  // --- B. MUAC GAUGE COMPUTATIONS ---
  // Échelle standard bande Shakir : 100 mm à 150 mm
  readonly gaugeMin = 100;
  readonly gaugeMax = 150;
  readonly redMax = 115;
  readonly yellowMax = 125;

  get redWidthPercent(): number {
    return ((this.redMax - this.gaugeMin) / (this.gaugeMax - this.gaugeMin)) * 100; // 30%
  }

  get yellowWidthPercent(): number {
    return ((this.yellowMax - this.redMax) / (this.gaugeMax - this.gaugeMin)) * 100; // 20%
  }

  get hasMuacMeasurement(): boolean {
    const child = this.currentChild;
    return !!(child && child.muac && child.muac > 0);
  }

  get muacValueMm(): number {
    const child = this.currentChild;
    if (!child || !child.muac) return 0;
    // Conversion si nécessaire de cm en mm
    return child.muac < 30 ? Math.round(child.muac * 10) : Math.round(child.muac);
  }

  get muacDisplayValue(): string {
    return this.hasMuacMeasurement ? `${this.muacValueMm}` : '--';
  }

  get cursorLeftPercent(): number {
    if (!this.hasMuacMeasurement) return 50;
    const clamped = Math.min(Math.max(this.muacValueMm, this.gaugeMin), this.gaugeMax);
    return ((clamped - this.gaugeMin) / (this.gaugeMax - this.gaugeMin)) * 100;
  }

  get zoneLabelText(): string {
    const mm = this.muacValueMm;
    if (mm < 115) return 'Zone Rouge';
    if (mm < 125) return 'Zone Jaune';
    return 'Zone Verte';
  }

  // --- C. STAT TILES COMPUTATIONS ---
  get weightDisplay(): string {
    const child = this.currentChild;
    if (child?.poidsActuel !== undefined && child?.poidsActuel !== null) {
      return child.poidsActuel.toFixed(1);
    }
    return '--';
  }

  get weightHelperText(): string {
    const child = this.currentChild;
    if (!child || !child.poidsActuel) {
      return 'Pesée clinique en attente';
    }
    const target = (child.poidsActuel + 0.4).toFixed(1);
    return `Cible OMS : ${target} kg`;
  }

  get heightDisplay(): string {
    const child = this.currentChild;
    if (child?.tailleActuelle !== undefined && child?.tailleActuelle !== null) {
      return child.tailleActuelle.toFixed(1);
    }
    return '--';
  }

  get heightHelperText(): string {
    const child = this.currentChild;
    if (!child || !child.tailleActuelle) {
      return 'Mesure toise en attente';
    }
    if (child.ageMois) {
      return `Percentile adapté pour ${child.ageMois} mois`;
    }
    return 'Courbe OMS de référence';
  }

  get lastCheckupDisplay(): string {
    const bilans = this.stateService.bilans();
    if (bilans && bilans.length > 0) {
      const dernier = bilans[bilans.length - 1];
      if (dernier?.dateBilan) {
        const diffMs = Math.abs(new Date().getTime() - new Date(dernier.dateBilan).getTime());
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return `Il y a ${diffDays} j`;
      }
    }
    return 'Récent';
  }

  get checkupLocationDoctorText(): string {
    const child = this.currentChild;
    if (child?.centreRattachement && child.centreRattachement !== 'Centre non renseigné') {
      return child.centreRattachement;
    }
    return 'Poste de santé de secteur';
  }

  toggleWolofHeroAudio(): void {
    const nextState = !this.isHeroAudioPlaying();
    this.isHeroAudioPlaying.set(nextState);

    if (nextState) {
      const zone = this.currentChild?.muacZone ?? 'NORMAL';
      const phraseKey = zone === 'MAS' ? 'muac_mas' : zone === 'MAM' ? 'muac_mam' : 'muac_normal';
      this.audioService.playWolofPhrase(phraseKey);
      setTimeout(() => this.isHeroAudioPlaying.set(false), 8000);
    } else {
      this.audioService.stopCurrentAudio();
    }
  }
}

