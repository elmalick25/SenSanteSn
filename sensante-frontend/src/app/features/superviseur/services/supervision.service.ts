import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  SupervisionCommandCenter,
  DeploiementEquipeRequest,
  DeploiementEquipeResponse
} from '../models/supervision.models';

@Injectable({
  providedIn: 'root'
})
export class SupervisionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/supervision';

  getCommandCenter(): Observable<SupervisionCommandCenter> {
    return this.http.get<SupervisionCommandCenter>(`${this.baseUrl}/command-center`);
  }

  deployerEquipe(request: DeploiementEquipeRequest): Observable<DeploiementEquipeResponse> {
    return this.http.post<DeploiementEquipeResponse>(`${this.baseUrl}/deploiement-equipe`, request);
  }

  acquitterAlerte(id: number): Observable<{ alerteId: number; statut: string }> {
    return this.http.post<{ alerteId: number; statut: string }>(`${this.baseUrl}/alertes/${id}/acquitter`, {});
  }

  exportPdf(): Observable<{ statut: string; reference: string; downloadUrl: string }> {
    return this.http.post<{ statut: string; reference: string; downloadUrl: string }>(`${this.baseUrl}/export-pdf`, {});
  }

  getMissions(statut?: string, search?: string): Observable<import('../models/supervision.models').MissionTerrain[]> {
    let url = `${this.baseUrl}/missions?`;
    if (statut && statut !== 'TOUTES') {
      url += `statut=${encodeURIComponent(statut)}&`;
    }
    if (search) {
      url += `search=${encodeURIComponent(search)}&`;
    }
    return this.http.get<import('../models/supervision.models').MissionTerrain[]>(url);
  }

  getMissionsOverview(): Observable<import('../models/supervision.models').MissionsOverview> {
    return this.http.get<import('../models/supervision.models').MissionsOverview>(`${this.baseUrl}/missions/overview`);
  }

  createMission(request: import('../models/supervision.models').CreateMissionRequest): Observable<import('../models/supervision.models').MissionTerrain> {
    return this.http.post<import('../models/supervision.models').MissionTerrain>(`${this.baseUrl}/missions`, request);
  }

  updateMissionStatut(id: number, statut: import('../models/supervision.models').StatutMissionType): Observable<import('../models/supervision.models').MissionTerrain> {
    return this.http.put<import('../models/supervision.models').MissionTerrain>(`${this.baseUrl}/missions/${id}/statut?statut=${statut}`, {});
  }

  exportMissionsDhis2(): Observable<{ statut: string; reference: string; missionsTransmises: number }> {
    return this.http.post<{ statut: string; reference: string; missionsTransmises: number }>(`${this.baseUrl}/missions/export-dhis2`, {});
  }

  // ==========================================
  // MODULE VALIDATION DES RAPPORTS
  // ==========================================

  getValidationQueue(type?: string, search?: string, tri?: string): Observable<import('../models/supervision.models').RapportValidationSummary[]> {
    let url = `${this.baseUrl}/validation/queue?`;
    if (type) url += `type=${encodeURIComponent(type)}&`;
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (tri) url += `tri=${encodeURIComponent(tri)}&`;
    return this.http.get<import('../models/supervision.models').RapportValidationSummary[]>(url);
  }

  getValidationOverview(): Observable<import('../models/supervision.models').ValidationQueueOverview> {
    return this.http.get<import('../models/supervision.models').ValidationQueueOverview>(`${this.baseUrl}/validation/overview`);
  }

  getRapportDetail(id: number): Observable<import('../models/supervision.models').RapportValidationDetail> {
    return this.http.get<import('../models/supervision.models').RapportValidationDetail>(`${this.baseUrl}/validation/${id}`);
  }

  validerRapport(id: number, payload?: import('../models/supervision.models').ValiderRapportPayload): Observable<import('../models/supervision.models').RapportValidationDetail> {
    return this.http.post<import('../models/supervision.models').RapportValidationDetail>(`${this.baseUrl}/validation/${id}/valider`, payload || {});
  }

  demanderComplement(id: number, payload: import('../models/supervision.models').DemandeComplementPayload): Observable<import('../models/supervision.models').RapportValidationDetail> {
    return this.http.post<import('../models/supervision.models').RapportValidationDetail>(`${this.baseUrl}/validation/${id}/complement`, payload);
  }

  validerLot(ids?: number[]): Observable<{ message: string; rapportsValides: number }> {
    return this.http.post<{ message: string; rapportsValides: number }>(`${this.baseUrl}/validation/valider-lot`, ids || []);
  }

  // ==========================================
  // MODULE RAPPORTS QUOTIDIENS & TÉLÉMÉTRIE
  // ==========================================

  getRapportJournalierTelemetrie(date?: string): Observable<import('../models/supervision.models').RapportJournalierTelemetrie> {
    let url = `${this.baseUrl}/rapports-quotidiens/telemetrie`;
    if (date) {
      url += `?date=${encodeURIComponent(date)}`;
    }
    return this.http.get<import('../models/supervision.models').RapportJournalierTelemetrie>(url);
  }

  cloturerJournee(date?: string, payload?: import('../models/supervision.models').ClotureJourneePayload): Observable<import('../models/supervision.models').ClotureJourneeResult> {
    let url = `${this.baseUrl}/rapports-quotidiens/cloturer`;
    if (date) {
      url += `?date=${encodeURIComponent(date)}`;
    }
    return this.http.post<import('../models/supervision.models').ClotureJourneeResult>(url, payload || {
      observations: 'Clôture validée avec conformité de promptitude.',
      signerNom: 'Dr. Mariama Diop'
    });
  }

  notifierDefaillants(date?: string): Observable<{ message: string; structuresNotifiees: number }> {
    let url = `${this.baseUrl}/rapports-quotidiens/notifier-defaillants`;
    if (date) {
      url += `?date=${encodeURIComponent(date)}`;
    }
    return this.http.post<{ message: string; structuresNotifiees: number }>(url, {});
  }

  exportTelemetrie(date?: string): Observable<Blob> {
    let url = `${this.baseUrl}/rapports-quotidiens/export`;
    if (date) {
      url += `?date=${encodeURIComponent(date)}`;
    }
    return this.http.get(url, { responseType: 'blob' });
  }

  // ==========================================
  // MODULE STOCKS ATPE & INTRANTS NUTRITIONNELS
  // ==========================================

  getStocksAtpeOverview(): Observable<import('../models/supervision.models').StocksAtpeOverview> {
    return this.http.get<import('../models/supervision.models').StocksAtpeOverview>(`${this.baseUrl}/stocks-atpe/overview`);
  }

  executerTransfertPerequation(payload: import('../models/supervision.models').TransfertPerequationPayload): Observable<import('../models/supervision.models').TransfertPerequationResult> {
    return this.http.post<import('../models/supervision.models').TransfertPerequationResult>(`${this.baseUrl}/stocks-atpe/transfert`, payload);
  }

  creerOrdreReapproPna(payload?: import('../models/supervision.models').OrdreReapproPnaPayload): Observable<import('../models/supervision.models').OrdreReapproPnaResult> {
    return this.http.post<import('../models/supervision.models').OrdreReapproPnaResult>(`${this.baseUrl}/stocks-atpe/reappro-pna`, payload || {});
  }

  exportSiglStocks(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/stocks-atpe/export-sigl`, { responseType: 'blob' });
  }

  // ==========================================
  // MODULE EXPORTS DHIS2 & REGISTRES NATIONAUX
  // ==========================================

  getDhis2StudioOverview(periode?: string): Observable<import('../models/supervision.models').Dhis2StudioOverview> {
    const params = periode ? `?periode=${periode}` : '';
    return this.http.get<import('../models/supervision.models').Dhis2StudioOverview>(`${this.baseUrl}/dhis2/overview${params}`);
  }

  teletransmettreDhis2(payload?: import('../models/supervision.models').TeletransmissionDhis2Payload): Observable<import('../models/supervision.models').TeletransmissionDhis2Result> {
    return this.http.post<import('../models/supervision.models').TeletransmissionDhis2Result>(`${this.baseUrl}/dhis2/teletransmettre`, payload || {});
  }

  exportDhis2Data(format: 'json' | 'xml' | 'csv' = 'csv', periode?: string): Observable<{ statut: string; format: string; fichier: string }> {
    const params = `format=${format}${periode ? `&periode=${periode}` : ''}`;
    return this.http.get<{ statut: string; format: string; fichier: string }>(`${this.baseUrl}/dhis2/export?${params}`);
  }

  genererBordereauPdf(uuid?: string): Observable<{ statut: string; fichier: string; pages: number }> {
    const params = uuid ? `?uuid=${uuid}` : '';
    return this.http.get<{ statut: string; fichier: string; pages: number }>(`${this.baseUrl}/dhis2/bordereau-pdf${params}`);
  }

  // ==========================================
  // VUE 7 — PROFIL SUPERVISEUR
  // ==========================================

  getSupervisorProfile(): Observable<import('../models/supervision.models').SupervisorProfile> {
    return this.http.get<import('../models/supervision.models').SupervisorProfile>(`${this.baseUrl}/profil`);
  }

  updateSupervisorProfile(payload: import('../models/supervision.models').SupervisorProfileUpdate): Observable<import('../models/supervision.models').SupervisorProfile> {
    return this.http.put<import('../models/supervision.models').SupervisorProfile>(`${this.baseUrl}/profil`, payload);
  }
}
