import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Badge } from '../../../../../core/models/badge.model';
import { Role } from '../../../../../core/models/role.enum';

@Component({
  selector: 'app-badge-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <th class="py-3 px-4">Praticien / Usager</th>
              <th class="py-3 px-4">Rôle Institutionnel</th>
              <th class="py-3 px-4">Structure d'Attachement</th>
              <th class="py-3 px-4">Accréditation / Ordre</th>
              <th class="py-3 px-4">CNI CEDEAO</th>
              <th class="py-3 px-4">Statut</th>
              <th class="py-3 px-4">Sécurité MFA</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr *ngFor="let badge of badges" class="hover:bg-slate-50/70 transition-colors">
              <!-- Praticien Identité -->
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                    <img *ngIf="badge.avatarUrl; else tableNoAvatar" [src]="badge.avatarUrl" [alt]="badge.nom" class="w-full h-full object-cover" />
                    <ng-template #tableNoAvatar>{{ getInitials(badge) }}</ng-template>
                  </div>
                  <div class="min-w-0">
                    <p class="font-bold text-slate-900 truncate">{{ badge.prenom }} {{ badge.nom }}</p>
                    <p class="text-[11px] text-slate-400 font-code-num truncate">{{ badge.email }}</p>
                  </div>
                </div>
              </td>

              <!-- Rôle -->
              <td class="py-3 px-4 whitespace-nowrap">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border"
                  [ngClass]="getRoleClass(badge.role)"
                >
                  <span class="material-symbols-outlined text-[13px]">{{ getRoleIcon(badge.role) }}</span>
                  <span>{{ getRoleTitle(badge.role) }}</span>
                </span>
              </td>

              <!-- Structure -->
              <td class="py-3 px-4">
                <p class="font-semibold text-slate-800 truncate max-w-[180px]">{{ badge.nomStructure || 'Non assigné' }}</p>
                <p class="text-[11px] font-code-num text-slate-400">{{ badge.codeStructure || badge.codeBadge }}</p>
              </td>

              <!-- Accréditation / Ordre -->
              <td class="py-3 px-4 whitespace-nowrap">
                <span *ngIf="badge.numeroOrdre" class="font-code-num font-bold text-indigo-700 bg-indigo-50/80 px-1.5 py-0.5 rounded border border-indigo-100">
                  {{ badge.numeroOrdre }}
                </span>
                <span *ngIf="!badge.numeroOrdre && badge.matriculeEtat" class="font-code-num font-bold text-teal-700 bg-teal-50/80 px-1.5 py-0.5 rounded border border-teal-100">
                  {{ badge.matriculeEtat }}
                </span>
                <span *ngIf="!badge.numeroOrdre && !badge.matriculeEtat" class="font-code-num text-slate-600">
                  {{ badge.accreditation || 'Validé' }}
                </span>
              </td>

              <!-- CNI -->
              <td class="py-3 px-4 font-code-num text-slate-600 whitespace-nowrap">
                {{ badge.cniMasquee || '1 751 •••• •••• --' }}
              </td>

              <!-- Statut -->
              <td class="py-3 px-4 whitespace-nowrap">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                  [ngClass]="badge.statutCompte === 'SUSPENDU' ? 'bg-amber-50 text-amber-800 border border-amber-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" [ngClass]="badge.statutCompte === 'SUSPENDU' ? 'bg-amber-600' : 'bg-emerald-500'"></span>
                  {{ badge.statutCompte === 'SUSPENDU' ? 'Suspendu' : 'Actif' }}
                </span>
              </td>

              <!-- Sécurité MFA -->
              <td class="py-3 px-4 whitespace-nowrap">
                <span class="inline-flex items-center gap-1 font-code-num text-[11px]"
                  [ngClass]="badge.statutCompte === 'SUSPENDU' ? 'text-amber-700' : 'text-emerald-700'"
                >
                  <span class="material-symbols-outlined text-[13px]">security</span>
                  {{ badge.securiteMfa || 'FIDO2 / OTP' }}
                </span>
              </td>

              <!-- Actions -->
              <td class="py-3 px-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    (click)="viewProfile.emit(badge)"
                    class="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition-colors shadow-2xs"
                    title="Voir profil"
                  >
                    <span class="material-symbols-outlined text-[16px]">visibility</span>
                  </button>
                  <button
                    type="button"
                    (click)="manageRights.emit(badge)"
                    class="p-1.5 rounded-lg border border-slate-200 bg-primary-container text-white hover:bg-[#165B47] transition-colors shadow-2xs"
                    title="Gérer droits"
                  >
                    <span class="material-symbols-outlined text-[16px]">manage_accounts</span>
                  </button>
                  <button
                    type="button"
                    (click)="quickAction.emit(badge)"
                    class="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors shadow-2xs"
                    title="Action rapide"
                  >
                    <span class="material-symbols-outlined text-[16px]">key</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class BadgeTableComponent {
  @Input({ required: true }) badges: Badge[] = [];
  @Output() viewProfile = new EventEmitter<Badge>();
  @Output() manageRights = new EventEmitter<Badge>();
  @Output() quickAction = new EventEmitter<Badge>();

  readonly Role = Role;

  getInitials(b: Badge): string {
    const p = b.prenom?.charAt(0) || '';
    const n = b.nom?.charAt(0) || '';
    return (p + n).toUpperCase() || 'SN';
  }

  getRoleClass(role: Role): string {
    if (role === Role.MEDECIN) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (role === Role.AGENT_SANTE) return 'bg-teal-50 text-teal-700 border-teal-200';
    if (role === Role.SUPERVISEUR) return 'bg-amber-50 text-amber-800 border-amber-200';
    if (role === Role.ADMINISTRATEUR) return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-sky-50 text-sky-700 border-sky-200';
  }

  getRoleIcon(role: Role): string {
    if (role === Role.MEDECIN) return 'stethoscope';
    if (role === Role.AGENT_SANTE) return 'health_and_safety';
    if (role === Role.SUPERVISEUR) return 'assignment_ind';
    if (role === Role.ADMINISTRATEUR) return 'admin_panel_settings';
    return 'family_restroom';
  }

  getRoleTitle(role: Role): string {
    if (role === Role.MEDECIN) return 'Médecin Chef';
    if (role === Role.AGENT_SANTE) return 'Sage-Femme';
    if (role === Role.SUPERVISEUR) return 'Superviseur';
    if (role === Role.ADMINISTRATEUR) return 'Admin MSAS';
    return 'Parent / Tuteur';
  }
}
