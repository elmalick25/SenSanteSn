import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedecinProfilService } from '../../services/medecin-profil.service';
import { MedecinProfil, UpdateMedecinProfilRequest, UpdateMedecinProfilResponse } from '../../models/medecin-profil.model';

@Component({
  selector: 'app-profil-medecin-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="w-full max-w-4xl mx-auto flex flex-col gap-4 pb-12 animate-fadeIn">
      
      <!-- ==================== HEADER & TAB SWITCHER ==================== -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl md:text-2xl font-bold text-gray-900 tracking-tight text-balance">
            Mon Profil Médecin
          </h1>
          <p class="text-xs md:text-sm text-gray-500 text-pretty">
            Gestion de votre identité praticien, habilitations cliniques et préférences d'exercice
          </p>
        </div>

        <!-- 3-Pill Tab Switcher -->
        <div class="inline-flex p-1 bg-gray-100/80 rounded-xl self-start md:self-auto border border-gray-200 shadow-xs">
          <button
            type="button"
            (click)="activeTab = 'info'"
            [ngClass]="activeTab === 'info' ? 'bg-[#0F4C3A] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'"
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150">
            Informations Personnelles
          </button>
          <button
            type="button"
            (click)="activeTab = 'prefs'"
            [ngClass]="activeTab === 'prefs' ? 'bg-[#0F4C3A] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'"
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150">
            Préférences
          </button>
          <button
            type="button"
            (click)="activeTab = 'secu'"
            [ngClass]="activeTab === 'secu' ? 'bg-[#0F4C3A] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'"
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150">
            Sécurité
          </button>
        </div>
      </div>

      <!-- ==================== 1. ÉTAT DE CHARGEMENT (SKELETON) ==================== -->
      <div *ngIf="loading" class="bg-white rounded-xl border border-gray-200 shadow-xs p-8 animate-pulse space-y-8">
        <div class="flex flex-col items-center space-y-4 pb-6 border-b border-gray-100">
          <div class="w-28 h-28 rounded-full bg-gray-200"></div>
          <div class="h-6 w-48 bg-gray-200 rounded"></div>
          <div class="h-5 w-64 bg-gray-100 rounded-full"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-4">
            <div class="h-4 w-36 bg-gray-200 rounded"></div>
            <div class="h-10 bg-gray-100 rounded-lg"></div>
            <div class="h-10 bg-gray-100 rounded-lg"></div>
            <div class="h-10 bg-gray-100 rounded-lg"></div>
          </div>
          <div class="space-y-4">
            <div class="h-4 w-44 bg-gray-200 rounded"></div>
            <div class="h-10 bg-gray-100 rounded-lg"></div>
            <div class="h-10 bg-gray-100 rounded-lg"></div>
            <div class="h-10 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </div>

      <!-- ==================== 2. ÉTAT D'ERREUR ==================== -->
      <div *ngIf="errorMessage && !loading" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center space-y-3">
        <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <span class="material-symbols-outlined text-2xl">error</span>
        </div>
        <h3 class="text-sm font-bold text-red-900 text-balance">Impossible de charger le profil praticien</h3>
        <p class="text-xs text-red-700 text-pretty">{{ errorMessage }}</p>
        <button
          (click)="chargerProfil()"
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors whitespace-nowrap shadow-xs">
          <span class="material-symbols-outlined text-base">refresh</span>
          <span>Réessayer</span>
        </button>
      </div>

      <!-- ==================== 3. CONTENU PRINCIPAL (TAB : INFORMATIONS) ==================== -->
      <div *ngIf="!loading && !errorMessage && activeTab === 'info'" class="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        
        <!-- Dégradé de marque supérieur -->
        <div class="h-2 w-full bg-gradient-to-r from-[#0F4C3A] via-[#266a54] to-[#acf1d5]"></div>

        <div class="p-6 md:p-8">
          
          <!-- En-tête centré avec Avatar & Identité -->
          <div class="flex flex-col items-center text-center pb-6 border-b border-gray-100">
            <div class="relative group mb-3">
              <!-- Avatar circulaire grand format -->
              <img
                [src]="formData.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqefWwa3WWJuRcZA3k3TLs3xEsLDMLNP2AY-fc99wOl_KrqpY24BBYFq5s1WUefXqRHkEtCJtqv9F-FgUiUIRxqwnjX2bBK-eYnpSy92vQ9Bb3cas0BZATI2-9RhcJpsDWLtAX2oSi7LGwLippHII53UxG3teCROzoVuZTeBubXgU1VvkvOIpH9iz3EJx8C5AIgyy9aX2hyOxQd5ylp_C8i7ciFSpRmmykyJxgYaUL3ilZKDvkzWYw'"
                alt="Portrait Dr. Babacar Fall"
                class="w-28 h-28 rounded-full object-cover ring-4 ring-emerald-50 shadow-md" />
              
              <!-- Bouton d'édition photo -->
              <button
                type="button"
                (click)="modifierPhoto()"
                class="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#0F4C3A] hover:bg-[#003426] text-white flex items-center justify-center ring-2 ring-white shadow-md transition-transform active:scale-90"
                title="Modifier la photo de profil">
                <span class="material-symbols-outlined text-[16px]">edit</span>
              </button>
            </div>

            <h2 class="text-lg md:text-xl font-bold text-gray-900 text-balance">
              {{ formData.nomComplet }}
            </h2>

            <!-- Statut Ordre National -->
            <div class="mt-1.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200/60 whitespace-nowrap">
              <span class="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>{{ profil?.statutOrdre || 'Médecin Pédiatre Inscrit • Ordre National' }}</span>
            </div>
          </div>

          <!-- Formulaire Discipliné en Grille 2 Colonnes -->
          <form class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6" (ngSubmit)="enregistrerModifications()">
            
            <!-- COLONNE GAUCHE : Informations Personnelles -->
            <div class="flex flex-col gap-5">
              <div class="flex items-center gap-1.5 pb-2 border-b border-gray-100">
                <span class="material-symbols-outlined text-[18px] text-[#0F4C3A]">badge</span>
                <span class="text-xs font-bold uppercase tracking-wider text-gray-800">Informations Personnelles</span>
              </div>

              <!-- Champ 1 : Nom complet -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-700" for="nomComplet">Nom complet</label>
                <div class="relative">
                  <input
                    id="nomComplet"
                    type="text"
                    [(ngModel)]="formData.nomComplet"
                    name="nomComplet"
                    class="w-full h-10 px-3 pr-9 rounded-lg border border-gray-200 bg-white text-gray-900 text-xs focus:ring-2 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] transition-all shadow-2xs" />
                  <span class="material-symbols-outlined absolute right-2.5 top-2.5 text-[18px] text-gray-400 pointer-events-none">person</span>
                </div>
              </div>

              <!-- Champ 2 : Téléphone -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-700" for="telephone">Numéro de téléphone</label>
                <div class="relative">
                  <input
                    id="telephone"
                    type="tel"
                    [(ngModel)]="formData.telephone"
                    name="telephone"
                    class="w-full h-10 px-3 pr-9 rounded-lg border border-gray-200 bg-white text-gray-900 text-xs focus:ring-2 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] transition-all shadow-2xs" />
                  <span class="material-symbols-outlined absolute right-2.5 top-2.5 text-[18px] text-gray-400 pointer-events-none">call</span>
                </div>
                <span class="text-[11px] text-gray-500 text-pretty">Ligne directe d'urgence et astreinte pédiatrique</span>
              </div>

              <!-- Champ 3 : Date de naissance -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-700" for="dateNaissance">Date de naissance</label>
                <div class="relative">
                  <input
                    id="dateNaissance"
                    type="text"
                    [(ngModel)]="formData.dateNaissance"
                    name="dateNaissance"
                    class="w-full h-10 px-3 pr-9 rounded-lg border border-gray-200 bg-white text-gray-900 text-xs focus:ring-2 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] transition-all shadow-2xs" />
                  <span class="material-symbols-outlined absolute right-2.5 top-2.5 text-[18px] text-gray-400 pointer-events-none">calendar_today</span>
                </div>
              </div>

              <!-- Champ 4 : Adresse -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-700" for="adresse">Adresse (Quartier / Résidence)</label>
                <div class="relative">
                  <input
                    id="adresse"
                    type="text"
                    [(ngModel)]="formData.adresse"
                    name="adresse"
                    class="w-full h-10 px-3 pr-9 rounded-lg border border-gray-200 bg-white text-gray-900 text-xs focus:ring-2 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] transition-all shadow-2xs" />
                  <span class="material-symbols-outlined absolute right-2.5 top-2.5 text-[18px] text-gray-400 pointer-events-none">home_pin</span>
                </div>
              </div>
            </div>

            <!-- COLONNE DROITE : Identité Hospitalière & Exercice -->
            <div class="flex flex-col gap-5">
              <div class="flex items-center gap-1.5 pb-2 border-b border-gray-100">
                <span class="material-symbols-outlined text-[18px] text-[#0F4C3A]">domain_verification</span>
                <span class="text-xs font-bold uppercase tracking-wider text-gray-800">Identité Hospitalière &amp; Exercice</span>
              </div>

              <!-- Champ 1 : Spécialité Médicale -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-700" for="specialite">Spécialité Médicale</label>
                <div class="relative">
                  <input
                    id="specialite"
                    type="text"
                    [(ngModel)]="formData.specialite"
                    name="specialite"
                    class="w-full h-10 px-3 pr-9 rounded-lg border border-gray-200 bg-white text-gray-900 text-xs focus:ring-2 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] transition-all shadow-2xs" />
                  <span class="material-symbols-outlined absolute right-2.5 top-2.5 text-[18px] text-gray-400 pointer-events-none">medical_services</span>
                </div>
              </div>

              <!-- Champ 2 : Matricule / N° Ordre des Médecins (Lecture Seule) -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-700" for="matriculeOrdre">Matricule / N° Ordre des Médecins</label>
                <div class="relative">
                  <input
                    id="matriculeOrdre"
                    type="text"
                    [value]="profil?.matriculeOrdre || 'CNOM-SN-4812 / MSAS-DK-094'"
                    readonly
                    class="w-full h-10 px-3 pr-9 rounded-lg border border-gray-200 bg-emerald-50/40 text-gray-800 text-xs font-medium cursor-not-allowed select-all" />
                  <span class="material-symbols-outlined absolute right-2.5 top-2.5 text-[18px] text-emerald-600" style="font-variation-settings: 'FILL' 1;">verified</span>
                </div>
                <span class="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <span class="material-symbols-outlined text-[13px]">lock</span>
                  <span>Identifiant certifié par le Conseil National de l'Ordre</span>
                </span>
              </div>

              <!-- Champ 3 : Structure hospitalière rattachée -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-700" for="structureRattachement">Structure hospitalière rattachée</label>
                <div class="relative">
                  <input
                    id="structureRattachement"
                    type="text"
                    [(ngModel)]="formData.structureRattachement"
                    name="structureRattachement"
                    class="w-full h-10 px-3 pr-9 rounded-lg border border-gray-200 bg-white text-gray-900 text-xs focus:ring-2 focus:ring-[#0F4C3A] focus:border-[#0F4C3A] transition-all shadow-2xs" />
                  <span class="material-symbols-outlined absolute right-2.5 top-2.5 text-[18px] text-gray-400 pointer-events-none">apartment</span>
                </div>
              </div>

              <!-- Champ 4 : Langue(s) habituelle(s) de consultation -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-700">Langue(s) habituelle(s) de consultation</label>
                <div class="grid grid-cols-2 gap-2 h-10 p-1 bg-gray-50 rounded-lg border border-gray-200">
                  
                  <!-- Option Français -->
                  <label class="flex items-center justify-center gap-2 rounded-md cursor-pointer bg-white text-gray-800 shadow-2xs transition-all select-none hover:bg-gray-50">
                    <input
                      type="checkbox"
                      [(ngModel)]="formData.langueFrancaise"
                      name="langueFrancaise"
                      class="rounded text-[#0F4C3A] focus:ring-[#0F4C3A] h-4 w-4 border-gray-300" />
                    <span class="text-xs font-medium whitespace-nowrap">Français</span>
                  </label>

                  <!-- Option Wolof -->
                  <label class="flex items-center justify-center gap-2 rounded-md cursor-pointer bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-2xs transition-all select-none hover:bg-emerald-100/60">
                    <input
                      type="checkbox"
                      [(ngModel)]="formData.langueWolof"
                      name="langueWolof"
                      class="rounded text-[#0F4C3A] focus:ring-[#0F4C3A] h-4 w-4 border-gray-300" />
                    <span class="text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap">
                      <span>Wolof</span>
                      <span class="text-[10px] bg-emerald-700 text-white px-1.5 py-0.2 rounded-full font-bold">Actif</span>
                    </span>
                  </label>
                </div>
                <span class="text-[11px] text-gray-500 text-pretty">Pratique bilingue recommandée pour l'accueil des accompagnants</span>
              </div>

            </div>

          </form>

        </div>

        <!-- ==================== PIED DE CARTE (FOOTER ACTIONS) ==================== -->
        <div class="bg-gray-50/80 px-6 md:px-8 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <!-- Sync info -->
          <div class="flex items-center gap-2 text-gray-500 text-xs">
            <span class="material-symbols-outlined text-[16px] text-emerald-600">cloud_done</span>
            <span>Dernière mise à jour&nbsp;: {{ profil?.dateDerniereMiseAJour || '12 Octobre 2024' }} • Synchronisé SNIS/DHIS2</span>
          </div>

          <!-- Action buttons -->
          <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              (click)="reinitialiser()"
              [disabled]="saving"
              class="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 text-xs font-semibold transition-colors active:scale-95 whitespace-nowrap">
              Annuler
            </button>
            <button
              type="button"
              (click)="enregistrerModifications()"
              [disabled]="saving"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0F4C3A] hover:bg-[#003426] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 whitespace-nowrap disabled:opacity-50">
              <span *ngIf="!saving" class="material-symbols-outlined text-[16px]">save</span>
              <span *ngIf="saving" class="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
              <span>{{ saving ? 'Enregistrement...' : 'Enregistrer les modifications' }}</span>
            </button>
          </div>

        </div>

      </div>

      <!-- ==================== TAB : PRÉFÉRENCES (EMPTY STATE DESIGN) ==================== -->
      <div *ngIf="activeTab === 'prefs' && !loading" class="bg-white rounded-xl border border-gray-200 shadow-xs p-8 text-center space-y-4">
        <div class="w-14 h-14 rounded-full bg-emerald-50 text-[#0F4C3A] flex items-center justify-center mx-auto">
          <span class="material-symbols-outlined text-3xl">tune</span>
        </div>
        <h3 class="text-base font-bold text-gray-900 text-balance">Préférences de Consultation &amp; Notifications</h3>
        <p class="text-xs text-gray-500 max-w-md mx-auto text-pretty">
          Définissez vos canaux de notification d'astreinte (SMS / WhatsApp), alertes de seuil d'intrants nutritionnels et réglages audio de synthèse vocale.
        </p>
        <div class="pt-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium whitespace-nowrap">
            <span class="material-symbols-outlined text-[14px]">info</span>
            <span>Configuration automatique selon la charte MSAS du Cabinet 04</span>
          </span>
        </div>
      </div>

      <!-- ==================== TAB : SÉCURITÉ (EMPTY STATE DESIGN) ==================== -->
      <div *ngIf="activeTab === 'secu' && !loading" class="bg-white rounded-xl border border-gray-200 shadow-xs p-8 text-center space-y-4">
        <div class="w-14 h-14 rounded-full bg-emerald-50 text-[#0F4C3A] flex items-center justify-center mx-auto">
          <span class="material-symbols-outlined text-3xl">shield</span>
        </div>
        <h3 class="text-base font-bold text-gray-900 text-balance">Sécurité &amp; Accréditations Ordinales</h3>
        <p class="text-xs text-gray-500 max-w-md mx-auto text-pretty">
          Authentification forte FIDO2 / TOTP active. Chiffrement de bout en bout conforme aux directives ANSSI-SN et scellé cryptographique SHA-256 certifié.
        </p>
        <div class="pt-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold whitespace-nowrap border border-emerald-200/60">
            <span class="material-symbols-outlined text-[14px] text-emerald-600">verified_user</span>
            <span>Accréditation Ordinale CNOM-SN Active &amp; Conforme</span>
          </span>
        </div>
      </div>

      <!-- ==================== TOAST NOTIFICATION FLOTTANT ==================== -->
      <div
        *ngIf="toastMessage"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gray-900 text-white shadow-xl text-xs font-semibold animate-slideUp">
        <span class="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
        <span>{{ toastMessage }}</span>
      </div>

    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn { animation: fadeIn 0.25s ease-out forwards; }
    .animate-slideUp { animation: slideUp 0.25s ease-out forwards; }
  `]
})
export class ProfilMedecinViewComponent implements OnInit {
  private readonly profilService = inject(MedecinProfilService);

  activeTab: 'info' | 'prefs' | 'secu' = 'info';
  loading = true;
  saving = false;
  errorMessage: string | null = null;
  toastMessage: string | null = null;

  profil: MedecinProfil | null = null;

  // Modèle local de formulaire pour l'édition
  formData: UpdateMedecinProfilRequest = {
    nomComplet: '',
    telephone: '',
    dateNaissance: '',
    adresse: '',
    specialite: '',
    structureRattachement: '',
    langueFrancaise: true,
    langueWolof: true,
    avatarUrl: ''
  };

  ngOnInit(): void {
    this.chargerProfil();
  }

  chargerProfil(): void {
    this.loading = true;
    this.errorMessage = null;

    this.profilService.getProfil().subscribe({
      next: (data: MedecinProfil) => {
        this.profil = data;
        this.initialiserFormulaire(data);
        this.loading = false;
      },
      error: (err: unknown) => {
        console.error('Erreur chargement profil médecin :', err);
        this.errorMessage = 'Impossible de charger les données praticien depuis le serveur central.';
        this.loading = false;
      }
    });
  }

  private initialiserFormulaire(data: MedecinProfil): void {
    this.formData = {
      nomComplet: data.nomComplet,
      telephone: data.telephone,
      dateNaissance: data.dateNaissance,
      adresse: data.adresse,
      specialite: data.specialite,
      structureRattachement: data.structureRattachement,
      langueFrancaise: data.langueFrancaise,
      langueWolof: data.langueWolof,
      avatarUrl: data.avatarUrl
    };
  }

  enregistrerModifications(): void {
    if (this.saving) return;
    this.saving = true;

    this.profilService.updateProfil(this.formData).subscribe({
      next: (res: UpdateMedecinProfilResponse) => {
        this.saving = false;
        if (res.profil) {
          this.profil = res.profil;
          this.initialiserFormulaire(res.profil);
        }
        this.afficherToast(res.message || 'Modifications enregistrées avec succès !');
      },
      error: (err: unknown) => {
        this.saving = false;
        console.error('Erreur mise à jour profil :', err);
        this.afficherToast('Erreur lors de la sauvegarde du profil.');
      }
    });
  }

  reinitialiser(): void {
    if (this.profil) {
      this.initialiserFormulaire(this.profil);
      this.afficherToast('Modifications annulées.');
    }
  }

  modifierPhoto(): void {
    const nouvelleUrl = prompt('Saisir l\'URL de la nouvelle photo de profil :', this.formData.avatarUrl || '');
    if (nouvelleUrl && nouvelleUrl.trim() !== '') {
      this.formData.avatarUrl = nouvelleUrl.trim();
      this.afficherToast('Photo mise à jour (pensez à enregistrer).');
    }
  }

  private afficherToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => {
      if (this.toastMessage === msg) {
        this.toastMessage = null;
      }
    }, 3500);
  }
}
