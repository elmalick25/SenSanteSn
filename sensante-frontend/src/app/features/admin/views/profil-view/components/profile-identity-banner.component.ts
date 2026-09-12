import { Component, Input, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminProfile } from '../../../../../core/models/admin-profile.model';

@Component({
  selector: 'app-profile-identity-banner',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 lg:p-8 bg-gradient-to-r from-slate-50 via-white to-emerald-50/20 border-b border-slate-100">
      <div class="flex flex-col md:flex-row md:items-center gap-6">
        <!-- Avatar avec bouton flottant d'édition -->
        <div class="relative shrink-0 w-[110px] h-[110px]">
          <img 
            class="w-[110px] h-[110px] rounded-full object-cover border-4 border-white shadow-md ring-1 ring-slate-200/80" 
            [src]="profile.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop'"
            [alt]="profile.nomComplet"
          />
          <!-- Floating Edit Pencil Badge Button -->
          <button 
            type="button"
            (click)="onEditAvatar.emit()"
            aria-label="Modifier la photo de profil" 
            class="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#003426] text-white flex items-center justify-center hover:bg-[#166b53] transition-all shadow-md active:scale-95 border-2 border-white cursor-pointer"
            title="Modifier la photo"
          >
            <span class="material-symbols-outlined text-[16px]">edit</span>
          </button>
        </div>

        <!-- Informations Métadonnées d'Identité -->
        <div class="flex flex-col gap-2 flex-1 min-w-0">
          <div class="flex flex-wrap items-center gap-3">
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display truncate text-balance">
              {{ profile.nomComplet }}
            </h2>

            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 whitespace-nowrap">
              <span class="material-symbols-outlined text-[14px]">shield</span>
              <span>{{ profile.roleLabel }}</span>
            </span>
          </div>

          <!-- Drapeaux & Certifications Institutionnelles -->
          <div class="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-slate-500">
            <div class="flex items-center gap-1 text-emerald-800 font-semibold whitespace-nowrap">
              <span class="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
              <span>Compte Certifié CNI Biométrique</span>
            </div>

            <span class="text-slate-300 hidden sm:inline">•</span>

            <div class="flex items-center gap-1 text-slate-500 whitespace-nowrap">
              <span class="material-symbols-outlined text-[16px]">history</span>
              <span>Dernière connexion : {{ profile.derniereConnexion }}</span>
            </div>
          </div>
        </div>

        <!-- Institutional Republic Watermark Stamp -->
        <div class="hidden xl:flex flex-col items-end opacity-85 shrink-0 pr-2">
          <div class="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <span class="material-symbols-outlined text-base text-[#166b53]">account_balance</span>
            <span>{{ profile.institution }}</span>
          </div>
          <span class="text-[11px] font-medium text-slate-400">
            {{ profile.direction }}
          </span>
        </div>
      </div>
    </div>
  `
})
export class ProfileIdentityBannerComponent {
  @Input({ required: true }) profile!: AdminProfile;
  onEditAvatar = output<void>();
}
