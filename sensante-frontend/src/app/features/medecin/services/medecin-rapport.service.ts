import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  RapportClotureVacation,
  CloturerVacationRequest,
  CloturerVacationResponse
} from '../models/medecin-rapport.model';

@Injectable({
  providedIn: 'root'
})
export class MedecinRapportService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/medecin/rapport';

  /**
   * Charge le rapport de clôture de la vacation active.
   */
  getRapportCloture(): Observable<RapportClotureVacation> {
    return this.http.get<RapportClotureVacation>(`${this.baseUrl}/cloture`);
  }

  /**
   * Clôture définitivement la vacation et transmet au DHIS2 Sénégal.
   */
  cloturerVacation(request: CloturerVacationRequest): Observable<CloturerVacationResponse> {
    return this.http.post<CloturerVacationResponse>(`${this.baseUrl}/cloturer`, request);
  }

  /**
   * Télécharge l'export CSV officiel SNIS.
   */
  telechargerCsv(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export-csv`, { responseType: 'blob' });
  }
}
