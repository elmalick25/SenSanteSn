import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateStructurePayload,
  StructureFilterCriteria,
  StructureSante,
  StructureStats
} from '../models/structure-sante.model';

@Injectable({
  providedIn: 'root'
})
export class StructureSanteService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/structures-sante';

  getStructures(criteria?: StructureFilterCriteria): Observable<StructureSante[]> {
    let params = new HttpParams();
    if (criteria) {
      if (criteria.region && criteria.region !== 'Toutes les Régions (14)') {
        params = params.set('region', criteria.region.split(' (')[0]);
      }
      if (criteria.district && criteria.district !== 'Tous les Districts (79)') {
        params = params.set('district', criteria.district);
      }
      if (criteria.type && criteria.type !== 'Tous les Types') {
        params = params.set('type', criteria.type);
      }
      if (criteria.statut && criteria.statut !== 'Tous Statuts') {
        params = params.set('statut', criteria.statut);
      }
      if (criteria.cren && criteria.cren !== 'Agréments CREN' && criteria.cren !== 'Tous') {
        params = params.set('cren', criteria.cren);
      }
      if (criteria.query && criteria.query.trim()) {
        params = params.set('q', criteria.query.trim());
      }
    }
    return this.http.get<StructureSante[]>(this.baseUrl, { params });
  }

  getStats(): Observable<StructureStats> {
    return this.http.get<StructureStats>(`${this.baseUrl}/stats`);
  }

  getStructureById(id: number): Observable<StructureSante> {
    return this.http.get<StructureSante>(`${this.baseUrl}/${id}`);
  }

  createStructure(payload: CreateStructurePayload): Observable<StructureSante> {
    return this.http.post<StructureSante>(this.baseUrl, payload);
  }

  updateStructure(id: number, payload: CreateStructurePayload): Observable<StructureSante> {
    return this.http.put<StructureSante>(`${this.baseUrl}/${id}`, payload);
  }

  deleteStructure(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
