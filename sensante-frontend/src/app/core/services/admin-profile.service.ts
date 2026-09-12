import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminProfile, AdminProfileUpdate, AdminReportResponse } from '../models/admin-profile.model';

@Injectable({
  providedIn: 'root'
})
export class AdminProfileService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/admin/profil';

  getProfile(): Observable<AdminProfile> {
    return this.http.get<AdminProfile>(this.baseUrl);
  }

  updateProfile(dto: AdminProfileUpdate): Observable<AdminProfile> {
    return this.http.put<AdminProfile>(this.baseUrl, dto);
  }

  exportReport(): Observable<AdminReportResponse> {
    return this.http.post<AdminReportResponse>(`${this.baseUrl}/export-rapport`, {});
  }
}
