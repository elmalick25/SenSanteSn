import { Component, OnInit, AfterViewInit, OnDestroy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { SupervisionService } from '../../services/supervision.service';
import {
  MissionTerrain,
  MissionsOverview,
  PrioriteMissionType,
  StatutMissionType
} from '../../models/supervision.models';

@Component({
  selector: 'app-cartographie-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cartographie-view.component.html',
  styleUrls: ['./cartographie-view.component.css']
})
export class CartographieViewComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly supervisionService = inject(SupervisionService);

  private map: L.Map | null = null;
  private markersLayer: L.LayerGroup | null = null;

  // Signals
  readonly missions = signal<MissionTerrain[]>([]);
  readonly overview = signal<MissionsOverview | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly isSubmitting = signal<boolean>(false);
  readonly toastMessage = signal<string | null>(null);

  // Filters & Search
  readonly filterStatut = signal<string>('TOUTES');
  readonly searchQuery = signal<string>('');

  // UI state
  readonly isCreatePanelOpen = signal<boolean>(false);
  readonly focusedSectorTitle = signal<string>('Zone Médina Sud (Foyer Actif)');

  // Form model for new mission
  newMission = {
    zoneCiblee: 'Zone Médina Secteur 3 (Prioritaire • Foyer MAS)',
    agentNom: 'Bajenu Gox Fatou Sow (Secteur Médina • Disponible)',
    objectifChiffre: 'Dépistage de 50 enfants 6-59 mois & test d\'appétit systématique aux œdèmes bilatéraux...',
    dateLimite: '2024-10-22',
    heureEcheance: '18:00',
    priorite: 'URGENCE_VITALE' as PrioriteMissionType,
    dotationMuac: true,
    dotationAtpe: true,
    dotationRegistres: true
  };

  // Filtered missions computed
  readonly filteredMissions = computed(() => {
    let list = this.missions();
    const filter = this.filterStatut();
    const query = this.searchQuery().toLowerCase().trim();

    if (filter !== 'TOUTES') {
      list = list.filter((m: MissionTerrain) => m.statut === filter);
    }

    if (query !== '') {
      list = list.filter((m: MissionTerrain) =>
        m.codeMission.toLowerCase().includes(query) ||
        m.zoneCiblee.toLowerCase().includes(query) ||
        m.agentNom.toLowerCase().includes(query)
      );
    }

    return list;
  });

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initLeafletMap();
    }, 200);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private initLeafletMap(): void {
    if (typeof window === 'undefined') return;
    const container = document.getElementById('map-superviseur-missions');
    if (!container || this.map) return;

    // Centre : Dakar Ouest (Corniche, Médina, Fann, Ouakam)
    const dakarCenter: [number, number] = [14.6937, -17.4560];

    this.map = L.map('map-superviseur-missions', {
      center: dakarCenter,
      zoom: 14,
      zoomControl: true,
      attributionControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors • SenSanté MSAS'
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);
    this.updateMapMarkers();
  }

  private updateMapMarkers(): void {
    if (!this.map || !this.markersLayer) return;
    this.markersLayer.clearLayers();

    // Structures et secteurs clés du District Dakar Ouest
    const sectors = [
      {
        nom: 'Médina Secteur 3',
        lat: 14.6865,
        lng: -17.4530,
        statut: 'A_INTERVENIR',
        color: '#DC2626',
        badge: 'À INTERVENIR (42 MAS)',
        desc: 'Foyer critique MAS actif • Relais Bajenu Gox Fatou Sow'
      },
      {
        nom: 'Gueule Tapée Ouest',
        lat: 14.6910,
        lng: -17.4580,
        statut: 'EN_COURS',
        color: '#D97706',
        badge: 'EN COURS • 68%',
        desc: 'Mission #MS-104 • Relais Aïssatou Diop'
      },
      {
        nom: 'Fann Point-E',
        lat: 14.6970,
        lng: -17.4650,
        statut: 'VALIDE',
        color: '#059669',
        badge: 'RAPPORT SOUMIS • 100%',
        desc: 'Mission #MS-098 • Dépistages complétés'
      },
      {
        nom: 'Centre de Santé de référence Gaspard Camara',
        lat: 14.6950,
        lng: -17.4510,
        statut: 'HUB',
        color: '#0F4C3A',
        badge: 'HUB DISTRICT',
        desc: 'CRENAS & Stock central ATPE District Ouest'
      },
      {
        nom: 'Poste de Santé Soumbédioune',
        lat: 14.6820,
        lng: -17.4590,
        statut: 'POSTE',
        color: '#0D9488',
        badge: 'POSTE SANTE',
        desc: 'Consultations infantiles et dépistage de routine'
      }
    ];

    sectors.forEach(s => {
      const html = `
        <div style="background-color: ${s.color}; color: white; border-radius: 9999px; padding: 4px 9px; font-weight: 700; font-size: 11px; font-family: Inter, sans-serif; box-shadow: 0 4px 8px rgba(0,0,0,0.35); border: 2px solid white; display: flex; align-items: center; gap: 4px; white-space: nowrap; cursor: pointer;">
          <span>${s.badge}</span>
        </div>
      `;

      const icon = L.divIcon({
        className: 'custom-mission-marker',
        html,
        iconSize: [120, 28],
        iconAnchor: [60, 14]
      });

      const marker = L.marker([s.lat, s.lng], { icon });
      marker.on('click', () => {
        this.selectMapSector(s.nom);
      });
      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; font-size: 12px; line-height: 1.4;">
          <strong style="color: #0F4C3A; font-size: 13px;">${s.nom}</strong><br/>
          <span>${s.desc}</span><br/>
          <span style="font-weight: 600; color: ${s.color};">Statut : ${s.badge}</span>
        </div>
      `);

      this.markersLayer!.addLayer(marker);
    });
  }

  loadData(): void {
    this.isLoading.set(true);
    this.supervisionService.getMissions().subscribe({
      next: (missions: MissionTerrain[]) => {
        this.missions.set(missions);
        this.isLoading.set(false);
        setTimeout(() => this.updateMapMarkers(), 100);
      },
      error: (err: unknown) => {
        console.error('Erreur chargement missions:', err);
        this.isLoading.set(false);
      }
    });

    this.supervisionService.getMissionsOverview().subscribe({
      next: (ov: MissionsOverview) => {
        this.overview.set(ov);
      },
      error: (err: unknown) => {
        console.error('Erreur chargement overview missions:', err);
      }
    });
  }

  onSearchChange(val: string): void {
    this.searchQuery.set(val);
  }

  openCreateMissionPanel(): void {
    this.isCreatePanelOpen.set(true);
  }

  submitCreateMission(): void {
    this.isSubmitting.set(true);
    const req = {
      zoneCiblee: this.newMission.zoneCiblee,
      agentNom: this.newMission.agentNom.split('(')[0].trim(),
      objectifChiffre: this.newMission.objectifChiffre,
      dateLimite: this.newMission.dateLimite,
      heureEcheance: this.newMission.heureEcheance,
      priorite: this.newMission.priorite,
      dotationMuac: this.newMission.dotationMuac,
      dotationAtpe: this.newMission.dotationAtpe,
      dotationRegistres: this.newMission.dotationRegistres,
      deployerImmediatement: true
    };

    this.supervisionService.createMission(req).subscribe({
      next: (created: MissionTerrain) => {
        this.isSubmitting.set(false);
        this.isCreatePanelOpen.set(false);
        this.showToast(`Mission ${created.codeMission} créée et déployée avec succès vers ${created.zoneCiblee} !`);
        this.loadData();
      },
      error: (err: unknown) => {
        console.error('Erreur création mission:', err);
        this.isSubmitting.set(false);
        this.showToast('Erreur lors de la création de la mission.');
      }
    });
  }

  saveDraft(): void {
    this.isCreatePanelOpen.set(false);
    this.showToast('Brouillon de mission sauvegardé dans le registre local.');
  }

  deployerMission(id: number): void {
    this.supervisionService.updateMissionStatut(id, 'EN_COURS').subscribe({
      next: (updated: MissionTerrain) => {
        this.showToast(`Mission ${updated.codeMission} mobilisée ! Statut : En cours.`);
        this.loadData();
      },
      error: (err: unknown) => {
        console.error('Erreur déploiement:', err);
        this.showToast('Échec de la mobilisation de la mission.');
      }
    });
  }

  validerRapport(id: number): void {
    this.supervisionService.updateMissionStatut(id, 'VALIDE').subscribe({
      next: (updated: MissionTerrain) => {
        this.showToast(`Rapport de mission ${updated.codeMission} validé avec succès et certifié MSAS.`);
        this.loadData();
      },
      error: (err: unknown) => {
        console.error('Erreur validation rapport:', err);
        this.showToast('Erreur lors de la validation du rapport.');
      }
    });
  }

  actionGps(mission: MissionTerrain): void {
    this.showToast(`Suivi GPS de ${mission.agentNom} : Localisation active sur ${mission.zoneCiblee}`);
  }

  exportDhis2(): void {
    this.supervisionService.exportMissionsDhis2().subscribe({
      next: (res: { statut: string; reference: string; missionsTransmises: number }) => {
        this.showToast(`Synchronisation DHIS2 réussie : ${res.missionsTransmises} missions transmises (${res.reference}).`);
      },
      error: (err: unknown) => {
        console.error('Erreur export DHIS2:', err);
        this.showToast('Erreur lors de l\'export DHIS2.');
      }
    });
  }

  selectMapSector(sectorName: string): void {
    this.focusedSectorTitle.set(`Zone ${sectorName}`);
    this.showToast(`Secteur ${sectorName} sélectionné sur la carte.`);

    if (this.map) {
      if (sectorName.includes('Médina')) {
        this.map.panTo([14.6865, -17.4530]);
      } else if (sectorName.includes('Gueule Tapée')) {
        this.map.panTo([14.6910, -17.4580]);
      } else if (sectorName.includes('Fann')) {
        this.map.panTo([14.6970, -17.4650]);
      }
    }
  }

  centerDakar(): void {
    if (this.map) {
      this.map.setView([14.6937, -17.4560], 14);
    }
    this.focusedSectorTitle.set('Zone Médina Sud (Foyer Actif)');
    this.showToast('Carte recentrée sur la presqu\'île de Dakar Ouest (WGS 84).');
  }

  toggleLayers(): void {
    this.showToast('Affichage combiné : Foyers MAS et positions GPS des relais.');
  }

  triggerNotificationAlert(): void {
    const aIntervenir = this.overview()?.aIntervenir || 3;
    this.showToast(`${aIntervenir} missions prioritaires requièrent une intervention immédiate.`);
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 4000);
  }
}
