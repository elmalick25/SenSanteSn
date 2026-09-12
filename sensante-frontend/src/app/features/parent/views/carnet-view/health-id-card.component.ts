import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarnetSanteData } from '../../../../core/models/carnet-sante.model';

@Component({
  selector: 'app-health-id-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl shadow-sm border border-emerald-900/5 p-6 lg:p-7 relative overflow-hidden flex flex-col justify-between h-full">
      <!-- Institutional Top Header Strip -->
      <div class="flex items-center justify-between pb-4 -mx-6 -mt-6 p-6 mb-4 bg-emerald-50/50 border-b border-emerald-900/5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#064e3b] flex items-center justify-center text-white shadow-sm">
            <span class="material-symbols-outlined text-[24px]">health_metrics</span>
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <span class="font-bold text-[13px] tracking-tight text-emerald-950 uppercase">RÉPUBLIQUE DU SÉNÉGAL</span>
              <!-- Drapeau officiel du Sénégal -->
              <span class="inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-white shadow-xs border border-gray-100" title="République du Sénégal">
                <span class="w-1.5 h-2.5 rounded-l-xs bg-[#00853f]"></span>
                <span class="w-1.5 h-2.5 bg-[#fdef42] relative flex items-center justify-center">
                  <span class="w-0.5 h-0.5 rounded-full bg-[#00853f]"></span>
                </span>
                <span class="w-1.5 h-2.5 rounded-r-xs bg-[#e31b23]"></span>
              </span>
            </div>
            <span class="text-[11px] font-semibold text-emerald-700 tracking-wide">Ministère de la Santé et de l'Action Sociale</span>
          </div>
        </div>
        <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold tracking-wide">
          <span class="material-symbols-outlined text-[14px]">verified</span>
          CERTIFIÉ CONFORME
        </div>
      </div>

      <!-- Identity Core Profile -->
      <div class="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        <!-- Photo and ID Column -->
        <div class="sm:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
          <div class="relative">
            <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-md border-2 border-white ring-2 ring-emerald-900/10 bg-emerald-100/50 flex items-center justify-center">
              <img 
                [src]="data.genre === 'FEMININ' ? 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=400&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&auto=format&fit=crop&q=80'" 
                [alt]="data.nomComplet" 
                class="w-full h-full object-cover" 
              />
            </div>
            <span 
              class="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm text-white"
              [ngClass]="data.genre === 'FEMININ' ? 'bg-rose-600' : 'bg-sky-600'">
              {{ data.genre === 'FEMININ' ? 'Féminin' : 'Masculin' }}
            </span>
          </div>
          <span class="text-[11px] text-gray-500 mt-3 uppercase tracking-wider font-semibold">ID National Sanitaire</span>
          <span class="text-[14px] font-mono font-bold text-[#064e3b]">{{ data.codeNational }}</span>
        </div>

        <!-- Demographic & Clinical Summary Column -->
        <div class="sm:col-span-8 space-y-4">
          <div>
            <span class="text-[11px] text-gray-400 uppercase tracking-wider block font-medium">Nom & Prénom de l'enfant</span>
            <h2 class="text-2xl font-bold text-gray-900 tracking-tight text-balance">{{ data.nomComplet }}</h2>
            <div class="flex items-center gap-2 mt-1 text-xs text-gray-600">
              <span class="material-symbols-outlined text-emerald-600 text-[16px]">child_care</span>
              <span>Né(e) le {{ data.dateNaissance | date:'dd MMMM yyyy':'':'fr' }} • <strong class="text-gray-900 font-semibold">{{ data.ageEnMois }} mois révolus</strong></span>
            </div>
          </div>

          <!-- Micro Metric Badges -->
          <div class="grid grid-cols-3 gap-2 pt-1">
            <div class="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <span class="text-[10px] text-gray-500 font-medium block">Groupe Sanguin</span>
              <div class="flex items-center gap-1 mt-0.5">
                <span class="material-symbols-outlined text-rose-600 text-[18px]">bloodtype</span>
                <span class="text-sm font-bold text-gray-900">{{ data.groupeSanguin }}</span>
              </div>
            </div>

            <div class="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <span class="text-[10px] text-gray-500 font-medium block">Périmètre Brachial</span>
              <div class="flex items-center gap-1 mt-0.5">
                <span class="material-symbols-outlined text-emerald-600 text-[18px]">straighten</span>
                <span class="text-sm font-bold" [ngClass]="muacColorClass">{{ data.dernierPerimetreBrachial }} cm</span>
              </div>
            </div>

            <div class="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <span class="text-[10px] text-gray-500 font-medium block">Statut Nutrition</span>
              <span 
                class="inline-block px-2 py-0.5 mt-0.5 rounded-full text-[10px] font-bold"
                [ngClass]="nutritionStatusClass">
                {{ nutritionStatusLabel }}
              </span>
            </div>
          </div>

          <!-- Attached Medical Facility -->
          <div class="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-900/5">
            <span class="material-symbols-outlined text-[#064e3b] text-[20px] mt-0.5">local_hospital</span>
            <div class="flex flex-col min-w-0">
              <span class="text-[10px] text-emerald-800 uppercase font-bold tracking-wider">Poste de Santé d'Attachement</span>
              <span class="text-xs text-gray-900 font-bold truncate">{{ data.nomStructureSante }}</span>
              <span class="text-[11px] text-gray-500">{{ data.regionMedicale }} • Tuteur : {{ data.tuteurNom }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Watermark Security Footer -->
      <div class="flex items-center justify-between pt-4 mt-5 border-t border-gray-100 text-[11px] text-gray-400 font-mono">
        <span>HASH: {{ data.hashCryptographiqueSHA256 }} • Émis à Dakar</span>
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span class="text-emerald-800 font-semibold uppercase text-[10px] tracking-wider">Passeport Pédiatrique Homologué</span>
        </div>
      </div>
    </div>
  `
})
export class HealthIdCardComponent {
  @Input({ required: true }) data!: CarnetSanteData;

  get muacColorClass(): string {
    const pb = this.data.dernierPerimetreBrachial;
    if (pb < 11.5) return 'text-rose-600';
    if (pb < 12.5) return 'text-amber-600';
    return 'text-emerald-700';
  }

  get nutritionStatusClass(): string {
    switch (this.data.statutNutritionnel) {
      case 'MAS':
        return 'bg-rose-100 text-rose-800';
      case 'MAM':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-emerald-100 text-emerald-800';
    }
  }

  get nutritionStatusLabel(): string {
    switch (this.data.statutNutritionnel) {
      case 'MAS':
        return 'Alerte MAS';
      case 'MAM':
        return 'MAM Modéré';
      default:
        return 'Normal (Eutrophie)';
    }
  }
}
