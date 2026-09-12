import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Badge } from '../../../../../core/models/badge.model';
import { Role } from '../../../../../core/models/role.enum';

@Component({
  selector: 'app-badge-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="bg-white rounded-2xl border shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group relative"
      [ngClass]="{
        'border-amber-300 bg-amber-50/10': badge.statutCompte === 'SUSPENDU',
        'border-emerald-700/30 bg-emerald-50/10': badge.role === Role.ADMINISTRATEUR,
        'border-slate-200': badge.statutCompte !== 'SUSPENDU' && badge.role !== Role.ADMINISTRATEUR
      }"
    >
      <!-- Ruban Officiel MSAS République du Sénégal -->
      <div
        class="h-2.5 w-full shrink-0"
        [ngClass]="{
          'bg-amber-400': badge.statutCompte === 'SUSPENDU',
          'bg-gradient-to-r from-emerald-600 via-amber-400 to-rose-600': badge.statutCompte !== 'SUSPENDU'
        }"
      ></div>

      <!-- Contenu de la Carte -->
      <div class="p-5 flex-1 flex flex-col justify-between">
        <div>
          <!-- En-tête Badge & Statut d'exercice -->
          <div class="flex items-start justify-between gap-3 mb-4">
            <div class="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase font-headline-sm"
              [ngClass]="{
                'text-amber-700': badge.statutCompte === 'SUSPENDU',
                'text-emerald-800': badge.role === Role.ADMINISTRATEUR,
                'text-slate-500': badge.statutCompte !== 'SUSPENDU' && badge.role !== Role.ADMINISTRATEUR
              }"
            >
              <span class="material-symbols-outlined text-[16px]">
                {{ getHeaderIcon() }}
              </span>
              <span class="truncate">{{ getHeaderLabel() }}</span>
            </div>

            <!-- Pilule Statut -->
            <span
              class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0"
              [ngClass]="getStatusPillClass()"
            >
              <span class="w-1.5 h-1.5 rounded-full" [ngClass]="getStatusDotClass()"></span>
              {{ getStatusLabel() }}
            </span>
          </div>

          <!-- Section Portrait Biométrique & Bloc Identité -->
          <div class="flex items-center gap-4 mb-4">
            <!-- Portrait Biométrique ICAO -->
            <div
              class="relative w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 shrink-0 bg-slate-100 flex items-center justify-center"
              [ngClass]="getAvatarBorderClass()"
            >
              <ng-container *ngIf="badge.avatarUrl; else noAvatar">
                <img
                  [src]="badge.avatarUrl"
                  [alt]="badge.prenom + ' ' + badge.nom"
                  class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </ng-container>
              <ng-template #noAvatar>
                <div class="w-full h-full bg-amber-50 flex items-center justify-center text-amber-800 font-bold text-xl">
                  {{ getInitials() }}
                </div>
              </ng-template>

              <!-- Indicateur de Session Active / Présence -->
              <div
                class="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-xs"
                [ngClass]="badge.statutCompte === 'SUSPENDU' ? 'bg-amber-500' : 'bg-emerald-500'"
                [title]="badge.statutCompte === 'SUSPENDU' ? 'Compte inactif' : 'Session active'"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
              </div>
            </div>

            <!-- Identité & Rôle Métier -->
            <div class="min-w-0 flex-1">
              <!-- Chip de Rôle -->
              <div
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold mb-1 border whitespace-nowrap"
                [ngClass]="getRoleBadgeClass()"
              >
                <span class="material-symbols-outlined text-[13px]">{{ getRoleIcon() }}</span>
                <span>{{ getRoleTitle() }}</span>
              </div>

              <!-- Nom & Prénom -->
              <h3 class="text-headline-sm font-headline-sm text-slate-900 font-bold truncate text-balance">
                {{ badge.prenom }} {{ badge.nom }}
              </h3>

              <!-- Titre du poste ou affectation -->
              <p class="text-xs text-slate-600 truncate mt-0.5 text-pretty">
                {{ badge.titrePoste || 'Praticien MSAS' }}
              </p>

              <!-- Email officiel -->
              <p class="text-[11px] font-code-num text-slate-400 mt-1 truncate">
                {{ badge.email }}
              </p>
            </div>
          </div>

          <!-- Cartouche Détails Institutionnels & Habilitation -->
          <div
            class="p-3 rounded-xl border space-y-2 text-xs"
            [ngClass]="badge.statutCompte === 'SUSPENDU' ? 'bg-amber-50/50 border-amber-100' : 'bg-slate-50 border-slate-100'"
          >
            <!-- Ligne 1: Structure / Institution -->
            <div class="flex items-center justify-between">
              <span class="text-slate-500 flex items-center gap-1">
                <span class="material-symbols-outlined text-[15px] text-slate-400">
                  {{ badge.role === Role.ADMINISTRATEUR ? 'account_balance' : (badge.role === Role.PARENT ? 'devices' : 'domain') }}
                </span>
                <span>{{ badge.role === Role.ADMINISTRATEUR ? 'Institution :' : (badge.role === Role.PARENT ? 'Plateforme :' : 'Structure :') }}</span>
              </span>
              <span class="font-semibold text-slate-800 text-right truncate max-w-[170px]">
                {{ badge.nomStructure || 'Non assigné' }}
              </span>
            </div>

            <!-- Ligne 2: Code MSAS / Code Entité / ID Carnet -->
            <div class="flex items-center justify-between">
              <span class="text-slate-500 flex items-center gap-1">
                <span class="material-symbols-outlined text-[15px] text-slate-400">
                  {{ badge.role === Role.PARENT ? 'book' : 'confirmation_number' }}
                </span>
                <span>{{ badge.role === Role.PARENT ? 'ID Carnet :' : 'Code MSAS :' }}</span>
              </span>
              <span class="font-code-num font-semibold text-slate-700">
                {{ badge.idCarnet || badge.codeStructure || badge.codeBadge || 'SN-MSAS' }}
              </span>
            </div>

            <!-- Ligne 3: Accréditation spécifique (ONMS, Matricule, Arrêté, Décret) -->
            <div class="flex items-center justify-between">
              <span class="text-slate-500 flex items-center gap-1">
                <span class="material-symbols-outlined text-[15px] text-slate-400">
                  {{ badge.statutCompte === 'SUSPENDU' ? 'warning' : 'verified_user' }}
                </span>
                <span>{{ getAccreditationLabel() }}</span>
              </span>
              <span class="font-code-num font-bold px-1.5 py-0.5 rounded border text-right truncate max-w-[170px]"
                [ngClass]="getAccreditationBadgeClass()"
              >
                {{ getAccreditationValue() }}
              </span>
            </div>

            <!-- Ligne 4: CNI Biométrique CEDEAO masquée -->
            <div class="flex items-center justify-between">
              <span class="text-slate-500 flex items-center gap-1">
                <span class="material-symbols-outlined text-[15px] text-slate-400">badge</span>
                <span>CNI CEDEAO :</span>
              </span>
              <span class="font-code-num text-slate-600 tracking-wider">
                {{ badge.cniMasquee || '1 751 •••• •••• --' }}
              </span>
            </div>

            <!-- Ligne 5: Sécurité MFA & Authentification double facteur -->
            <div class="flex items-center justify-between pt-1 border-t border-slate-200/60">
              <span class="text-slate-500 flex items-center gap-1 text-[11px]">
                <span class="material-symbols-outlined text-[14px]"
                  [ngClass]="badge.statutCompte === 'SUSPENDU' ? 'text-amber-600' : 'text-emerald-600'"
                >
                  {{ badge.statutCompte === 'SUSPENDU' ? 'lock_reset' : 'security' }}
                </span>
                <span>Sécurité MFA :</span>
              </span>
              <span class="inline-flex items-center gap-1 text-[11px] font-semibold font-code-num"
                [ngClass]="badge.statutCompte === 'SUSPENDU' ? 'text-amber-800' : 'text-emerald-700'"
              >
                <span *ngIf="badge.statutCompte !== 'SUSPENDU'" class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {{ badge.securiteMfa || 'Double Authentification' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Barre d'Actions Inférieure -->
      <div
        class="px-5 py-3 border-t flex items-center justify-between gap-2 shrink-0"
        [ngClass]="badge.statutCompte === 'SUSPENDU' ? 'bg-amber-50/40 border-amber-100' : 'bg-slate-50/70 border-slate-100'"
      >
        <button
          type="button"
          (click)="viewProfile.emit(badge)"
          class="flex-1 py-1.5 px-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-container transition-colors flex items-center justify-center gap-1 shadow-2xs whitespace-nowrap active:scale-[0.98]"
        >
          <span class="material-symbols-outlined text-[16px]">visibility</span>
          <span>{{ badge.statutCompte === 'SUSPENDU' ? 'Voir Dossier' : 'Voir Profil' }}</span>
        </button>

        <ng-container *ngIf="badge.statutCompte === 'SUSPENDU'; else normalActions">
          <button
            type="button"
            (click)="toggleStatus.emit(badge)"
            class="flex-1 py-1.5 px-2 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-all flex items-center justify-center gap-1 shadow-2xs whitespace-nowrap active:scale-[0.98]"
          >
            <span class="material-symbols-outlined text-[16px]">play_circle</span>
            <span>Réactiver</span>
          </button>
        </ng-container>

        <ng-template #normalActions>
          <button
            type="button"
            (click)="manageRights.emit(badge)"
            class="flex-1 py-1.5 px-2 rounded-lg bg-primary-container text-white text-xs font-semibold hover:bg-[#165B47] transition-all flex items-center justify-center gap-1 shadow-2xs whitespace-nowrap active:scale-[0.98]"
          >
            <span class="material-symbols-outlined text-[16px]">
              {{ badge.role === Role.ADMINISTRATEUR ? 'policy' : (badge.role === Role.PARENT ? 'child_care' : 'manage_accounts') }}
            </span>
            <span>{{ badge.role === Role.ADMINISTRATEUR ? 'Audit Accès' : (badge.role === Role.PARENT ? 'Enfants Liés' : 'Gérer Droits') }}</span>
          </button>
        </ng-template>

        <!-- Bouton Rapide Sécurité / OTP -->
        <button
          type="button"
          (click)="quickAction.emit(badge)"
          [title]="badge.statutCompte === 'SUSPENDU' ? 'Révocation définitive' : 'Réinitialiser clé MFA / OTP'"
          class="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors shrink-0 active:scale-[0.96]"
        >
          <span class="material-symbols-outlined text-[16px]">
            {{ badge.statutCompte === 'SUSPENDU' ? 'block' : (badge.role === Role.ADMINISTRATEUR ? 'history' : 'key') }}
          </span>
        </button>
      </div>
    </div>
  `
})
export class BadgeCardComponent {
  @Input({ required: true }) badge!: Badge;
  @Output() viewProfile = new EventEmitter<Badge>();
  @Output() manageRights = new EventEmitter<Badge>();
  @Output() toggleStatus = new EventEmitter<Badge>();
  @Output() quickAction = new EventEmitter<Badge>();

  readonly Role = Role;

  getHeaderIcon(): string {
    if (this.badge.statutCompte === 'SUSPENDU') return 'pause_circle';
    if (this.badge.role === Role.ADMINISTRATEUR) return 'shield';
    if (this.badge.role === Role.PARENT) return 'escalator_warning';
    if (this.badge.role === Role.SUPERVISEUR) return 'verified';
    return 'verified';
  }

  getHeaderLabel(): string {
    if (this.badge.statutCompte === 'SUSPENDU') return 'CARTE D\'HABILITATION SUSPENDUE';
    if (this.badge.role === Role.ADMINISTRATEUR) return 'SUPER-ADMIN GOUVERNEMENTAL';
    if (this.badge.role === Role.PARENT) return 'CARTE CITOYENNE • CARNET';
    if (this.badge.role === Role.SUPERVISEUR) return 'CARTE D\'HABILITATION RÉGIONALE';
    return 'CARTE D\'HABILITATION MSAS';
  }

  getStatusLabel(): string {
    if (this.badge.statutCompte === 'SUSPENDU') return 'Suspendu';
    if (this.badge.role === Role.ADMINISTRATEUR) return 'Niveau 4';
    if (this.badge.role === Role.PARENT) return 'Vérifié';
    if (this.badge.statutCompte === 'EN_ATTENTE') return 'En attente';
    return 'Actif';
  }

  getStatusPillClass(): string {
    if (this.badge.statutCompte === 'SUSPENDU') {
      return 'bg-amber-50 text-amber-800 border border-amber-300';
    }
    if (this.badge.role === Role.ADMINISTRATEUR) {
      return 'bg-purple-100 text-purple-800 border border-purple-200';
    }
    if (this.badge.statutCompte === 'EN_ATTENTE') {
      return 'bg-amber-50 text-amber-800 border border-amber-200';
    }
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  }

  getStatusDotClass(): string {
    if (this.badge.statutCompte === 'SUSPENDU') return 'bg-amber-600';
    if (this.badge.role === Role.ADMINISTRATEUR) return 'bg-purple-600';
    if (this.badge.statutCompte === 'EN_ATTENTE') return 'bg-amber-500';
    return 'bg-emerald-500';
  }

  getAvatarBorderClass(): string {
    if (this.badge.statutCompte === 'SUSPENDU') return 'border-amber-400/50';
    if (this.badge.role === Role.ADMINISTRATEUR) return 'border-primary-container';
    if (this.badge.role === Role.MEDECIN) return 'border-emerald-600/40';
    if (this.badge.role === Role.AGENT_SANTE) return 'border-teal-600/40';
    if (this.badge.role === Role.SUPERVISEUR) return 'border-amber-500/40';
    return 'border-sky-400/40';
  }

  getRoleBadgeClass(): string {
    if (this.badge.role === Role.MEDECIN) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
    if (this.badge.role === Role.AGENT_SANTE) {
      return 'bg-teal-50 text-teal-700 border-teal-200';
    }
    if (this.badge.role === Role.SUPERVISEUR) {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    if (this.badge.role === Role.ADMINISTRATEUR) {
      return 'bg-purple-50 text-purple-700 border-purple-200';
    }
    return 'bg-sky-50 text-sky-700 border-sky-200';
  }

  getRoleIcon(): string {
    if (this.badge.role === Role.MEDECIN) return 'stethoscope';
    if (this.badge.role === Role.AGENT_SANTE) return 'health_and_safety';
    if (this.badge.role === Role.SUPERVISEUR) return 'assignment_ind';
    if (this.badge.role === Role.ADMINISTRATEUR) return 'admin_panel_settings';
    return 'family_restroom';
  }

  getRoleTitle(): string {
    if (this.badge.role === Role.MEDECIN) return 'Médecin Chef';
    if (this.badge.role === Role.AGENT_SANTE) return 'Sage-Femme / Agent';
    if (this.badge.role === Role.SUPERVISEUR) return 'Superviseur District';
    if (this.badge.role === Role.ADMINISTRATEUR) return 'Admin Système MSAS';
    return 'Parent / Tuteur Légal';
  }

  getAccreditationLabel(): string {
    if (this.badge.statutCompte === 'SUSPENDU') return 'Motif Suspension :';
    if (this.badge.numeroOrdre) return 'Ordre Médecins :';
    if (this.badge.matriculeEtat) return 'Matricule État :';
    if (this.badge.role === Role.ADMINISTRATEUR) return 'Accréditation :';
    if (this.badge.role === Role.SUPERVISEUR) return 'Arrêté Ministériel :';
    return 'Validation CNI :';
  }

  getAccreditationValue(): string {
    if (this.badge.statutCompte === 'SUSPENDU') return this.badge.motifSuspension || 'Inactivité > 30j';
    if (this.badge.numeroOrdre) return this.badge.numeroOrdre;
    if (this.badge.matriculeEtat) return this.badge.matriculeEtat;
    if (this.badge.accreditation) return this.badge.accreditation;
    return 'Vérification OK';
  }

  getAccreditationBadgeClass(): string {
    if (this.badge.statutCompte === 'SUSPENDU') {
      return 'text-amber-800 bg-amber-50 border-amber-200';
    }
    if (this.badge.numeroOrdre) {
      return 'text-indigo-700 bg-indigo-50/80 border-indigo-100';
    }
    if (this.badge.matriculeEtat) {
      return 'text-teal-700 bg-teal-50/80 border-teal-100';
    }
    if (this.badge.role === Role.ADMINISTRATEUR) {
      return 'text-purple-700 bg-purple-50/80 border-purple-100';
    }
    if (this.badge.role === Role.SUPERVISEUR) {
      return 'text-amber-800 bg-amber-50/80 border-amber-100';
    }
    return 'text-sky-700 bg-sky-50/80 border-sky-100';
  }

  getInitials(): string {
    const p = this.badge.prenom?.charAt(0) || '';
    const n = this.badge.nom?.charAt(0) || '';
    return (p + n).toUpperCase() || 'SN';
  }
}
