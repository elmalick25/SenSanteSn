import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupervisionService } from '../../services/supervision.service';
import { SupervisorProfile, SupervisorProfileUpdate, SupervisedStructure } from '../../models/supervision.models';

@Component({
  selector: 'app-profil-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil-view.component.html',
  styleUrls: ['./profil-view.component.css']
})
export class ProfilViewComponent implements OnInit {
  private readonly supervisionService = inject(SupervisionService);

  // Signaux d'état
  readonly loading = signal<boolean>(true);
  readonly saving = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly toastMessage = signal<string | null>(null);
  readonly toastType = signal<'success' | 'error'>('success');
  readonly activeTab = signal<'personal' | 'preferences' | 'security'>('personal');

  // Données du profil
  readonly profile = signal<SupervisorProfile | null>(null);

  // Formulaire réactif
  fullName = '';
  phone = '';
  birthdate = '';
  address = '';
  preferredLanguage: 'fr' | 'wo' = 'fr';

  // Préférences (Onglet 2)
  smsAlertsMas = signal<boolean>(true);
  emailDigestHebdo = signal<boolean>(true);
  autoSyncDhis2 = signal<boolean>(true);
  notificationStockRupture = signal<boolean>(true);

  // Sécurité (Onglet 3)
  certificatSha256 = 'SHA256:4a89f...018e';
  cleFido2Active = true;
  doubleAuthTotp = true;

  ngOnInit(): void {
    this.chargerProfil();
  }

  chargerProfil(): void {
    this.loading.set(true);
    this.error.set(null);

    this.supervisionService.getSupervisorProfile().subscribe({
      next: (data: SupervisorProfile) => {
        this.profile.set(data);
        this.fullName = data.fullName;
        this.phone = data.phone;
        this.birthdate = data.birthdate;
        this.address = data.address;
        this.preferredLanguage = (data.preferredLanguage === 'wo') ? 'wo' : 'fr';
        this.loading.set(false);
      },
      error: (err: unknown) => {
        console.error('[ProfilView] Erreur de chargement du profil :', err);
        this.error.set('Impossible de charger le profil superviseur. Veuillez vérifier la connexion au serveur.');
        this.loading.set(false);
      }
    });
  }

  enregistrerModifications(): void {
    if (this.saving()) return;

    if (!this.fullName || !this.phone) {
      this.afficherToast('Le nom complet et le numéro de téléphone sont obligatoires.', 'error');
      return;
    }

    this.saving.set(true);

    const payload: SupervisorProfileUpdate = {
      fullName: this.fullName.trim(),
      phone: this.phone.trim(),
      birthdate: this.birthdate?.trim(),
      address: this.address?.trim(),
      preferredLanguage: this.preferredLanguage,
      avatarUrl: this.profile()?.avatarUrl
    };

    this.supervisionService.updateSupervisorProfile(payload).subscribe({
      next: (updated: SupervisorProfile) => {
        this.profile.set(updated);
        this.saving.set(false);
        this.afficherToast('Modifications enregistrées avec succès ! Transmission MSAS effectuée.', 'success');
      },
      error: (err: unknown) => {
        console.error('[ProfilView] Erreur lors de la sauvegarde :', err);
        this.saving.set(false);
        this.afficherToast('Échec de l\'enregistrement des modifications.', 'error');
      }
    });
  }

  annulerModifications(): void {
    const current = this.profile();
    if (current) {
      this.fullName = current.fullName;
      this.phone = current.phone;
      this.birthdate = current.birthdate;
      this.address = current.address;
      this.preferredLanguage = current.preferredLanguage;
      this.afficherToast('Modifications annulées.', 'success');
    }
  }

  selectTab(tab: 'personal' | 'preferences' | 'security'): void {
    this.activeTab.set(tab);
  }

  setLanguage(lang: 'fr' | 'wo'): void {
    this.preferredLanguage = lang;
  }

  afficherToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 4000);
  }

  dismissToast(): void {
    this.toastMessage.set(null);
  }

  trackByStructureCode(_index: number, struct: SupervisedStructure): string {
    return struct.code;
  }
}
