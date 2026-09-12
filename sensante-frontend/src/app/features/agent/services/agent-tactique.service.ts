import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AgentTactiqueOverview,
  ActionTactiqueRequest,
  ActionTactiqueResponse,
  FicheExpress,
  ScanRecent,
  NouveauBilanRequest,
  NouveauTriageRequest,
  DelivranceAtpeRequest,
  PatientTriage,
  MatriceTriage,
  TicketAdmission,
  AssignationSlotRequest,
  ConcessionZone,
  ZoneCarteOverview,
  ReleveTerrainRequest,
  ClotureRegistreOverview,
  TransmissionDistrictRequest,
  AgentProfil,
  UpdateAgentProfilRequest
} from '../models/agent-tactique.model';

@Injectable({
  providedIn: 'root'
})
export class AgentTactiqueService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/agent/tactique';

  getOverview(
    filtreStatut?: string,
    secteur?: string,
    trancheAge?: string,
    query?: string
  ): Observable<AgentTactiqueOverview> {
    let params = new HttpParams();
    if (filtreStatut && filtreStatut !== 'TOUS') {
      params = params.set('filtreStatut', filtreStatut);
    }
    if (secteur && !secteur.includes('Tous les secteurs')) {
      params = params.set('secteur', secteur);
    }
    if (trancheAge && !trancheAge.includes('0 - 59 mois')) {
      params = params.set('trancheAge', trancheAge);
    }
    if (query && query.trim().length > 0) {
      params = params.set('query', query.trim());
    }

    return this.http.get<AgentTactiqueOverview>(`${this.baseUrl}/overview`, { params });
  }

  enregistrerNouveauTriage(req: NouveauTriageRequest): Observable<ActionTactiqueResponse> {
    return this.http.post<ActionTactiqueResponse>(`${this.baseUrl}/nouveau-triage`, req);
  }

  acquitterAlerte(idAlerte: number): Observable<ActionTactiqueResponse> {
    return this.http.post<ActionTactiqueResponse>(`${this.baseUrl}/alertes/${idAlerte}/acquitter`, {});
  }

  refererSamu(idEnfant: number, motif?: string): Observable<ActionTactiqueResponse> {
    const payload: ActionTactiqueRequest = {
      idEnfant,
      typeAction: 'REFERER_SAMU',
      motif: motif || 'Urgence MAS sévère sous seuil 115mm'
    };
    return this.http.post<ActionTactiqueResponse>(`${this.baseUrl}/enfants/${idEnfant}/refer-samu`, payload);
  }

  dispenserAtpe(idEnfant: number, nombreRations: number = 14): Observable<ActionTactiqueResponse> {
    const payload: ActionTactiqueRequest = {
      idEnfant,
      typeAction: 'DISPENSER_ATPE',
      nombreRations
    };
    return this.http.post<ActionTactiqueResponse>(`${this.baseUrl}/enfants/${idEnfant}/dispenser-atpe`, payload);
  }

  planifierVisite(idEnfant: number, dateVisite?: string, notes?: string): Observable<ActionTactiqueResponse> {
    const payload: ActionTactiqueRequest = {
      idEnfant,
      typeAction: 'PLANIFIER_VISITE',
      dateVisite: dateVisite || 'Demain 10h00',
      notes: notes || 'Visite domiciliaire de suivi'
    };
    return this.http.post<ActionTactiqueResponse>(`${this.baseUrl}/enfants/${idEnfant}/planifier-visite`, payload);
  }

  synchroniser(): Observable<ActionTactiqueResponse> {
    return this.http.post<ActionTactiqueResponse>(`${this.baseUrl}/sync`, {});
  }

  // Scanner QR & Fiche Express
  getFicheExpress(matricule: string): Observable<FicheExpress> {
    return this.http.get<FicheExpress>(`${this.baseUrl}/scanner/fiche/${encodeURIComponent(matricule)}`);
  }

  getScansRecents(): Observable<ScanRecent[]> {
    return this.http.get<ScanRecent[]>(`${this.baseUrl}/scanner/recents`);
  }

  enregistrerNouveauBilan(req: NouveauBilanRequest): Observable<ActionTactiqueResponse> {
    return this.http.post<ActionTactiqueResponse>(`${this.baseUrl}/scanner/bilan`, req);
  }

  delivrerAtpeExpress(req: DelivranceAtpeRequest): Observable<ActionTactiqueResponse> {
    return this.http.post<ActionTactiqueResponse>(`${this.baseUrl}/scanner/atpe`, req);
  }

  declencherAlerteSamu(matricule: string, motif?: string): Observable<ActionTactiqueResponse> {
    let params = new HttpParams().set('matricule', matricule);
    if (motif) {
      params = params.set('motif', motif);
    }
    return this.http.post<ActionTactiqueResponse>(`${this.baseUrl}/scanner/alerte-samu`, {}, { params });
  }

  // ==========================================
  // MODULE TRIAGE RDV & MATRICE MULTI-BOX
  // ==========================================

  getFileAttenteClinique(filtre?: string): Observable<PatientTriage[]> {
    let params = new HttpParams();
    if (filtre) {
      params = params.set('filtre', filtre);
    }
    return this.http.get<PatientTriage[]>(`${this.baseUrl}/triage/file`, { params });
  }

  getMatriceAttribution(date?: string): Observable<MatriceTriage> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', date);
    }
    return this.http.get<MatriceTriage>(`${this.baseUrl}/triage/matrice`, { params });
  }

  getTicketAdmission(patientId: number): Observable<TicketAdmission> {
    return this.http.get<TicketAdmission>(`${this.baseUrl}/triage/ticket/${patientId}`);
  }

  assignerSlotPatient(req: AssignationSlotRequest): Observable<ActionTactiqueResponse> {
    return this.http.post<ActionTactiqueResponse>(`${this.baseUrl}/triage/assigner`, req);
  }

  // ==========================================
  // MODULE CARTE DES ZONES & RADAR CONCESSIONS
  // ==========================================

  getZoneCarteOverview(secteur?: string): Observable<ZoneCarteOverview> {
    let params = new HttpParams();
    if (secteur) {
      params = params.set('secteur', secteur);
    }
    return this.http.get<ZoneCarteOverview>(`${this.baseUrl}/carte/overview`, { params });
  }

  getConcessionDetails(id: string): Observable<ConcessionZone> {
    return this.http.get<ConcessionZone>(`${this.baseUrl}/carte/concessions/${encodeURIComponent(id)}`);
  }

  enregistrerReleveTerrain(req: ReleveTerrainRequest): Observable<ActionTactiqueResponse> {
    return this.http.post<ActionTactiqueResponse>(`${this.baseUrl}/carte/releve`, req);
  }

  // ==========================================
  // MODULE CLÔTURE DU JOUR & TRANSMISSION DISTRICT
  // ==========================================

  getClotureRegistreOverview(date?: string): Observable<ClotureRegistreOverview> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', date);
    }
    return this.http.get<ClotureRegistreOverview>(`${this.baseUrl}/cloture/overview`, { params });
  }

  transmettreClotureDistrict(req: TransmissionDistrictRequest): Observable<ActionTactiqueResponse> {
    return this.http.post<ActionTactiqueResponse>(`${this.baseUrl}/cloture/transmettre`, req);
  }

  genererBordereauPdf(date?: string): Observable<ActionTactiqueResponse> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', date);
    }
    return this.http.post<ActionTactiqueResponse>(`${this.baseUrl}/cloture/generer-pdf`, {}, { params });
  }

  // ==========================================
  // MODULE MON PROFIL & RÉGLAGES AGENT
  // ==========================================

  getAgentProfil(): Observable<AgentProfil> {
    return this.http.get<AgentProfil>(`${this.baseUrl}/profil`);
  }

  updateAgentProfil(req: UpdateAgentProfilRequest): Observable<ActionTactiqueResponse> {
    return this.http.put<ActionTactiqueResponse>(`${this.baseUrl}/profil`, req);
  }
}

