import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateBadgePayload } from '../../../../../core/models/badge.model';
import { Role } from '../../../../../core/models/role.enum';

@Component({
  selector: 'app-badge-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      *ngIf="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      (click)="onBackdropClick($event)"
    >
      <div
        class="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        (click)="$event.stopPropagation()"
      >
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-primary-container text-white flex items-center justify-center shadow-xs">
              <span class="material-symbols-outlined text-[20px]">verified_user</span>
            </div>
            <div>
              <h2 class="text-headline-sm font-headline-sm text-slate-900 font-bold">
                Création de Compte &amp; Émission de Badge
              </h2>
              <p class="text-[11px] text-slate-500 font-medium">
                Ministère de la Santé et de l'Action Sociale — République du Sénégal
              </p>
            </div>
          </div>
          <button
            type="button"
            class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            (click)="close.emit()"
          >
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Modal Body / Formulaire en 5 étapes -->
        <form (ngSubmit)="submitForm()" class="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-700">
          
          <!-- Étape 1 : Rôle Institutionnel -->
          <div>
            <label class="block text-slate-800 uppercase mb-2 font-bold tracking-wider text-[11px]">
              1. Sélection du Rôle Institutionnel *
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <label
                class="flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all"
                [ngClass]="formData.role === Role.MEDECIN ? 'border-primary-container bg-emerald-50/60 ring-1 ring-primary-container' : 'border-slate-200 bg-white hover:bg-slate-50'"
              >
                <input type="radio" name="role" [value]="Role.MEDECIN" [(ngModel)]="formData.role" class="text-primary-container focus:ring-primary" />
                <span class="text-xs font-semibold text-slate-800">Médecin / Spécialiste</span>
              </label>

              <label
                class="flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all"
                [ngClass]="formData.role === Role.AGENT_SANTE ? 'border-primary-container bg-emerald-50/60 ring-1 ring-primary-container' : 'border-slate-200 bg-white hover:bg-slate-50'"
              >
                <input type="radio" name="role" [value]="Role.AGENT_SANTE" [(ngModel)]="formData.role" class="text-primary-container focus:ring-primary" />
                <span class="text-xs font-semibold text-slate-800">Agent de Santé</span>
              </label>

              <label
                class="flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all"
                [ngClass]="formData.role === Role.SUPERVISEUR ? 'border-primary-container bg-emerald-50/60 ring-1 ring-primary-container' : 'border-slate-200 bg-white hover:bg-slate-50'"
              >
                <input type="radio" name="role" [value]="Role.SUPERVISEUR" [(ngModel)]="formData.role" class="text-primary-container focus:ring-primary" />
                <span class="text-xs font-semibold text-slate-800">Superviseur District</span>
              </label>

              <label
                class="flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all"
                [ngClass]="formData.role === Role.ADMINISTRATEUR ? 'border-primary-container bg-emerald-50/60 ring-1 ring-primary-container' : 'border-slate-200 bg-white hover:bg-slate-50'"
              >
                <input type="radio" name="role" [value]="Role.ADMINISTRATEUR" [(ngModel)]="formData.role" class="text-primary-container focus:ring-primary" />
                <span class="text-xs font-semibold text-slate-800">Admin Système MSAS</span>
              </label>

              <label
                class="flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all col-span-2 sm:col-span-1"
                [ngClass]="formData.role === Role.PARENT ? 'border-primary-container bg-emerald-50/60 ring-1 ring-primary-container' : 'border-slate-200 bg-white hover:bg-slate-50'"
              >
                <input type="radio" name="role" [value]="Role.PARENT" [(ngModel)]="formData.role" class="text-primary-container focus:ring-primary" />
                <span class="text-xs font-semibold text-slate-800">Parent / Tuteur</span>
              </label>
            </div>
          </div>

          <!-- Étape 2 : Identité, Photo Biométrique & CNI -->
          <div class="pt-3 border-t border-slate-100">
            <label class="block text-slate-800 uppercase mb-2 font-bold tracking-wider text-[11px]">
              2. Identité, Photo Biométrique &amp; CNI CEDEAO
            </label>
            
            <div class="flex items-center gap-4 mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div class="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-[10px] text-center p-1 bg-white overflow-hidden shrink-0">
                <img *ngIf="formData.avatarUrl; else photoPlaceholder" [src]="formData.avatarUrl" alt="Aperçu" class="w-full h-full object-cover rounded-lg" />
                <ng-template #photoPlaceholder>
                  <span class="material-symbols-outlined text-[20px]">add_a_photo</span>
                  <span>Photo</span>
                </ng-template>
              </div>
              <div class="flex-1 space-y-1">
                <input
                  type="url"
                  placeholder="Lien URL de photo officielle (ICAO compliant)..."
                  [(ngModel)]="formData.avatarUrl"
                  name="avatarUrl"
                  class="w-full h-8 px-3 rounded-lg border border-slate-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <p class="text-[11px] text-slate-500">Conforme normes ICAO / MSAS (Fond clair, visage neutre dégagé)</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div class="sm:col-span-2">
                <label class="block text-[11px] text-slate-600 mb-1">Nom complet (selon CNI) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dr. Mouhamadou Moustapha Kane"
                  [(ngModel)]="formData.nom"
                  name="nom"
                  class="w-full h-[38px] px-3 rounded-lg border border-slate-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label class="block text-[11px] text-slate-600 mb-1">Date de naissance *</label>
                <input
                  type="date"
                  [(ngModel)]="formData.dateNaissance"
                  name="dateNaissance"
                  class="w-full h-[38px] px-2.5 rounded-lg border border-slate-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div class="sm:col-span-3">
                <label class="block text-[11px] text-slate-600 mb-1">Numéro CNI biométrique CEDEAO (17 chiffres) *</label>
                <div class="relative">
                  <input
                    type="text"
                    required
                    placeholder="1 751 1988 00482 14"
                    [(ngModel)]="formData.cni"
                    name="cni"
                    class="w-full h-[38px] pl-3 pr-10 rounded-lg border border-slate-300 font-code-num text-xs focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <span class="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 text-[18px]">badge</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Étape 3 : Habilitation Ordinale & Solde État -->
          <div class="pt-3 border-t border-slate-100">
            <label class="block text-slate-800 uppercase mb-2 font-bold tracking-wider text-[11px]">
              3. Habilitation Ordinale &amp; Solde État
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] text-slate-600 mb-1">Numéro ONMS (Ordre des Médecins)</label>
                <input
                  type="text"
                  placeholder="ONMS-SN-XXXX"
                  [(ngModel)]="formData.numeroOrdre"
                  name="numeroOrdre"
                  class="w-full h-[38px] px-3 rounded-lg border border-slate-300 font-code-num text-xs focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label class="block text-[11px] text-slate-600 mb-1">Matricule Solde / Fonction Publique</label>
                <input
                  type="text"
                  placeholder="Ex: MAT-941802"
                  [(ngModel)]="formData.matriculeEtat"
                  name="matriculeEtat"
                  class="w-full h-[38px] px-3 rounded-lg border border-slate-300 font-code-num text-xs focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <!-- Étape 4 : Affectation Territoriale & Structure -->
          <div class="pt-3 border-t border-slate-100">
            <label class="block text-slate-800 uppercase mb-2 font-bold tracking-wider text-[11px]">
              4. Affectation Territoriale &amp; Établissement
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-[11px] text-slate-600 mb-1">Région Médicale *</label>
                <select
                  [(ngModel)]="formData.regionSanitaire"
                  name="regionSanitaire"
                  class="w-full h-[38px] px-2 rounded-lg border border-slate-300 text-xs focus:border-primary"
                >
                  <option value="Dakar">Dakar</option>
                  <option value="Thiès">Thiès</option>
                  <option value="Saint-Louis">Saint-Louis</option>
                  <option value="Kaolack">Kaolack</option>
                  <option value="Ziguinchor">Ziguinchor</option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] text-slate-600 mb-1">District Sanitaire *</label>
                <input
                  type="text"
                  placeholder="Ex: Dakar Plateau"
                  [(ngModel)]="formData.districtSanitaire"
                  name="districtSanitaire"
                  class="w-full h-[38px] px-3 rounded-lg border border-slate-300 text-xs focus:border-primary"
                />
              </div>

              <div>
                <label class="block text-[11px] text-slate-600 mb-1">Structure Sanitaire (Nom & Code) *</label>
                <input
                  type="text"
                  placeholder="Ex: Hôpital Principal Dakar"
                  [(ngModel)]="formData.nomStructure"
                  name="nomStructure"
                  class="w-full h-[38px] px-3 rounded-lg border border-slate-300 text-xs focus:border-primary"
                />
              </div>
            </div>
          </div>

          <!-- Étape 5 : Coordonnées & Sécurité MFA -->
          <div class="pt-3 border-t border-slate-100">
            <label class="block text-slate-800 uppercase mb-2 font-bold tracking-wider text-[11px]">
              5. Coordonnées &amp; Sécurité d'Accès (MFA Obligatoire)
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] text-slate-600 mb-1">Email Officiel MSAS / Institutionnel *</label>
                <input
                  type="email"
                  required
                  placeholder="prenom.nom@sante.gouv.sn"
                  [(ngModel)]="formData.email"
                  name="email"
                  class="w-full h-[38px] px-3 rounded-lg border border-slate-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label class="block text-[11px] text-slate-600 mb-1">Numéro Mobile (Authentification OTP / MFA) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+221 77 XXX XX XX"
                  [(ngModel)]="formData.telephone"
                  name="telephone"
                  class="w-full h-[38px] px-3 rounded-lg border border-slate-300 font-code-num text-xs focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <!-- Banner Sceau Cryptographique -->
            <div class="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
              <span class="material-symbols-outlined text-emerald-700 text-[18px] shrink-0 mt-0.5">badge</span>
              <div class="text-[11px] text-emerald-900 leading-tight">
                <strong>Émission Instantanée de Badge Numérique :</strong> Le badge sera cryptographiquement scellé avec un QR-code sécurisé et envoyé directement par SMS sécurisé et email officiel.
              </div>
            </div>
          </div>

          <!-- Erreur éventuelle -->
          <div *ngIf="errorMessage" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {{ errorMessage }}
          </div>
        </form>

        <!-- Modal Footer -->
        <div class="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            class="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors whitespace-nowrap active:scale-[0.98]"
            (click)="close.emit()"
          >
            Annuler
          </button>
          
          <button
            type="button"
            [disabled]="isSubmitting"
            (click)="submitForm()"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-white text-xs font-semibold hover:bg-[#165B47] transition-all shadow-sm whitespace-nowrap disabled:opacity-50 active:scale-[0.98]"
          >
            <span *ngIf="!isSubmitting" class="material-symbols-outlined text-[18px]">verified</span>
            <span *ngIf="isSubmitting" class="material-symbols-outlined text-[18px] animate-spin">refresh</span>
            <span>{{ isSubmitting ? 'Émission en cours...' : 'Émettre Badge Numérique MSAS' }}</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class BadgeModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateBadgePayload>();

  readonly Role = Role;
  isSubmitting = false;
  errorMessage = '';

  formData: CreateBadgePayload = {
    role: Role.MEDECIN,
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    cni: '',
    avatarUrl: '',
    numeroOrdre: '',
    matriculeEtat: '',
    regionSanitaire: 'Dakar',
    districtSanitaire: 'Dakar Centre (Plateau)',
    nomStructure: 'Hôpital Principal Dakar',
    codeStructure: 'SN-DK-001',
    titrePoste: 'Médecin Praticien'
  };

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  submitForm(): void {
    if (!this.formData.nom || !this.formData.email || !this.formData.telephone || !this.formData.cni) {
      this.errorMessage = 'Veuillez renseigner tous les champs obligatoires (*)';
      return;
    }

    this.errorMessage = '';
    this.save.emit(this.formData);
  }
}
