import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait être créé avec un formulaire invalide par défaut', () => {
    expect(component).toBeTruthy();
    expect(component.loginForm.valid).toBeFalse();
  });

  it('devrait valider le formulaire avec un email valide et un mot de passe suffisant', () => {
    component.loginForm.controls['email'].setValue('ass@malick.com');
    component.loginForm.controls['motDePasse'].setValue('monpwd');

    expect(component.loginForm.valid).toBeTrue();
  });

  it('devrait rejeter un format d email invalide', () => {
    component.loginForm.controls['email'].setValue('email-invalide');
    component.loginForm.controls['motDePasse'].setValue('monpwd');

    expect(component.loginForm.valid).toBeFalse();
    expect(component.loginForm.controls['email'].errors?.['email']).toBeTrue();
  });
});
