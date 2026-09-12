import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminProfileService } from '../../../../core/services/admin-profile.service';
import { HealthToastService } from '../../../../core/services/health-toast.service';
import { AdminProfile, AdminProfileUpdate, AdminReportResponse } from '../../../../core/models/admin-profile.model';
import { ProfileHeaderComponent, ProfileTab } from './components/profile-header.component';
import { ProfileIdentityBannerComponent } from './components/profile-identity-banner.component';
import { ProfilePersonalFormComponent } from './components/profile-personal-form.component';
import { ProfilePreferencesTabComponent } from './components/profile-preferences-tab.component';
import { ProfileSecurityTabComponent } from './components/profile-security-tab.component';

@Component({
  selector: 'app-profil-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProfileHeaderComponent,
    ProfileIdentityBannerComponent,
    ProfilePersonalFormComponent,
    ProfilePreferencesTabComponent,
    ProfileSecurityTabComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto flex flex-col gap-6">
      <!-- 1. En-tête de Profil & Navigation Onglets -->
      <app-profile-header 
        [activeTab]="activeTab()" 
        (onTabChange)="setTab($event)"
      ></app-profile-header>

      <!-- 2. Gestion des 4 États UI -->
      @if (isLoading()) {
        <!-- SKELETON STATE -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 animate-pulse space-y-6">
          <div class="flex items-center gap-6 pb-6 border-b border-slate-100">
            <div class="w-[110px] h-[110px] rounded-full bg-slate-200"></div>
            <div class="space-y-3 flex-1">
              <div class="h-6 w-48 bg-slate-200 rounded-lg"></div>
              <div class="h-4 w-64 bg-slate-200 rounded-lg"></div>
              <div class="h-3 w-80 bg-slate-200 rounded-lg"></div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="h-10 bg-slate-200 rounded-xl"></div>
            <div class="h-10 bg-slate-200 rounded-xl"></div>
            <div class="h-10 bg-slate-200 rounded-xl"></div>
            <div class="h-10 bg-slate-200 rounded-xl"></div>
            <div class="h-10 bg-slate-200 rounded-xl"></div>
            <div class="h-10 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      } @else {
        @if (hasError()) {
          <!-- ERROR STATE -->
          <div class="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center max-w-lg mx-auto my-12 shadow-xs">
            <div class="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <span class="material-symbols-outlined text-[26px]">error</span>
            </div>
            <h2 class="text-base font-bold text-rose-900 mb-1">
              Impossible de charger le profil
            </h2>
            <p class="text-xs text-rose-700 mb-4 text-pretty">
              {{ errorMessage() || "Échec de synchronisation avec l'annuaire d'habilitation MSAS." }}
            </p>
            <button
              type="button"
              (click)="loadProfile()"
              class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer"
            >
              Réessayer
            </button>
          </div>
        } @else {
          @if (profile(); as prof) {
            <!-- SUCCESS STATE : CARTE ARCHITECTURALE HAUTE DENSITÉ -->
            <section class="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(15,23,42,0.06)] overflow-hidden">
              <!-- Bandeau d'Identité Institutionnel -->
              <app-profile-identity-banner 
                [profile]="prof" 
                (onEditAvatar)="openAvatarModal(prof.avatarUrl)"
              ></app-profile-identity-banner>

              <!-- Corps de l'Onglet Actif -->
              @switch (activeTab()) {
                @case ('personal') {
                  <app-profile-personal-form 
                    [profile]="prof" 
                    [isSaving]="isSaving()" 
                    (onSave)="saveProfile($event)"
                    (onCancel)="onCancelEdit()"
                  ></app-profile-personal-form>
                }
                @case ('preferences') {
                  <app-profile-preferences-tab 
                    (onSavePreferences)="savePreferences()"
                  ></app-profile-preferences-tab>
                }
                @case ('security') {
                  <app-profile-security-tab 
                    (onChangePassword)="onChangePassword()"
                  ></app-profile-security-tab>
                }
              }
            </section>

            <!-- Pied de page d'audit institutionnel -->
            <footer class="mt-1 mb-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 px-2">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-sm">gavel</span>
                <span>Système National d'Information Sanitaire — Ministère de la Santé et de l'Action Sociale (MSAS)</span>
              </div>
              <div class="font-mono text-[11px]">
                <span>Certificat Sécurité SSL/ANSSI-SN • ID Session : {{ prof.sessionCertificat }}</span>
              </div>
            </footer>
          }
        }
      }

      <!-- Modale de Changement d'Avatar / Photo Officielle -->
      @if (isAvatarModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-emerald-700 text-[22px]">account_circle</span>
                <h3 class="text-sm font-bold text-slate-900">Photo Officielle d'Identité</h3>
              </div>
              <button 
                type="button" 
                (click)="closeAvatarModal()"
                class="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div class="space-y-3">
              <p class="text-xs text-slate-600 text-pretty">
                Indiquez l'URL sécurisée de votre portrait officiel conforme aux normes d'accréditation MSAS.
              </p>

              <div class="flex items-center justify-center py-2">
                <img 
                  [src]="avatarInput() || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop'" 
                  class="w-24 h-24 rounded-full object-cover border-2 border-emerald-600 shadow-sm"
                  alt="Aperçu avatar" 
                />
              </div>

              <div>
                <label class="text-[11px] font-semibold text-slate-600 block mb-1">URL de la photo</label>
                <input 
                  type="text" 
                  [(ngModel)]="avatarInput" 
                  class="w-full h-9 px-3 text-xs rounded-lg border border-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button 
                type="button" 
                (click)="closeAvatarModal()"
                class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                Annuler
              </button>
              <button 
                type="button" 
                (click)="confirmAvatarChange()"
                class="px-4 py-2 text-xs font-bold text-white bg-[#003426] hover:bg-[#0c3c2e] rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                Appliquer la Photo
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ProfilViewComponent implements OnInit {
  private readonly profileService = inject(AdminProfileService);
  private readonly toast = inject(HealthToastService);

  profile = signal<AdminProfile | null>(null);
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);
  errorMessage = signal<string>('');
  isSaving = signal<boolean>(false);
  activeTab = signal<ProfileTab>('personal');

  isAvatarModalOpen = signal<boolean>(false);
  avatarInput = signal<string>('');

  ngOnInit(): void {
    this.loadProfile();
  }

  setTab(tab: ProfileTab): void {
    this.activeTab.set(tab);
  }

  loadProfile(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.profileService.getProfile().subscribe({
      next: (data: AdminProfile) => {
        this.profile.set(data);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Erreur chargement profil admin:', err);
        this.hasError.set(true);
        this.errorMessage.set("Échec de la communication avec l'annuaire central MSAS.");
        this.isLoading.set(false);
        this.toast.show('Impossible de charger votre profil administrateur.', 'error');
      }
    });
  }

  saveProfile(dto: AdminProfileUpdate): void {
    this.isSaving.set(true);
    this.profileService.updateProfile(dto).subscribe({
      next: (updated: AdminProfile) => {
        this.profile.set(updated);
        this.isSaving.set(false);
        this.toast.show('Profil administrateur et habilitations mis à jour avec succès.', 'success');
      },
      error: (err: unknown) => {
        console.error('Erreur mise à jour profil:', err);
        this.isSaving.set(false);
        this.toast.show("Échec de l'enregistrement des modifications du profil.", 'error');
      }
    });
  }

  onCancelEdit(): void {
    this.toast.show('Modifications réinitialisées.', 'info');
  }

  savePreferences(): void {
    this.toast.show('Préférences et alertes enregistrées avec succès.', 'success');
  }

  onChangePassword(): void {
    this.toast.show('Demande de renouvellement de mot de passe transmise avec succès.', 'success');
  }

  openAvatarModal(currentAvatarUrl?: string): void {
    this.avatarInput.set(currentAvatarUrl || '');
    this.isAvatarModalOpen.set(true);
  }

  closeAvatarModal(): void {
    this.isAvatarModalOpen.set(false);
  }

  confirmAvatarChange(): void {
    const prof = this.profile();
    if (!prof) return;

    const newUrl = this.avatarInput().trim();
    if (newUrl) {
      const updatePayload: AdminProfileUpdate = {
        nom: prof.nomComplet,
        telephone: prof.telephone,
        dateNaissance: prof.dateNaissance,
        adresse: prof.adresse,
        fonction: prof.fonction,
        matricule: prof.matricule,
        langueTravail: prof.langueTravail,
        avatarUrl: newUrl
      };
      this.saveProfile(updatePayload);
    }
    this.closeAvatarModal();
  }
}
