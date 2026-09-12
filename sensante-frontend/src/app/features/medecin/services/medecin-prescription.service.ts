import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PrescriptionMedicale,
  GenererOrdonnanceResponse
} from '../models/medecin-prescription.model';

@Injectable({
  providedIn: 'root'
})
export class MedecinPrescriptionService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/medecin/prescription';

  /**
   * Charge la prescription et le protocole CRENAS du patient en cours.
   */
  getPrescriptionEnCours(): Observable<PrescriptionMedicale> {
    return this.http.get<PrescriptionMedicale>(`${this.baseUrl}/en-cours`);
  }

  /**
   * Charge la prescription pour un NIP donné.
   */
  getPrescriptionParNip(nip: string): Observable<PrescriptionMedicale> {
    return this.http.get<PrescriptionMedicale>(`${this.baseUrl}/dossier/${nip}`);
  }

  /**
   * Génère et scelle numériquement l'ordonnance officielle et la fiche relais.
   */
  genererOrdonnance(nip: string): Observable<GenererOrdonnanceResponse> {
    return this.http.post<GenererOrdonnanceResponse>(`${this.baseUrl}/generer`, { nip });
  }

  /**
   * Transmet un SMS récapitulatif à la tutrice du patient.
   */
  notifierSms(nip: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.baseUrl}/notifier-sms`, { nip });
  }
}
