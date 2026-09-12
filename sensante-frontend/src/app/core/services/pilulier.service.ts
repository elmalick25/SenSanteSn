import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PilulierPageDataDTO, ValiderPriseResponseDTO } from '../models/pilulier.model';

@Injectable({
  providedIn: 'root'
})
export class PilulierService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/pilulier';

  /**
   * Récupère les données réelles du pilulier et du traitement d'un enfant depuis l'API.
   * Aucune donnée de démonstration n'est injectée.
   */
  getPilulierData(enfantId: number): Observable<PilulierPageDataDTO> {
    return this.http.get<PilulierPageDataDTO>(`${this.baseUrl}/enfant/${enfantId}`);
  }

  /**
   * Valide la prise d'une dose via le backend avec contrôle de propriété strict.
   */
  validerPrise(priseId: number): Observable<ValiderPriseResponseDTO> {
    return this.http.post<ValiderPriseResponseDTO>(`${this.baseUrl}/valider-prise/${priseId}`, {});
  }

  exportFichePdf(enfantId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/enfant/${enfantId}/export-fiche-pdf`, {
      responseType: 'blob'
    });
  }
}
