import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, UserSession } from '../models/auth.model';
import { Role } from '../models/role.enum';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);

  private readonly API_URL = '/api/auth';

  readonly currentUser = signal<UserSession | null>(this.storage.getUser());
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly currentRole = computed(() => this.currentUser()?.role ?? null);

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response: AuthResponse) => {
        const session: UserSession = {
          idUser: response.idUser,
          nom: response.nom,
          prenom: response.prenom,
          email: response.email,
          role: response.role,
          token: response.token
        };
        this.storage.saveToken(response.token);
        this.storage.saveUser(session);
        this.currentUser.set(session);
      })
    );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, payload).pipe(
      tap((response: AuthResponse) => {
        const session: UserSession = {
          idUser: response.idUser,
          nom: response.nom,
          prenom: response.prenom,
          email: response.email,
          role: response.role,
          token: response.token
        };
        this.storage.saveToken(response.token);
        this.storage.saveUser(session);
        this.currentUser.set(session);
      })
    );
  }

  logout(): void {
    this.storage.clear();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  hasRole(roles: Role | Role[]): boolean {
    const user = this.currentUser();
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  }
}
