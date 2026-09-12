import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeStats } from '../../../../../core/models/badge.model';
import { Role } from '../../../../../core/models/role.enum';

@Component({
  selector: 'app-badge-stats-bento',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <!-- 1. Médecins Chefs -->
      <button
        type="button"
        (click)="filterByRole.emit(Role.MEDECIN)"
        class="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3 text-left transition-all hover:border-indigo-300 hover:shadow-sm focus:outline-none"
        [ngClass]="{ 'ring-2 ring-indigo-600 bg-indigo-50/20': activeRole === Role.MEDECIN }"
      >
        <div class="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-[20px]">stethoscope</span>
        </div>
        <div class="overflow-hidden">
          <span class="text-xs text-slate-500 font-medium truncate block">Médecins Chefs</span>
          <div class="text-title-md font-bold text-slate-900 font-code-num flex items-baseline gap-1">
            <span>{{ stats?.medecinsChefsCount || 0 }}</span>
            <span class="text-[10px] text-emerald-600 font-normal whitespace-nowrap">100% ONMS</span>
          </div>
        </div>
      </button>

      <!-- 2. Agents / Sages-Femmes -->
      <button
        type="button"
        (click)="filterByRole.emit(Role.AGENT_SANTE)"
        class="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3 text-left transition-all hover:border-teal-300 hover:shadow-sm focus:outline-none"
        [ngClass]="{ 'ring-2 ring-teal-600 bg-teal-50/20': activeRole === Role.AGENT_SANTE }"
      >
        <div class="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-[20px]">health_and_safety</span>
        </div>
        <div class="overflow-hidden">
          <span class="text-xs text-slate-500 font-medium truncate block">Agents / Sages-Femmes</span>
          <div class="text-title-md font-bold text-slate-900 font-code-num flex items-baseline gap-1">
            <span>{{ stats?.agentsSanteCount || 0 }}</span>
            <span class="text-[10px] text-teal-600 font-normal whitespace-nowrap">Terrain</span>
          </div>
        </div>
      </button>

      <!-- 3. Superviseurs District -->
      <button
        type="button"
        (click)="filterByRole.emit(Role.SUPERVISEUR)"
        class="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3 text-left transition-all hover:border-amber-300 hover:shadow-sm focus:outline-none"
        [ngClass]="{ 'ring-2 ring-amber-600 bg-amber-50/20': activeRole === Role.SUPERVISEUR }"
      >
        <div class="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-[20px]">assignment_ind</span>
        </div>
        <div class="overflow-hidden">
          <span class="text-xs text-slate-500 font-medium truncate block">Superviseurs District</span>
          <div class="text-title-md font-bold text-slate-900 font-code-num flex items-baseline gap-1">
            <span>{{ stats?.superviseursCount || 0 }}</span>
            <span class="text-[10px] text-amber-600 font-normal whitespace-nowrap">14 Régions</span>
          </div>
        </div>
      </button>

      <!-- 4. Administrateurs MSAS -->
      <button
        type="button"
        (click)="filterByRole.emit(Role.ADMINISTRATEUR)"
        class="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3 text-left transition-all hover:border-purple-300 hover:shadow-sm focus:outline-none"
        [ngClass]="{ 'ring-2 ring-purple-600 bg-purple-50/20': activeRole === Role.ADMINISTRATEUR }"
      >
        <div class="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-[20px]">shield_person</span>
        </div>
        <div class="overflow-hidden">
          <span class="text-xs text-slate-500 font-medium truncate block">Administrateurs MSAS</span>
          <div class="text-title-md font-bold text-slate-900 font-code-num flex items-baseline gap-1">
            <span>{{ stats?.administrateursCount || 0 }}</span>
            <span class="text-[10px] text-purple-600 font-normal whitespace-nowrap">DSI Central</span>
          </div>
        </div>
      </button>

      <!-- 5. Parents & Tuteurs -->
      <button
        type="button"
        (click)="filterByRole.emit(Role.PARENT)"
        class="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3 text-left transition-all hover:border-sky-300 hover:shadow-sm focus:outline-none col-span-2 sm:col-span-1"
        [ngClass]="{ 'ring-2 ring-sky-600 bg-sky-50/20': activeRole === Role.PARENT }"
      >
        <div class="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-[20px]">family_restroom</span>
        </div>
        <div class="overflow-hidden">
          <span class="text-xs text-slate-500 font-medium truncate block">Parents & Tuteurs</span>
          <div class="text-title-md font-bold text-slate-900 font-code-num flex items-baseline gap-1">
            <span>{{ stats?.parentsCount || 0 }}</span>
            <span class="text-[10px] text-sky-600 font-normal whitespace-nowrap">Portail Citoyen</span>
          </div>
        </div>
      </button>
    </section>
  `
})
export class BadgeStatsBentoComponent {
  @Input() stats: BadgeStats | null = null;
  @Input() activeRole: Role | null = null;
  @Output() filterByRole = new EventEmitter<Role>();

  readonly Role = Role;
}
