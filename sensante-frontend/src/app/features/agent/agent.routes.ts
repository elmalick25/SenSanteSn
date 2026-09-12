import { Routes } from '@angular/router';
import { AgentLayoutComponent } from './agent-layout.component';
import { TourDeControleViewComponent } from './views/tour-de-controle/tour-de-controle-view.component';
import { ScannerViewComponent } from './views/scanner/scanner-view.component';
import { TriageRdvViewComponent } from './views/triage/triage-view.component';
import { CarteZonesViewComponent } from './views/carte/carte-zones-view.component';
import { ClotureJourViewComponent } from './views/cloture/cloture-jour-view.component';
import { ProfilAgentViewComponent } from './views/profil/profil-agent-view.component';

export const AGENT_ROUTES: Routes = [
  {
    path: '',
    component: AgentLayoutComponent,
    children: [
      { path: '', redirectTo: 'tour-de-controle', pathMatch: 'full' },
      { path: 'tour-de-controle', component: TourDeControleViewComponent },
      { path: 'scanner', component: ScannerViewComponent },
      { path: 'dispensation', redirectTo: 'tour-de-controle' },
      { path: 'triage', component: TriageRdvViewComponent },
      { path: 'carte', component: CarteZonesViewComponent },
      { path: 'cloture', component: ClotureJourViewComponent },
      { path: 'profil', component: ProfilAgentViewComponent }
    ]
  }
];
