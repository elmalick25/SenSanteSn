import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models/role.enum';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSidebarOpen = signal<boolean>(true);
  readonly Role = Role;

  toggleSidebar(): void {
    this.isSidebarOpen.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
  }

  getRoleBadgeClass(role?: Role): string {
    switch (role) {
      case Role.ADMINISTRATEUR: return 'badge-role';
      case Role.MEDECIN: return 'badge-normal';
      case Role.AGENT_SANTE: return 'badge-mam';
      case Role.SUPERVISEUR: return 'badge-mas';
      default: return 'badge-role';
    }
  }
}
