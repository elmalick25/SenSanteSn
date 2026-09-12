import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-supervisor-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex-1 p-6 flex flex-col items-center justify-center text-center bg-[#f4f7fb]">
      <div class="max-w-md p-8 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
        <div class="w-16 h-16 rounded-2xl bg-emerald-50 text-[#003426] flex items-center justify-center mb-4">
          <span class="material-symbols-outlined text-3xl">{{ icon || 'construction' }}</span>
        </div>
        <h3 class="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans'] text-balance">{{ title }}</h3>
        <p class="text-xs text-slate-500 mt-2 text-pretty">{{ description }}</p>
        <div class="mt-4 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold whitespace-nowrap">
          Module prêt pour l'intégration des prochaines maquettes
        </div>
      </div>
    </div>
  `
})
export class SupervisorPlaceholderComponent {
  @Input() title = 'Module en cours de finalisation';
  @Input() description = 'Cette vue sera activée avec les prochaines maquettes partagées.';
  @Input() icon = 'dashboard';
}
