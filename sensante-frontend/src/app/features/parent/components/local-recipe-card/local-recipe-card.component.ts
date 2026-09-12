import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-local-recipe-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col">
      <!-- Image bannière de la bouillie avec dégradé -->
      <div class="relative h-36 w-full bg-slate-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=800&auto=format&fit=crop"
          alt="Bouillie enrichie traditionnelle sénégalaise"
          class="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500">
        <div class="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/30 to-transparent"></div>
        <div class="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
          <span class="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 font-bold shadow-xs">
            RECETTE LOCALE HOMOLOGUÉE
          </span>
          <span class="text-[10px] font-semibold flex items-center gap-1 text-emerald-200">
            <span class="material-symbols-outlined text-[13px]">verified</span>
            MSAS Santé Maternelle
          </span>
        </div>
      </div>

      <!-- Corps de la recette -->
      <div class="p-4 flex flex-col gap-2">
        <h4 class="text-sm font-bold text-slate-900 font-sans">
          Bouillie Riche Niébé-Mil-Moringa
        </h4>
        <p class="text-xs text-slate-600 leading-relaxed">
          Formule nutritionnelle recommandée pour la réhabilitation à domicile dès 6 mois, riche en fer végétal et protéines digestibles.
        </p>

        <!-- Liste des ingrédients dosés -->
        <div class="mt-1 space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div class="flex items-center justify-between text-xs text-slate-700">
            <span class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Farine de mil torréfié
            </span>
            <span class="font-bold text-slate-900">4 cuillères à soupe</span>
          </div>
          <div class="flex items-center justify-between text-xs text-slate-700">
            <span class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Poudre de niébé tamisée
            </span>
            <span class="font-bold text-slate-900">2 cuillères à soupe</span>
          </div>
          <div class="flex items-center justify-between text-xs text-slate-700">
            <span class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Poudre de feuilles de Nébéday (Moringa)
            </span>
            <span class="font-bold text-slate-900">1/2 cuillère à café</span>
          </div>
        </div>

        <button
          type="button"
          class="mt-1 w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-emerald-200/60"
          (click)="openGuide.emit()">
          <span class="material-symbols-outlined text-[16px]">menu_book</span>
          <span>Voir le guide de préparation Badien Gox</span>
        </button>
      </div>
    </div>
  `
})
export class LocalRecipeCardComponent {
  @Output() openGuide = new EventEmitter<void>();
}
