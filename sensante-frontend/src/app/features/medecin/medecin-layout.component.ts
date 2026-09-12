import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SidebarBrandComponent } from '../../shared/components/sidebar-brand/sidebar-brand.component';

@Component({
  selector: 'app-medecin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule, SidebarBrandComponent],
  template: `
    <div class="h-full bg-[#E8FFF3] text-[#0C1F18] font-sans antialiased overflow-x-hidden selection:bg-[#003426] selection:text-white min-h-screen">

      <!-- Mobile Backdrop -->
      <div
        *ngIf="mobileMenuOpen()"
        (click)="toggleMobileMenu()"
        class="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
      ></div>

      <!-- ==================== SIDEBAR FIXE (#0F4C3A) ==================== -->
      <aside
        [class.translate-x-0]="mobileMenuOpen()"
        [class.-translate-x-full]="!mobileMenuOpen()"
        class="fixed top-0 left-0 h-screen w-[256px] flex flex-col justify-between bg-[#0F4C3A] text-white border-r border-white/10 z-40 select-none transition-transform duration-300 ease-in-out lg:translate-x-0"
      >
        <!-- Top Section -->
        <div class="flex flex-col overflow-y-auto">

          <!-- Brand Header -->
          <div class="px-3 pt-3.5 pb-2.5 border-b border-white/10">
            <app-sidebar-brand [showCloseButton]="true" (closeMobileMenu)="toggleMobileMenu()"></app-sidebar-brand>
          </div>

          <!-- Doctor Identity Card -->
          <div class="p-4 border-b border-white/10 bg-[#003426]/40">
            <div class="flex items-center gap-3">
              <div class="relative flex-shrink-0">
                <img
                  class="w-11 h-11 rounded-full object-cover ring-2 ring-[#ACF1D5]/60"
                  [src]="medecinAvatar()"
                  alt="Portrait Dr."
                />
                <span class="absolute bottom-0 right-0 w-3 h-3 bg-[#ACF1D5] border-2 border-[#0F4C3A] rounded-full"
                  title="En vacation active"></span>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-sm font-bold text-white truncate text-balance">{{ medecinNomComplet() }}</h3>
                <p class="text-[11px] text-[#99D3BA] truncate">Pédiatre • Cabinet 04</p>
                <div class="flex items-center gap-1 mt-0.5">
                  <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#ACF1D5] animate-pulse"></span>
                  <span class="text-[10px] font-semibold text-[#ACF1D5] tracking-wide">En&nbsp;vacation</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation 7 items -->
          <nav class="px-3 py-3 space-y-1">

            <!-- 1. Prise de Service -->
            <a routerLink="/medecin/prise-de-service"
               routerLinkActive="bg-[#ACF1D5] text-[#003426] font-bold shadow-sm"
               [routerLinkActiveOptions]="{ exact: false }"
               (click)="closeMobileMenu()"
               class="flex items-center justify-between px-3 py-2 text-[#99D3BA] hover:text-white hover:bg-white/10 rounded-lg text-sm transition-colors cursor-pointer group">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-xl"
                  style="font-variation-settings: 'FILL' 1;">calendar_view_week</span>
                <span class="whitespace-nowrap">Prise de Service</span>
              </div>
              <span class="w-1.5 h-4 bg-[#ACF1D5] rounded-full opacity-0 group-[.router-link-active]:opacity-100 transition-opacity"></span>
            </a>

            <!-- 2. File d'Attente -->
            <a routerLink="/medecin/file-attente"
               routerLinkActive="bg-[#ACF1D5] text-[#003426] font-bold shadow-sm"
               (click)="closeMobileMenu()"
               class="flex items-center justify-between px-3 py-2 text-[#99D3BA] hover:text-white hover:bg-white/10 rounded-lg text-sm transition-colors cursor-pointer">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-xl">groups</span>
                <span class="whitespace-nowrap">File d'Attente</span>
              </div>
              <span class="bg-[#003426] px-1.5 py-0.5 rounded-full text-[10px] font-bold text-[#ACF1D5] border border-[#ACF1D5]/30 whitespace-nowrap">14</span>
            </a>

            <!-- 3. Dossier Patient -->
            <a routerLink="/medecin/dossier"
               routerLinkActive="bg-[#ACF1D5] text-[#003426] font-bold shadow-sm"
               (click)="closeMobileMenu()"
               class="flex items-center gap-3 px-3 py-2 text-[#99D3BA] hover:text-white hover:bg-white/10 rounded-lg text-sm transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-xl">folder_shared</span>
              <span class="whitespace-nowrap">Dossier Patient</span>
            </a>

            <!-- 4. Examen Clinique -->
            <a routerLink="/medecin/examen"
               routerLinkActive="bg-[#ACF1D5] text-[#003426] font-bold shadow-sm"
               (click)="closeMobileMenu()"
               class="flex items-center gap-3 px-3 py-2 text-[#99D3BA] hover:text-white hover:bg-white/10 rounded-lg text-sm transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-xl">stethoscope</span>
              <span class="whitespace-nowrap">Examen Clinique</span>
            </a>

            <!-- 5. Prescription -->
            <a routerLink="/medecin/prescription"
               routerLinkActive="bg-[#ACF1D5] text-[#003426] font-bold shadow-sm"
               (click)="closeMobileMenu()"
               class="flex items-center gap-3 px-3 py-2 text-[#99D3BA] hover:text-white hover:bg-white/10 rounded-lg text-sm transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-xl">prescriptions</span>
              <span class="whitespace-nowrap">Prescription</span>
            </a>

            <!-- 6. Rapport du Jour -->
            <a routerLink="/medecin/rapport"
               routerLinkActive="bg-[#ACF1D5] text-[#003426] font-bold shadow-sm"
               (click)="closeMobileMenu()"
               class="flex items-center gap-3 px-3 py-2 text-[#99D3BA] hover:text-white hover:bg-white/10 rounded-lg text-sm transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-xl">assignment</span>
              <span class="whitespace-nowrap">Rapport du Jour</span>
            </a>

            <!-- 7. Mon Profil -->
            <a routerLink="/medecin/profil"
               routerLinkActive="bg-[#ACF1D5] text-[#003426] font-bold shadow-sm"
               (click)="closeMobileMenu()"
               class="flex items-center gap-3 px-3 py-2 text-[#99D3BA] hover:text-white hover:bg-white/10 rounded-lg text-sm transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-xl">account_circle</span>
              <span class="whitespace-nowrap">Mon Profil</span>
            </a>
          </nav>
        </div>

        <!-- Bottom : Urgence + Structure -->
        <div class="p-4 border-t border-white/10 space-y-3">
          <button
            (click)="declencherUrgencePediatrique()"
            class="w-full flex items-center justify-between px-3 py-2.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 active:scale-[0.98] transition-all shadow-md whitespace-nowrap cursor-pointer">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
              <span>Urgence Pédiatrique</span>
            </div>
            <span class="material-symbols-outlined text-sm">e911_emergency</span>
          </button>

          <div class="flex items-center gap-2 px-1 py-1 text-[#99D3BA] text-[11px]">
            <span class="material-symbols-outlined text-sm text-[#ACF1D5]">domain</span>
            <span class="truncate text-pretty">Centre de Santé Gaspard Kamara</span>
          </div>

          <button (click)="deconnexion()"
            class="w-full h-8 px-3 rounded bg-black/20 hover:bg-red-950/40 border border-white/10 text-[#99D3BA] hover:text-red-300 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap">
            <span class="material-symbols-outlined text-base">logout</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <!-- ==================== MAIN WORKSPACE ==================== -->
      <div class="lg:ml-[256px] min-h-screen flex flex-col">

        <!-- Top Navigation Bar -->
        <header class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#BFC9C3] px-4 sm:px-6 h-14 flex items-center justify-between shadow-sm">

          <!-- Left: Context -->
          <div class="flex items-center gap-3">
            <!-- Mobile Toggle -->
            <button (click)="toggleMobileMenu()"
              class="lg:hidden p-1.5 rounded-md hover:bg-gray-100 text-gray-700">
              <span class="material-symbols-outlined text-2xl">menu</span>
            </button>

            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-[#0C1F18] whitespace-nowrap text-balance">{{ dateAujourdhui() }}</span>
              <span class="text-[#707974] text-xs">•</span>
              <span class="text-xs text-[#404944] font-medium hidden md:inline text-pretty">
                Centre de Santé Gaspard Kamara • Box 04 Pédiatrie
              </span>
            </div>

            <div class="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-[#E3F9ED] rounded-full border border-[#BFC9C3]/60">
              <span class="w-2 h-2 rounded-full bg-[#266A54] animate-pulse"></span>
              <span class="text-[11px] font-semibold text-[#266A54] whitespace-nowrap">Synchronisé avec le Triage &amp; PMI</span>
            </div>
          </div>

          <!-- Right: Actions -->
          <div class="flex items-center gap-2">
            <!-- Search -->
            <div class="relative hidden sm:block w-64 lg:w-72">
              <span class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#707974]">
                <span class="material-symbols-outlined text-sm">search</span>
              </span>
              <input
                [(ngModel)]="searchQuery"
                (input)="onSearch()"
                class="w-full pl-8 pr-3 py-1.5 bg-[#E3F9ED] border border-[#BFC9C3] rounded-lg text-xs text-[#0C1F18] placeholder:text-[#707974] focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A]"
                placeholder="Rechercher patient par NIP ou nom..."
                type="text"
              />
            </div>

            <!-- Nouvelle Fiche -->
            <button
              class="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F4C3A] text-white rounded-lg text-xs font-semibold hover:bg-[#266A54] transition-colors shadow-sm active:scale-95 whitespace-nowrap cursor-pointer">
              <span class="material-symbols-outlined text-sm">person_add</span>
              <span class="hidden sm:inline">Nouvelle Fiche d'Admission</span>
            </button>

            <!-- Notifications -->
            <div class="relative">
              <button
                class="p-2 text-[#404944] hover:text-[#0C1F18] hover:bg-[#DDF3E8] rounded-lg transition-colors cursor-pointer"
                title="Notifications cliniques">
                <span class="material-symbols-outlined">notifications</span>
              </button>
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white"></span>
            </div>

            <!-- Sync -->
            <button
              class="p-2 text-[#404944] hover:text-[#0C1F18] hover:bg-[#DDF3E8] rounded-lg transition-colors cursor-pointer"
              title="Forcer synchronisation">
              <span class="material-symbols-outlined">sync</span>
            </button>
          </div>
        </header>

        <!-- Router Outlet -->
        <main class="flex-1 overflow-y-auto p-4 sm:p-5 bg-[#E8FFF3]">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class MedecinLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly mobileMenuOpen = signal<boolean>(false);
  searchQuery = '';

  readonly medecinAvatar = computed(() => {
    const user = this.authService.currentUser();
    return (user && user.avatarUrl) ? user.avatarUrl
      : 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5w515RpsTCZq3bYV3IPRWenES_WpPWET4vwy8uD1zVJyT8ELNEwuNNj3ui_YOElStAk0G5mEyqhNID-r45iihYw3tPBKk7kPP5jlVgV9dWHE5QuSKw0ait3CBA8hW7MyC8GF_vtCJlH5Z6w3QlG57M2XXaR67zmoNujd3mVPoJPXQJ9kTF1E82ClHEyknxv5cFwTJBsdDrdWbpsaaOhdolRY7NuKLk-Lz2PtAtlxrhPUbhsuaZfqp';
  });

  readonly medecinNomComplet = computed(() => {
    const user = this.authService.currentUser();
    if (user && user.prenom && user.nom) {
      return `Dr. ${user.prenom} ${user.nom}`;
    }
    return 'Dr. Babacar Fall';
  });

  readonly dateAujourdhui = computed(() => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }).format(new Date());
  });

  toggleMobileMenu(): void { this.mobileMenuOpen.update(v => !v); }
  closeMobileMenu(): void  { this.mobileMenuOpen.set(false); }

  onSearch(): void {
    // La recherche sera transmise aux vues enfants via un service partagé
    // ou un signal — extensible pour les vues suivantes
  }

  declencherUrgencePediatrique(): void {
    alert('🚨 Urgence Pédiatrique déclenchée — SAMU 15 notifié.\nProtocole choc hypovolémique activé Box 04.');
  }

  deconnexion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
