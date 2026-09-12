import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationClinique, DiffusionResult } from '../models/configuration-clinique.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationCliniqueService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/admin/cliniques';

  getConfiguration(): Observable<ConfigurationClinique> {
    return this.http.get<ConfigurationClinique>(`${this.baseUrl}/config`);
  }

  updateConfiguration(config: ConfigurationClinique): Observable<ConfigurationClinique> {
    return this.http.put<ConfigurationClinique>(`${this.baseUrl}/config`, config);
  }

  diffuserDirectives(): Observable<DiffusionResult> {
    return this.http.post<DiffusionResult>(`${this.baseUrl}/diffuser`, {});
  }

  resetOmsDefaults(): Observable<ConfigurationClinique> {
    return this.http.post<ConfigurationClinique>(`${this.baseUrl}/reset-oms`, {});
  }
}
