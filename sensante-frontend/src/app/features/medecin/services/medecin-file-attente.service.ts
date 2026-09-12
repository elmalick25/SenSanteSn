import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  FileAttenteVuePupitre,
  DossierAccueil,
  FaireEntrerRequest,
  FaireEntrerResponse
} from '../models/medecin-file-attente.model';

@Injectable({
  providedIn: 'root'
})
export class MedecinFileAttenteService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/medecin/file-attente';

  /**
   * Charge la vue pupitre complète : KPIs, consultation en cours, listes et dossier actif.
   * L'identité du médecin est résolue via le token JWT côté Spring Security.
   */
  getVuePupitre(): Observable<FileAttenteVuePupitre> {
    return this.http.get<FileAttenteVuePupitre>(`${this.baseUrl}/vue-pupitre`);
  }

  /**
   * Charge le dossier d'accueil et la double-identité d'un patient sélectionné.
   */
  getDossierAccueil(idPatient: number): Observable<DossierAccueil> {
    return this.http.get<DossierAccueil>(`${this.baseUrl}/dossier/${idPatient}`);
  }

  /**
   * Fait entrer le patient dans le Cabinet 04 (Lance la consultation pédiatrique).
   */
  faireEntrer(idPatient: number, cabinet = 'Cabinet 04'): Observable<FaireEntrerResponse> {
    const body: FaireEntrerRequest = { idPatient, cabinet };
    return this.http.post<FaireEntrerResponse>(`${this.baseUrl}/faire-entrer`, body);
  }

  /**
   * Priorise d'urgence un cas MAS et déclenche l'appel d'entrée immédiat.
   */
  prioriserEtAppeler(idPatient: number): Observable<FaireEntrerResponse> {
    return this.http.post<FaireEntrerResponse>(`${this.baseUrl}/prioriser/${idPatient}`, {});
  }

  /**
   * Clôture la consultation courante pour libérer le cabinet médical.
   */
  cloturerConsultation(): Observable<FaireEntrerResponse> {
    return this.http.post<FaireEntrerResponse>(`${this.baseUrl}/cloturer`, {});
  }
}
