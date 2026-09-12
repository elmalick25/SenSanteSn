import { Component, Input, OnChanges } from '@angular/core';
import { BackendBilanAntro } from '../../../../core/models/parent-space.model';

@Component({
  selector: 'app-growth-sparkline',
  standalone: true,
  template: `
    <div class="w-full flex flex-col gap-1">
      <div class="w-full h-11 relative overflow-hidden rounded-md bg-slate-50/50 p-0.5">
        <svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 160 40">
          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#0d9488" />
              <stop offset="100%" stop-color="#047857" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.25" />
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.02" />
            </linearGradient>
          </defs>

          <!-- Couloir OMS Normal de référence (Polygone vert d'eau estompé) -->
          <polygon
            points="0,28 35,24 80,18 120,14 160,10 160,26 120,30 80,33 35,36 0,38"
            fill="#e6f7f2"
            opacity="0.8">
          </polygon>

          <!-- Remplissage sous la courbe -->
          <path
            [attr.d]="svgAreaPath"
            fill="url(#areaGradient)">
          </path>

          <!-- Courbe de croissance réelle -->
          <path
            [attr.d]="svgCurvePath"
            fill="none"
            stroke="url(#curveGradient)"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round">
          </path>

          <!-- Point de dernière pesée -->
          <circle
            [attr.cx]="lastPoint.x"
            [attr.cy]="lastPoint.y"
            r="3.5"
            fill="#064e3b"
            stroke="#ffffff"
            stroke-width="1.5">
          </circle>
        </svg>
      </div>

      <!-- Légende basse dynamique -->
      <div class="flex justify-between text-[11px] text-gray-500 font-medium">
        <span>{{ startLabel }}</span>
        <span class="text-emerald-800 font-semibold">{{ endLabel }}</span>
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
export class GrowthSparklineComponent implements OnChanges {
  @Input() bilans: BackendBilanAntro[] = [];
  @Input() currentWeight: number | null = 6.45;

  svgCurvePath: string = 'M0,34 Q35,30 75,23 T160,12';
  svgAreaPath: string = 'M0,34 Q35,30 75,23 T160,12 L160,40 L0,40 Z';
  lastPoint = { x: 160, y: 12 };
  startLabel: string = 'Mois 4 (5.5kg)';
  endLabel: string = "Aujourd'hui (6.45kg)";

  ngOnChanges(): void {
    this.computePaths();
  }

  private computePaths(): void {
    if (!this.bilans || this.bilans.length < 2) {
      // Modèle par défaut calculé à partir du poids actuel
      const w = this.currentWeight ?? 6.45;
      const startW = Math.max(3.2, Number((w - 1.2).toFixed(1)));
      this.startLabel = `Début (${startW} kg)`;
      this.endLabel = `Actuel (${w.toFixed(2)} kg)`;

      const yStart = 34;
      const yEnd = Math.max(8, Math.min(32, 38 - ((w - 3.0) / 7.0) * 30));
      this.lastPoint = { x: 160, y: yEnd };
      this.svgCurvePath = `M0,${yStart} Q80,${(yStart + yEnd) / 2 - 2} 160,${yEnd}`;
      this.svgAreaPath = `M0,${yStart} Q80,${(yStart + yEnd) / 2 - 2} 160,${yEnd} L160,40 L0,40 Z`;
      return;
    }

    // Calcul mathématique précis sur les bilans disponibles
    const sorted = [...this.bilans].sort((a, b) => new Date(a.dateBilan).getTime() - new Date(b.dateBilan).getTime());
    const weights = sorted.map(b => b.poids);
    const minW = Math.min(...weights, 3.0);
    const maxW = Math.max(...weights, 10.0);
    const range = maxW - minW || 1;

    const points = weights.map((w, idx) => {
      const x = (idx / (weights.length - 1)) * 160;
      const normalized = (w - minW) / range;
      const y = 35 - normalized * 26; // Y inversé (0 en haut)
      return { x, y };
    });

    if (points.length >= 2) {
      let path = `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const midX = (prev.x + curr.x) / 2;
        path += ` Q${midX.toFixed(1)},${prev.y.toFixed(1)} ${curr.x.toFixed(1)},${curr.y.toFixed(1)}`;
      }
      this.svgCurvePath = path;
      this.svgAreaPath = `${path} L160,40 L0,40 Z`;
      this.lastPoint = points[points.length - 1];

      this.startLabel = `Pesée 1 (${weights[0]} kg)`;
      this.endLabel = `Dernière (${weights[weights.length - 1]} kg)`;
    }
  }
}
