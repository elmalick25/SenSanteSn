import { Routes } from '@angular/router';
import { SuperviseurLayoutComponent } from './superviseur-layout.component';
import { CommandCenterViewComponent } from './views/command-center-view/command-center-view.component';

import { CartographieViewComponent } from './views/cartographie-view/cartographie-view.component';
import { ValidationRapportsViewComponent } from './views/validation-rapports-view/validation-rapports-view.component';
import { RapportsQuotidiensViewComponent } from './views/rapports-quotidiens-view/rapports-quotidiens-view.component';
import { StocksAtpeViewComponent } from './views/stocks-atpe-view/stocks-atpe-view.component';
import { ExportsDhis2ViewComponent } from './views/exports-dhis2-view/exports-dhis2-view.component';
import { ProfilViewComponent } from './views/profil-view/profil-view.component';

export const SUPERVISEUR_ROUTES: Routes = [
  {
    path: '',
    component: SuperviseurLayoutComponent,
    children: [
      { path: '', redirectTo: 'centre-commandement', pathMatch: 'full' },
      { path: 'centre-commandement', component: CommandCenterViewComponent },
      { path: 'cartographie', component: CartographieViewComponent },
      { path: 'validation-rapports', component: ValidationRapportsViewComponent },
      { path: 'rapports-quotidiens', component: RapportsQuotidiensViewComponent },
      { path: 'stocks-atpe', component: StocksAtpeViewComponent },
      { path: 'exports-dhis2', component: ExportsDhis2ViewComponent },
      { path: 'profil', component: ProfilViewComponent }
    ]
  }
];
