import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ExamenCliniquePcime,
  ValiderExamenRequest,
  ValiderExamenResponse
} from '../models/medecin-examen.model';

@Injectable({
  providedIn: 'root'
})
export class MedecinExamenService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/medecin/examen';

  /**
   * Charge l'examen clinique et l'arbre décisionnel du patient en cours de consultation.
   */
  getExamenEnCours(): Observable<ExamenCliniquePcime> {
    return this.http.get<ExamenCliniquePcime>(`${this.baseUrl}/en-cours`);
  }

  /**
   * Charge l'examen clinique et l'arbre décisionnel d'un patient via son NIP.
   */
  getExamenParNip(nip: string): Observable<ExamenCliniquePcime> {
    return this.http.get<ExamenCliniquePcime>(`${this.baseUrl}/dossier/${nip}`);
  }

  /**
   * Valide l'arbre décisionnel et enregistre la prise en charge thérapeutique.
   */
  validerExamen(request: ValiderExamenRequest): Observable<ValiderExamenResponse> {
    return this.http.post<ValiderExamenResponse>(`${this.baseUrl}/valider`, request);
  }
}
