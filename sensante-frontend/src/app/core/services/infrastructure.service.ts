import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BackupArchive, InfrastructureOverview } from '../models/infrastructure.model';

@Injectable({
  providedIn: 'root'
})
export class InfrastructureService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/admin/infrastructure';

  getOverview(): Observable<InfrastructureOverview> {
    return this.http.get<InfrastructureOverview>(`${this.baseUrl}/overview`);
  }

  createBackup(): Observable<BackupArchive> {
    return this.http.post<BackupArchive>(`${this.baseUrl}/backups`, {});
  }

  restoreSandbox(backupId: string): Observable<{ statut: string; message: string }> {
    return this.http.post<{ statut: string; message: string }>(
      `${this.baseUrl}/backups/${backupId}/restore-sandbox`,
      {}
    );
  }

  resolveConflict(conflictId: string, choix: string): Observable<{ statut: string; message: string }> {
    return this.http.post<{ statut: string; message: string }>(
      `${this.baseUrl}/conflicts/${conflictId}/resolve?choix=${encodeURIComponent(choix)}`,
      {}
    );
  }
}
