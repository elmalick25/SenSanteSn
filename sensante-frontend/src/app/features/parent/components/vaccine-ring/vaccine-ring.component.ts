import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-vaccine-ring',
  standalone: true,
  template: `
    <div class="relative w-14 h-14 flex-shrink-0 flex items-center justify-center">
      <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <!-- Fond de la piste -->
        <path
          class="text-slate-100"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          stroke-width="3.5">
        </path>
        <!-- Anneau de progression PEV -->
        <path
          class="text-emerald-600 transition-all duration-700"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          [attr.stroke-dasharray]="strokeDasharray"
          stroke-linecap="round"
          stroke-width="3.5">
        </path>
      </svg>
      <span class="absolute text-[11px] font-bold text-emerald-950 font-sans">
        {{ dosesDone }}/{{ totalDoses }}
      </span>
    </div>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }
  `]
})
export class VaccineRingComponent {
  @Input() dosesDone: number = 6;
  @Input() totalDoses: number = 7;
  @Input() percentage: number = 85;

  get strokeDasharray(): string {
    const pct = Math.min(100, Math.max(0, this.percentage));
    return `${pct}, 100`;
  }
}
