import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-guide-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div (click)="close.emit()" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div (click)="$event.stopPropagation()" class="bg-white w-full max-w-lg max-h-[90vh] sm:max-h-[86vh] rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-auto transform transition-all animate-slideUp">
        <!-- Header vert institutionnel -->
        <div class="shrink-0 bg-emerald-900 text-white p-4 sm:p-5 flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
              <span class="material-symbols-outlined text-[24px]">soup_kitchen</span>
            </div>
            <div>
              <span class="text-[11px] uppercase tracking-wider text-emerald-200 font-bold block">Guide Nutritionnel Badien Gox</span>
              <h3 class="text-base font-bold text-white font-sans">Préparation de la Bouillie Enrichie</h3>
            </div>
          </div>
          <button
            type="button"
            class="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            (click)="close.emit()">
            <span class="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        <!-- Étapes de préparation -->
        <div class="flex-1 min-h-0 p-5 sm:p-6 space-y-3.5 overflow-y-auto overscroll-contain">
          <div class="flex gap-3 items-start">
            <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
            <div>
              <h5 class="text-xs font-bold text-slate-900">Mélange à froid des poudres</h5>
              <p class="text-xs text-slate-600 mt-0.5">
                Dans 200ml d'eau potable froide, délayer les 4 cuillères de mil torréfié et les 2 cuillères de poudre de niébé tamisée pour éviter les grumeaux.
              </p>
            </div>
          </div>

          <div class="flex gap-3 items-start">
            <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
            <div>
              <h5 class="text-xs font-bold text-slate-900">Cuisson douce et prolongée</h5>
              <p class="text-xs text-slate-600 mt-0.5">
                Porter à ébullition à feu moyen en remuant continuellement pendant 12 à 15 minutes jusqu'à épaississement onctueux.
              </p>
            </div>
          </div>

          <div class="flex gap-3 items-start">
            <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
            <div>
              <h5 class="text-xs font-bold text-slate-900">Incorporation du Moringa (Nébéday) hors du feu</h5>
              <p class="text-xs text-slate-600 mt-0.5">
                Retirer la marmite du feu. Ajouter la 1/2 cuillère à café de poudre de moringa afin de préserver intactes toutes les vitamines thermosensibles (Vitamine A &amp; C).
              </p>
            </div>
          </div>

          <div class="flex gap-3 items-start">
            <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
            <div>
              <h5 class="text-xs font-bold text-slate-900">Service tiède à la cuillère</h5>
              <p class="text-xs text-slate-600 mt-0.5">
                Laisser tiédir. Donner à l'enfant avec une cuillère propre, jamais au biberon, en encourageant chaque cuillerée avec patience.
              </p>
            </div>
          </div>

          <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <span class="material-symbols-outlined text-emerald-700 text-[18px]">verified</span>
            <span>Conseil de Mme Binetou Sarr : Ne pas conserver la bouillie cuite plus de 2 heures à température ambiante.</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="shrink-0 p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            class="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all"
            (click)="close.emit()">
            Fermer le guide
          </button>
        </div>
      </div>
    </div>
  `
})
export class RecipeGuideModalComponent {
  @Output() close = new EventEmitter<void>();
}
