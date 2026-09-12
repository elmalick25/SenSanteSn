import { Component, inject, signal, computed } from '@angular/core';
import { AudioService } from '../../core/services/audio.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ParentStateService } from '../../core/services/parent-state.service';
import { Child } from '../../core/models/parent-space.model';
import { EnrollmentInfoModalComponent } from './components/enrollment-info-modal/enrollment-info-modal.component';
import { SidebarBrandComponent } from '../../shared/components/sidebar-brand/sidebar-brand.component';

@Component({
  selector: 'app-parent-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, EnrollmentInfoModalComponent, SidebarBrandComponent],
  styles: [`
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      display: inline-block;
      vertical-align: middle;
      line-height: 1;
    }
    .material-symbols-outlined.fill-icon {
      font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
  `],
  template: `
    <div class="bg-background text-on-surface min-h-screen flex overflow-hidden antialiased font-sans relative">

      <!-- ========================================================================= -->
      <!-- BANDEAU TRICOLORE SOUVERAIN (PLEINE LARGEUR BORD À BORD : DE 0px À 100%) -->
      <!-- Prolonge les couleurs nationales du Sénégal (Vert, Jaune, Rouge) jusqu'à l'extrême gauche -->
      <!-- ========================================================================= -->
      <div class="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00853F] via-[#FDEF42] to-[#E31B23] z-[60] shadow-xs pointer-events-none"></div>

      <!-- ========================================================================= -->
      <!-- 1. LEFT SIDEBAR (Vert émeraude officiel SenSanté #065f46 conforme maquette) -->
      <!-- ========================================================================= -->
      <aside
        class="fixed top-0 left-0 h-screen w-72 flex flex-col justify-between bg-[#065f46] text-white border-r border-white/10 shadow-lg z-50 transition-transform duration-300 lg:translate-x-0 overflow-x-hidden pt-1.5"
        [class.-translate-x-full]="!isMobileMenuOpen()"
        [class.translate-x-0]="isMobileMenuOpen()">

        <div class="h-full flex flex-col justify-between p-4 overflow-y-auto overflow-x-hidden">
          <!-- Section Supérieure : Brand Officiel + Sélecteur Enfant Actif + Navigation -->
          <div class="flex flex-col gap-4">

            <!-- En-tête Brand SenSanté Officiel (Logo & Couleurs Souveraines - Exact Image 2) -->
            <div class="px-1 pt-1 pb-2 border-b border-white/10">
              <app-sidebar-brand
                [showCloseButton]="true"
                (closeMobileMenu)="isMobileMenuOpen.set(false)">
              </app-sidebar-brand>
            </div>

            <!-- Carte Sélecteur Enfant Actif (Dropdown Fratrie Dynamique) -->
            <div class="relative">
              @if (hasChildren) {
                <div
                  (click)="toggleChildDropdown()"
                  class="group flex w-full items-center gap-3 rounded-2xl border border-white/20 bg-black/20 p-3 text-left transition-all hover:bg-black/30 cursor-pointer select-none">
                  
                  <!-- Avatar ou Fallback Initiales de l'enfant -->
                  <div class="size-10 rounded-full border border-white/25 flex-shrink-0 overflow-hidden bg-white/10 flex items-center justify-center text-white font-bold text-xs">
                    @if (childPhotoFailed() || !activeChildPhoto) {
                      <span>{{ activeChildInitials }}</span>
                    } @else {
                      <img
                        [src]="activeChildPhoto"
                        [alt]="'Photo de ' + activeChildName"
                        (error)="onPhotoError()"
                        class="w-full h-full object-cover">
                    }
                  </div>

                  <!-- Métadonnées de l'enfant -->
                  <div class="flex min-w-0 flex-1 flex-col">
                    <span class="truncate text-sm font-semibold text-white">
                      {{ activeChildName }}
                    </span>
                    <span class="truncate text-[11px] text-white/70">
                      {{ activeChildAge }} • {{ activeChildLocation }}
                    </span>
                  </div>

                  <!-- Pastille Statut MUAC -->
                  <span
                    class="w-2.5 h-2.5 shrink-0 rounded-full"
                    [class.bg-emerald-400]="activeChildZone === 'NORMAL'"
                    [class.bg-amber-400]="activeChildZone === 'MAM'"
                    [class.bg-rose-400]="activeChildZone === 'MAS'">
                  </span>

                  <span
                    class="material-symbols-outlined text-white/70 text-[18px] shrink-0 transition-transform duration-200"
                    [class.rotate-180]="isChildDropdownOpen()">
                    unfold_more
                  </span>
                </div>
              } @else {
                <!-- État 0 Enfant lié : Guidage vers l'enrôlement (Conforme Maquette) -->
                <div
                  (click)="showEnrollmentModal.set(true)"
                  class="flex w-full items-center gap-3 rounded-2xl border border-dashed border-white/30 bg-white/5 p-3 text-left transition-all hover:bg-white/10 cursor-pointer select-none">
                  <div class="size-10 rounded-full border border-dashed border-white/40 flex-shrink-0 bg-white/10 flex items-center justify-center text-white">
                    <span class="material-symbols-outlined text-[20px]">person_add</span>
                  </div>
                  <div class="flex min-w-0 flex-1 flex-col">
                    <span class="truncate text-sm font-semibold text-white">Aucun enfant lié</span>
                    <span class="text-xs text-white/80 hover:underline">Consulter la procédure</span>
                  </div>
                </div>
              }

              <!-- Menu Déroulant Fratrie -->
              @if (isChildDropdownOpen()) {
                <div class="absolute left-0 right-0 top-full mt-1.5 bg-[#065f46] border border-white/20 rounded-2xl shadow-xl z-50 p-2 space-y-1 text-white animate-scaleUp">
                  <span class="text-[10px] uppercase font-bold text-white/60 px-2 block tracking-wider">Fratrie rattachée</span>
                  @for (child of stateService.children(); track child.id) {
                    <div
                      (click)="selectChild(child.id)"
                      class="flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors hover:bg-white/10"
                      [ngClass]="{'bg-white/15': child.id === stateService.selectedChildId()}">
                      <div class="flex items-center gap-2 min-w-0">
                        <span class="text-xs font-semibold text-white truncate">{{ child.prenom }} {{ child.nom }}</span>
                        <span class="text-[10px] text-white/70">({{ child.ageMois }}m)</span>
                      </div>
                      <div class="flex items-center gap-1.5">
                        <span
                          class="w-2 h-2 rounded-full"
                          [class.bg-emerald-400]="child.muacZone === 'NORMAL'"
                          [class.bg-amber-400]="child.muacZone === 'MAM'"
                          [class.bg-rose-400]="child.muacZone === 'MAS'">
                        </span>
                        @if (child.id === stateService.selectedChildId()) {
                          <span class="material-symbols-outlined text-[#fdef42] text-[16px]">check</span>
                        }
                      </div>
                    </div>
                  }
                  <button
                    type="button"
                    (click)="showEnrollmentModal.set(true); isChildDropdownOpen.set(false)"
                    class="w-full text-left text-[11px] font-semibold text-[#fdef42] hover:underline pt-2 px-2 flex items-center gap-1.5 border-t border-white/10 cursor-pointer">
                    <span class="material-symbols-outlined text-[15px]">add_circle</span>
                    <span>Enrôlement d'un nouvel enfant</span>
                  </button>
                </div>
              }
            </div>

            <!-- Liste des 5 Liens de Navigation Principaux (Bords Arrondis sur chaque bouton - Exact Maquette) -->
            <nav class="flex flex-col gap-1.5">
              <!-- Tab 1: Tableau de Bord -->
              <a
                routerLink="/parent/dashboard"
                routerLinkActive="bg-white/20 text-white font-semibold shadow-xs"
                [routerLinkActiveOptions]="{exact: true}"
                (click)="isMobileMenuOpen.set(false)"
                class="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-white/90 hover:text-white hover:bg-white/10 transition-all cursor-pointer select-none">
                <span class="material-symbols-outlined text-[22px] text-white">grid_view</span>
                <span class="text-sm font-semibold whitespace-nowrap">Tableau de bord</span>
              </a>

              <!-- Tab 2: Carnet Numérique -->
              <a
                routerLink="/parent/carnet"
                routerLinkActive="bg-white/20 text-white font-semibold shadow-xs"
                (click)="isMobileMenuOpen.set(false)"
                class="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-white/90 hover:text-white hover:bg-white/10 transition-all cursor-pointer select-none">
                <span class="material-symbols-outlined text-[22px] text-white">menu_book</span>
                <span class="text-sm font-semibold whitespace-nowrap">Carnet numérique</span>
              </a>

              <!-- Tab 3: Courbes de Croissance -->
              <a
                routerLink="/parent/courbes"
                routerLinkActive="bg-white/20 text-white font-semibold shadow-xs"
                (click)="isMobileMenuOpen.set(false)"
                class="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-white/90 hover:text-white hover:bg-white/10 transition-all cursor-pointer select-none">
                <span class="material-symbols-outlined text-[22px] text-white">monitoring</span>
                <span class="text-sm font-semibold whitespace-nowrap">Courbes de croissance</span>
              </a>

              <!-- Tab 4: Suppléments & Recettes -->
              <a
                routerLink="/parent/pilulier"
                routerLinkActive="bg-white/20 text-white font-semibold shadow-xs"
                (click)="isMobileMenuOpen.set(false)"
                class="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-white/90 hover:text-white hover:bg-white/10 transition-all cursor-pointer select-none">
                <span class="material-symbols-outlined text-[22px] text-white">nutrition</span>
                <span class="text-sm font-semibold whitespace-nowrap">Suppléments &amp; recettes</span>
              </a>

              <!-- Tab 5: Rendez-vous -->
              <a
                routerLink="/parent/rendez-vous"
                routerLinkActive="bg-white/20 text-white font-semibold shadow-xs"
                (click)="isMobileMenuOpen.set(false)"
                class="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-white/90 hover:text-white hover:bg-white/10 transition-all cursor-pointer select-none">
                <span class="material-symbols-outlined text-[22px] text-white">calendar_month</span>
                <span class="text-sm font-semibold whitespace-nowrap">Rendez-vous</span>
              </a>
            </nav>
          </div>

          <!-- Section Bas de Sidebar (Footer conforme à la maquette v0) -->
          <div class="flex flex-col gap-2 pt-3 border-t border-white/10">
            <!-- Liseré tricolore souverain Sénégal (Vert, Jaune, Rouge) -->
            <div class="h-0.5 w-full rounded-full bg-gradient-to-r from-[#00853F] via-[#FDEF42] to-[#E31B23] opacity-85 mb-1"></div>

            <!-- Bouton d'Urgence Prioritaire SOS Gaaw 1515 -->
            <a
              href="tel:1515"
              class="w-full bg-[#D94238] hover:bg-[#b91c1c] active:scale-[0.98] transition-all text-white rounded-2xl p-3 flex items-center justify-center gap-2.5 shadow-sm whitespace-nowrap font-bold text-xs sm:text-sm">
              <span class="material-symbols-outlined text-[18px]">phone_in_talk</span>
              <span>SOS Danger / Gaaw · 1515</span>
            </a>

            <!-- Paramètres / Profil (Placé au bas de la barre, exactement comme la maquette v0) -->
            <a
              routerLink="/parent/profil"
              routerLinkActive="bg-white/20 text-white font-semibold shadow-xs"
              (click)="isMobileMenuOpen.set(false)"
              class="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-white/85 hover:text-white hover:bg-white/10 transition-all">
              <span class="material-symbols-outlined text-[22px] text-white/90">settings</span>
              <span class="text-sm font-semibold whitespace-nowrap">Paramètres / Profil</span>
            </a>

            <!-- Bouton Déconnexion (Sidebar Footer) -->
            <button
              type="button"
              (click)="logout()"
              class="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-rose-200 hover:text-white hover:bg-rose-500/20 active:scale-[0.98] transition-all cursor-pointer select-none w-full text-left font-semibold text-sm">
              <span class="material-symbols-outlined text-[22px] text-rose-300">logout</span>
              <span class="whitespace-nowrap">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Masque de fond (Backdrop) sur mobile quand le menu est ouvert -->
      @if (isMobileMenuOpen()) {
        <div
          class="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          (click)="isMobileMenuOpen.set(false)">
        </div>
      }

      <!-- ========================================================================= -->
      <!-- 2. MAIN CONTENT AREA (Offset sidebar w-72 sur desktop) -->
      <!-- ========================================================================= -->
      <div class="flex-1 lg:ml-72 flex flex-col h-screen overflow-y-auto overflow-x-hidden bg-background min-w-0 pt-1.5">

        <header class="sticky top-0 z-40 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/40 px-4 sm:px-6 py-3 flex justify-between items-center min-w-0">
          
          <!-- Burger Mobile + Salutation Personnalisée & Date Dynamique avec Couleurs Nationales -->
          <div class="flex items-center gap-3 min-w-0">
            <button
              type="button"
              (click)="isMobileMenuOpen.set(true)"
              class="lg:hidden p-2 rounded-xl text-on-surface hover:bg-surface-container transition-colors flex-shrink-0 cursor-pointer"
              aria-label="Ouvrir le menu latéral">
              <span class="material-symbols-outlined text-[22px]">menu</span>
            </button>

            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h1 class="text-base sm:text-lg font-bold text-[#065f46] tracking-tight truncate text-balance">
                  Bonjour, {{ parentDisplayName }}
                </h1>
                <!-- Badge Souverain Sénégal avec drapeau SVG officiel -->
                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#065f46]/10 border border-[#065f46]/25 text-[#065f46] text-[10.5px] font-bold shadow-2xs whitespace-nowrap flex-shrink-0">
                  <svg class="w-3.5 h-2.5 rounded-2xs overflow-hidden shadow-2xs flex-shrink-0" viewBox="0 0 900 600" aria-hidden="true">
                    <rect width="300" height="600" fill="#00853F" />
                    <rect x="300" width="300" height="600" fill="#FDEF42" />
                    <rect x="600" width="300" height="600" fill="#E31B23" />
                    <polygon points="450,225 469,283 530,283 481,319 499,376 450,341 401,376 419,319 370,283 431,283" fill="#00853F" />
                  </svg>
                  <span>Sénégal</span>
                </span>
              </div>
              <div class="flex items-center gap-2 text-xs text-on-surface-variant capitalize truncate mt-0.5">
                <span class="w-1.5 h-1.5 rounded-full bg-[#065f46]"></span>
                <span>{{ todayFormatted }}</span>
                <span class="text-slate-300">•</span>
                <span class="text-[#065f46] font-semibold">MSAS • Sunu Santé</span>
              </div>
            </div>
          </div>

          <!-- Actions Droite : Enfant Actif Rapide + Audio Wolof + Notifications + Profil -->
          <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            
            <!-- Widget Enfant Actif dans le Header (Visible sur md+) -->
            @if (hasChildren && selectedChild; as child) {
              <div
                (click)="toggleChildDropdown()"
                class="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/40 hover:bg-surface-container cursor-pointer transition-all select-none">
                <div class="size-6 rounded-full bg-[#065f46] text-white text-[10px] font-bold flex items-center justify-center overflow-hidden flex-shrink-0">
                  @if (childPhotoFailed() || !activeChildPhoto) {
                    <span>{{ activeChildInitials }}</span>
                  } @else {
                    <img [src]="activeChildPhoto" [alt]="activeChildName" (error)="onPhotoError()" class="w-full h-full object-cover">
                  }
                </div>
                <span class="text-xs font-semibold text-on-surface truncate max-w-[120px]">{{ activeChildName }}</span>
                <span
                  class="size-2 rounded-full flex-shrink-0"
                  [class.bg-emerald-500]="child.muacZone === 'NORMAL'"
                  [class.bg-amber-500]="child.muacZone === 'MAM'"
                  [class.bg-rose-500]="child.muacZone === 'MAS'">
                </span>
                <span class="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
              </div>
            }

            <!-- Bouton Audio Wolof Interactif -->
            <button
              type="button"
              (click)="toggleAudioGuidance()"
              class="items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-all text-xs font-semibold whitespace-nowrap hidden sm:flex cursor-pointer"
              [class.bg-primary-15]="isAudioPlaying()">
              <span class="material-symbols-outlined text-[17px]" [class.animate-pulse]="isAudioPlaying()">
                volume_up
              </span>
              <span>{{ topAudioButtonLabel }}</span>
            </button>

            <!-- Bouton Audio Wolof Compact sur Mobile -->
            <button
              type="button"
              (click)="toggleAudioGuidance()"
              class="sm:hidden p-2 rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-all flex items-center justify-center cursor-pointer"
              aria-label="Écouter en Wolof">
              <span class="material-symbols-outlined text-[20px]" [class.animate-pulse]="isAudioPlaying()">
                volume_up
              </span>
            </button>

            <!-- Cloche Notifications -->
            <button
              aria-label="Notifications"
              class="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors relative cursor-pointer"
              type="button">
              <span class="material-symbols-outlined text-[20px]">notifications</span>
              <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
            </button>

            <!-- Avatar Profil Parent avec anneau tricolore sénégalais (Vert, Jaune, Rouge) -->
            <a
              routerLink="/parent/profil"
              class="relative p-[2px] rounded-full bg-gradient-to-tr from-[#00853F] via-[#FDEF42] to-[#E31B23] shadow-xs hover:scale-105 transition-transform overflow-hidden flex-shrink-0 cursor-pointer"
              aria-label="Mon profil">
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-[#065f46] text-white font-bold text-xs overflow-hidden">
                @if (parentAvatarUrl) {
                  <img
                    [src]="parentAvatarUrl"
                    [alt]="'Photo de ' + parentDisplayName"
                    (error)="onParentAvatarError($event)"
                    class="w-full h-full object-cover">
                } @else {
                  <span>{{ parentInitials }}</span>
                }
              </div>
            </a>

            <!-- Bouton Déconnexion Rapide Topbar -->
            <button
              type="button"
              (click)="logout()"
              title="Se déconnecter"
              aria-label="Se déconnecter"
              class="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer flex-shrink-0">
              <span class="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </header>

        <!-- ================= MAIN CONTENT OUTLET ================= -->
        <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6 pb-24 lg:pb-8">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- ========================================================================= -->
      <!-- 3. MOBILE BOTTOM NAVIGATION BAR (DOCK TACTILE CONÇU POUR LES FAMILLES)    -->
      <!-- ========================================================================= -->
      <nav
        aria-label="Navigation mobile principale"
        class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/40 px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        
        <!-- Tab 1 : Tableau de bord -->
        <a
          routerLink="/parent/dashboard"
          routerLinkActive="text-[#065f46] font-bold"
          [routerLinkActiveOptions]="{exact: true}"
          class="flex flex-col items-center gap-0.5 text-on-surface-variant hover:text-[#065f46] transition-colors py-1 px-2 select-none">
          <span class="material-symbols-outlined text-[22px]">grid_view</span>
          <span class="text-[10px] whitespace-nowrap">Accueil</span>
        </a>

        <!-- Tab 2 : Carnet de santé -->
        <a
          routerLink="/parent/carnet"
          routerLinkActive="text-[#065f46] font-bold"
          class="flex flex-col items-center gap-0.5 text-on-surface-variant hover:text-[#065f46] transition-colors py-1 px-2 select-none">
          <span class="material-symbols-outlined text-[22px]">menu_book</span>
          <span class="text-[10px] whitespace-nowrap">Carnet</span>
        </a>

        <!-- Bouton Central SOS Gaaw 1515 Tactile -->
        <a
          href="tel:1515"
          aria-label="Appel d'urgence pédiatrique SAMU 1515"
          class="flex flex-col items-center justify-center -mt-5 size-12 rounded-full bg-[#D94238] text-white shadow-lg border-[3px] border-white active:scale-95 transition-transform select-none">
          <span class="material-symbols-outlined text-[22px]">phone_in_talk</span>
          <span class="text-[8px] font-extrabold tracking-tighter uppercase -mt-0.5">1515</span>
        </a>

        <!-- Tab 3 : Rendez-vous -->
        <a
          routerLink="/parent/rendez-vous"
          routerLinkActive="text-[#065f46] font-bold"
          class="flex flex-col items-center gap-0.5 text-on-surface-variant hover:text-[#065f46] transition-colors py-1 px-2 select-none">
          <span class="material-symbols-outlined text-[22px]">calendar_month</span>
          <span class="text-[10px] whitespace-nowrap">RDV</span>
        </a>

        <!-- Tab 4 : Mon Profil -->
        <a
          routerLink="/parent/profil"
          routerLinkActive="text-[#065f46] font-bold"
          class="flex flex-col items-center gap-0.5 text-on-surface-variant hover:text-[#065f46] transition-colors py-1 px-2 select-none">
          <span class="material-symbols-outlined text-[22px]">person</span>
          <span class="text-[10px] whitespace-nowrap">Profil</span>
        </a>
      </nav>

      <!-- ========================================================================= -->
      <!-- 4. LECTEUR AUDIO FLOTTANT WOLOF EN COURS DE LECTURE                       -->
      <!-- ========================================================================= -->
      @if (isAudioPlaying()) {
        <div class="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 bg-[#065f46] text-white rounded-full px-4 py-2.5 shadow-xl flex items-center gap-3 border border-white/20 animate-scaleUp">
          <span class="flex items-center gap-1">
            <span class="w-1 h-3 bg-emerald-300 animate-pulse rounded-full"></span>
            <span class="w-1 h-5 bg-emerald-200 animate-pulse rounded-full"></span>
            <span class="w-1 h-2 bg-emerald-400 animate-pulse rounded-full"></span>
          </span>
          <span class="text-xs font-semibold whitespace-nowrap">Audio Wolof en cours...</span>
          <button
            type="button"
            (click)="toggleAudioGuidance()"
            class="text-white/80 hover:text-white p-0.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Arrêter la lecture audio">
            <span class="material-symbols-outlined text-[18px]">stop_circle</span>
          </button>
        </div>
      }

      <!-- Modale d'orientation enrôlement dispensaire -->
      @if (showEnrollmentModal()) {
        <app-enrollment-info-modal
          (close)="showEnrollmentModal.set(false)">
        </app-enrollment-info-modal>
      }

    </div>
  `
})
export class ParentLayoutComponent {
  readonly authService = inject(AuthService);
  readonly stateService = inject(ParentStateService);
  private readonly audioService = inject(AudioService);

  readonly isMobileMenuOpen = signal<boolean>(false);
  readonly isChildDropdownOpen = signal<boolean>(false);
  readonly isAudioPlaying = signal<boolean>(false);
  readonly showEnrollmentModal = signal<boolean>(false);
  readonly childPhotoFailed = signal<boolean>(false);
  readonly parentPhotoFailed = signal<boolean>(false);

  // Parent Profile Dynamique (100% zéro hardcoding)
  get parentDisplayName(): string {
    const user = this.authService.currentUser();
    if (!user) return 'Parent';
    const prenom = user.prenom?.trim() || '';
    const nom = user.nom?.trim() || '';
    const full = `${prenom} ${nom}`.trim();
    return full || user.email || 'Parent';
  }

  get parentInitials(): string {
    const user = this.authService.currentUser();
    if (!user) return 'P';
    const p = user.prenom?.trim()?.[0] || '';
    const n = user.nom?.trim()?.[0] || '';
    return (p + n).toUpperCase() || 'P';
  }

  get parentAvatarUrl(): string {
    if (this.parentPhotoFailed()) return '';
    const user = this.authService.currentUser();
    return user?.avatarUrl || '';
  }

  get topAudioButtonLabel(): string {
    return this.isAudioPlaying() ? "En cours d'écoute (Wolof)..." : "Déglo lëral bi ci kàddu";
  }

  get todayFormatted(): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return now.toLocaleDateString('fr-FR', options);
  }

  get hasChildren(): boolean {
    return this.stateService.children().length > 0;
  }

  // Active Child Bindings
  get selectedChild(): Child | null {
    return this.stateService.selectedChild();
  }

  get activeChildName(): string {
    const child = this.selectedChild;
    if (child) {
      return `${child.prenom} ${child.nom}`.trim();
    }
    return 'Aucun enfant lié';
  }

  get activeChildInitials(): string {
    const child = this.selectedChild;
    if (!child) return 'E';
    const p = child.prenom?.trim()?.[0] || '';
    const n = child.nom?.trim()?.[0] || '';
    return (p + n).toUpperCase() || 'E';
  }

  get activeChildAge(): string {
    const child = this.selectedChild;
    if (child?.ageMois !== undefined && child?.ageMois !== null) {
      return `${child.ageMois} mois`;
    }
    return '--';
  }

  get activeChildLocation(): string {
    const child = this.selectedChild;
    if (child?.centreRattachement && child.centreRattachement !== 'Centre non renseigné') {
      return child.centreRattachement
        .replace('Poste de Santé de ', '')
        .replace('Poste de Santé ', '')
        .replace('Centre de Santé ', '')
        .replace('Centre Hospitalier ', '')
        .replace('Hôpital ', '')
        .trim();
    }
    return 'Poste de santé';
  }

  get activeChildPhoto(): string {
    const child = this.selectedChild;
    return child?.photoUrl || '';
  }

  get activeChildZone(): 'NORMAL' | 'MAM' | 'MAS' {
    const child = this.selectedChild;
    return child?.muacZone || 'NORMAL';
  }

  toggleChildDropdown(): void {
    this.isChildDropdownOpen.update(v => !v);
  }

  selectChild(id: number): void {
    this.childPhotoFailed.set(false);
    this.stateService.selectChild(id);
    this.isChildDropdownOpen.set(false);
  }

  onPhotoError(): void {
    this.childPhotoFailed.set(true);
  }

  onParentAvatarError(event: Event): void {
    this.parentPhotoFailed.set(true);
  }

  toggleAudioGuidance(): void {
    const nextState = !this.isAudioPlaying();
    this.isAudioPlaying.set(nextState);

    if (nextState) {
      this.audioService.playWolofPhrase('bienvenue');
      setTimeout(() => this.isAudioPlaying?.set(false), 8000);
    } else {
      this.audioService.stopCurrentAudio();
    }
  }

  logout(): void {
    this.audioService.stopCurrentAudio();
    this.authService.logout();
  }
}

