import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CroissanceOmsData } from '../models/croissance-oms.model';

@Injectable({
  providedIn: 'root'
})
export class CroissanceOmsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/croissance';

  /**
   * Récupère l'analyse de croissance OMS réelle depuis PostgreSQL via le backend Spring Boot.
   * Éradication totale de getFallbackData() pour garantir la vérité terrain.
   */
  getAnalyseCroissance(enfantId: number): Observable<CroissanceOmsData> {
    return this.http.get<CroissanceOmsData>(`${this.baseUrl}/enfant/${enfantId}`);
  }

  exportPdf(enfantId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/enfant/${enfantId}/export-pdf`, {
      responseType: 'blob'
    });
  }
}
