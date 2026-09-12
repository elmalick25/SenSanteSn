import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointPesee } from '../../../../core/models/croissance-oms.model';

@Component({
  selector: 'app-growth-history-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <!-- Table Header -->
      <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
        <div class="flex items-center gap-2.5">
          <div class="p-2 bg-slate-100 text-slate-700 rounded-xl">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900">Historique Chronologique des Pesées</h3>
            <p class="text-xs text-slate-500">Registre validé par les agents de santé et certifié DHIS2</p>
          </div>
        </div>
        <span class="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
          {{ points.length }} bilan{{ points.length > 1 ? 's' : '' }} enregistré{{ points.length > 1 ? 's' : '' }}
        </span>
      </div>

      <!-- Table Body -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr class="bg-slate-50/75 border-b border-slate-200/80 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
              <th class="py-3.5 px-4">Date du Bilan</th>
              <th class="py-3.5 px-4">Âge</th>
              <th class="py-3.5 px-4">Poids (kg)</th>
              <th class="py-3.5 px-4">Taille (cm)</th>
              <th class="py-3.5 px-4">Périmètre Brachial</th>
              <th class="py-3.5 px-4">Z-Score (P/A)</th>
              <th class="py-3.5 px-4">Statut Nutritionnel</th>
              <th class="py-3.5 px-4">Examinateur & Centre</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr *ngFor="let p of points; let i = index; let isLast = last"
              class="hover:bg-slate-50/80 transition-colors"
              [ngClass]="{'bg-emerald-50/30': isLast}">
              <!-- Date -->
              <td class="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                <div class="flex items-center gap-1.5">
                  <span *ngIf="isLast" class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {{ p.dateBilan }}
                </div>
              </td>

              <!-- Âge -->
              <td class="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                {{ p.ageMois }} mois
              </td>

              <!-- Poids -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span class="font-bold text-slate-900">{{ p.poidsKg | number:'1.2-2' }} kg</span>
              </td>

              <!-- Taille -->
              <td class="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                {{ p.tailleCm ? (p.tailleCm | number:'1.1-1') + ' cm' : '—' }}
              </td>

              <!-- PB (MUAC) -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <div class="flex items-center gap-1.5" *ngIf="p.perimetreBrachialCm">
                  <span class="w-2 h-2 rounded-full" [ngClass]="getPbBadgeClass(p.perimetreBrachialCm)"></span>
                  <span class="font-semibold text-slate-800">{{ p.perimetreBrachialCm | number:'1.1-1' }} cm</span>
                </div>
                <span *ngIf="!p.perimetreBrachialCm" class="text-slate-400">—</span>
              </td>

              <!-- Z-Score -->
              <td class="py-3.5 px-4 whitespace-nowrap font-semibold" [ngClass]="getZScoreClass(p.zScorePoidsAge)">
                {{ (p.zScorePoidsAge || 0) >= 0 ? '+' : '' }}{{ p.zScorePoidsAge || 0 | number:'1.2-2' }} σ
              </td>

              <!-- Statut Badge -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span *ngIf="p.statut === 'NORMAL'"
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Normal
                </span>
                <span *ngIf="p.statut === 'MAM'"
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  MAM Modéré
                </span>
                <span *ngIf="p.statut === 'MAS'"
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  MAS Sévère
                </span>
              </td>

              <!-- Examinateur & Structure -->
              <td class="py-3.5 px-4 text-xs whitespace-nowrap">
                <div class="font-medium text-slate-800">{{ p.examinateurNom }}</div>
                <div class="text-slate-500 text-[11px]">{{ p.structureNom }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="points.length === 0" class="p-8 text-center text-slate-500 text-sm">
        Aucune pesée enregistrée pour le moment.
      </div>
    </div>
  `
})
export class GrowthHistoryTableComponent {
  @Input() points: PointPesee[] = [];

  getPbBadgeClass(pb: number): string {
    if (pb >= 12.5) return 'bg-emerald-500';
    if (pb >= 11.5) return 'bg-amber-500';
    return 'bg-rose-500';
  }

  getZScoreClass(z?: number): string {
    const val = z ?? 0;
    if (val >= -1) return 'text-emerald-700';
    if (val >= -2) return 'text-amber-700';
    return 'text-rose-700';
  }
}
