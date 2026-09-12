import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AtpeTier } from '../../../../../core/models/configuration-clinique.model';

@Component({
  selector: 'app-atpe-matrix-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-2">
      <!-- Card Header -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-md bg-amber-100 text-amber-900 flex items-center justify-center">
            <span class="material-symbols-outlined text-lg">medication</span>
          </div>
          <div>
            <h2 class="text-base font-semibold text-slate-900 text-balance">
              Matrice Nationale de Dosage ATPE / Plumpy'Nut®
            </h2>
            <span class="text-xs text-slate-500">
              Protocole de Prise en Charge de la Malnutrition Aiguë Sévère sans Complication
            </span>
          </div>
        </div>
        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap flex-shrink-0">
          Protocole PECMA Sénégal
        </span>
      </div>

      <!-- Matrix Table -->
      <div class="overflow-x-auto border border-slate-200 rounded-lg mb-4">
        <table class="w-full text-left border-collapse font-sans text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-semibold">
              <th class="py-2.5 px-3">Tranche de Poids de l'Enfant (kg)</th>
              <th class="py-2.5 px-3">Sachets ATPE / Jour</th>
              <th class="py-2.5 px-3">Équivalence Énergétique (kcal/j)</th>
              <th class="py-2.5 px-3">Durée Standard Prescription</th>
              <th class="py-2.5 px-3">Unité Conditionnement</th>
              <th class="py-2.5 px-3 text-right">Ration Hebdo Totale</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (tier of tiers; track tier.id) {
              @if (!tier.triageSpecialise) {
                <tr class="hover:bg-slate-50/60 transition-colors">
                  <td class="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                    {{ tier.tranchePoids }}
                  </td>
                  <td class="py-2.5 px-3 whitespace-nowrap">
                    <div class="inline-flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        [(ngModel)]="tier.sachetsParJour"
                        (ngModelChange)="onSachetsChange(tier)"
                        class="w-14 text-center px-1 py-0.5 text-xs font-bold text-[#003426] bg-white border border-slate-300 rounded focus:border-[#003426]"
                      />
                      <span class="text-xs text-slate-500">sachets / jour</span>
                    </div>
                  </td>
                  <td class="py-2.5 px-3 text-slate-900 font-medium whitespace-nowrap font-mono">
                    {{ tier.equivKcalJour | number:'1.0-0' }} kcal/j
                  </td>
                  <td class="py-2.5 px-3 whitespace-nowrap">
                    <span class="inline-flex px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-medium">
                      {{ tier.dureePrescription }}
                    </span>
                  </td>
                  <td class="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                    {{ tier.uniteConditionnement }}
                  </td>
                  <td class="py-2.5 px-3 text-right font-bold text-[#003426] whitespace-nowrap font-mono">
                    {{ tier.rationHebdoTotale }} sachets
                  </td>
                </tr>
              } @else {
                <!-- Tier 5: Referral Specialized Pediatric Row -->
                <tr class="bg-amber-50/50 hover:bg-amber-50 transition-colors">
                  <td class="py-2.5 px-3 font-bold text-amber-950 whitespace-nowrap">
                    {{ tier.tranchePoids }}
                  </td>
                  <td class="py-2.5 px-3 text-amber-800 font-semibold italic" colspan="4">
                    <div class="flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-base">warning</span>
                      <span>{{ tier.recommandationSpeciale }}</span>
                    </div>
                  </td>
                  <td class="py-2.5 px-3 text-right text-amber-800 font-semibold whitespace-nowrap">
                    Triage Médical
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <!-- Stock Alert Footnote -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 gap-2">
        <div class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[#166b53] text-base shrink-0">inventory_2</span>
          <span class="text-pretty">
            <strong>Impact Logistique PNA :</strong> Cette grille impacte directement le calcul des commandes automatisées auprès de la Pharmacie Nationale d'Approvisionnement (PNA).
          </span>
        </div>
        <span class="font-mono font-semibold text-[#003426] whitespace-nowrap shrink-0">
          Coefficient Sécurité Tampon Stock : {{ coefficientPna }}
        </span>
      </div>
    </section>
  `
})
export class AtpeMatrixEditorComponent {
  @Input({ required: true }) tiers!: AtpeTier[];
  @Input() coefficientPna = 1.25;
  @Output() configChanged = new EventEmitter<void>();

  onSachetsChange(tier: AtpeTier): void {
    if (!tier.triageSpecialise) {
      tier.rationHebdoTotale = (tier.sachetsParJour || 0) * 7;
      tier.equivKcalJour = (tier.sachetsParJour || 0) * 500;
    }
    this.configChanged.emit();
  }
}
