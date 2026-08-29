import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Role } from '../models/role.enum';
import { AuthResponse } from '../models/auth.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let storageService: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        StorageService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    storageService = TestBed.inject(StorageService);
    storageService.clear();
  });

  afterEach(() => {
    httpMock.verify();
    storageService.clear();
  });

  it('devrait être instancié avec un utilisateur non connecté par défaut', () => {
    expect(service).toBeTruthy();
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.currentUser()).toBeNull();
  });

  it('devrait authentifier un utilisateur et mettre à jour le signal et le stockage', () => {
    const mockResponse: AuthResponse = {
      token: 'jwt-dummy-token-12345',
      type: 'Bearer',
      idUser: 1,
      nom: 'Diallo',
      prenom: 'Malick',
      email: 'ass@malick.com',
      role: Role.MEDECIN
    };

    service.login({ email: 'ass@malick.com', motDePasse: 'monpwd' }).subscribe((res: AuthResponse) => {
      expect(res.token).toBe('jwt-dummy-token-12345');
      expect(service.isAuthenticated()).toBeTrue();
      expect(service.currentRole()).toBe(Role.MEDECIN);
      expect(storageService.getToken()).toBe('jwt-dummy-token-12345');
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('devrait vérifier correctement les rôles autorisés via hasRole', () => {
    const mockUser = {
      idUser: 1,
      nom: 'Diallo',
      prenom: 'Malick',
      email: 'ass@malick.com',
      role: Role.MEDECIN,
      token: 'token-xyz'
    };

    service.currentUser.set(mockUser);

    expect(service.hasRole(Role.MEDECIN)).toBeTrue();
    expect(service.hasRole(Role.AGENT_SANTE)).toBeFalse();
    expect(service.hasRole([Role.AGENT_SANTE, Role.MEDECIN])).toBeTrue();
    expect(service.hasRole([Role.AGENT_SANTE, Role.SUPERVISEUR])).toBeFalse();
  });

  it('devrait effacer la session lors du logout', () => {
    storageService.saveToken('dummy-token');
    service.logout();

    expect(service.isAuthenticated()).toBeFalse();
    expect(service.currentUser()).toBeNull();
    expect(storageService.getToken()).toBeNull();
  });
});
