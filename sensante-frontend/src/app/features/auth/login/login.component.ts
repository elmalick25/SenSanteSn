import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute, Params } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { AuthResponse } from '../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required, Validators.minLength(4)]]
  });

  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  infoMessage = signal<string | null>(null);

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  constructor() {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['expired'] === 'true') {
        this.infoMessage.set('Votre session a expiré. Veuillez vous reconnecter.');
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: AuthResponse) => {
        this.isLoading.set(false);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.errorMessage.set('Identifiants incorrects. Veuillez vérifier votre email et mot de passe.');
        } else if (err.status === 400) {
          this.errorMessage.set('Requête invalide. Veuillez vérifier les champs saisis.');
        } else if (err.status === 500 || err.status === 504 || err.status === 0) {
          this.errorMessage.set('Impossible de joindre le serveur Spring Boot (port 8082). Assurez-vous que le backend est bien démarré.');
        } else {
          this.errorMessage.set('Une erreur inattendue est survenue.');
        }
      }
    });
  }

  get email() { return this.loginForm.get('email'); }
  get motDePasse() { return this.loginForm.get('motDePasse'); }
}
