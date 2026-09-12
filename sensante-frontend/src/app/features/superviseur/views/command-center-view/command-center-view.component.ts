import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupervisionService } from '../../services/supervision.service';
import {
  SupervisionCommandCenter,
  DistrictZoneGeo,
  AlerteTriage,
  DeploiementEquipeResponse
} from '../../models/supervision.models';

@Component({
  selector: 'app-command-center-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './command-center-view.component.html',
  styleUrls: ['./command-center-view.component.css']
})
export class CommandCenterViewComponent implements OnInit {
  private readonly supervisionService = inject(SupervisionService);

  // Core State Signals
  readonly data = signal<SupervisionCommandCenter | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly toastMessage = signal<string | null>(null);

  // Controls & Filters
  readonly activeLayer = signal<'VUE_MAS' | 'STOCKS_ATPE'>('VUE_MAS');
  readonly mapMode = signal<'DENSITE_MAS' | 'RELAIS_EQUIPES' | 'POSTES_SANTE'>('DENSITE_MAS');
  readonly alertFilter = signal<'TOUTES' | 'MAS_SEVERE' | 'RUPTURE_ATPE'>('TOUTES');

  // Selected Zone for Tactical Card
  readonly selectedZone = signal<DistrictZoneGeo | null>(null);

  // Map Zoom & Transform
  readonly zoomLevel = signal<number>(1.0);

  // Modals & Action States
  readonly isDispatchModalOpen = signal<boolean>(false);
  readonly dispatchZoneTarget = signal<string>('Médina (Cluster Critique)');
  dispatchMotif = '';
  readonly isDeploying = signal<boolean>(false);
  readonly isExportingPdf = signal<boolean>(false);

  readonly selectedAlertForModal = signal<AlerteTriage | null>(null);

  // Computed alert lists
  readonly allAlerts = computed(() => this.data()?.alertes || []);

  readonly filteredAlerts = computed(() => {
    const filter = this.alertFilter();
    const list = this.allAlerts();
    if (filter === 'MAS_SEVERE') {
      return list.filter((a) => a.typeAlerte === 'MAS_SEVERE');
    }
    if (filter === 'RUPTURE_ATPE') {
      return list.filter((a) => a.typeAlerte === 'RUPTURE_ATPE');
    }
    return list;
  });

  readonly masSevereCount = computed(() => {
    return this.allAlerts().filter((a) => a.typeAlerte === 'MAS_SEVERE').length;
  });

  readonly ruptureAtpeCount = computed(() => {
    return this.allAlerts().filter((a) => a.typeAlerte === 'RUPTURE_ATPE').length;
  });

  readonly unreadAlertsCount = computed(() => {
    return this.allAlerts().filter((a) => !a.acquittee).length;
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.supervisionService.getCommandCenter().subscribe({
      next: (res: SupervisionCommandCenter) => {
        this.data.set(res);
        this.isLoading.set(false);
        // Default focal zone (Medina or first critical zone)
        if (res.zones && res.zones.length > 0) {
          const medina = res.zones.find((z: DistrictZoneGeo) => z.nom.toLowerCase().includes('médina') || z.nom.toLowerCase().includes('medina'));
          this.selectedZone.set(medina || res.zones[0]);
        }
      },
      error: (err: unknown) => {
        console.error('Erreur chargement Centre de Commandement:', err);
        this.errorMessage.set('Impossible de charger les données cartographiques du district. Vérifiez votre connexion.');
        this.isLoading.set(false);
      }
    });
  }

  selectZoneByName(zoneName: string): void {
    const zones = this.data()?.zones || [];
    const found = zones.find((z) => z.nom.toLowerCase() === zoneName.toLowerCase());
    if (found) {
      this.selectedZone.set(found);
      this.showToast(`Secteur ${found.nom} focalisé : Prévalence ${found.prevalenceMas}% (${found.casActifsMas} cas)`);
    }
  }

  selectPatrol(patrolName: string): void {
    this.showToast(`Unité mobile sélectionnée : ${patrolName} — Statut opérationnel actif`);
  }

  zoomIn(): void {
    this.zoomLevel.update((z) => Math.min(z + 0.15, 1.8));
  }

  zoomOut(): void {
    this.zoomLevel.update((z) => Math.max(z - 0.15, 0.7));
  }

  resetMap(): void {
    this.zoomLevel.set(1.0);
    this.selectZoneByName('Médina');
  }

  toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  openDispatchModal(zoneTarget?: string): void {
    this.dispatchZoneTarget.set(zoneTarget || this.selectedZone()?.nom || 'Médina (Cluster Critique)');
    this.dispatchMotif = `Cluster MAS critique détecté (${this.selectedZone()?.casActifsMas || 42} enfants). Risque d'aggravation rapide.`;
    this.isDispatchModalOpen.set(true);
  }

  confirmDispatch(): void {
    this.isDeploying.set(true);
    const req = {
      zoneCible: this.dispatchZoneTarget(),
      motif: this.dispatchMotif,
      niveauPriorite: 'URGENCE_NIVEAU_3'
    };

    this.supervisionService.deployerEquipe(req).subscribe({
      next: (res: DeploiementEquipeResponse) => {
        this.isDeploying.set(false);
        this.isDispatchModalOpen.set(false);
        this.showToast(`Équipe mobilisée avec succès ! Mission ${res.numeroMission} en route vers ${res.zoneCible}.`);
      },
      error: (err: unknown) => {
        console.error('Erreur déploiement équipe:', err);
        this.isDeploying.set(false);
        this.showToast("Erreur lors de la transmission de l'ordre de mission.");
      }
    });
  }

  openChildModal(alert: AlerteTriage): void {
    this.selectedAlertForModal.set(alert);
  }

  acquitterAlerte(id: number): void {
    this.supervisionService.acquitterAlerte(id).subscribe({
      next: () => {
        // Mark alert as acknowledged locally in signal
        const current = this.data();
        if (current) {
          const updatedAlerts = current.alertes.map((a) => (a.id === id ? { ...a, acquittee: true } : a));
          this.data.set({ ...current, alertes: updatedAlerts });
        }
        this.selectedAlertForModal.set(null);
        this.showToast('Alerte acquittée et archivée dans le registre épidémiologique.');
      },
      error: (err: unknown) => {
        console.error('Erreur acquittement:', err);
        this.showToast("Échec de l'acquittement de l'alerte.");
      }
    });
  }

  exportPdf(): void {
    this.isExportingPdf.set(true);
    this.supervisionService.exportPdf().subscribe({
      next: (res: { statut: string; reference: string; downloadUrl: string }) => {
        this.isExportingPdf.set(false);
        this.showToast(`Synthèse PDF officielle générée avec succès (${res.reference}). Téléchargement démarré.`);
      },
      error: (err: unknown) => {
        console.error('Erreur export PDF:', err);
        this.isExportingPdf.set(false);
        this.showToast('Échec de la génération du rapport PDF.');
      }
    });
  }

  toggleNotifications(): void {
    const unread = this.unreadAlertsCount();
    this.showToast(`${unread} alertes prioritaires requièrent une décision du superviseur de district.`);
  }

  private showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 4000);
  }
}
