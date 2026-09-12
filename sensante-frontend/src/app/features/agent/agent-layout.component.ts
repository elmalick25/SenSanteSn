import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AgentTactiqueService } from './services/agent-tactique.service';
import { ActionTactiqueResponse } from './models/agent-tactique.model';
import { SidebarBrandComponent } from '../../shared/components/sidebar-brand/sidebar-brand.component';

@Component({
  selector: 'app-agent-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule, SidebarBrandComponent],
  template: `
    <div class="h-full bg-[#EEF2F0] text-[#111C2D] font-sans antialiased overflow-x-hidden selection:bg-[#006C4A] selection:text-white min-h-screen">
      <!-- Mobile Backdrop -->
      <div
        *ngIf="mobileMenuOpen()"
        (click)="toggleMobileMenu()"
        class="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs transition-opacity"
      ></div>

      <!-- ==================== FIXED SIDEBAR ==================== -->
      <aside
        [class.translate-x-0]="mobileMenuOpen()"
        [class.-translate-x-full]="!mobileMenuOpen()"
        class="fixed top-0 left-0 h-screen w-[260px] flex flex-col justify-between border-r border-white/10 bg-[#0F4C3A] z-40 text-white select-none transition-transform duration-300 ease-in-out lg:translate-x-0"
      >
        <!-- Top Section: Brand, Profile & Scrollable Navigation -->
        <div class="flex flex-col flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          <!-- Brand Logo Header -->
          <div class="px-3.5 pt-3.5 pb-2.5 border-b border-white/10 flex-shrink-0">
            <app-sidebar-brand [showCloseButton]="true" (closeMobileMenu)="toggleMobileMenu()"></app-sidebar-brand>
          </div>

          <!-- Agent Status Badge -->
          <div class="px-5 py-2.5 border-b border-white/10 bg-black/10 flex-shrink-0">
            <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 text-[10px] font-semibold text-emerald-200 tracking-wide whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Agent Terrain — Bajenu Gox
            </span>
          </div>

          <!-- Agent Avatar & Identity Card -->
          <div class="px-5 py-3.5 bg-black/15 border-b border-white/10 flex items-center gap-3 flex-shrink-0">
            <div class="relative flex-shrink-0">
              <img
                class="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                [src]="agentAvatar()"
                alt="Portrait Agent Terrain"
              />
              <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0F4C3A] rounded-full"></span>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-bold text-white truncate">{{ agentNomComplet() }}</p>
              <p class="text-[11px] text-emerald-200/80 truncate">Poste Médina — Secteur 4</p>
            </div>
          </div>

          <!-- Navigation Items -->
          <nav class="px-3 py-3 space-y-1 flex-1">
            <!-- 1. Tour de Contrôle (ACTIVE) -->
            <a
              routerLink="/agent/tour-de-controle"
              routerLinkActive="bg-[#006C4A] text-white font-bold shadow-xs active-link"
              [routerLinkActiveOptions]="{ exact: false }"
              (click)="closeMobileMenu()"
              class="flex items-center gap-3 px-3 py-2 text-emerald-100 hover:bg-white/10 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer group"
            >
              <span class="material-symbols-outlined text-[20px]">dashboard</span>
              <span class="text-xs flex-1 whitespace-nowrap">Tour de Contrôle</span>
              <span class="w-1.5 h-4 bg-emerald-300 rounded-full group-[.active-link]:inline-block hidden"></span>
            </a>

            <!-- 2. Scanner QR -->
            <a
              routerLink="/agent/scanner"
              routerLinkActive="bg-[#006C4A] text-white font-bold shadow-xs active-link"
              (click)="closeMobileMenu()"
              class="flex items-center gap-3 px-3 py-2 text-emerald-100 hover:bg-white/10 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer group"
            >
              <span class="material-symbols-outlined text-[20px]">qr_code_scanner</span>
              <span class="flex-1 whitespace-nowrap">Scanner QR</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">Prêt</span>
            </a>

            <!-- 3. Bilan & Dispensation -->
            <a
              routerLink="/agent/dispensation"
              routerLinkActive="bg-[#006C4A] text-white font-bold shadow-xs active-link"
              (click)="closeMobileMenu()"
              class="flex items-center gap-3 px-3 py-2 text-emerald-100 hover:bg-white/10 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer group"
            >
              <span class="material-symbols-outlined text-[20px]">medication</span>
              <span class="whitespace-nowrap">Bilan &amp; Dispensation</span>
            </a>

            <!-- 4. Triage RDV -->
            <a
              routerLink="/agent/triage"
              routerLinkActive="bg-[#006C4A] text-white font-bold shadow-xs active-link"
              (click)="closeMobileMenu()"
              class="flex items-center gap-3 px-3 py-2 text-emerald-100 hover:bg-white/10 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer group"
            >
              <span class="material-symbols-outlined text-[20px]">view_timeline</span>
              <span class="flex-1 whitespace-nowrap">Triage RDV</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded font-bold bg-red-600 text-white whitespace-nowrap animate-pulse">4 en attente</span>
            </a>

            <!-- 5. Carte des Zones -->
            <a
              routerLink="/agent/carte"
              routerLinkActive="bg-[#006C4A] text-white font-bold shadow-xs active-link"
              (click)="closeMobileMenu()"
              class="flex items-center gap-3 px-3 py-2 text-emerald-100 hover:bg-white/10 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer group"
            >
              <span class="material-symbols-outlined text-[20px]">map</span>
              <span class="whitespace-nowrap">Carte des Zones</span>
            </a>

            <!-- 6. Clôture du Jour -->
            <a
              routerLink="/agent/cloture"
              routerLinkActive="bg-[#006C4A] text-white font-bold shadow-xs active-link"
              (click)="closeMobileMenu()"
              class="flex items-center gap-3 px-3 py-2 text-emerald-100 hover:bg-white/10 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer group"
            >
              <span class="material-symbols-outlined text-[20px]">fact_check</span>
              <span class="whitespace-nowrap">Clôture du Jour</span>
            </a>

            <!-- 7. Mon Profil -->
            <a
              routerLink="/agent/profil"
              routerLinkActive="bg-[#006C4A] text-white font-bold shadow-xs active-link"
              (click)="closeMobileMenu()"
              class="flex items-center gap-3 px-3 py-2 text-emerald-100 hover:bg-white/10 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer group"
            >
              <span class="material-symbols-outlined text-[20px]">account_circle</span>
              <span class="whitespace-nowrap">Mon Profil</span>
            </a>
          </nav>
        </div>

        <!-- Bottom: Sync & Quick Action & Logout -->
        <div class="p-4 border-t border-white/10 space-y-3 flex-shrink-0 bg-black/10">
          <div class="p-2.5 rounded-xl bg-black/25 border border-white/10">
            <div class="flex items-center justify-between">
              <span class="text-[11px] text-emerald-200/90 flex items-center gap-1.5 font-medium">
                <span class="material-symbols-outlined text-[15px]">sync</span>
                Statut Synchronisation
              </span>
              <span class="flex h-2 w-2 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p class="text-xs text-white font-semibold mt-1">Connecté — Synchro: {{ derniereSynchroHeure() }}</p>
            <p class="text-[10px] text-emerald-200/70 mt-0.5">Données chiffrées hors-ligne OK</p>
          </div>

          <button
            (click)="declencherSynchronisation()"
            [disabled]="isSyncing()"
            class="w-full h-9 px-3 rounded-xl bg-[#006C4A] hover:bg-emerald-600 active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50 whitespace-nowrap cursor-pointer"
          >
            <span class="material-symbols-outlined text-[17px]" [class.animate-spin]="isSyncing()">cloud_sync</span>
            <span>{{ isSyncing() ? 'Synchronisation...' : 'Synchronisation Rapide' }}</span>
          </button>

          <button
            (click)="deconnexion()"
            class="w-full h-8 px-3 rounded-xl bg-black/20 hover:bg-red-950/40 border border-white/10 text-emerald-200/80 hover:text-red-300 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <span class="material-symbols-outlined text-[16px]">logout</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <!-- ==================== MAIN WORKSPACE ==================== -->
      <div class="lg:ml-[260px] min-h-screen flex flex-col bg-[#EEF2F0]">
        <!-- Top Tactical Operations Header -->
        <header class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#D8E1DD] px-4 sm:px-6 h-15 py-2.5 flex items-center justify-between shadow-2xs">
          <div class="flex items-center gap-3">
            <!-- Mobile Toggle -->
            <button
              (click)="toggleMobileMenu()"
              class="lg:hidden p-1.5 rounded-md hover:bg-gray-100 text-gray-700"
              title="Ouvrir le menu"
            >
              <span class="material-symbols-outlined text-2xl">menu</span>
            </button>

            <div class="flex items-center gap-2">
              <div class="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <h1 class="text-xs sm:text-sm font-bold text-gray-900 tracking-tight uppercase whitespace-nowrap text-balance">
                Poste d'Intervention Tactique
              </h1>
            </div>
            <span class="text-gray-300 hidden sm:inline">|</span>
            <span class="text-xs text-gray-500 font-medium hidden md:inline">
              Médina &amp; Soumbédioune • {{ dateAujourdhui() }}
            </span>
            <span class="hidden sm:inline-flex px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold whitespace-nowrap">
              Réseau 4G Local OK
            </span>
          </div>

          <div class="flex items-center gap-3">
            <!-- Live Timer Indicator -->
            <div class="hidden sm:flex items-center gap-1.5 text-xs text-gray-600 bg-[#F4F7F5] border border-[#CBD5E1] px-2.5 py-1 rounded-md whitespace-nowrap">
              <span class="material-symbols-outlined text-[15px] text-emerald-700">timer</span>
              <span>Dernière synchro: <strong class="text-gray-900">{{ derniereSynchroHeure() }}</strong></span>
            </div>

            <!-- Toast alert feedback -->
            <div *ngIf="syncSuccessMessage()" class="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded border border-emerald-300 animate-fade-in whitespace-nowrap">
              {{ syncSuccessMessage() }}
            </div>

            <!-- Notifications Button -->
            <div class="relative">
              <button
                (click)="toggleNotifications()"
                class="relative w-8 h-8 flex items-center justify-center rounded-md border border-[#CBD5E1] text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                title="Notifications cliniques"
              >
                <span class="material-symbols-outlined text-[18px]">notifications</span>
                @if (unreadNotificationsCount() > 0) {
                  <span class="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white"></span>
                }
              </button>

              <!-- Dropdown Notifications Cliniques -->
              @if (notificationsOpen()) {
                <div class="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                  <div class="p-3 bg-[#0F4C3A] text-white flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-emerald-300 text-lg">medical_services</span>
                      <span class="font-bold text-xs uppercase tracking-wide whitespace-nowrap">Alertes Cliniques Terrain</span>
                    </div>
                    <button (click)="notificationsOpen.set(false)" class="text-white/70 hover:text-white cursor-pointer">
                      <span class="material-symbols-outlined text-base">close</span>
                    </button>
                  </div>
                  <div class="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    @for (notif of notificationsList(); track notif.id) {
                      <div class="p-3 hover:bg-slate-50 transition-colors flex items-start gap-3" [class.bg-red-50]="notif.urgent">
                        <span
                          class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs"
                          [class.bg-red-600]="notif.urgent"
                          [class.bg-emerald-600]="!notif.urgent"
                        >
                          <span class="material-symbols-outlined text-sm">{{ notif.urgent ? 'emergency' : 'schedule' }}</span>
                        </span>
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center justify-between">
                            <p class="text-xs font-bold text-slate-900 truncate">{{ notif.titre }}</p>
                            <span class="text-[10px] text-slate-400 whitespace-nowrap">{{ notif.heure }}</span>
                          </div>
                          <p class="text-[11px] text-slate-600 mt-0.5 text-pretty">{{ notif.description }}</p>
                        </div>
                      </div>
                    }
                  </div>
                  <div class="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <button
                      (click)="acquitterNotifications()"
                      class="text-[11px] font-bold text-[#006C4A] hover:underline cursor-pointer whitespace-nowrap"
                    >
                      Tout marquer comme lu
                    </button>
                    <span class="text-[10px] text-slate-400 whitespace-nowrap">Source : MSAS • COUS</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </header>

        <!-- Main View Outlet Container -->
        <main class="flex-1 p-4 sm:p-6 max-w-[1600px] w-full mx-auto space-y-4">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AgentLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly agentService = inject(AgentTactiqueService);
  private readonly router = inject(Router);

  readonly mobileMenuOpen = signal<boolean>(false);
  readonly isSyncing = signal<boolean>(false);
  readonly derniereSynchroHeure = signal<string>('08:42');
  readonly syncSuccessMessage = signal<string | null>(null);
  readonly notificationsOpen = signal<boolean>(false);

  readonly notificationsList = signal([
    {
      id: 1,
      urgent: true,
      titre: 'Urgence MAS Critique non acquittée',
      description: 'Enfant #SEN-MED-2489 (Mamadou Ndiaye, PB: 108mm). Évacuation UREN requise sans délai.',
      heure: '08:30'
    },
    {
      id: 2,
      urgent: false,
      titre: '4 Rendez-vous de Triage prévus',
      description: 'Consultations pédiatriques de contrôle programmées pour le créneau matinal.',
      heure: '09:00'
    },
    {
      id: 3,
      urgent: false,
      titre: 'Stock ATPE de dotation',
      description: '14 sachets de Plumpy\'Nut restants disponibles dans la sacoche de tournée.',
      heure: 'Hier'
    }
  ]);

  readonly unreadNotificationsCount = computed(() => this.notificationsList().filter(n => n.urgent).length);

  readonly agentAvatar = computed(() => {
    const user = this.authService.currentUser();
    return (user && user.avatarUrl) ? user.avatarUrl : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzCi3mC_GPkSix2r-PU1IR8QGQ7_gtYqKwfqZ9m4OaqxHbaYP5sLC4Q03w51nakEpn0YEf9vaXYT1O7LoU5P6gh1G3QDmRpU82OTQQvAgH4HcuSA2VbaTPWaFew8Mv6B52glopy6UuIIuW3RXi_eyCzWlRh3WAj-PZx-HN3HY05HI-QHt5zQhFtCCEmw2jBMu2SgZeNtrujJ7gHdoPMvu-eHDnmAm9E2-9WLYiLjHdnjGg8ebz-zBg';
  });

  readonly agentNomComplet = computed(() => {
    const user = this.authService.currentUser();
    if (user && user.prenom && user.nom) {
      return `${user.prenom} ${user.nom}`;
    }
    return 'Aïssatou Diop';
  });

  readonly dateAujourdhui = computed(() => {
    const date = new Date();
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  });

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  toggleNotifications(): void {
    this.notificationsOpen.update(v => !v);
  }

  acquitterNotifications(): void {
    this.notificationsList.update(list => list.map(item => ({ ...item, urgent: false })));
    this.notificationsOpen.set(false);
  }

  declencherSynchronisation(): void {
    this.isSyncing.set(true);
    this.agentService.synchroniser().subscribe({
      next: (res: ActionTactiqueResponse) => {
        this.isSyncing.set(false);
        const heure = res.donneeResultat?.heureSynchro || new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date());
        this.derniereSynchroHeure.set(heure);
        this.syncSuccessMessage.set('Synchro réussie !');
        setTimeout(() => this.syncSuccessMessage.set(null), 3000);
      },
      error: () => {
        this.isSyncing.set(false);
        this.derniereSynchroHeure.set(new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date()));
        this.syncSuccessMessage.set('Synchro locale effectuée');
        setTimeout(() => this.syncSuccessMessage.set(null), 3000);
      }
    });
  }

  deconnexion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
