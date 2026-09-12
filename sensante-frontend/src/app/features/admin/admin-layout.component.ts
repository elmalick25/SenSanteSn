import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { SidebarBrandComponent } from '../../shared/components/sidebar-brand/sidebar-brand.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarBrandComponent],
  template: `
    <div class="h-full min-h-screen bg-slate-50 antialiased flex overflow-x-hidden font-sans text-slate-800">
      <!-- MOBILE MENU BACKDROP -->
      @if (isMobileMenuOpen) {
        <div
          class="fixed inset-0 bg-slate-900/50 z-40 xl:hidden backdrop-blur-xs"
          (click)="isMobileMenuOpen = false"
        ></div>
      }

      <!-- ================= SIDEBAR COMPONENT ================= -->
      <aside
        class="fixed inset-y-0 left-0 z-40 w-[280px] flex flex-col justify-between px-3.5 py-4 bg-[#0f4c3a] border-r border-emerald-900/40 text-white shrink-0 overflow-y-auto transition-transform duration-300 ease-in-out"
        [class.-translate-x-full]="!isMobileMenuOpen"
        [class.translate-x-0]="isMobileMenuOpen"
        [class.xl:translate-x-0]="true"
      >
        <div class="flex flex-col gap-y-5">
          <!-- Brand & Sovereign Crest -->
          <div class="px-1 pt-1 pb-2 border-b border-emerald-800/50">
            <app-sidebar-brand></app-sidebar-brand>
          </div>

          <!-- Admin Identity Card (Dynamique depuis AuthService) -->
          <div class="p-2.5 rounded-lg bg-black/20 border border-white/10 flex items-center gap-3">
            <div class="relative shrink-0">
              @if (userAvatar()) {
                <img
                  [src]="userAvatar()"
                  alt="Avatar"
                  class="w-9 h-9 rounded-full object-cover border border-[#a4f2d4]/40"
                />
              } @else {
                <div class="w-9 h-9 rounded-full bg-[#166b53] border border-[#a4f2d4]/40 text-[#a4f2d4] flex items-center justify-center font-bold text-xs">
                  {{ userInitials() }}
                </div>
              }
              <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0f4c3a]"></span>
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-xs font-semibold text-white truncate">{{ userName() }}</span>
              <span class="text-[10px] text-emerald-200/80 truncate">Administrateur National</span>
              <span class="inline-flex items-center gap-1 text-[9px] text-[#a4f2d4] font-semibold tracking-wide">
                <span class="w-1.5 h-1.5 rounded-full bg-[#a4f2d4]"></span> Niv. 4 Super-Admin
              </span>
            </div>
          </div>

          <!-- Main Navigation Cluster -->
          <nav class="flex flex-col gap-1">
            <!-- 1. Structures (ACTIVE) -->
            <a
              routerLink="/admin/structures"
              routerLinkActive="bg-[#166b53] text-white shadow-sm font-semibold"
              [routerLinkActiveOptions]="{ exact: false }"
              class="flex items-center justify-between px-3 py-2 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 text-xs transition-colors"
              (click)="isMobileMenuOpen = false"
            >
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-lg">domain</span>
                <span>Structures</span>
              </div>
              <span class="w-2 h-2 rounded-full bg-emerald-300"></span>
            </a>

            <!-- 2. Utilisateurs & Badges -->
            <a
              routerLink="/admin/utilisateurs"
              routerLinkActive="bg-[#166b53] text-white shadow-sm font-semibold"
              class="flex items-center justify-between px-3 py-2 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 text-xs transition-colors"
              (click)="isMobileMenuOpen = false"
            >
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-lg">badge</span>
                <span>Utilisateurs &amp; Badges</span>
              </div>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white/10 text-emerald-200">2,418</span>
            </a>

            <!-- 3. Audit & Sécurité -->
            <a
              routerLink="/admin/audit"
              routerLinkActive="bg-[#166b53] text-white shadow-sm font-semibold"
              class="flex items-center justify-between px-3 py-2 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 text-xs transition-colors"
              (click)="isMobileMenuOpen = false"
            >
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-lg">verified_user</span>
                <span>Audit &amp; Sécurité</span>
              </div>
              <span class="px-1.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-bold tracking-wide uppercase whitespace-nowrap">
                Conforme
              </span>
            </a>

            <!-- 4. Config. Cliniques -->
            <a
              routerLink="/admin/cliniques"
              routerLinkActive="bg-[#166b53] text-white shadow-sm font-semibold"
              class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 text-xs transition-colors"
              (click)="isMobileMenuOpen = false"
            >
              <span class="material-symbols-outlined text-lg">medical_services</span>
              <span>Config. Cliniques</span>
            </a>

            <!-- 5. Infrastructure -->
            <a
              routerLink="/admin/infrastructure"
              routerLinkActive="bg-[#166b53] text-white shadow-sm font-semibold"
              class="flex items-center justify-between px-3 py-2 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 text-xs transition-colors"
              (click)="isMobileMenuOpen = false"
            >
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-lg">dns</span>
                <span>Infrastructure</span>
              </div>
              <span class="text-[10px] font-semibold text-emerald-300">99.98%</span>
            </a>

            <!-- 6. Baromètre National -->
            <a
              routerLink="/admin/barometre"
              routerLinkActive="bg-[#166b53] text-white shadow-sm font-semibold"
              class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 text-xs transition-colors"
              (click)="isMobileMenuOpen = false"
            >
              <span class="material-symbols-outlined text-lg">analytics</span>
              <span>Baromètre National</span>
            </a>

            <!-- 7. Mon Profil -->
            <a
              routerLink="/admin/profil"
              routerLinkActive="bg-[#166b53] text-white shadow-sm font-semibold"
              class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 text-xs transition-colors"
              (click)="isMobileMenuOpen = false"
            >
              <span class="material-symbols-outlined text-lg">account_circle</span>
              <span>Mon Profil</span>
            </a>
          </nav>
        </div>

        <!-- Sidebar Footer -->
        <div class="flex flex-col gap-3 pt-4 border-t border-white/10">
          <div class="flex flex-col gap-1">
            <a class="flex items-center gap-2 text-xs text-emerald-200/70 hover:text-white transition-colors py-1 cursor-pointer">
              <span class="material-symbols-outlined text-sm">help</span>
              <span>Aide Système</span>
            </a>
            <button
              type="button"
              class="flex items-center gap-2 text-xs text-red-300/80 hover:text-red-200 transition-colors py-1 text-left cursor-pointer"
              (click)="logout()"
            >
              <span class="material-symbols-outlined text-sm">logout</span>
              <span>Déconnexion</span>
            </button>
          </div>
          <div class="p-2 rounded bg-black/25 text-[10px] text-emerald-200/80 leading-snug">
            <p class="font-semibold text-white/90">v4.2.1-prod</p>
            <p>SEN-GOUV Cloud • Dakar Datacenter Tier III</p>
          </div>
        </div>
      </aside>

      <!-- ================= MAIN CONTENT CANVAS ================= -->
      <div class="xl:pl-[280px] flex-1 flex flex-col min-w-0 bg-slate-50 min-h-screen">
        <!-- TOP UTILITY NAVBAR -->
        <header class="h-16 flex items-center justify-between px-4 md:px-6 w-full sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-[0_1px_2px_0_rgba(15,23,42,0.05)]">
          <!-- Left: Mobile Toggle & Breadcrumbs -->
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg xl:hidden"
              (click)="isMobileMenuOpen = !isMobileMenuOpen"
              title="Menu Navigation"
            >
              <span class="material-symbols-outlined text-xl">menu</span>
            </button>

            <div class="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
              <span>{{ isProfilView() ? 'Gouvernance Centrale' : (isBarometreView() ? 'Observatoire National' : (isAuditView() ? 'Cabinet Ministériel' : 'Gouvernance Centrale')) }}</span>
              <span class="material-symbols-outlined text-xs">chevron_right</span>
              <span>{{ isProfilView() ? 'Administration Système' : (isBarometreView() ? 'Indicateurs Stratégiques & PSE' : (isInfrastructureView() ? 'Supervision Système & Datacenter Diamniadio' : (isCliniquesView() ? 'Normes & Paramétrage Médical' : (isAuditView() ? 'Inspection Générale de la Santé' : (isBadgesView() ? 'Gestion des Accès' : 'Référentiel National'))))) }}</span>
              <span class="material-symbols-outlined text-xs">chevron_right</span>
              <span class="text-[#003426] font-semibold">
                {{ isProfilView() ? 'Mon Profil' : (isBarometreView() ? 'Baromètre National de Santé Publique' : (isInfrastructureView() ? 'Infrastructure & Sauvegardes' : (isCliniquesView() ? 'Configuration Clinique Nationale' : (isAuditView() ? 'Synthèse Exécutive SSI & Conformité Légale' : (isBadgesView() ? 'Trombinoscope & Badges MSAS' : 'Structures de Santé'))))) }}
              </span>
            </div>
            <span class="hidden sm:inline-block h-4 w-px bg-slate-200"></span>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span class="whitespace-nowrap">
                {{ isProfilView() ? 'PROD - Réseau National MSAS' : (isBarometreView() ? 'Impact PSE Santé 2024 (Index 93.4/100)' : (isInfrastructureView() ? 'Datacenter National ADIE / SEN-GOUV Opérationnel (99.98% SLA)' : (isCliniquesView() ? 'Directives Cliniques Actives (OMS / MSAS 2024)' : 'PROD - MSAS HealthNet Sécurisé'))) }}
              </span>
            </div>
          </div>

          <!-- Right: Search, Sync time, Export, Action -->
          <div class="flex items-center gap-3">
            <!-- Live Sync Pill -->
            <div class="hidden xl:flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-slate-100/80 px-2.5 py-1 rounded border border-slate-200">
              <span class="material-symbols-outlined text-sm text-[#003426]">schedule</span>
              <span>Dakar GMT: {{ liveDakarTime }}</span>
            </div>

            <!-- Global Search Input -->
            <div class="relative w-48 md:w-64">
              <span class="material-symbols-outlined absolute left-2.5 top-2.5 text-slate-400 text-sm">search</span>
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (keyup.enter)="onGlobalSearch()"
                class="w-full h-[36px] pl-8 pr-3 text-xs bg-white border border-slate-300 rounded focus:border-[#0f4c3a] focus:ring-1 focus:ring-[#0f4c3a] outline-none transition-all placeholder:text-slate-400"
                placeholder="Rechercher code, ville..."
              />
            </div>

            <!-- Notification Bell -->
            <button
              type="button"
              class="relative p-2 text-slate-600 hover:text-[#003426] hover:bg-slate-100 rounded transition-colors"
              title="Notifications MSAS"
            >
              <span class="material-symbols-outlined text-xl">notifications</span>
              <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        <!-- CONTENT ROUTER OUTLET -->
        <main class="p-4 md:p-6 flex-1">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isMobileMenuOpen = false;
  searchQuery = '';
  liveDakarTime = '';
  private timer: any;

  readonly user = this.authService.currentUser;

  readonly isBadgesView = computed(() => {
    return this.router.url.includes('/admin/utilisateurs');
  });

  readonly isAuditView = computed(() => {
    return this.router.url.includes('/admin/audit');
  });

  readonly isCliniquesView = computed(() => {
    return this.router.url.includes('/admin/cliniques');
  });

  readonly isInfrastructureView = computed(() => {
    return this.router.url.includes('/admin/infrastructure');
  });

  readonly isBarometreView = computed(() => {
    return this.router.url.includes('/admin/barometre');
  });

  readonly isProfilView = computed(() => {
    return this.router.url.includes('/admin/profil');
  });

  readonly userName = computed(() => {
    const u = this.user();
    if (!u) return 'Dr. Ibrahima Sow';
    return `${u.prenom} ${u.nom}`.trim() || 'Dr. Ibrahima Sow';
  });

  readonly userInitials = computed(() => {
    const u = this.user();
    if (!u) return 'IS';
    const first = u.prenom ? u.prenom.charAt(0) : 'I';
    const last = u.nom ? u.nom.charAt(0) : 'S';
    return `${first}${last}`.toUpperCase();
  });

  readonly userAvatar = computed(() => {
    const u = this.user();
    return u?.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop';
  });

  ngOnInit(): void {
    this.updateClock();
    this.timer = setInterval(() => this.updateClock(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private updateClock(): void {
    const now = new Date();
    this.liveDakarTime = now.toLocaleTimeString('fr-FR', {
      timeZone: 'Africa/Dakar',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  onGlobalSearch(): void {
    // Navigates or sets search query
    this.router.navigate(['/admin/structures'], { queryParams: { q: this.searchQuery } });
  }

  logout(): void {
    this.authService.logout();
  }
}
