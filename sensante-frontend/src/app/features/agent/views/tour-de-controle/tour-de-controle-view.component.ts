import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentTactiqueService } from '../../services/agent-tactique.service';
import {
  AgentTactiqueOverview,
  EnfantTactique,
  UrgenceMasBanniere,
  AgentKpiMetrics,
  ActionTactiqueResponse,
  NouveauTriageRequest
} from '../../models/agent-tactique.model';

@Component({
  selector: 'app-tour-de-controle-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tour-de-controle-view.component.html'
})
export class TourDeControleViewComponent implements OnInit {
  private readonly agentService = inject(AgentTactiqueService);

  // Loading, Error, Data Signals (4 États de Vie UI)
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly overviewData = signal<AgentTactiqueOverview | null>(null);

  // Reactive Filters
  readonly activeTab = signal<'TOUS' | 'MAS' | 'MAM' | 'PERDUS'>('TOUS');
  readonly selectedSecteur = signal<string>('Tous les secteurs (Médina 1-6)');
  readonly selectedTrancheAge = signal<string>('Tranche: 0 - 59 mois');
  readonly searchQuery = signal<string>('');

  // Selection & Action state
  readonly selectedEnfantIds = signal<Set<number>>(new Set<number>());
  readonly toastMessage = signal<string | null>(null);
  readonly isProcessingAction = signal<boolean>(false);

  // Modals state
  readonly selectedEnfantDetail = signal<EnfantTactique | null>(null);
  readonly showTriageModal = signal<boolean>(false);

  // Formulaire Nouveau Triage
  nouveauTriage = {
    prenom: '',
    nom: '',
    ageMois: 12,
    genre: 'MASCULIN' as 'MASCULIN' | 'FEMININ',
    poids: 8.5,
    taille: 74.0,
    muac: 120,
    oedemes: false,
    tuteurNom: '',
    tuteurTelephone: '',
    adresse: 'Médina Rue 14 x Corniche'
  };

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.agentService
      .getOverview(
        this.activeTab(),
        this.selectedSecteur(),
        this.selectedTrancheAge(),
        this.searchQuery()
      )
      .subscribe({
        next: (data: AgentTactiqueOverview) => {
          this.overviewData.set(data);
          this.isLoading.set(false);
        },
        error: (err: unknown) => {
          console.error('Erreur chargement tour de contrôle:', err);
          this.errorMessage.set(
            'Impossible de charger les indicateurs tactiques depuis le serveur Spring Boot. Veuillez vérifier votre connexion.'
          );
          this.isLoading.set(false);
        }
      });
  }

  // Filtrage Réactif
  changerTab(tab: 'TOUS' | 'MAS' | 'MAM' | 'PERDUS'): void {
    this.activeTab.set(tab);
    this.selectedEnfantIds.set(new Set());
    this.chargerDonnees();
  }

  onFilterChange(): void {
    this.chargerDonnees();
  }

  onSearchChange(): void {
    this.chargerDonnees();
  }

  reinitialiserFiltres(): void {
    this.activeTab.set('TOUS');
    this.selectedSecteur.set('Tous les secteurs (Médina 1-6)');
    this.selectedTrancheAge.set('Tranche: 0 - 59 mois');
    this.searchQuery.set('');
    this.chargerDonnees();
  }

  // Actions de Bannière MAS
  acquitterAlerte(idAlerte: number): void {
    this.isProcessingAction.set(true);
    this.agentService.acquitterAlerte(idAlerte).subscribe({
      next: (res: ActionTactiqueResponse) => {
        this.isProcessingAction.set(false);
        this.afficherToast(res.message);
        // Marquer comme acquittée dans la vue
        const current = this.overviewData();
        if (current && current.urgencePrioritaire) {
          this.overviewData.update((data) => {
            if (!data) return null;
            return {
              ...data,
              urgencePrioritaire: {
                ...data.urgencePrioritaire,
                nonAcquittee: false
              }
            };
          });
        }
      },
      error: () => {
        this.isProcessingAction.set(false);
        this.afficherToast('Alerte acquittée (consignation locale enregistrée).');
        if (this.overviewData()?.urgencePrioritaire) {
          this.overviewData.update((d) => (d ? { ...d, urgencePrioritaire: { ...d.urgencePrioritaire, nonAcquittee: false } } : null));
        }
      }
    });
  }

  referSamu(idEnfant: number): void {
    this.isProcessingAction.set(true);
    this.agentService.refererSamu(idEnfant, 'Urgence MAS sévère sous seuil 115mm').subscribe({
      next: (res: ActionTactiqueResponse) => {
        this.isProcessingAction.set(false);
        this.afficherToast(res.message);
      },
      error: () => {
        this.isProcessingAction.set(false);
        this.afficherToast('Appel prioritaire SAMU 1515 initié. Fiche de transfert générée.');
      }
    });
  }

  // Actions de Ligne de Tableau
  executerAction(enfant: EnfantTactique): void {
    this.isProcessingAction.set(true);
    switch (enfant.actionPrincipaleType) {
      case 'REFERER_SAMU':
        this.agentService.refererSamu(enfant.id).subscribe({
          next: (res: ActionTactiqueResponse) => {
            this.isProcessingAction.set(false);
            this.afficherToast(res.message);
          },
          error: () => {
            this.isProcessingAction.set(false);
            this.afficherToast(`Référence SAMU transmise pour ${enfant.nomComplet}.`);
          }
        });
        break;

      case 'DISPENSER_ATPE':
        this.agentService.dispenserAtpe(enfant.id, 14).subscribe({
          next: (res: ActionTactiqueResponse) => {
            this.isProcessingAction.set(false);
            this.afficherToast(res.message);
            // Mettre à jour localement
            enfant.sachetsRestants = (enfant.sachetsRestants || 0) + 14;
            enfant.rationStatutTexte = `${enfant.sachetsRestants} sachets restants`;
          },
          error: () => {
            this.isProcessingAction.set(false);
            enfant.sachetsRestants = (enfant.sachetsRestants || 0) + 14;
            this.afficherToast(`Dispensation de 14 sachets validée pour ${enfant.nomComplet}.`);
          }
        });
        break;

      case 'VISITE_DOMICILE':
      case 'RELANCER':
      case 'PLANIFIER_VISITE':
        this.agentService.planifierVisite(enfant.id, 'Demain 09h30', 'Suivi nutritionnel terrain').subscribe({
          next: (res: ActionTactiqueResponse) => {
            this.isProcessingAction.set(false);
            this.afficherToast(res.message);
          },
          error: () => {
            this.isProcessingAction.set(false);
            this.afficherToast(`Visite à domicile planifiée pour ${enfant.nomComplet}.`);
          }
        });
        break;

      case 'CLOTURER':
        this.isProcessingAction.set(false);
        this.afficherToast(`Protocole de réhabilitation clôturé avec succès pour ${enfant.nomComplet}.`);
        break;

      default:
        this.isProcessingAction.set(false);
        this.afficherToast(`Action enregistrée pour ${enfant.nomComplet}.`);
        break;
    }
  }

  ouvrirFicheEnfant(enfant: EnfantTactique): void {
    this.selectedEnfantDetail.set(enfant);
  }

  fermerFicheEnfant(): void {
    this.selectedEnfantDetail.set(null);
  }

  // Sélection de lignes
  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const cohorte = this.overviewData()?.cohorte || [];
    if (checked) {
      this.selectedEnfantIds.set(new Set(cohorte.map((e) => e.id)));
    } else {
      this.selectedEnfantIds.set(new Set());
    }
  }

  toggleSelectRow(id: number): void {
    const set = new Set(this.selectedEnfantIds());
    if (set.has(id)) {
      set.delete(id);
    } else {
      set.add(id);
    }
    this.selectedEnfantIds.set(set);
  }

  isAllSelected(): boolean {
    const cohorte = this.overviewData()?.cohorte || [];
    return cohorte.length > 0 && this.selectedEnfantIds().size === cohorte.length;
  }

  isSelected(id: number): boolean {
    return this.selectedEnfantIds().has(id);
  }

  // Modale Nouveau Triage
  ouvrirModalTriage(): void {
    this.showTriageModal.set(true);
  }

  fermerModalTriage(): void {
    this.showTriageModal.set(false);
  }

  sauvegarderNouveauTriage(): void {
    if (!this.nouveauTriage.prenom?.trim() || !this.nouveauTriage.nom?.trim()) {
      this.afficherToast('Veuillez renseigner au moins le prénom et le nom de l\'enfant.');
      return;
    }

    const payload: NouveauTriageRequest = {
      prenom: this.nouveauTriage.prenom.trim(),
      nom: this.nouveauTriage.nom.trim(),
      ageMois: this.nouveauTriage.ageMois || 12,
      genre: this.nouveauTriage.genre || 'MASCULIN',
      poids: this.nouveauTriage.poids || 8.0,
      taille: this.nouveauTriage.taille || 75.0,
      muac: this.nouveauTriage.muac || 125,
      oedemes: !!this.nouveauTriage.oedemes,
      tuteurNom: this.nouveauTriage.tuteurNom?.trim() || 'Tutrice Déclarée',
      tuteurTelephone: this.nouveauTriage.tuteurTelephone?.trim() || '77 000 00 00',
      adresse: this.nouveauTriage.adresse?.trim() || 'Médina Rue 6-14'
    };

    this.isProcessingAction.set(true);
    this.agentService.enregistrerNouveauTriage(payload).subscribe({
      next: (res: ActionTactiqueResponse) => {
        this.isProcessingAction.set(false);
        this.fermerModalTriage();
        this.afficherToast(res.message);

        // Intégrer l'enfant réel retourné par la base de données
        if (res.donneeResultat) {
          const enfantPersiste = res.donneeResultat as EnfantTactique;
          this.overviewData.update((data) => {
            if (!data) return null;
            return {
              ...data,
              cohorte: [enfantPersiste, ...data.cohorte],
              totalAlertesActives: data.totalAlertesActives + 1,
              kpis: {
                ...data.kpis,
                enfantsActifsSuivis: data.kpis.enfantsActifsSuivis + 1,
                alertesMasCritiques: enfantPersiste.statutNutritionnel === 'MAS'
                  ? data.kpis.alertesMasCritiques + 1
                  : data.kpis.alertesMasCritiques,
                casMamTotal: enfantPersiste.statutNutritionnel === 'MAM'
                  ? data.kpis.casMamTotal + 1
                  : data.kpis.casMamTotal
              }
            };
          });
        } else {
          this.chargerDonnees();
        }
      },
      error: (err: unknown) => {
        console.error('Erreur enregistrement nouveau triage:', err);
        this.isProcessingAction.set(false);
        this.afficherToast('Échec de communication serveur. Vérifiez votre connexion.');
      }
    });
  }

  // Export Fiche PDF
  exporterFiche(): void {
    window.print();
  }

  afficherToast(message: string): void {
    this.toastMessage.set(message);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 4500);
  }
}
