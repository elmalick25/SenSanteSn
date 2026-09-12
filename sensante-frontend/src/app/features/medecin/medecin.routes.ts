import { Routes } from '@angular/router';
import { MedecinLayoutComponent } from './medecin-layout.component';
import { PriseDeServiceViewComponent } from './views/prise-de-service/prise-de-service-view.component';
import { FileAttenteViewComponent } from './views/file-attente/file-attente-view.component';
import { DossierPatientViewComponent } from './views/dossier-patient/dossier-patient-view.component';
import { ExamenCliniqueViewComponent } from './views/examen-clinique/examen-clinique-view.component';
import { PrescriptionViewComponent } from './views/prescription/prescription-view.component';
import { RapportJourViewComponent } from './views/rapport-jour/rapport-jour-view.component';
import { ProfilMedecinViewComponent } from './views/profil-medecin/profil-medecin-view.component';

export const MEDECIN_ROUTES: Routes = [
  {
    path: '',
    component: MedecinLayoutComponent,
    children: [
      { path: '', redirectTo: 'prise-de-service', pathMatch: 'full' },
      { path: 'prise-de-service', component: PriseDeServiceViewComponent },
      { path: 'file-attente',     component: FileAttenteViewComponent },
      { path: 'dossier',          component: DossierPatientViewComponent },
      { path: 'examen',           component: ExamenCliniqueViewComponent },
      { path: 'prescription',     component: PrescriptionViewComponent },
      { path: 'rapport',          component: RapportJourViewComponent },
      { path: 'profil',           component: ProfilMedecinViewComponent },
    ]
  }
];
