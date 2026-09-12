import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-brand',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col w-full select-none">
      <!-- 1. Ligne Supérieure : Badges Souverains & Statut Serveur -->
      <div class="flex items-center justify-between gap-1 w-full min-w-0">
        <!-- Pillule République du Sénégal -->
        <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-400/25 bg-[#003426]/70 backdrop-blur-xs shadow-2xs flex-shrink min-w-0">
          <!-- Drapeau du Sénégal vectoriel SVG -->
          <svg class="w-3.5 h-2.5 rounded-2xs overflow-hidden shadow-2xs flex-shrink-0" viewBox="0 0 900 600" aria-hidden="true">
            <rect width="300" height="600" fill="#00853F" />
            <rect x="300" width="300" height="600" fill="#FDEF42" />
            <rect x="600" width="300" height="600" fill="#E31B23" />
            <!-- Étoile verte au centre -->
            <polygon points="450,225 469,283 530,283 481,319 499,376 450,341 401,376 419,319 370,283 431,283" fill="#00853F" />
          </svg>
          <span class="text-[9px] sm:text-[9.5px] font-semibold text-emerald-100 tracking-tight whitespace-nowrap">
            Sénégal
          </span>
        </div>

        <!-- Pillule Serveur Actif + Bouton Fermer Mobile si présent -->
        <div class="flex items-center gap-1 flex-shrink-0">
          <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-400/25 bg-[#003426]/70 backdrop-blur-xs shadow-2xs">
            <span class="relative flex h-1.5 w-1.5 flex-shrink-0">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
            </span>
            <span class="text-[9px] sm:text-[9.5px] font-medium text-emerald-100 whitespace-nowrap">
              Serveur Actif
            </span>
          </div>

          <!-- Bouton fermeture mobile optionnel -->
          @if (showCloseButton) {
            <button
              type="button"
              (click)="closeMobileMenu.emit()"
              class="lg:hidden p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Fermer le menu"
            >
              <span class="material-symbols-outlined text-lg leading-none">close</span>
            </button>
          }
        </div>
      </div>

      <!-- 2. Écusson Central : Logo Lumineux avec Halo -->
      <div class="relative my-3 flex items-center justify-center">
        <!-- Halo lumineux d'ambiance vert menthe / émeraude -->
        <div class="absolute w-16 h-16 rounded-2xl bg-[#2DD4BF]/25 blur-md pointer-events-none"></div>

        <!-- Boîtier Écusson Squircle -->
        <div class="relative w-14 h-14 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-b from-[#116952] to-[#0A4535] border border-[#2DD4BF]/50 shadow-[0_0_20px_rgba(45,212,191,0.3)] flex items-center justify-center overflow-hidden">
          <svg class="w-9 h-9" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Logo SenSanté">
            <!-- Croix médicale d'arrière-plan en vert menthe translucide -->
            <rect x="14" y="20" width="20" height="8" rx="2.5" fill="#2DD4BF" fill-opacity="0.45" />
            <rect x="20" y="14" width="8" height="20" rx="2.5" fill="#2DD4BF" fill-opacity="0.45" />

            <!-- Cœur blanc pur central -->
            <path
              d="M24 35.8C23.6 35.8 23.2 35.6 22.9 35.3C19.1 31.8 14.5 27.5 14.5 22.3C14.5 18.6 17.4 15.8 21 15.8C22.6 15.8 24.1 16.4 25.1 17.5C26.1 16.4 27.6 15.8 29.2 15.8C32.8 15.8 35.7 18.6 35.7 22.3C35.7 27.5 31.1 31.8 27.3 35.3C27 35.6 26.6 35.8 26.2 35.8H24Z"
              fill="#FFFFFF"
              filter="drop-shadow(0 1px 2px rgba(0,0,0,0.18))"
            />

            <!-- Onde Électrocardiogramme (ECG) / Battement de vie découpé dans le cœur -->
            <path
              d="M17.5 23.5H20.8L22.2 20.8L24.5 26.5L26.2 22.2L27.4 23.5H32.5"
              stroke="#0D5C46"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>

      <!-- 3. Logotype Officiel Bicolore + Badge SN + Drapeau -->
      <div class="flex items-center justify-center gap-1.5 leading-none">
        <span class="text-xl sm:text-[22px] font-black tracking-tight text-white font-display">Sen</span>
        <span class="text-xl sm:text-[22px] font-black tracking-tight text-[#2DD4BF] font-display">Santé</span>

        <!-- Badge SN -->
        <span class="px-1.5 py-0.5 rounded-md bg-[#2DD4BF]/20 border border-[#2DD4BF]/50 text-[#2DD4BF] text-[10px] font-mono font-extrabold tracking-wider whitespace-nowrap leading-tight">
          SN
        </span>

        <!-- Drapeau Sénégal miniature -->
        <svg class="w-4 h-3 rounded-2xs overflow-hidden shadow-2xs flex-shrink-0" viewBox="0 0 900 600" aria-hidden="true">
          <rect width="300" height="600" fill="#00853F" />
          <rect x="300" width="300" height="600" fill="#FDEF42" />
          <rect x="600" width="300" height="600" fill="#E31B23" />
          <polygon points="450,225 469,283 530,283 481,319 499,376 450,341 401,376 419,319 370,283 431,283" fill="#00853F" />
        </svg>
      </div>

      <!-- 4. Devise Officielle Nationale de Santé -->
      <div class="text-center mt-1.5">
        <span class="text-[#34D399] text-[10px] sm:text-[10.5px] font-extrabold tracking-[0.18em] uppercase whitespace-nowrap block">
          SUNU SANTÉ, SUNU YITTÉ
        </span>
      </div>
    </div>
  `
})
export class SidebarBrandComponent {
  @Input() showCloseButton = false;
  @Output() closeMobileMenu = new EventEmitter<void>();
}
