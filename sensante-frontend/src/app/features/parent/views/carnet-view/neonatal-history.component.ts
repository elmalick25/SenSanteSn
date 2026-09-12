import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarnetSanteData } from '../../../../core/models/carnet-sante.model';

@Component({
  selector: 'app-neonatal-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-emerald-900/5 space-y-4">
      <!-- Section Title -->
      <div class="flex items-center justify-between pb-2 border-b border-gray-100">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
            <span class="material-symbols-outlined text-[20px]">crib</span>
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-900 text-balance">Antécédents Néonataux &amp; Naissance</h3>
            <p class="text-xs text-gray-500">{{ data.antecedents.materniteOrigine }}</p>
          </div>
        </div>
        <span class="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-[11px] font-semibold">
          {{ data.antecedents.modeAccouchement }}
        </span>
      </div>

      <!-- Metric Mosaic 4 Columns -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div class="p-3 rounded-xl bg-emerald-50/40 border border-emerald-900/5 flex flex-col justify-between">
          <span class="text-[11px] text-gray-500 font-medium">Poids Naissance</span>
          <div class="mt-1">
            <span class="text-xl font-bold text-[#064e3b]">{{ data.antecedents.poidsNaissance }}</span>
            <span class="text-xs text-gray-500 ml-1">kg</span>
          </div>
          <span class="text-[10px] text-emerald-700 font-semibold mt-1">Percentile 50 (Idéal)</span>
        </div>

        <div class="p-3 rounded-xl bg-emerald-50/40 border border-emerald-900/5 flex flex-col justify-between">
          <span class="text-[11px] text-gray-500 font-medium">Score Apgar</span>
          <div class="mt-1">
            <span class="text-xl font-bold text-emerald-600">{{ data.antecedents.scoreApgar }}</span>
          </div>
          <span class="text-[10px] text-emerald-700 font-semibold mt-1">Vitalité Optimale</span>
        </div>

        <div class="p-3 rounded-xl bg-emerald-50/40 border border-emerald-900/5 flex flex-col justify-between">
          <span class="text-[11px] text-gray-500 font-medium">Drépanocytose</span>
          <div class="mt-1">
            <span class="text-xl font-bold text-gray-900">{{ data.antecedents.statutDrepanocytose }}</span>
          </div>
          <span class="text-[10px] text-emerald-700 font-semibold mt-1">
            {{ data.antecedents.statutDrepanocytose === 'AA' ? 'Dépistage Négatif' : 'Trait Porteur Sains' }}
          </span>
        </div>

        <div class="p-3 rounded-xl bg-emerald-50/40 border border-emerald-900/5 flex flex-col justify-between">
          <span class="text-[11px] text-gray-500 font-medium">Taille Naissance</span>
          <div class="mt-1">
            <span class="text-xl font-bold text-[#064e3b]">{{ data.antecedents.tailleNaissance }}</span>
            <span class="text-xs text-gray-500 ml-1">cm</span>
          </div>
          <span class="text-[10px] text-gray-500 mt-1">PC : {{ data.antecedents.perimetreCranien }} cm</span>
        </div>
      </div>

      <!-- Clinical Context Strip (AME) -->
      <div class="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
        <span class="material-symbols-outlined text-emerald-600 text-[22px] mt-0.5">nest_cam_wired_stand</span>
        <div class="flex-1 space-y-1">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-gray-900">Allaitement Maternel Exclusif (AME)</span>
            <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {{ data.antecedents.allaitementMaternelExclusif ? 'Validé 6 mois' : 'Non Exclusif' }}
            </span>
          </div>
          <p class="text-xs text-gray-600 leading-relaxed">
            Conduite nutritionnelle conforme au programme national d'alimentation du nourrisson. Diversification débutée au 6ème mois avec bouillies enrichies locales (mil, niébé, moringa).
          </p>
        </div>
      </div>

      <!-- Vaccinations Clés de Naissance -->
      <div class="space-y-2 pt-1">
        <span class="text-[11px] text-gray-400 uppercase tracking-wider font-bold">Vaccinations Clés de Naissance</span>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div 
            *ngFor="let v of data.vaccinsNaissance" 
            class="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
            <span class="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
            <div class="flex flex-col">
              <span class="text-xs font-bold text-gray-900">{{ v.codeVaccin }}</span>
              <span class="text-[10px] text-gray-500">{{ v.dateAdministration | date:'dd/MM/yyyy' }} • Fait</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NeonatalHistoryComponent {
  @Input({ required: true }) data!: CarnetSanteData;
}
