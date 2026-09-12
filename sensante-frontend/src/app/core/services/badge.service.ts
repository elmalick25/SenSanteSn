import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Badge,
  BadgeStats,
  CreateBadgePayload,
  PageBadgesResponse,
  StatutCompte
} from '../models/badge.model';

export interface BadgeFilterCriteria {
  role?: string;
  region?: string;
  statut?: string;
  tri?: string;
  search?: string;
  page?: number;
  size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BadgeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/admin/badges';

  getBadges(criteria?: BadgeFilterCriteria): Observable<PageBadgesResponse> {
    let params = new HttpParams();
    if (criteria) {
      if (criteria.role && criteria.role !== 'Tous les rôles cliniques & administratifs' && criteria.role !== 'TOUS') {
        params = params.set('role', criteria.role);
      }
      if (criteria.region && !criteria.region.startsWith('Toutes Régions') && criteria.region !== 'TOUTES') {
        const cleanRegion = criteria.region.split(' (')[0];
        params = params.set('region', cleanRegion);
      }
      if (criteria.statut && criteria.statut !== 'Tous') {
        if (criteria.statut === 'Statut : Actifs uniquement' || criteria.statut === 'ACTIF') {
          params = params.set('statut', 'ACTIF');
        } else if (criteria.statut === 'Suspendus' || criteria.statut === 'SUSPENDU') {
          params = params.set('statut', 'SUSPENDU');
        } else if (criteria.statut === 'En attente' || criteria.statut === 'EN_ATTENTE') {
          params = params.set('statut', 'EN_ATTENTE');
        }
      }
      if (criteria.search && criteria.search.trim()) {
        params = params.set('search', criteria.search.trim());
      }
      if (criteria.tri) {
        if (criteria.tri.includes('Structure')) {
          params = params.set('sort', 'structure');
        } else if (criteria.tri.includes('activité')) {
          params = params.set('sort', 'derniereActivite').set('dir', 'desc');
        } else {
          params = params.set('sort', 'nom').set('dir', 'asc');
        }
      }
      if (criteria.page !== undefined) {
        params = params.set('page', criteria.page.toString());
      }
      if (criteria.size !== undefined) {
        params = params.set('size', criteria.size.toString());
      }
    }
    return this.http.get<PageBadgesResponse>(this.baseUrl, { params });
  }

  getStats(): Observable<BadgeStats> {
    return this.http.get<BadgeStats>(`${this.baseUrl}/stats`);
  }

  createBadge(payload: CreateBadgePayload): Observable<Badge> {
    return this.http.post<Badge>(this.baseUrl, payload);
  }

  updateStatut(id: number, statut: StatutCompte, motif?: string): Observable<Badge> {
    let params = new HttpParams().set('statut', statut);
    if (motif) {
      params = params.set('motif', motif);
    }
    return this.http.put<Badge>(`${this.baseUrl}/${id}/statut`, null, { params });
  }

  resetMfa(id: number): Observable<Badge> {
    return this.http.post<Badge>(`${this.baseUrl}/${id}/reset-mfa`, null);
  }
}
