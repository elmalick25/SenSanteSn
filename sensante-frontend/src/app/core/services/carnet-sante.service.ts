import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarnetSanteData } from '../models/carnet-sante.model';

@Injectable({
  providedIn: 'root'
})
export class CarnetSanteService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/carnet-sante';

  /**
   * Charge le carnet de santé réel d'un enfant depuis l'API sécurisée.
   * Aucune donnée de démonstration n'est injectée en cas d'erreur.
   */
  getCarnetSante(enfantId: number): Observable<CarnetSanteData> {
    return this.http.get<CarnetSanteData>(`${this.baseUrl}/enfant/${enfantId}`);
  }

  exportPdf(enfantId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/enfant/${enfantId}/export-pdf`, {
      responseType: 'blob'
    });
  }

  telechargerDocument(docId: string, enfantId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/documents/${docId}/telecharger?enfantId=${enfantId}`, {
      responseType: 'blob'
    });
  }
}
