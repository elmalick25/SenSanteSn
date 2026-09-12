import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ParentLayoutComponent } from './features/parent/parent-layout.component';
import { DashboardViewComponent } from './features/parent/views/dashboard-view/dashboard-view.component';
import { CarnetViewComponent } from './features/parent/views/carnet-view/carnet-view.component';
import { CourbesViewComponent } from './features/parent/views/courbes-view/courbes-view.component';
import { RdvViewComponent } from './features/parent/views/rdv-view/rdv-view.component';
import { PilulierViewComponent } from './features/parent/views/pilulier-view/pilulier-view.component';
import { ProfilViewComponent } from './features/parent/views/profil-view/profil-view.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Role } from './core/models/role.enum';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'parent',
    component: ParentLayoutComponent,
    canActivate: [authGuard, roleGuard([Role.PARENT, Role.ADMINISTRATEUR])],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardViewComponent },
      { path: 'carnet', component: CarnetViewComponent },
      { path: 'courbes', component: CourbesViewComponent },
      { path: 'rendez-vous', component: RdvViewComponent },
      { path: 'pilulier', component: PilulierViewComponent },
      { path: 'profil', component: ProfilViewComponent },
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard([Role.ADMINISTRATEUR])],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES)
  },
  {
    path: 'superviseur',
    canActivate: [authGuard, roleGuard([Role.SUPERVISEUR, Role.ADMINISTRATEUR])],
    loadChildren: () => import('./features/superviseur/superviseur.routes').then((m) => m.SUPERVISEUR_ROUTES)
  },
  {
    path: 'agent',
    canActivate: [authGuard, roleGuard([Role.AGENT_SANTE, Role.SUPERVISEUR, Role.ADMINISTRATEUR])],
    loadChildren: () => import('./features/agent/agent.routes').then((m) => m.AGENT_ROUTES)
  },
  {
    path: 'medecin',
    canActivate: [authGuard, roleGuard([Role.MEDECIN, Role.ADMINISTRATEUR])],
    loadChildren: () => import('./features/medecin/medecin.routes').then((m) => m.MEDECIN_ROUTES)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];


