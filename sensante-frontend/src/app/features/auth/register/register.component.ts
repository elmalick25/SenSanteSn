import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/role.enum';

interface RoleConfig {
  value: Role;
  label: string;
  icon: string;
  description: string;
  color: string;
  colorLight: string;
  colorClass: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentStep = signal<1 | 2 | 3>(1);
  readonly selectedRole = signal<Role | null>(null);
  readonly infoRole = signal<RoleConfig | null>(null);
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly roleConfigs: RoleConfig[] = [
    {
      value: Role.AGENT_SANTE,
      label: 'Agent de Santé',
      icon: 'fa-user-nurse',
      description: 'Suivi nutritionnel, bilans anthropométriques et signalement des cas de malnutrition en zones rurales.',
      color: '#0d9488',
      colorLight: '#f0fdfa',
      colorClass: 'role-teal'
    },
    {
      value: Role.MEDECIN,
      label: 'Médecin Spécialiste',
      icon: 'fa-user-doctor',
      description: 'Supervision médicale des cas détectés, validation des protocoles nutritionnels et rapports cliniques.',
      color: '#3b82f6',
      colorLight: '#eff6ff',
      colorClass: 'role-blue'
    },
    {
      value: Role.SUPERVISEUR,
      label: 'Superviseur Régional',
      icon: 'fa-user-shield',
      description: 'Analyse des indicateurs régionaux, coordination des équipes terrain et génération de rapports.',
      color: '#8b5cf6',
      colorLight: '#f5f3ff',
      colorClass: 'role-purple'
    },
    {
      value: Role.PARENT,
      label: 'Parent / Tuteur',
      icon: 'fa-heart',
      description: 'Consultation du suivi nutritionnel et du développement de santé de vos enfants enregistrés.',
      color: '#f59e0b',
      colorLight: '#fffbeb',
      colorClass: 'role-amber'
    }
  ];

  readonly selectedRoleConfig = computed(() => {
    const role = this.selectedRole();
    return role ? (this.roleConfigs.find(r => r.value === role) ?? null) : null;
  });

  registerForm: FormGroup = this.fb.group(
    {
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.pattern('^[0-9+ ]{8,15}$')]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      confirmMotDePasse: ['', [Validators.required]]
    },
    { validators: this.passwordMatchValidator() }
  );

  get passwordStrengthScore(): number {
    const pw: string = this.registerForm.get('motDePasse')?.value ?? '';
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return Math.min(score, 4);
  }

  get passwordStrengthLabel(): string {
    return (['', 'Très faible', 'Faible', 'Moyen', 'Fort'])[this.passwordStrengthScore] ?? '';
  }

  get passwordsDoNotMatch(): boolean {
    return !!(
      this.registerForm.errors?.['passwordMismatch'] &&
      this.registerForm.get('confirmMotDePasse')?.touched
    );
  }

  get prenom() { return this.registerForm.get('prenom'); }
  get nom() { return this.registerForm.get('nom'); }
  get email() { return this.registerForm.get('email'); }
  get telephone() { return this.registerForm.get('telephone'); }
  get motDePasse() { return this.registerForm.get('motDePasse'); }
  get confirmMotDePasse() { return this.registerForm.get('confirmMotDePasse'); }

  private passwordMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const pw = group.get('motDePasse')?.value;
      const confirm = group.get('confirmMotDePasse')?.value;
      return pw && confirm && pw !== confirm ? { passwordMismatch: true } : null;
    };
  }

  selectRole(rc: RoleConfig): void {
    if (rc.value === Role.PARENT) {
      this.selectedRole.set(rc.value);
      this.currentStep.set(2);
    } else {
      this.infoRole.set(rc);
    }
  }

  backToRoleSelection(): void {
    this.infoRole.set(null);
  }

  nextStep(): void {
    if (this.currentStep() !== 2) return;
    ['prenom', 'nom', 'email', 'telephone'].forEach(name =>
      this.registerForm.get(name)?.markAsTouched()
    );
    const step2Valid = ['prenom', 'nom', 'email'].every(
      name => this.registerForm.get(name)?.valid
    );
    if (step2Valid) {
      this.currentStep.set(3);
    }
  }

  prevStep(): void {
    const step = this.currentStep();
    if (step === 2) this.currentStep.set(1);
    else if (step === 3) this.currentStep.set(2);
  }

  onSubmit(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid || !this.selectedRole()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { confirmMotDePasse, ...formValue } = this.registerForm.value;
    const payload = { ...formValue, role: this.selectedRole() };

    this.authService.register(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        if (err.error?.message?.toLowerCase().includes('email')) {
          this.errorMessage.set('Cette adresse email est déjà enregistrée.');
        } else if (err.status === 400 && err.error?.message) {
          this.errorMessage.set(err.error.message);
        } else {
          this.errorMessage.set("Une erreur est survenue lors de l'inscription.");
        }
      }
    });
  }
}
