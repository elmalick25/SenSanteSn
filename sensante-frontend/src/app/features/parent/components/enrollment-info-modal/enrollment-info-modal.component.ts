import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-enrollment-info-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div (click)="close.emit()" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div (click)="$event.stopPropagation()" class="bg-white w-full max-w-lg max-h-[90vh] sm:max-h-[86vh] rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-auto transform transition-all animate-slideUp">
        
        <!-- Ruban Tricolore Souverain du Sénégal -->
        <div class="h-1.5 w-full bg-gradient-to-r from-[#00853F] via-[#FDEF42] to-[#E31B23] shrink-0"></div>

        <!-- Header Vert SenSanté (#065f46) avec Logo Officiel -->
        <div class="shrink-0 bg-[#065f46] text-white p-5 sm:p-6 relative">
          <div class="flex items-start justify-between gap-4">
            
            <!-- Logo SenSanté Officiel + Titre Institutionnel -->
            <div class="flex items-center gap-3.5 min-w-0">
              <!-- Écusson Logo Squircle SenSanté -->
              <div class="relative w-12 h-12 rounded-2xl bg-gradient-to-b from-[#116952] to-[#0A4535] border border-[#2DD4BF]/50 shadow-[0_0_15px_rgba(45,212,191,0.35)] flex items-center justify-center flex-shrink-0">
                <svg class="w-7 h-7" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Logo SenSanté">
                  <rect x="14" y="20" width="20" height="8" rx="2.5" fill="#2DD4BF" fill-opacity="0.45" />
                  <rect x="20" y="14" width="8" height="20" rx="2.5" fill="#2DD4BF" fill-opacity="0.45" />
                  <path
                    d="M24 35.8C23.6 35.8 23.2 35.6 22.9 35.3C19.1 31.8 14.5 27.5 14.5 22.3C14.5 18.6 17.4 15.8 21 15.8C22.6 15.8 24.1 16.4 25.1 17.5C26.1 16.4 27.6 15.8 29.2 15.8C32.8 15.8 35.7 18.6 35.7 22.3C35.7 27.5 31.1 31.8 27.3 35.3C27 35.6 26.6 35.8 26.2 35.8H24Z"
                    fill="#FFFFFF"
                  />
                  <path
                    d="M17.5 23.5H20.8L22.2 20.8L24.5 26.5L26.2 22.2L27.4 23.5H32.5"
                    stroke="#065f46"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>

              <!-- Libellés & Marque -->
              <div class="flex flex-col min-w-0">
                <div class="flex items-center gap-1.5 leading-none">
                  <span class="text-lg font-black tracking-tight text-white font-display">Sen</span>
                  <span class="text-lg font-black tracking-tight text-[#2DD4BF] font-display">Santé</span>
                  <span class="px-1.5 py-0.5 rounded-md bg-[#2DD4BF]/20 border border-[#2DD4BF]/50 text-[#2DD4BF] text-[9.5px] font-mono font-extrabold tracking-wider whitespace-nowrap">
                    SN
                  </span>
                  <!-- Drapeau du Sénégal vectoriel SVG -->
                  <svg class="w-3.5 h-2.5 rounded-2xs overflow-hidden shadow-2xs flex-shrink-0" viewBox="0 0 900 600" aria-hidden="true">
                    <rect width="300" height="600" fill="#00853F" />
                    <rect x="300" width="300" height="600" fill="#FDEF42" />
                    <rect x="600" width="300" height="600" fill="#E31B23" />
                    <polygon points="450,225 469,283 530,283 481,319 499,376 450,341 401,376 419,319 370,283 431,283" fill="#00853F" />
                  </svg>
                </div>
                <span class="text-[11px] uppercase tracking-wider text-emerald-200 font-bold mt-1 block truncate">
                  Protocole National MSAS
                </span>
                <h3 class="text-base font-bold text-white font-sans truncate">
                  Enrôlement Pédiatrique Officiel
                </h3>
              </div>
            </div>

            <!-- Bouton Fermer -->
            <button
              type="button"
              class="text-white/80 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/15 cursor-pointer flex-shrink-0"
              (click)="close.emit()"
              aria-label="Fermer la boîte de dialogue">
              <span class="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </div>

        <!-- Contenu explicatif réglementaire -->
        <div class="flex-1 min-h-0 p-5 sm:p-6 space-y-4 overflow-y-auto overscroll-contain">
          <!-- Avertissement réglementaire -->
          <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 shadow-2xs">
            <span class="material-symbols-outlined text-amber-700 text-[24px] flex-shrink-0 mt-0.5">verified_user</span>
            <div class="text-xs sm:text-sm text-amber-950 space-y-1">
              <p class="font-bold">Seul l'agent de santé certifié est habilité à enrôler un enfant.</p>
              <p class="text-amber-800 text-xs leading-relaxed">
                Pour garantir la traçabilité biométrique et l'intégrité du carnet vaccinal PEV officiel du Sénégal, l'enregistrement initial doit être réalisé physiquement au poste de santé.
              </p>
            </div>
          </div>

          <!-- District le plus proche identifié -->
          <div class="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2.5">
            <div class="flex items-center justify-between gap-2 flex-wrap">
              <span class="text-xs uppercase font-bold text-[#065f46] tracking-wide">Structure de Rattachement</span>
              <span class="px-2.5 py-0.5 rounded-full bg-[#065f46] text-white text-[10.5px] font-bold shadow-2xs whitespace-nowrap">Poste de Santé Référent</span>
            </div>
            <h4 class="text-base font-bold text-slate-900">Poste de Santé Médina Yague Mar</h4>
            <p class="text-xs sm:text-sm text-slate-600 flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-[#065f46]">location_on</span>
              <span>Rue 6 x 11, Quartier Médina, Dakar</span>
            </p>
            <p class="text-xs sm:text-sm text-slate-600 flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-[#065f46]">schedule</span>
              <span>Consultations Mère-Enfant : Lundi au Vendredi, 08h00 - 14h00</span>
            </p>
          </div>

          <!-- Documents à présenter -->
          <div class="space-y-2 pt-1">
            <span class="text-xs font-bold text-slate-800 block">Documents à présenter à l'infirmière chef de poste (ICP) :</span>
            <ul class="space-y-2">
              <li class="flex items-center gap-2.5 text-xs text-slate-700">
                <span class="material-symbols-outlined text-[18px] text-[#065f46] flex-shrink-0">check_circle</span>
                <span>Carnet de santé papier jaune d'origine</span>
              </li>
              <li class="flex items-center gap-2.5 text-xs text-slate-700">
                <span class="material-symbols-outlined text-[18px] text-[#065f46] flex-shrink-0">check_circle</span>
                <span>Extrait de naissance ou volet d'état civil de l'enfant</span>
              </li>
              <li class="flex items-center gap-2.5 text-xs text-slate-700">
                <span class="material-symbols-outlined text-[18px] text-[#065f46] flex-shrink-0">check_circle</span>
                <span>Numéro de téléphone valide d'un parent ou tuteur</span>
              </li>
              <li class="flex items-center gap-2.5 text-xs text-slate-700">
                <span class="material-symbols-outlined text-[18px] text-[#065f46] flex-shrink-0">check_circle</span>
                <span>Carnet de vaccination antérieur, si l'enfant a déjà reçu des doses</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="shrink-0 p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            class="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all cursor-pointer"
            (click)="close.emit()">
            Compris
          </button>
          <a
            href="tel:+221770000000"
            class="px-4 py-2.5 rounded-xl bg-[#065f46] hover:bg-[#044e3f] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">call</span>
            <span>Contacter le Poste</span>
          </a>
        </div>
      </div>
    </div>
  `
})
export class EnrollmentInfoModalComponent {
  @Output() close = new EventEmitter<void>();
}
