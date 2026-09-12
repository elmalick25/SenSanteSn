import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AuditStats,
  GeneratedReportResult,
  LegalAuditLog,
  MacroFlowPoint,
  RegionalCompliance
} from '../models/audit.model';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/admin/audit';

  getStats(): Observable<AuditStats> {
    return this.http.get<AuditStats>(`${this.baseUrl}/stats`);
  }

  getRegionalCompliance(): Observable<RegionalCompliance[]> {
    return this.http.get<RegionalCompliance[]>(`${this.baseUrl}/regional`);
  }

  getMacroFlow(): Observable<MacroFlowPoint[]> {
    return this.http.get<MacroFlowPoint[]>(`${this.baseUrl}/macro-flow`);
  }

  getLegalRegister(): Observable<LegalAuditLog[]> {
    return this.http.get<LegalAuditLog[]>(`${this.baseUrl}/legal-register`);
  }

  generateOfficialReport(): Observable<GeneratedReportResult> {
    return this.http.post<GeneratedReportResult>(`${this.baseUrl}/generate-report`, {});
  }
}
