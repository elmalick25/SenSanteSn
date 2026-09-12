import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  VacationPriseDeService,
  AppelerBoxRequest,
  AppelerBoxResponse,
  ReconfigurerVacationRequest
} from '../models/medecin-vacation.model';

@Injectable({
  providedIn: 'root'
})
export class MedecinVacationService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/medecin/vacation';

  /**
   * Charge le chronogramme opérationnel complet pour la vacation en cours.
   * Identité médecin extraite automatiquement du token JWT côté Spring Security.
   */
  getPriseDeService(): Observable<VacationPriseDeService> {
    return this.http.get<VacationPriseDeService>(`${this.baseUrl}/prise-de-service`);
  }

  /**
   * Convoque le patient du créneau au Box médical.
   * @param idCreneau Identifiant du créneau à appeler
   */
  appelerBox(idCreneau: number, motif?: string): Observable<AppelerBoxResponse> {
    const body: AppelerBoxRequest = { idCreneau, motif };
    return this.http.post<AppelerBoxResponse>(
      `${this.baseUrl}/creneaux/${idCreneau}/appeler-box`,
      body
    );
  }

  /**
   * Alloue le créneau tampon à un cas aigu entrant.
   */
  allouerCreneauUrgence(idCreneau: number): Observable<AppelerBoxResponse> {
    return this.http.post<AppelerBoxResponse>(
      `${this.baseUrl}/creneaux/${idCreneau}/allouer-urgence`,
      {}
    );
  }

  /**
   * Reconfigure la plage horaire et le nombre de créneaux.
   */
  reconfigurerVacation(req: ReconfigurerVacationRequest): Observable<VacationPriseDeService> {
    return this.http.put<VacationPriseDeService>(`${this.baseUrl}/config`, req);
  }
}
