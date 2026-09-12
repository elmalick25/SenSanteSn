import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { ParentStateService } from '../../../../core/services/parent-state.service';
import { catchError, of } from 'rxjs';

interface UserProfileDTO {
  idUser: number;
  nom: string;
  prenom: string;
  nomUtilisateur?: string;
  email: string;
  telephone?: string;
  dateNaissance?: string;
  adresseActuelle?: string;
  adressePermanente?: string;
  ville?: string;
  codePostal?: string;
  pays?: string;
  avatarUrl?: string;
  role: string;
}

@Component({
  selector: 'app-profil-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-16 animate-fadeIn font-body-md text-on-surface antialiased">

      <!-- ========================================================================= -->
      <!-- 1. SOVEREIGN HEADER CARD WITH SENEGAL RIBBON                              -->
      <!-- ========================================================================= -->
      <header class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#065f46] via-[#047857] to-[#0f4c3a] text-white p-6 sm:p-8 custom-shadow-card">
        <!-- Senegal National Ribbon -->
        <div class="absolute top-0 left-0 right-0 h-1.5 flex">
          <div class="h-full flex-1 bg-[#00853F]"></div>
          <div class="h-full flex-1 bg-[#FDEF42]"></div>
          <div class="h-full flex-1 bg-[#E31B23]"></div>
        </div>

        <!-- Watermark Background -->
        <div class="absolute -right-8 -bottom-10 opacity-10 pointer-events-none select-none">
          <span class="material-symbols-outlined text-[180px]">badge</span>
        </div>

        <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-emerald-100 text-xs font-semibold border border-white/15 whitespace-nowrap flex-shrink-0">
              <span class="material-symbols-outlined text-[15px] text-[#FDEF42]">verified</span>
              <span>République du Sénégal • Espace Parent MSAS</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance">
              Mon Profil &amp; Paramètres Famille
            </h1>
            <p class="text-sm sm:text-base text-emerald-100/90 text-pretty leading-relaxed max-w-xl">
              Gérez votre identité de tuteur accrédité, vos coordonnées de rattachement et la sécurité de votre compte.
            </p>
          </div>

          <!-- Sovereign Credential Badge -->
          <div class="px-4 py-3 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-xs flex items-center gap-3 self-start sm:self-auto flex-shrink-0">
            <div class="size-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-white">
              <span class="material-symbols-outlined text-[22px] text-[#FDEF42]">family_restroom</span>
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold tracking-wider text-emerald-200 block whitespace-nowrap">Statut Compte</span>
              <span class="text-xs font-bold text-white block whitespace-nowrap">Tuteur Légal Accrédité</span>
            </div>
          </div>
        </div>
      </header>

      <!-- ========================================================================= -->
      <!-- 2. ÉTAT CHARGEMENT (SKELETONS)                                            -->
      <!-- ========================================================================= -->
      @if (loading()) {
        <div class="flex flex-col gap-6">
          @for (item of [1, 2, 3, 4]; track $index) {
            <div class="rounded-3xl border border-outline-variant/30 bg-surface-container-lowest p-6 space-y-4 animate-pulse custom-shadow-card">
              <div class="h-6 bg-surface-container rounded-xl w-1/3"></div>
              <div class="space-y-3">
                <div class="h-10 bg-surface-container/60 rounded-xl w-full"></div>
                <div class="h-10 bg-surface-container/60 rounded-xl w-full"></div>
              </div>
            </div>
          }
        </div>
      }

      <!-- ========================================================================= -->
      <!-- 3. ÉTAT CONTENU CHARGÉ                                                    -->
      <!-- ========================================================================= -->
      @if (!loading() && profile) {

        <!-- Toast / Bannière de succès profil -->
        @if (saveSuccess()) {
          <div class="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold shadow-xs animate-in fade-in duration-200">
            <span class="material-symbols-outlined text-[#065f46] text-xl flex-shrink-0">check_circle</span>
            <span class="whitespace-nowrap">Profil mis à jour avec succès sur les serveurs MSAS.</span>
          </div>
        }

        <!-- Toast / Bannière de succès adresse -->
        @if (addressSuccess()) {
          <div class="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold shadow-xs animate-in fade-in duration-200">
            <span class="material-symbols-outlined text-[#065f46] text-xl flex-shrink-0">check_circle</span>
            <span class="whitespace-nowrap">Coordonnées postales et sanitaires enregistrées.</span>
          </div>
        }

        @if (saveError()) {
          <div class="flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold shadow-xs">
            <span class="material-symbols-outlined text-red-600 text-xl flex-shrink-0">error</span>
            <span>{{ saveError() }}</span>
          </div>
        }

        <!-- ================= CARD 1 : IDENTITÉ DU TUTEUR ACCRÉDITÉ ================= -->
        <div class="rounded-3xl border border-outline-variant/30 bg-surface-container-lowest custom-shadow-card overflow-hidden">
          <div class="p-6 pb-4 border-b border-outline-variant/20 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-[#065f46] text-[22px] flex-shrink-0">person</span>
              <h2 class="text-base font-bold text-[#065f46] text-balance">Identité &amp; Photo de Profil</h2>
            </div>
            <span class="text-xs font-bold text-[#065f46] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 whitespace-nowrap flex-shrink-0">
              Identité Vérifiée MSAS
            </span>
          </div>

          <div class="p-6">
            <form (ngSubmit)="saveProfile()" class="flex flex-col gap-6">
              <!-- Photo + Nom + Email -->
              <div class="flex items-center gap-4">
                <div class="relative flex-shrink-0">
                  <div class="relative size-20 overflow-hidden rounded-2xl border-2 border-emerald-200 bg-[#065f46] text-white font-extrabold text-xl flex items-center justify-center shadow-sm">
                    @if (form.avatarUrl) {
                      <img [src]="form.avatarUrl" alt="Photo de profil" class="w-full h-full object-cover">
                    } @else {
                      <span>{{ userInitials }}</span>
                    }
                  </div>
                  <button
                    type="button"
                    (click)="fileInput.click()"
                    class="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-white bg-[#065f46] text-white shadow-sm hover:bg-[#047857] transition-all cursor-pointer"
                    aria-label="Modifier la photo de profil">
                    <span class="material-symbols-outlined text-[14px]">edit</span>
                  </button>
                  <input
                    #fileInput
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    class="hidden"
                    (change)="onFileSelected($event)">
                </div>

                <div class="flex flex-col min-w-0">
                  <span class="text-base font-bold text-on-surface truncate">
                    {{ form.prenom || 'Prénom' }} {{ form.nom || 'Nom' }}
                  </span>
                  <span class="text-xs text-on-surface-variant truncate">{{ form.email || 'Email non renseigné' }}</span>
                  @if (form.avatarUrl) {
                    <button
                      type="button"
                      (click)="removeAvatar()"
                      class="text-xs text-red-600 hover:underline text-left mt-1 cursor-pointer whitespace-nowrap">
                      Supprimer la photo
                    </button>
                  }
                </div>
              </div>

              <!-- Formulaire 2 colonnes -->
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-on-surface" for="firstName">Prénom</label>
                  <input
                    id="firstName"
                    type="text"
                    name="prenom"
                    [(ngModel)]="form.prenom"
                    placeholder="Prénom"
                    class="flex h-11 w-full rounded-2xl border border-outline-variant/40 bg-surface-container-low px-3.5 text-xs text-on-surface transition-colors placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-[#065f46]">
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-on-surface" for="lastName">Nom</label>
                  <input
                    id="lastName"
                    type="text"
                    name="nom"
                    [(ngModel)]="form.nom"
                    placeholder="Nom"
                    class="flex h-11 w-full rounded-2xl border border-outline-variant/40 bg-surface-container-low px-3.5 text-xs text-on-surface transition-colors placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-[#065f46]">
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-on-surface" for="email">Adresse Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    [(ngModel)]="form.email"
                    placeholder="email@domaine.sn"
                    class="flex h-11 w-full rounded-2xl border border-outline-variant/40 bg-surface-container-low px-3.5 text-xs text-on-surface transition-colors placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-[#065f46]">
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-on-surface flex items-center justify-between" for="phone">
                    <span>Numéro Téléphone (SMS Relais)</span>
                    <span class="text-[10px] text-emerald-800 font-semibold uppercase">Requis pour SMS</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="telephone"
                    [(ngModel)]="form.telephone"
                    placeholder="+221 77 000 00 00"
                    class="flex h-11 w-full rounded-2xl border border-outline-variant/40 bg-surface-container-low px-3.5 text-xs text-on-surface transition-colors placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-[#065f46]">
                </div>
              </div>

              <!-- Bouton Enregistrer -->
              <div class="flex justify-end pt-2">
                <button
                  type="submit"
                  [disabled]="saving()"
                  class="inline-flex items-center justify-center rounded-xl text-xs font-bold transition-all bg-[#065f46] hover:bg-[#047857] text-white shadow-sm h-11 px-5 cursor-pointer disabled:opacity-50 whitespace-nowrap flex-shrink-0">
                  @if (saving()) {
                    <span class="size-3.5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></span>
                    <span class="whitespace-nowrap">Enregistrement...</span>
                  } @else {
                    <span class="whitespace-nowrap">Enregistrer l'identité</span>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- ================= CARD 2 : COORDONNÉES POSTALES & RÉGION SANITAIRE ================= -->
        <div class="rounded-3xl border border-outline-variant/30 bg-surface-container-lowest custom-shadow-card overflow-hidden">
          <div class="p-6 pb-4 border-b border-outline-variant/20">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-[#065f46] text-[22px] flex-shrink-0">location_on</span>
              <h2 class="text-base font-bold text-[#065f46] text-balance">Coordonnées Domiciliaires &amp; Région Sanitaire</h2>
            </div>
            <p class="text-xs text-on-surface-variant text-pretty mt-1">Utilisées pour les visites à domicile de la Badiene Gox et le rattachement de proximité.</p>
          </div>

          <div class="p-6">
            <form (ngSubmit)="saveAddress()" class="flex flex-col gap-6">
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="space-y-1.5 sm:col-span-2">
                  <label class="text-xs font-bold text-on-surface" for="address">Adresse du Domicile</label>
                  <input
                    id="address"
                    type="text"
                    name="adresseActuelle"
                    [(ngModel)]="form.adresseActuelle"
                    placeholder="Adresse, rue, numéro de concession..."
                    class="flex h-11 w-full rounded-2xl border border-outline-variant/40 bg-surface-container-low px-3.5 text-xs text-on-surface transition-colors placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-[#065f46]">
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-on-surface" for="neighborhood">Quartier</label>
                  <input
                    id="neighborhood"
                    type="text"
                    name="adressePermanente"
                    [(ngModel)]="form.adressePermanente"
                    placeholder="Quartier (ex: Pikine Ouest, Médina)"
                    class="flex h-11 w-full rounded-2xl border border-outline-variant/40 bg-surface-container-low px-3.5 text-xs text-on-surface transition-colors placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-[#065f46]">
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-on-surface" for="city">Ville</label>
                  <input
                    id="city"
                    type="text"
                    name="ville"
                    [(ngModel)]="form.ville"
                    placeholder="Ville (ex: Dakar)"
                    class="flex h-11 w-full rounded-2xl border border-outline-variant/40 bg-surface-container-low px-3.5 text-xs text-on-surface transition-colors placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-[#065f46]">
                </div>

                <div class="space-y-1.5 sm:col-span-2">
                  <label class="text-xs font-bold text-on-surface" for="region">District / Région Sanitaire d'Affectation</label>
                  <input
                    id="region"
                    type="text"
                    [value]="healthRegion"
                    disabled
                    class="flex h-11 w-full rounded-2xl border border-outline-variant/30 bg-surface-container/60 px-3.5 text-xs text-on-surface-variant font-semibold cursor-not-allowed">
                </div>
              </div>

              <div class="flex justify-end pt-2">
                <button
                  type="submit"
                  [disabled]="addressSaving()"
                  class="inline-flex items-center justify-center rounded-xl text-xs font-bold transition-all bg-[#065f46] hover:bg-[#047857] text-white shadow-sm h-11 px-5 cursor-pointer disabled:opacity-50 whitespace-nowrap flex-shrink-0">
                  @if (addressSaving()) {
                    <span class="size-3.5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></span>
                    <span class="whitespace-nowrap">Enregistrement...</span>
                  } @else {
                    <span class="whitespace-nowrap">Enregistrer les coordonnées</span>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- ================= CARD 3 : SÉCURITÉ & ACCÈS AU COMPTE ================= -->
        <div class="rounded-3xl border border-outline-variant/30 bg-surface-container-lowest custom-shadow-card overflow-hidden">
          <div class="p-6 pb-4 border-b border-outline-variant/20">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-[#065f46] text-[22px] flex-shrink-0">lock</span>
              <h2 class="text-base font-bold text-[#065f46] text-balance">Sécurité &amp; Mot de Passe</h2>
            </div>
            <p class="text-xs text-on-surface-variant text-pretty mt-1">Modifiez régulièrement votre mot de passe pour garantir la confidentialité des données de santé.</p>
          </div>

          <div class="p-6">
            <form (ngSubmit)="changePassword()" class="flex flex-col gap-6">
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="space-y-1.5 sm:col-span-2">
                  <label class="text-xs font-bold text-on-surface" for="current-password">Mot de passe actuel</label>
                  <input
                    id="current-password"
                    type="password"
                    name="ancien"
                    [(ngModel)]="pwdForm.ancien"
                    placeholder="••••••••"
                    class="flex h-11 w-full rounded-2xl border border-outline-variant/40 bg-surface-container-low px-3.5 text-xs text-on-surface transition-colors placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-[#065f46]">
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-on-surface" for="new-password">Nouveau mot de passe</label>
                  <input
                    id="new-password"
                    type="password"
                    name="nouveau"
                    [(ngModel)]="pwdForm.nouveau"
                    placeholder="••••••••"
                    class="flex h-11 w-full rounded-2xl border border-outline-variant/40 bg-surface-container-low px-3.5 text-xs text-on-surface transition-colors placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-[#065f46]">
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-on-surface" for="confirm-password">Confirmer le nouveau mot de passe</label>
                  <input
                    id="confirm-password"
                    type="password"
                    name="confirmation"
                    [(ngModel)]="pwdForm.confirmation"
                    placeholder="••••••••"
                    class="flex h-11 w-full rounded-2xl border border-outline-variant/40 bg-surface-container-low px-3.5 text-xs text-on-surface transition-colors placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-[#065f46]">
                  @if (pwdForm.nouveau && pwdForm.confirmation && pwdForm.nouveau !== pwdForm.confirmation) {
                    <p class="text-xs text-red-600 font-bold mt-1">Les mots de passe ne correspondent pas.</p>
                  }
                </div>
              </div>

              @if (pwdSuccess()) {
                <div class="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
                  <span class="material-symbols-outlined text-[#065f46] text-base">check_circle</span>
                  <span>Mot de passe modifié avec succès !</span>
                </div>
              }

              @if (pwdError()) {
                <div class="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold">
                  <span class="material-symbols-outlined text-red-600 text-base">error</span>
                  <span>{{ pwdError() }}</span>
                </div>
              }

              <div class="flex justify-end pt-2">
                <button
                  type="submit"
                  [disabled]="pwdSaving() || !pwdForm.ancien || !pwdForm.nouveau || pwdForm.nouveau !== pwdForm.confirmation"
                  class="inline-flex items-center justify-center rounded-xl text-xs font-bold transition-all bg-[#065f46] hover:bg-[#047857] text-white shadow-sm h-11 px-5 cursor-pointer disabled:opacity-50 whitespace-nowrap flex-shrink-0">
                  @if (pwdSaving()) {
                    <span class="size-3.5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></span>
                    <span class="whitespace-nowrap">Modification...</span>
                  } @else {
                    <span class="whitespace-nowrap">Changer le mot de passe</span>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- ================= CARD 4 : ENFANTS ASSOCIÉS & DISPENSAIRE RÉFÉRENT ================= -->
        <div class="rounded-3xl border border-outline-variant/30 bg-surface-container-lowest custom-shadow-card overflow-hidden">
          <div class="p-6 pb-4 border-b border-outline-variant/20 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-[#065f46] text-[22px] flex-shrink-0">escalator_warning</span>
              <h2 class="text-base font-bold text-[#065f46] text-balance">Fratrie &amp; Enfants Rattachés</h2>
            </div>
            <span class="text-xs font-bold text-[#065f46] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 whitespace-nowrap flex-shrink-0">
              {{ stateService.children().length }} Dossier(s)
            </span>
          </div>

          <div class="p-6 flex flex-col gap-3">
            @if (stateService.children().length === 0) {
              <div class="py-6 text-center text-xs text-on-surface-variant">
                Aucun enfant associé pour le moment à ce compte parent.
              </div>
            } @else {
              @for (child of stateService.children(); track child.id; let last = $last) {
                <div>
                  <div class="flex items-center justify-between gap-3 py-2">
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="relative size-12 shrink-0 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50 flex items-center justify-center text-[#065f46] font-extrabold text-sm">
                        @if (child.photoUrl) {
                          <img [src]="child.photoUrl" [alt]="child.prenom" class="w-full h-full object-cover">
                        } @else {
                          <span>{{ (child.prenom ? child.prenom.charAt(0) : 'E') + (child.nom ? child.nom.charAt(0) : '') }}</span>
                        }
                      </div>
                      <div class="flex flex-col min-w-0">
                        <span class="text-sm font-bold text-on-surface truncate">
                          {{ child.prenom }} {{ child.nom }}
                        </span>
                        <span class="text-xs text-on-surface-variant truncate">
                          Matricule : {{ child.matricule || child.perinatal?.matriculeNational || ('SN-MAT-' + child.id) }} • {{ child.centreRattachement || 'Poste de santé' }}
                        </span>
                      </div>
                    </div>

                    <div class="flex items-center gap-2 flex-shrink-0">
                      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-[#065f46] whitespace-nowrap flex-shrink-0">
                        {{ child.ageMois }} mois
                      </span>
                      @if (stateService.selectedChild()?.id === child.id) {
                        <span class="text-[10px] font-extrabold text-[#065f46] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                          Sélectionné
                        </span>
                      }
                    </div>
                  </div>
                  @if (!last) {
                    <div class="border-t border-outline-variant/20 my-1"></div>
                  }
                </div>
              }
            }
          </div>
        </div>

      }

      <!-- ========================================================================= -->
      <!-- 4. ÉTAT ERREUR CHARGEMENT                                                 -->
      <!-- ========================================================================= -->
      @if (!loading() && !profile) {
        <div class="p-8 bg-red-50 border border-red-200 rounded-3xl text-center space-y-3 max-w-md mx-auto custom-shadow-card">
          <span class="material-symbols-outlined text-red-600 text-5xl">cloud_off</span>
          <h3 class="text-base font-bold text-red-900 text-balance">Impossible de charger le profil</h3>
          <p class="text-xs text-on-surface-variant text-pretty">Vérifiez votre connexion au serveur et réessayez.</p>
          <button
            type="button"
            (click)="loadProfile()"
            class="px-5 py-2.5 rounded-xl bg-[#065f46] text-white text-xs font-bold hover:bg-[#047857] transition-colors whitespace-nowrap cursor-pointer flex-shrink-0">
            Réessayer
          </button>
        </div>
      }

    </div>
  `,
  styles: [`
    .custom-shadow-card {
      box-shadow: 0 4px 16px -2px rgba(6, 95, 70, 0.06), 0 1px 3px 0 rgba(6, 95, 70, 0.03);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.25s ease-out;
    }
  `]
})
export class ProfilViewComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  readonly stateService = inject(ParentStateService);

  // State signals
  readonly loading = signal<boolean>(true);
  readonly saving = signal<boolean>(false);
  readonly addressSaving = signal<boolean>(false);
  readonly saveSuccess = signal<boolean>(false);
  readonly addressSuccess = signal<boolean>(false);
  readonly saveError = signal<string | null>(null);
  readonly pwdSaving = signal<boolean>(false);
  readonly pwdSuccess = signal<boolean>(false);
  readonly pwdError = signal<string | null>(null);

  profile: UserProfileDTO | null = null;

  // Formulaire identité + adresse + photo
  form = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    adresseActuelle: '',
    adressePermanente: '',
    ville: '',
    codePostal: '',
    pays: '',
    avatarUrl: ''
  };

  // Formulaire mot de passe
  pwdForm = {
    ancien: '',
    nouveau: '',
    confirmation: ''
  };

  get userInitials(): string {
    const p = (this.form.prenom || 'M').charAt(0).toUpperCase();
    const n = (this.form.nom || 'D').charAt(0).toUpperCase();
    return `${p}${n}`;
  }

  get healthRegion(): string {
    const child = this.stateService.selectedChild();
    if (child?.centreRattachement) {
      return `Région Sanitaire de Dakar (${child.centreRattachement})`;
    }
    return 'Région Sanitaire de Dakar (Dakar Sud / Pikine)';
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading.set(true);
    this.http.get<UserProfileDTO>('/api/utilisateurs/me').pipe(
      catchError(() => of<UserProfileDTO | null>(null))
    ).subscribe((profile: UserProfileDTO | null) => {
      this.profile = profile;
      if (profile) {
        this.form = {
          nom: profile.nom || '',
          prenom: profile.prenom || '',
          email: profile.email || '',
          telephone: profile.telephone || '',
          dateNaissance: profile.dateNaissance || '',
          adresseActuelle: profile.adresseActuelle || '',
          adressePermanente: profile.adressePermanente || '',
          ville: profile.ville || '',
          codePostal: profile.codePostal || '',
          pays: profile.pays || '',
          avatarUrl: profile.avatarUrl || ''
        };
      }
      this.loading.set(false);
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      this.saveError.set('Format de fichier non supporté. Veuillez sélectionner une image (JPG, PNG ou WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.saveError.set("L'image est trop volumineuse (maximum 5 Mo).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 320;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          this.form.avatarUrl = dataUrl;
          this.saveError.set(null);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeAvatar(): void {
    this.form.avatarUrl = '';
  }

  saveProfile(): void {
    this.saving.set(true);
    this.saveSuccess.set(false);
    this.saveError.set(null);

    this.http.put<UserProfileDTO>('/api/utilisateurs/me', this.form).pipe(
      catchError((err: { error?: { message?: string } }) => {
        this.saveError.set(err?.error?.message || 'Erreur lors de la mise à jour du profil.');
        this.saving.set(false);
        return of<UserProfileDTO | null>(null);
      })
    ).subscribe((updated: UserProfileDTO | null) => {
      if (!updated) return;
      this.profile = updated;
      this.saving.set(false);
      this.saveSuccess.set(true);

      this.authService.updateCurrentUser({
        nom: updated.nom,
        prenom: updated.prenom,
        email: updated.email,
        telephone: updated.telephone,
        avatarUrl: updated.avatarUrl
      });

      this.stateService.loadParentData();
      setTimeout(() => this.saveSuccess.set(false), 4000);
    });
  }

  saveAddress(): void {
    this.addressSaving.set(true);
    this.addressSuccess.set(false);
    this.saveError.set(null);

    this.http.put<UserProfileDTO>('/api/utilisateurs/me', this.form).pipe(
      catchError((err: { error?: { message?: string } }) => {
        this.saveError.set(err?.error?.message || 'Erreur lors de la mise à jour des coordonnées.');
        this.addressSaving.set(false);
        return of<UserProfileDTO | null>(null);
      })
    ).subscribe((updated: UserProfileDTO | null) => {
      if (!updated) return;
      this.profile = updated;
      this.addressSaving.set(false);
      this.addressSuccess.set(true);
      setTimeout(() => this.addressSuccess.set(false), 4000);
    });
  }

  changePassword(): void {
    if (this.pwdForm.nouveau !== this.pwdForm.confirmation) return;

    this.pwdSaving.set(true);
    this.pwdSuccess.set(false);
    this.pwdError.set(null);

    this.http.put<{ message: string }>('/api/utilisateurs/me/password', {
      ancienMotDePasse: this.pwdForm.ancien,
      nouveauMotDePasse: this.pwdForm.nouveau,
      confirmationMotDePasse: this.pwdForm.confirmation
    }).pipe(
      catchError((err: { error?: { message?: string } }) => {
        this.pwdError.set(err?.error?.message || 'Mot de passe actuel incorrect ou erreur serveur.');
        this.pwdSaving.set(false);
        return of<{ message: string } | null>(null);
      })
    ).subscribe((res: { message: string } | null) => {
      if (!res) return;
      this.pwdSaving.set(false);
      this.pwdSuccess.set(true);
      this.pwdForm = { ancien: '', nouveau: '', confirmation: '' };
      setTimeout(() => this.pwdSuccess.set(false), 5000);
    });
  }
}
