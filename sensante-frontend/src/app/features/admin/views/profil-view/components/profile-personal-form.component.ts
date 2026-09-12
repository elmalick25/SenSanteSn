import { Component, Input, OnInit, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminProfile, AdminProfileUpdate } from '../../../../../core/models/admin-profile.model';

@Component({
  selector: 'app-profile-personal-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form (ngSubmit)="onSubmit()" class="p-6 lg:p-8 flex flex-col gap-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <!-- COLONNE GAUCHE -->
        <div class="flex flex-col gap-6">
          <!-- 1. Nom complet -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-slate-700 flex items-center justify-between" for="fullName">
              <span>Nom complet</span>
              <span class="text-[11px] text-slate-400 font-normal">Conforme CNI</span>
            </label>
            <div class="relative">
              <input 
                id="fullName" 
                name="fullName"
                type="text" 
                [(ngModel)]="formData.nom"
                class="w-full h-10 px-3.5 pr-10 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 transition-all outline-none" 
              />
              <span class="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 text-[18px]">person</span>
            </div>
          </div>

          <!-- 2. Numéro de téléphone -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-slate-700" for="phoneNumber">
              Numéro de téléphone
            </label>
            <div class="flex rounded-xl border border-slate-300 focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/15 transition-all overflow-hidden bg-white">
              <!-- Badge Drapeau Sénégal -->
              <div class="flex items-center gap-1.5 px-3 bg-slate-50 border-r border-slate-200 text-xs font-semibold text-slate-700 shrink-0">
                <span class="inline-block w-4 h-3 rounded-xs overflow-hidden shadow-xs relative bg-[#00853F]">
                  <span class="absolute inset-y-0 left-1/3 w-1/3 bg-[#FDEF42] flex items-center justify-center">
                    <span class="text-[7px] leading-none text-[#00853F]">★</span>
                  </span>
                  <span class="absolute inset-y-0 right-0 w-1/3 bg-[#E31B23]"></span>
                </span>
                <span class="font-mono text-slate-600">+221</span>
              </div>
              <input 
                id="phoneNumber" 
                name="phoneNumber"
                type="tel" 
                [(ngModel)]="formData.telephone"
                class="flex-1 h-10 px-3.5 border-0 bg-transparent text-slate-900 text-xs font-medium focus:ring-0 outline-none" 
                placeholder="77 645 89 20"
              />
            </div>
          </div>

          <!-- 3. Date de naissance -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-slate-700" for="birthDate">
              Date de naissance
            </label>
            <div class="relative">
              <input 
                id="birthDate" 
                name="birthDate"
                type="date" 
                [(ngModel)]="formData.dateNaissance"
                class="w-full h-10 px-3.5 pr-10 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 transition-all outline-none" 
              />
              <span class="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 text-[18px]">calendar_today</span>
            </div>
          </div>

          <!-- 4. Adresse professionnelle / personnelle -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-slate-700" for="address">
              Adresse professionnelle / personnelle
            </label>
            <div class="relative">
              <input 
                id="address" 
                name="address"
                type="text" 
                [(ngModel)]="formData.adresse"
                class="w-full h-10 px-3.5 pr-10 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 transition-all outline-none" 
              />
              <span class="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 text-[18px]">location_on</span>
            </div>
          </div>
        </div>

        <!-- COLONNE DROITE -->
        <div class="flex flex-col gap-6">
          <!-- 1. Fonction -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-slate-700" for="roleTitle">
              Fonction
            </label>
            <div class="relative">
              <input 
                id="roleTitle" 
                name="roleTitle"
                type="text" 
                [(ngModel)]="formData.fonction"
                class="w-full h-10 px-3.5 pr-10 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 transition-all outline-none" 
              />
              <span class="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 text-[18px]">work</span>
            </div>
          </div>

          <!-- 2. Matricule Fonction Publique -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-slate-700 flex items-center justify-between" for="matricule">
              <span>Matricule Fonction Publique</span>
              <span class="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">verified</span>
                <span>Vérifié DRH MSAS</span>
              </span>
            </label>
            <div class="relative">
              <input 
                id="matricule" 
                name="matricule"
                type="text" 
                [(ngModel)]="formData.matricule"
                class="w-full h-10 px-3.5 pr-10 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono text-xs font-bold focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 transition-all outline-none" 
              />
              <span class="material-symbols-outlined absolute right-3 top-2.5 text-emerald-700 text-[18px]">policy</span>
            </div>
          </div>

          <!-- 3. Périmètre d'Administration (Champ Verrouillé) -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Périmètre d'Administration</span>
              <span class="text-[11px] text-slate-400 flex items-center gap-0.5">
                <span class="material-symbols-outlined text-[14px]">lock</span>
                <span>Verrouillé</span>
              </span>
            </label>
            <div class="h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-100/80 flex items-center justify-between text-slate-600 select-none">
              <div class="flex items-center gap-2 min-w-0">
                <span class="material-symbols-outlined text-[18px] text-emerald-700 shrink-0">public</span>
                <span class="text-xs font-semibold text-slate-800 truncate">
                  {{ profile.perimetre }}
                </span>
              </div>
              <span class="material-symbols-outlined text-slate-400 text-[16px] shrink-0">lock</span>
            </div>
          </div>

          <!-- 4. Langue de travail (Toggle Segmenté) -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-slate-700">
              Langue de travail
            </label>
            <div class="h-10 p-1 rounded-xl border border-slate-300 bg-slate-100 flex items-center gap-1">
              <!-- Français -->
              <button 
                type="button"
                (click)="formData.langueTravail = 'FR'"
                class="flex-1 h-full rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                [ngClass]="{
                  'bg-[#003426] text-white shadow-xs font-bold': formData.langueTravail === 'FR',
                  'text-slate-600 hover:text-slate-900': formData.langueTravail !== 'FR'
                }"
              >
                @if (formData.langueTravail === 'FR') {
                  <span class="material-symbols-outlined text-[16px]">check</span>
                }
                <span>Français</span>
              </button>

              <!-- Wolof -->
              <button 
                type="button"
                (click)="formData.langueTravail = 'WO'"
                class="flex-1 h-full rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                [ngClass]="{
                  'bg-[#003426] text-white shadow-xs font-bold': formData.langueTravail === 'WO',
                  'text-slate-600 hover:text-slate-900': formData.langueTravail !== 'WO'
                }"
              >
                @if (formData.langueTravail === 'WO') {
                  <span class="material-symbols-outlined text-[16px]">check</span>
                }
                <span>Wolof</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD FOOTER ACTIONS -->
      <div class="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <!-- Left Info Status -->
        <div class="flex items-center gap-2 text-xs text-slate-500">
          <span class="material-symbols-outlined text-base text-emerald-600">sync</span>
          <span>Dernière synchronisation réussie avec l'annuaire central ({{ profile.derniereSynchronisation }})</span>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button 
            type="button"
            (click)="onReset()"
            [disabled]="isSaving"
            class="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            Annuler les modifications en cours
          </button>

          <button 
            type="submit"
            [disabled]="isSaving"
            class="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#003426] text-white font-bold text-xs hover:bg-[#0c3c2e] active:scale-[0.99] transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            @if (isSaving) {
              <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Enregistrement en cours...</span>
            } @else {
              <span class="material-symbols-outlined text-[18px]">check</span>
              <span>Enregistrer les Modifications</span>
            }
          </button>
        </div>
      </div>
    </form>
  `
})
export class ProfilePersonalFormComponent implements OnInit {
  @Input({ required: true }) profile!: AdminProfile;
  @Input() isSaving = false;

  onSave = output<AdminProfileUpdate>();
  onCancel = output<void>();

  formData: AdminProfileUpdate = {
    nom: '',
    telephone: '',
    dateNaissance: '',
    adresse: '',
    fonction: '',
    matricule: '',
    langueTravail: 'FR',
    avatarUrl: ''
  };

  ngOnInit(): void {
    this.resetFromProfile();
  }

  resetFromProfile(): void {
    if (this.profile) {
      this.formData = {
        nom: this.profile.nomComplet || `${this.profile.prenom || ''} ${this.profile.nom || ''}`.trim(),
        telephone: this.profile.telephone || '',
        dateNaissance: this.profile.dateNaissance || '1976-08-14',
        adresse: this.profile.adresse || '',
        fonction: this.profile.fonction || '',
        matricule: this.profile.matricule || '',
        langueTravail: this.profile.langueTravail || 'FR',
        avatarUrl: this.profile.avatarUrl || ''
      };
    }
  }

  onReset(): void {
    this.resetFromProfile();
    this.onCancel.emit();
  }

  onSubmit(): void {
    this.onSave.emit(this.formData);
  }
}
