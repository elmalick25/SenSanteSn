import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Badge, BadgeStats, CreateBadgePayload, PageBadgesResponse } from '../../../../core/models/badge.model';
import { Role } from '../../../../core/models/role.enum';
import { BadgeService, BadgeFilterCriteria } from '../../../../core/services/badge.service';
import { BadgeCardComponent } from './components/badge-card.component';
import { BadgeStatsBentoComponent } from './components/badge-stats-bento.component';
import { BadgeTableComponent } from './components/badge-table.component';
import { BadgeTrombiComponent } from './components/badge-trombi.component';
import { BadgeModalComponent } from './components/badge-modal.component';

type ViewMode = 'GRID' | 'TABLE' | 'TROMBI';

@Component({
  selector: 'app-badges-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BadgeCardComponent,
    BadgeStatsBentoComponent,
    BadgeTableComponent,
    BadgeTrombiComponent,
    BadgeModalComponent
  ],
  template: `
    <div class="space-y-6">
      
      <!-- EN-TÊTE : SÉLECTEUR DE VUE & COMPTEURS NATIONAUX -->
      <section class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-headline-lg font-headline-lg text-slate-900 tracking-tight font-bold text-balance">
              Fiches &amp; Badges d'Identité Sanitaire
            </h1>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary-container/10 text-primary-container border border-primary-container/20 whitespace-nowrap">
              Trombinoscope Officiel MSAS
            </span>
          </div>
          <p class="text-xs text-slate-600 mt-1 text-pretty max-w-3xl">
            Contrôle visuel des cartes professionnelles biométriques, statuts d'exercice clinique et double authentification (MFA).
          </p>
        </div>

        <!-- SÉLECTEUR DE MODE DE VUE & COMPTEURS DE SYNTHÈSE -->
        <div class="flex flex-wrap items-center gap-3">
          <!-- Switcher Grille / Tableau / Trombinoscope -->
          <div class="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              (click)="viewMode = 'TABLE'"
              class="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
              [ngClass]="viewMode === 'TABLE' ? 'bg-white text-primary-container font-bold shadow-xs border border-slate-200/60' : 'text-slate-600 hover:text-slate-900'"
            >
              <span class="material-symbols-outlined text-[16px]">view_list</span>
              <span>Tableau</span>
            </button>

            <button
              type="button"
              (click)="viewMode = 'GRID'"
              class="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
              [ngClass]="viewMode === 'GRID' ? 'bg-white text-primary-container font-bold shadow-xs border border-slate-200/60' : 'text-slate-600 hover:text-slate-900'"
            >
              <span class="material-symbols-outlined text-[16px]">badge</span>
              <span>Grille Badges Photos</span>
            </button>

            <button
              type="button"
              (click)="viewMode = 'TROMBI'"
              class="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
              [ngClass]="viewMode === 'TROMBI' ? 'bg-white text-primary-container font-bold shadow-xs border border-slate-200/60' : 'text-slate-600 hover:text-slate-900'"
            >
              <span class="material-symbols-outlined text-[16px]">contacts</span>
              <span>Trombinoscope</span>
            </button>
          </div>

          <!-- Puces métriques d'état global -->
          <div class="hidden sm:flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium whitespace-nowrap">
              <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
              <strong>{{ stats?.totalValides || 2284 }}</strong> Validés
            </span>

            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium whitespace-nowrap">
              <span class="w-2 h-2 rounded-full bg-amber-600"></span>
              <strong>{{ stats?.totalEnAttente || 86 }}</strong> En attente
            </span>
          </div>
        </div>
      </section>

      <!-- MINI BENTO GRID : STATS TÉLÉMÉTRIQUES PAR CORPS DE MÉTIER -->
      <app-badge-stats-bento
        [stats]="stats"
        [activeRole]="selectedRole"
        (filterByRole)="onRoleSelected($event)"
      ></app-badge-stats-bento>

      <!-- BARRE D'OUTILS, FILTRES AVANCÉS & TRI -->
      <section class="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <!-- Filtre Rôles -->
          <select
            [(ngModel)]="filterCriteria.role"
            (change)="applyFilters()"
            class="h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-primary"
          >
            <option value="">Tous les rôles cliniques &amp; administratifs</option>
            <option [value]="Role.MEDECIN">Médecin / Spécialiste</option>
            <option [value]="Role.AGENT_SANTE">Sage-Femme / Agent de Santé</option>
            <option [value]="Role.SUPERVISEUR">Superviseur District</option>
            <option [value]="Role.ADMINISTRATEUR">Admin National</option>
            <option [value]="Role.PARENT">Parent / Tuteur</option>
          </select>

          <!-- Filtre Régions -->
          <select
            [(ngModel)]="filterCriteria.region"
            (change)="applyFilters()"
            class="h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-primary"
          >
            <option value="">Toutes Régions (Dakar, Thiès, St-Louis...)</option>
            <option value="Dakar">Dakar (Plateau / CS)</option>
            <option value="Thiès">Thiès</option>
            <option value="Kaolack">Kaolack</option>
            <option value="Saint-Louis">Saint-Louis</option>
            <option value="Ziguinchor">Ziguinchor</option>
          </select>

          <!-- Filtre Statuts -->
          <select
            [(ngModel)]="filterCriteria.statut"
            (change)="applyFilters()"
            class="h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-primary"
          >
            <option value="ACTIF">Statut : Actifs uniquement</option>
            <option value="SUSPENDU">Suspendus</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="Tous">Tous</option>
          </select>

          <!-- Bouton Réinitialisation si filtre actif -->
          <button
            *ngIf="hasActiveFilters()"
            type="button"
            (click)="resetFilters()"
            class="h-9 px-2.5 rounded-lg border border-slate-200 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            <span class="material-symbols-outlined text-[16px]">filter_alt_off</span>
            <span>Réinitialiser</span>
          </button>
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto justify-end">
          <span class="text-xs text-slate-500 whitespace-nowrap">Trier par :</span>
          <select
            [(ngModel)]="filterCriteria.tri"
            (change)="applyFilters()"
            class="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 focus:outline-none"
          >
            <option value="Nom">Nom &amp; Titre (A-Z)</option>
            <option value="Structure">Structure de rattachement</option>
            <option value="activité">Dernière activité récente</option>
          </select>
        </div>
      </section>

      <!-- ÉTAT 1 : CHARGEMENT (SKELETON LOADERS) -->
      <div *ngIf="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let item of [1, 2, 3, 4, 5, 6]" class="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 animate-pulse">
          <div class="h-2.5 bg-slate-200 rounded w-full"></div>
          <div class="flex items-center justify-between">
            <div class="h-4 bg-slate-200 rounded w-1/3"></div>
            <div class="h-5 bg-slate-200 rounded-full w-16"></div>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-24 h-24 rounded-2xl bg-slate-200 shrink-0"></div>
            <div class="space-y-2 flex-1">
              <div class="h-3 bg-slate-200 rounded w-1/2"></div>
              <div class="h-5 bg-slate-200 rounded w-3/4"></div>
              <div class="h-3 bg-slate-200 rounded w-2/3"></div>
            </div>
          </div>
          <div class="h-28 bg-slate-100 rounded-xl"></div>
          <div class="h-9 bg-slate-200 rounded-lg"></div>
        </div>
      </div>

      <!-- ÉTAT 2 : ERREUR RÉSEAU -->
      <div *ngIf="errorMessage && !isLoading" class="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-3">
        <span class="material-symbols-outlined text-rose-600 text-[36px]">error</span>
        <h3 class="text-sm font-bold text-rose-900">Erreur lors de la récupération des habilitations</h3>
        <p class="text-xs text-rose-700">{{ errorMessage }}</p>
        <button
          type="button"
          (click)="loadBadges()"
          class="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors whitespace-nowrap"
        >
          Réessayer
        </button>
      </div>

      <!-- ÉTAT 3 : VUE VIDE (EMPTY STATE) -->
      <div *ngIf="!isLoading && !errorMessage && badges.length === 0" class="p-12 bg-white border border-slate-200 rounded-2xl text-center space-y-3 shadow-xs">
        <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <span class="material-symbols-outlined text-[28px]">search_off</span>
        </div>
        <h3 class="text-sm font-bold text-slate-800">Aucun badge ou praticien ne correspond à vos filtres</h3>
        <p class="text-xs text-slate-500 max-w-md mx-auto text-pretty">
          Modifiez vos critères de recherche ou enregistrez une nouvelle habilitation sanitaire.
        </p>
        <div class="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            (click)="resetFilters()"
            class="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            Effacer les filtres
          </button>
          <button
            type="button"
            (click)="isModalOpen = true"
            class="px-4 py-2 rounded-lg bg-primary-container text-white text-xs font-semibold hover:bg-[#165B47] transition-all whitespace-nowrap"
          >
            + Émettre un Badge
          </button>
        </div>
      </div>

      <!-- ÉTAT 4 : RENDU NOMINAL SELON LE MODE SÉLECTIONNÉ -->
      <div *ngIf="!isLoading && !errorMessage && badges.length > 0">
        
        <!-- Mode 1 : Grille Badges Biométriques -->
        <section *ngIf="viewMode === 'GRID'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <app-badge-card
            *ngFor="let badge of badges"
            [badge]="badge"
            (viewProfile)="onViewProfile($event)"
            (manageRights)="onManageRights($event)"
            (toggleStatus)="onToggleStatus($event)"
            (quickAction)="onQuickAction($event)"
          ></app-badge-card>
        </section>

        <!-- Mode 2 : Tableau Administratif -->
        <section *ngIf="viewMode === 'TABLE'">
          <app-badge-table
            [badges]="badges"
            (viewProfile)="onViewProfile($event)"
            (manageRights)="onManageRights($event)"
            (quickAction)="onQuickAction($event)"
          ></app-badge-table>
        </section>

        <!-- Mode 3 : Trombinoscope Compact -->
        <section *ngIf="viewMode === 'TROMBI'">
          <app-badge-trombi
            [badges]="badges"
            (viewProfile)="onViewProfile($event)"
          ></app-badge-trombi>
        </section>

        <!-- BARRE DE PAGINATION INTERACTIVE -->
        <section class="mt-6 bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 shadow-xs">
          <div class="flex items-center gap-2">
            <span>
              Affichage de <strong>{{ badges.length }} fiches badges</strong> sur <strong>{{ totalElements }}</strong> agents &amp; usagers enregistrés
            </span>
            <span class="text-slate-300">|</span>
            <span>Cartes par page :</span>
            <select
              [(ngModel)]="filterCriteria.size"
              (change)="onPageSizeChange()"
              class="px-2 py-0.5 rounded border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-primary"
            >
              <option [value]="6">6</option>
              <option [value]="12">12</option>
              <option [value]="24">24</option>
              <option [value]="48">48</option>
            </select>
          </div>

          <!-- Boutons de pagination numérique -->
          <div class="flex items-center gap-1">
            <button
              type="button"
              [disabled]="currentPage === 0"
              (click)="goToPage(currentPage - 1)"
              class="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Précédent
            </button>

            <ng-container *ngFor="let p of getPagesArray()">
              <button
                type="button"
                (click)="goToPage(p)"
                class="px-3 py-1 rounded font-semibold transition-colors"
                [ngClass]="p === currentPage ? 'bg-primary-container text-white' : 'border border-slate-200 bg-white hover:bg-slate-100 text-slate-700'"
              >
                {{ p + 1 }}
              </button>
            </ng-container>

            <button
              type="button"
              [disabled]="currentPage >= totalPages - 1"
              (click)="goToPage(currentPage + 1)"
              class="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Suivant
            </button>
          </div>
        </section>
      </div>

      <!-- MODAL D'ÉMISSION DE BADGE -->
      <app-badge-modal
        [isOpen]="isModalOpen"
        (close)="isModalOpen = false"
        (save)="onCreateBadge($event)"
      ></app-badge-modal>

      <!-- NOTIFICATION TOAST SUCCÈS / INFO -->
      <div
        *ngIf="toastMessage"
        class="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200"
      >
        <span class="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
        <span>{{ toastMessage }}</span>
      </div>

    </div>
  `
})
export class BadgesViewComponent implements OnInit {
  private readonly badgeService = inject(BadgeService);

  readonly Role = Role;

  viewMode: ViewMode = 'GRID';
  isLoading = false;
  errorMessage = '';
  toastMessage = '';

  badges: Badge[] = [];
  stats: BadgeStats | null = null;
  selectedRole: Role | null = null;

  isModalOpen = false;

  currentPage = 0;
  totalPages = 1;
  totalElements = 0;

  filterCriteria: BadgeFilterCriteria = {
    role: '',
    region: '',
    statut: 'Tous',
    tri: 'Nom',
    search: '',
    page: 0,
    size: 6
  };

  ngOnInit(): void {
    this.loadStats();
    this.loadBadges();
  }

  loadStats(): void {
    this.badgeService.getStats().subscribe({
      next: (res: BadgeStats) => (this.stats = res),
      error: (err: unknown) => console.error('Erreur chargement statistiques :', err)
    });
  }

  loadBadges(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.badgeService.getBadges(this.filterCriteria).subscribe({
      next: (page: PageBadgesResponse) => {
        this.badges = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.currentPage = page.number;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = err?.message || 'Impossible de joindre le serveur pour les badges.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filterCriteria.page = 0;
    this.loadBadges();
  }

  onRoleSelected(role: Role): void {
    if (this.selectedRole === role) {
      this.selectedRole = null;
      this.filterCriteria.role = '';
    } else {
      this.selectedRole = role;
      this.filterCriteria.role = role;
    }
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return Boolean(
      this.filterCriteria.role ||
      this.filterCriteria.region ||
      (this.filterCriteria.statut && this.filterCriteria.statut !== 'Tous') ||
      this.filterCriteria.search
    );
  }

  resetFilters(): void {
    this.selectedRole = null;
    this.filterCriteria = {
      role: '',
      region: '',
      statut: 'Tous',
      tri: 'Nom',
      search: '',
      page: 0,
      size: 6
    };
    this.loadBadges();
  }

  onPageSizeChange(): void {
    this.filterCriteria.page = 0;
    this.loadBadges();
  }

  goToPage(p: number): void {
    if (p >= 0 && p < this.totalPages) {
      this.filterCriteria.page = p;
      this.loadBadges();
    }
  }

  getPagesArray(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) {
      if (i < 5 || i === this.totalPages - 1 || Math.abs(i - this.currentPage) <= 1) {
        pages.push(i);
      }
    }
    return pages;
  }

  onCreateBadge(payload: CreateBadgePayload): void {
    this.badgeService.createBadge(payload).subscribe({
      next: (created: Badge) => {
        this.isModalOpen = false;
        this.showToast(`Badge émis avec succès pour ${created.prenom} ${created.nom} (${created.codeBadge})`);
        this.loadBadges();
        this.loadStats();
      },
      error: (err: any) => {
        this.showToast(err?.error?.message || 'Erreur lors de l\'émission du badge.');
      }
    });
  }

  onViewProfile(badge: Badge): void {
    this.showToast(`Ouverture de la fiche complète de ${badge.prenom} ${badge.nom}...`);
  }

  onManageRights(badge: Badge): void {
    this.showToast(`Gestion des habilitations & droits de ${badge.prenom} ${badge.nom}...`);
  }

  onToggleStatus(badge: Badge): void {
    const nextStatus = badge.statutCompte === 'SUSPENDU' ? 'ACTIF' : 'SUSPENDU';
    const motif = nextStatus === 'ACTIF' ? 'Réactivation par super-admin' : 'Suspension administrative';
    
    this.badgeService.updateStatut(badge.idUser, nextStatus, motif).subscribe({
      next: (updated: Badge) => {
        this.showToast(`Statut mis à jour : ${updated.prenom} ${updated.nom} est maintenant ${updated.statutCompte}.`);
        this.loadBadges();
        this.loadStats();
      },
      error: (err: any) => this.showToast('Erreur lors de la mise à jour du statut.')
    });
  }

  onQuickAction(badge: Badge): void {
    if (badge.statutCompte === 'SUSPENDU') {
      this.onToggleStatus(badge);
    } else {
      this.badgeService.resetMfa(badge.idUser).subscribe({
        next: () => this.showToast(`Clé de sécurité / OTP réinitialisé pour ${badge.prenom} ${badge.nom}.`),
        error: () => this.showToast('Erreur lors de la réinitialisation MFA.')
      });
    }
  }

  private showToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => {
      this.toastMessage = '';
    }, 4000);
  }
}
