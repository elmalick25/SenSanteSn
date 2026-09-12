import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-measurement-guide-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div class="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/60 to-white">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-900">Guide Pédiatrique & Protocole de Mesure</h2>
              <p class="text-xs text-slate-500">Normes OMS & Ministère de la Santé et de l'Action Sociale</p>
            </div>
          </div>
          <button
            type="button"
            (click)="onClose.emit()"
            class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 overflow-y-auto space-y-6 text-sm text-slate-600">
          <!-- Step 1: Pesée -->
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">1</div>
            <div>
              <h3 class="font-bold text-slate-900">Pesée au Poste de Santé (Balance Pèse-Bébé)</h3>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                La pesée doit être effectuée avec un nourrisson dévêtu ou en couche sèche, sur une balance électronique calibrée à tare zéro (Seca ou balance Salter suspendue). Le rythme recommandé est mensuel jusqu'à 12 mois.
              </p>
            </div>
          </div>

          <!-- Step 2: Taille couchée -->
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">2</div>
            <div>
              <h3 class="font-bold text-slate-900">Mesure de la Longueur Couchée (Toise Horizontale)</h3>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                Pour les enfants de moins de 2 ans, la mesure s'effectue allongé (longueur couchée). La tête de l'enfant touche fermement le montant fixe, et le curseur mobile vient se plaquer contre les talons redressés à 90°.
              </p>
            </div>
          </div>

          <!-- Step 3: Ruban MUAC -->
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">3</div>
            <div>
              <h3 class="font-bold text-slate-900">Périmètre Brachial (Ruban de Shakir MUAC)</h3>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                Mesuré au milieu du bras gauche relâché (entre l'acromion et l'olécrâne) :
              </p>
              <div class="grid grid-cols-3 gap-2 mt-2">
                <div class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  <div class="font-bold">≥ 12.5 cm</div>
                  <div class="text-[11px]">Vert : Statut Normal</div>
                </div>
                <div class="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  <div class="font-bold">11.5 - 12.4 cm</div>
                  <div class="text-[11px]">Jaune : Risque MAM</div>
                </div>
                <div class="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  <div class="font-bold">&lt; 11.5 cm</div>
                  <div class="text-[11px]">Rouge : Urgence MAS</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Conseils Nutritionnels Sénégal -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              Recommandations Nutritionnelles Pédiatriques
            </h4>
            <ul class="mt-2 space-y-1.5 text-xs text-slate-600 list-disc list-inside">
              <li>Allaitement maternel exclusif recommandé jusqu'à l'âge de 6 mois révolus (sans eau ni tisane).</li>
              <li>Dès 6 mois, introduction progressive des farines composées locales (mil, maïs, niébé, pâte d'arachide).</li>
              <li>En cas d'infléchissement ou de cassure de courbe, consultez immédiatement le Poste de Santé référent.</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex justify-end">
          <button
            type="button"
            (click)="onClose.emit()"
            class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm">
            Compris, fermer le guide
          </button>
        </div>
      </div>
    </div>
  `
})
export class MeasurementGuideModalComponent {
  @Output() onClose = new EventEmitter<void>();
}
