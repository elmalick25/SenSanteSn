import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedecinProfil, UpdateMedecinProfilRequest, UpdateMedecinProfilResponse } from '../models/medecin-profil.model';

@Injectable({
  providedIn: 'root'
})
export class MedecinProfilService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8082/api/medecin/profil';

  getProfil(): Observable<MedecinProfil> {
    return this.http.get<MedecinProfil>(this.apiUrl);
  }

  updateProfil(request: UpdateMedecinProfilRequest): Observable<UpdateMedecinProfilResponse> {
    return this.http.put<UpdateMedecinProfilResponse>(this.apiUrl, request);
  }
}
