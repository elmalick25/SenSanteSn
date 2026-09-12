import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeRdvRequestDTO, RdvPageDataDTO, RendezVousDTO } from '../models/rendez-vous.model';

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/rendez-vous';

  /**
   * Récupère la page de données réelles de rendez-vous pour un enfant donné.
   * Aucune fausse consultation ou faux enfant de secours n'est renvoyé.
   */
  getRdvPageData(enfantId: number): Observable<RdvPageDataDTO> {
    return this.http.get<RdvPageDataDTO>(`${this.baseUrl}/enfant/${enfantId}`);
  }

  /**
   * Transmet une demande de rendez-vous au backend.
   */
  demanderRendezVous(request: DemandeRdvRequestDTO): Observable<RendezVousDTO> {
    return this.http.post<RendezVousDTO>(`${this.baseUrl}/demande`, request);
  }

  exportBilanPdf(enfantId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/enfant/${enfantId}/export-bilan-pdf`, {
      responseType: 'blob'
    });
  }

  telechargerFiche(consultationId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/consultations/${consultationId}/telecharger-fiche`, {
      responseType: 'blob'
    });
  }
}
