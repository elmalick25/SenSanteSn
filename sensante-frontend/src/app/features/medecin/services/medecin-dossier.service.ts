import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DossierPatient360 } from '../models/medecin-dossier.model';

@Injectable({
  providedIn: 'root'
})
export class MedecinDossierService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/medecin/dossier';

  /**
   * Charge le dossier médical complet 360° du patient spécifié.
   */
  getDossier360(idPatient: number): Observable<DossierPatient360> {
    return this.http.get<DossierPatient360>(`${this.baseUrl}/${idPatient}`);
  }

  /**
   * Charge le dossier 360° du patient actif par défaut (Moussa Diop).
   */
  getDossierActif(): Observable<DossierPatient360> {
    return this.http.get<DossierPatient360>(`${this.baseUrl}/actif`);
  }
}
