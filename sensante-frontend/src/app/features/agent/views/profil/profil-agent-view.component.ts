import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentTactiqueService } from '../../services/agent-tactique.service';
import { AgentProfil, UpdateAgentProfilRequest, ActionTactiqueResponse } from '../../models/agent-tactique.model';

@Component({
  selector: 'app-profil-agent-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil-agent-view.component.html'
})
export class ProfilAgentViewComponent implements OnInit {
  private readonly agentService = inject(AgentTactiqueService);

  // ── État du composant ────────────────────────────────────────────
  readonly loading = signal<boolean>(true);
  readonly saving = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successToast = signal<string | null>(null);

  // ── Données du profil (en lecture depuis l'API) ──────────────────
  readonly profil = signal<AgentProfil | null>(null);

  // ── Onglets ──────────────────────────────────────────────────────
  readonly activeTab = signal<'infos' | 'preferences' | 'securite'>('infos');

  // ── Champs du formulaire (propriétés mutables pour [(ngModel)]) ──
  formNomComplet   = '';
  formTelephone    = '';
  formDateNaissance= '';
  formResidence    = '';
  formStructureSante    = '';
  formZonesIntervention = '';
  formLangueService     = 'FR';

  // ── Onglet Préférences ───────────────────────────────────────────
  prefSyncAuto     = true;
  prefBipScanner   = true;
  prefRayonGps     = '250';
  prefLangueAudio  = 'WO';

  // ── Onglet Sécurité ──────────────────────────────────────────────
  formAncienMdp    = '';
  formNouveauMdp   = '';
  formConfirmerMdp = '';
  formPinRapide    = '4280';
  securiteSuccess  = signal<string | null>(null);
  securiteError    = signal<string | null>(null);

  // ── Date affichée dans le header ─────────────────────────────────
  readonly today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
  });

  ngOnInit(): void {
    this.loadProfil();
  }

  loadProfil(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.agentService.getAgentProfil().subscribe({
      next: (data: AgentProfil) => {
        this.profil.set(data);
        // Hydrater les champs du formulaire depuis l'API
        this.formNomComplet        = data.nomComplet;
        this.formTelephone         = data.telephone;
        this.formDateNaissance     = data.dateNaissance ?? '';
        this.formResidence         = data.residence ?? '';
        this.formStructureSante    = data.structureSante ?? '';
        this.formZonesIntervention = data.zonesIntervention ?? '';
        this.formLangueService     = data.langueService ?? 'FR';
        this.loading.set(false);
      },
      error: (err: unknown) => {
        console.error('[ProfilAgent] Erreur chargement profil :', err);
        this.errorMessage.set(
          'Impossible de charger les données du profil agent. Vérifiez la connexion avec le serveur.'
        );
        this.loading.set(false);
      }
    });
  }

  saveProfil(): void {
    if (!this.profil()) return;

    this.saving.set(true);
    this.errorMessage.set(null);

    const req: UpdateAgentProfilRequest = {
      nomComplet:        this.formNomComplet,
      telephone:         this.formTelephone,
      dateNaissance:     this.formDateNaissance,
      residence:         this.formResidence,
      structureSante:    this.formStructureSante,
      zonesIntervention: this.formZonesIntervention,
      langueService:     this.formLangueService
    };

    this.agentService.updateAgentProfil(req).subscribe({
      next: (res: ActionTactiqueResponse) => {
        this.saving.set(false);
        // Mise à jour locale du signal : cast explicite de langueService pour satisfaire 'FR' | 'WO'
        this.profil.update(p => p ? {
          ...p,
          ...req,
          langueService: (req.langueService ?? p.langueService) as 'FR' | 'WO'
        } : null);
        this.showToast(res.message ?? 'Profil agent mis à jour avec succès.');
      },
      error: (err: unknown) => {
        console.error('[ProfilAgent] Erreur mise à jour profil :', err);
        this.saving.set(false);
        this.errorMessage.set("Échec de l'enregistrement. Veuillez réessayer.");
      }
    });
  }

  setLangue(lang: string): void {
    this.formLangueService = lang;
  }

  selectTab(tab: 'infos' | 'preferences' | 'securite'): void {
    this.activeTab.set(tab);
  }

  sauvegarderPreferences(): void {
    localStorage.setItem('sensante_agent_pref_sync', String(this.prefSyncAuto));
    localStorage.setItem('sensante_agent_pref_bip', String(this.prefBipScanner));
    localStorage.setItem('sensante_agent_pref_rayon', this.prefRayonGps);
    localStorage.setItem('sensante_agent_pref_audio', this.prefLangueAudio);
    this.showToast('Préférences de tournée enregistrées localement.');
  }

  sauvegarderSecurite(): void {
    this.securiteError.set(null);
    this.securiteSuccess.set(null);

    if (this.formNouveauMdp && this.formNouveauMdp !== this.formConfirmerMdp) {
      this.securiteError.set('La confirmation ne correspond pas au nouveau mot de passe.');
      return;
    }

    if (this.formNouveauMdp && this.formNouveauMdp.length < 6) {
      this.securiteError.set('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    if (this.formPinRapide.length !== 4 || !/^\d{4}$/.test(this.formPinRapide)) {
      this.securiteError.set('Le code PIN de terrain doit comporter exactement 4 chiffres.');
      return;
    }

    localStorage.setItem('sensante_agent_pin_rapide', this.formPinRapide);
    this.securiteSuccess.set('Paramètres de sécurité et code PIN terrain mis à jour.');
    this.formAncienMdp = '';
    this.formNouveauMdp = '';
    this.formConfirmerMdp = '';
    this.showToast('Accréditation de sécurité mise à jour avec succès.');
  }

  private showToast(msg: string): void {
    this.successToast.set(msg);
    setTimeout(() => this.successToast.set(null), 4500);
  }
}
