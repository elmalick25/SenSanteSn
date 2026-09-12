import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MuacZone } from '../../../../core/models/parent-space.model';

@Component({
  selector: 'app-muac-gauge',
  standalone: true,
  imports: [],
  template: `
    <div class="flex flex-col w-full">
      <!-- Legend -->
      <div class="flex justify-between text-[10px] font-semibold text-gray-500 mb-1.5">
        <span class="text-rose-600 font-bold">&lt; 11.5 (MAS)</span>
        <span class="text-amber-600 font-bold">11.5 - 12.5 (MAM)</span>
        <span class="text-emerald-700 font-bold">&gt; 12.5 (OK)</span>
      </div>

      <!-- Tricolor Shakir Strip -->
      <div class="h-3.5 w-full rounded-full bg-slate-200 overflow-hidden flex relative p-0.5 shadow-inner">
        <!-- Rouge: MAS (<11.5 cm) ~ 35% de l'échelle 9-16cm -->
        <div class="w-[35%] bg-rose-600 rounded-l-full transition-all" title="Zone Rouge : Malnutrition Aiguë Sévère"></div>
        <!-- Jaune: MAM (11.5-12.5 cm) ~ 15% de l'échelle -->
        <div class="w-[15%] bg-amber-400 transition-all" title="Zone Jaune : Malnutrition Aiguë Modérée"></div>
        <!-- Vert: Normal (>12.5 cm) ~ 50% de l'échelle -->
        <div class="w-[50%] bg-emerald-600 rounded-r-full transition-all" title="Zone Verte : Nutrition Normale"></div>

        <!-- Curseur Indicateur dynamique (Aiguille Shakir) -->
        <div
          class="absolute top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_6px_rgba(0,0,0,0.45)] border border-gray-300 transition-all duration-500 transform -translate-x-1/2"
          [style.left.%]="cursorPositionPercent"
          [title]="'Mesure actuelle : ' + muac + ' cm'">
        </div>
      </div>

      <!-- Footer info -->
      <div class="flex justify-between items-center mt-2.5 text-xs text-gray-500">
        <span>Seuil sécuritaire : 12.5 cm</span>
        <span class="font-semibold text-emerald-700 font-sans" [class.text-rose-600]="zone === 'MAS'" [class.text-amber-600]="zone === 'MAM'">
          {{ muac.toFixed(1) }} cm • {{ zoneLabel }}
        </span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class MuacGaugeComponent {
  @Input() muac: number = 13.1;
  @Input() zone: MuacZone = 'NORMAL';

  get cursorPositionPercent(): number {
    // Échelle réaliste du ruban de Shakir : de 9.5 cm à 15.5 cm
    const min = 9.5;
    const max = 15.5;
    const clamped = Math.min(max, Math.max(min, this.muac));
    return ((clamped - min) / (max - min)) * 100;
  }

  get zoneLabel(): string {
    switch (this.zone) {
      case 'MAS': return 'Zone Rouge (MAS)';
      case 'MAM': return 'Zone Jaune (MAM)';
      case 'NORMAL': return 'Zone Verte (Normal)';
    }
  }
}
