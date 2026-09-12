import { Component, Input, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ProfileTab = 'personal' | 'preferences' | 'security';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="flex flex-col gap-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-display text-balance">
            Mon Profil Administrateur
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-0.5 text-pretty">
            Gestion de vos informations d'identité républicaine, habilitations DSI et préférences d'administration SenSanté.
          </p>
        </div>

        <!-- Quick Security Badge -->
        <div class="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/80 text-slate-700 text-xs font-semibold shadow-xs whitespace-nowrap">
          <span class="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
          <span>Rôle National : <strong class="text-slate-900">Niveau 1 (Accès Total)</strong></span>
        </div>
      </div>

      <!-- TOP TAB SWITCHER -->
      <nav class="flex items-center gap-6 sm:gap-8 border-b border-slate-200 mt-1 overflow-x-auto scrollbar-none">
        <!-- Active Tab: Informations Personnelles -->
        <button 
          type="button"
          (click)="onTabChange.emit('personal')"
          class="flex items-center gap-2 pb-3 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer whitespace-nowrap"
          [ngClass]="{
            'text-[#003426] border-[#003426] font-bold': activeTab === 'personal',
            'text-slate-500 hover:text-slate-900 border-transparent': activeTab !== 'personal'
          }"
        >
          <span class="material-symbols-outlined text-[18px]">badge</span>
          <span>Informations Personnelles</span>
          @if (activeTab === 'personal') {
            <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
          }
        </button>

        <!-- Tab: Préférences -->
        <button 
          type="button"
          (click)="onTabChange.emit('preferences')"
          class="flex items-center gap-2 pb-3 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer whitespace-nowrap"
          [ngClass]="{
            'text-[#003426] border-[#003426] font-bold': activeTab === 'preferences',
            'text-slate-500 hover:text-slate-900 border-transparent': activeTab !== 'preferences'
          }"
        >
          <span class="material-symbols-outlined text-[18px]">tune</span>
          <span>Préférences</span>
          @if (activeTab === 'preferences') {
            <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
          }
        </button>

        <!-- Tab: Sécurité & Accès -->
        <button 
          type="button"
          (click)="onTabChange.emit('security')"
          class="flex items-center gap-2 pb-3 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer whitespace-nowrap"
          [ngClass]="{
            'text-[#003426] border-[#003426] font-bold': activeTab === 'security',
            'text-slate-500 hover:text-slate-900 border-transparent': activeTab !== 'security'
          }"
        >
          <span class="material-symbols-outlined text-[18px]">security</span>
          <span>Sécurité &amp; Accès</span>
          @if (activeTab === 'security') {
            <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
          }
        </button>
      </nav>
    </header>
  `
})
export class ProfileHeaderComponent {
  @Input() activeTab: ProfileTab = 'personal';
  onTabChange = output<ProfileTab>();
}
