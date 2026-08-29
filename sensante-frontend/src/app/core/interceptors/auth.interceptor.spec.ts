import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { StorageService } from '../services/storage.service';
import { provideRouter } from '@angular/router';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let storageService: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StorageService,
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    storageService = TestBed.inject(StorageService);
    storageService.clear();
  });

  afterEach(() => {
    httpMock.verify();
    storageService.clear();
  });

  it("devrait injecter l'en-tête Authorization Bearer lorsque le token existe", () => {
    storageService.saveToken('jwt-sample-token-999');

    httpClient.get('/api/enfants').subscribe();

    const req = httpMock.expectOne('/api/enfants');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-sample-token-999');
    req.flush([]);
  });

  it("ne devrait pas injecter d'en-tête Authorization pour les requêtes publiques de login", () => {
    storageService.saveToken('jwt-sample-token-999');

    httpClient.post('/api/auth/login', {}).subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });
});
