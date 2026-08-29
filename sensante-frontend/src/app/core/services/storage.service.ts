import { Injectable } from '@angular/core';
import { UserSession } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly TOKEN_KEY = 'sensante_token';
  private readonly USER_KEY = 'sensante_user';

  saveToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  saveUser(user: UserSession): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  getUser(): UserSession | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userJson = localStorage.getItem(this.USER_KEY);
      if (userJson) {
        try {
          return JSON.parse(userJson) as UserSession;
        } catch {
          this.clear();
          return null;
        }
      }
    }
    return null;
  }

  clear(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
