import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Badge } from '../../../../../core/models/badge.model';
import { Role } from '../../../../../core/models/role.enum';

@Component({
  selector: 'app-badge-trombi',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div
        *ngFor="let badge of badges"
        class="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col items-center text-center shadow-xs hover:shadow-md transition-all group"
      >
        <!-- Photo Biométrique avec Point de Statut -->
        <div class="relative w-20 h-20 rounded-2xl overflow-hidden mb-3 border-2 border-slate-200 group-hover:border-primary-container/50 transition-colors bg-slate-100 flex items-center justify-center">
          <img *ngIf="badge.avatarUrl; else noAvatarTrombi" [src]="badge.avatarUrl" [alt]="badge.nom" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          <ng-template #noAvatarTrombi>
            <div class="w-full h-full bg-amber-50 flex items-center justify-center text-amber-800 font-bold text-lg">
              {{ getInitials(badge) }}
            </div>
          </ng-template>

          <span
            class="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs"
            [ngClass]="badge.statutCompte === 'SUSPENDU' ? 'bg-amber-500' : 'bg-emerald-500'"
          ></span>
        </div>

        <!-- Rôle -->
        <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1"
          [ngClass]="getRoleClass(badge.role)"
        >
          {{ getRoleShort(badge.role) }}
        </span>

        <!-- Nom -->
        <h4 class="text-xs font-bold text-slate-900 truncate w-full text-balance">
          {{ badge.prenom }} {{ badge.nom }}
        </h4>

        <!-- Structure -->
        <p class="text-[11px] text-slate-500 truncate w-full mt-0.5">
          {{ badge.nomStructure || 'MSAS' }}
        </p>

        <!-- Numéro d'Ordre ou Matricule -->
        <p class="text-[10px] font-code-num text-slate-400 mt-1 truncate">
          {{ badge.numeroOrdre || badge.matriculeEtat || badge.codeBadge }}
        </p>

        <!-- Action Button -->
        <button
          type="button"
          (click)="viewProfile.emit(badge)"
          class="mt-3 w-full py-1 px-2 rounded-lg bg-slate-50 hover:bg-primary-container hover:text-white text-slate-700 text-[11px] font-semibold transition-colors border border-slate-200 whitespace-nowrap active:scale-[0.98]"
        >
          Fiche Badge
        </button>
      </div>
    </div>
  `
})
export class BadgeTrombiComponent {
  @Input({ required: true }) badges: Badge[] = [];
  @Output() viewProfile = new EventEmitter<Badge>();

  readonly Role = Role;

  getInitials(b: Badge): string {
    const p = b.prenom?.charAt(0) || '';
    const n = b.nom?.charAt(0) || '';
    return (p + n).toUpperCase() || 'SN';
  }

  getRoleShort(role: Role): string {
    if (role === Role.MEDECIN) return 'Médecin';
    if (role === Role.AGENT_SANTE) return 'Sage-Femme';
    if (role === Role.SUPERVISEUR) return 'Superviseur';
    if (role === Role.ADMINISTRATEUR) return 'Admin';
    return 'Parent';
  }

  getRoleClass(role: Role): string {
    if (role === Role.MEDECIN) return 'bg-indigo-50 text-indigo-700';
    if (role === Role.AGENT_SANTE) return 'bg-teal-50 text-teal-700';
    if (role === Role.SUPERVISEUR) return 'bg-amber-50 text-amber-800';
    if (role === Role.ADMINISTRATEUR) return 'bg-purple-50 text-purple-700';
    return 'bg-sky-50 text-sky-700';
  }
}
