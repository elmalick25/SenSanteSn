import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';
import { StructuresViewComponent } from './views/structures-view/structures-view.component';
import { BadgesViewComponent } from './views/badges-view/badges-view.component';
import { AuditViewComponent } from './views/audit-view/audit-view.component';
import { CliniquesViewComponent } from './views/cliniques-view/cliniques-view.component';
import { InfrastructureViewComponent } from './views/infrastructure-view/infrastructure-view.component';
import { BarometreViewComponent } from './views/barometre-view/barometre-view.component';
import { ProfilViewComponent } from './views/profil-view/profil-view.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'structures', pathMatch: 'full' },
      { path: 'structures', component: StructuresViewComponent },
      { path: 'utilisateurs', component: BadgesViewComponent },
      { path: 'audit', component: AuditViewComponent },
      { path: 'cliniques', component: CliniquesViewComponent },
      { path: 'infrastructure', component: InfrastructureViewComponent },
      { path: 'barometre', component: BarometreViewComponent },
      { path: 'profil', component: ProfilViewComponent }
    ]
  }
];
