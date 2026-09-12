import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SidebarBrandComponent } from '../../shared/components/sidebar-brand/sidebar-brand.component';

@Component({
  selector: 'app-superviseur-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarBrandComponent],
  template: `
    <div class="h-screen w-screen overflow-hidden bg-[#f4f7fb] text-slate-800 font-sans antialiased flex">
      <!-- MOBILE BACKDROP -->
      @if (isMobileMenuOpen) {
        <div
          class="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
          (click)="isMobileMenuOpen = false"
        ></div>
      }

      <!-- SIDEBAR: Dark Teal SenSanté Brand Navigation (#003426) -->
      <aside
        class="fixed inset-y-0 left-0 z-50 lg:static w-[260px] flex-shrink-0 h-full flex flex-col justify-between bg-[#003426] border-r border-emerald-900/30 shadow-xl transition-transform duration-300 ease-in-out"
        [class.-translate-x-full]="!isMobileMenuOpen"
        [class.translate-x-0]="isMobileMenuOpen"
        [class.lg:translate-x-0]="true"
      >
        <!-- Upper Section -->
        <div class="flex flex-col pt-4 px-2 overflow-y-auto custom-scrollbar">
          <!-- Brand Header -->
          <div class="px-2 pb-3 border-b border-white/10">
            <app-sidebar-brand [showCloseButton]="true" (closeMobileMenu)="isMobileMenuOpen = false"></app-sidebar-brand>
          </div>

          <!-- Supervisor Profile Block (Dynamic from AuthService) -->
          <div class="p-2.5 my-3 mx-1 rounded-xl bg-[#0f4c3a]/70 border border-emerald-400/20 flex items-center gap-3 shadow-inner">
            <div class="relative flex-shrink-0">
              <img
                class="w-10 h-10 rounded-full object-cover border border-[#85f8c4]/50"
                [src]="userAvatar()"
                alt="Portrait Superviseur"
              />
              <span class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#85f8c4] border-2 border-[#003426]" title="Connecté"></span>
            </div>
            <div class="flex flex-col overflow-hidden min-w-0">
              <h4 class="text-sm font-semibold text-white truncate text-balance">{{ userName() }}</h4>
              <span class="text-[11px] text-emerald-200/90 truncate">{{ userRoleTitle() }}</span>
              <span class="text-[10px] text-emerald-300/90 truncate font-medium flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-[#85f8c4] animate-pulse"></span>
                {{ userDistrict() }}
              </span>
            </div>
          </div>

          <!-- Tab Navigation Links -->
          <nav class="space-y-1 mt-1">
            <!-- 1. Centre de Commandement (Vue 1 - Active) -->
            <a
              routerLink="/superviseur/centre-commandement"
              routerLinkActive="bg-emerald-800/60 text-white font-semibold border-l-4 border-[#85f8c4] shadow-sm"
              [routerLinkActiveOptions]="{ exact: false }"
              (click)="isMobileMenuOpen = false"
              class="text-emerald-100 hover:bg-[#0f4c3a]/50 hover:text-white transition-colors duration-150 rounded-lg text-xs font-medium flex items-center gap-3 px-3 py-2.5 mx-1"
            >
              <span class="material-symbols-outlined text-[#85f8c4]" style="font-variation-settings: 'FILL' 1;">dashboard</span>
              <span class="truncate flex-1 whitespace-nowrap">Centre de Commandement</span>
              <span class="w-2 h-2 rounded-full bg-[#85f8c4] animate-pulse"></span>
            </a>

            <!-- 2. Cartographie & Missions -->
            <a
              routerLink="/superviseur/cartographie"
              routerLinkActive="bg-emerald-800/60 text-white font-semibold border-l-4 border-[#85f8c4] shadow-sm"
              (click)="isMobileMenuOpen = false"
              class="text-emerald-100/80 hover:bg-[#0f4c3a]/40 hover:text-white transition-colors duration-150 rounded-lg text-xs font-medium flex items-center gap-3 px-3 py-2 mx-1"
            >
              <span class="material-symbols-outlined text-emerald-400">map</span>
              <span class="truncate whitespace-nowrap">Cartographie &amp; Missions</span>
            </a>

            <!-- 3. Validation Rapports -->
            <a
              routerLink="/superviseur/validation-rapports"
              routerLinkActive="bg-emerald-800/60 text-white font-semibold border-l-4 border-[#85f8c4] shadow-sm"
              (click)="isMobileMenuOpen = false"
              class="text-emerald-100/80 hover:bg-[#0f4c3a]/40 hover:text-white transition-colors duration-150 rounded-lg text-xs font-medium flex items-center justify-between px-3 py-2 mx-1"
            >
              <div class="flex items-center gap-3 min-w-0">
                <span class="material-symbols-outlined">fact_check</span>
                <span class="truncate whitespace-nowrap">Validation Rapports</span>
              </div>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#8c000a] text-[#ffdad6] border border-[#ffb4ab]/30 whitespace-nowrap flex-shrink-0">8</span>
            </a>

            <!-- 4. Rapports Quotidiens -->
            <a
              routerLink="/superviseur/rapports-quotidiens"
              routerLinkActive="bg-emerald-800/60 text-white font-semibold border-l-4 border-[#85f8c4] shadow-sm"
              (click)="isMobileMenuOpen = false"
              class="text-emerald-100/80 hover:bg-[#0f4c3a]/40 hover:text-white transition-colors duration-150 rounded-lg text-xs font-medium flex items-center gap-3 px-3 py-2 mx-1"
            >
              <span class="material-symbols-outlined">assignment</span>
              <span class="truncate whitespace-nowrap">Rapports Quotidiens</span>
            </a>

            <!-- 5. Stocks ATPE -->
            <a
              routerLink="/superviseur/stocks-atpe"
              routerLinkActive="bg-emerald-800/60 text-white font-semibold border-l-4 border-[#85f8c4] shadow-sm"
              (click)="isMobileMenuOpen = false"
              class="text-emerald-100/80 hover:bg-[#0f4c3a]/40 hover:text-white transition-colors duration-150 rounded-lg text-xs font-medium flex items-center gap-3 px-3 py-2 mx-1"
            >
              <span class="material-symbols-outlined">inventory_2</span>
              <span class="truncate whitespace-nowrap">Stocks ATPE</span>
            </a>

            <!-- 6. Exports DHIS2 -->
            <a
              routerLink="/superviseur/exports-dhis2"
              routerLinkActive="bg-emerald-800/60 text-white font-semibold border-l-4 border-[#85f8c4] shadow-sm"
              (click)="isMobileMenuOpen = false"
              class="text-emerald-100/80 hover:bg-[#0f4c3a]/40 hover:text-white transition-colors duration-150 rounded-lg text-xs font-medium flex items-center gap-3 px-3 py-2 mx-1"
            >
              <span class="material-symbols-outlined">sync_alt</span>
              <span class="truncate whitespace-nowrap">Exports DHIS2</span>
            </a>

            <!-- 7. Mon Profil -->
            <a
              routerLink="/superviseur/profil"
              routerLinkActive="bg-emerald-800/60 text-white font-semibold border-l-4 border-[#85f8c4] shadow-sm"
              (click)="isMobileMenuOpen = false"
              class="text-emerald-100/80 hover:bg-[#0f4c3a]/40 hover:text-white transition-colors duration-150 rounded-lg text-xs font-medium flex items-center gap-3 px-3 py-2 mx-1"
            >
              <span class="material-symbols-outlined">account_circle</span>
              <span class="truncate whitespace-nowrap">Mon Profil</span>
            </a>
          </nav>
        </div>

        <!-- Bottom Nav Elements -->
        <div class="px-3 pb-4 pt-2 border-t border-white/10 space-y-2">
          <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0f4c3a]/50 text-emerald-200 text-xs">
            <span class="material-symbols-outlined text-[#85f8c4] text-base animate-pulse">satellite_alt</span>
            <div class="flex flex-col min-w-0">
              <span class="font-semibold text-white text-[11px] whitespace-nowrap">Flux SIG Live (4 min)</span>
              <span class="text-[10px] text-emerald-300/80 whitespace-nowrap">GPS Dakar Ouest actif</span>
            </div>
          </div>
          <button
            (click)="logout()"
            class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-emerald-200 hover:bg-red-900/40 hover:text-red-200 transition-colors text-xs font-medium whitespace-nowrap"
          >
            <span class="material-symbols-outlined text-base text-red-400">logout</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <!-- MAIN APP CANVAS: Map-First GIS Command Room -->
      <div class="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#f4f7fb]">
        <!-- Mobile Top Bar with Drawer toggle button -->
        <div class="lg:hidden h-12 bg-[#003426] text-white px-3 flex items-center justify-between border-b border-emerald-900/30 shrink-0 z-30">
          <div class="flex items-center gap-2">
            <button
              (click)="isMobileMenuOpen = true"
              class="p-1 rounded-md text-emerald-200 hover:text-white hover:bg-white/10"
              aria-label="Ouvrir le menu"
            >
              <span class="material-symbols-outlined text-2xl">menu</span>
            </button>
            <span class="font-bold text-sm tracking-tight font-['Plus_Jakarta_Sans']">SenSanté GIS</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] bg-[#85f8c4]/20 text-[#85f8c4] px-2 py-0.5 rounded font-semibold whitespace-nowrap">Dakar Ouest</span>
          </div>
        </div>

        <!-- Router Outlet Content View -->
        <div class="flex-1 min-h-0 overflow-hidden flex flex-col">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
    }
  `]
})
export class SuperviseurLayoutComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isMobileMenuOpen = false;

  readonly currentUser = this.authService.currentUser;

  readonly userName = computed(() => {
    const u = this.currentUser();
    if (u && (u.prenom || u.nom)) {
      return `${u.prenom || ''} ${u.nom || ''}`.trim();
    }
    return 'Dr. Aminata Diallo';
  });

  readonly userRoleTitle = computed(() => {
    const u = this.currentUser();
    if (u?.role === 'SUPERVISEUR') {
      return 'Médecin Chef de District';
    } else if (u?.role === 'ADMINISTRATEUR') {
      return 'Superviseur National';
    }
    return 'Médecin Chef de District';
  });

  readonly userDistrict = computed(() => 'District Dakar Ouest');

  readonly userAvatar = computed(() => {
    const u = this.currentUser();
    if (u?.avatarUrl && u.avatarUrl.trim() !== '') {
      return u.avatarUrl;
    }
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhJJ0SMFdZXqUVc8eZngmyPCgDUQVph8-83OL5rNuGzZ71Qb4Zb3hihB-Mrys2gx6qyPXBez17cTzX7UA7H7fHK5jOXtuAfC0r-vVMHJkhxjc1ai61Od4jeCsGmco_Qe8kDWeOtDpERyTlqBqTwfFrnzeCiMjjA5SM5gZBs8LNKcnwuA89zUG6P9d0pdIpIVXVwBkhc83BFYCj9bP3imWnZn2htz_Xli2j7DgU-yylCPfA3y0j1ZBd';
  });

  ngOnInit(): void {
    // Initial hook
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
