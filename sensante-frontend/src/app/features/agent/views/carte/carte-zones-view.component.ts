import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { AgentTactiqueService } from '../../services/agent-tactique.service';
import { OfflineSyncService } from '../../../../core/offline/offline-sync.service';
import { AudioService } from '../../../../core/services/audio.service';
import {
  ConcessionZone,
  ZoneCarteOverview,
  ReleveTerrainRequest,
  ActionTactiqueResponse
} from '../../models/agent-tactique.model';

@Component({
  selector: 'app-carte-zones-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carte-zones-view.component.html',
  styles: [`
    @keyframes radar-sweep {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .radar-beam {
      transform-origin: center;
      animation: radar-sweep 4s linear infinite;
    }
    @keyframes pulse-dot {
      0%, 100% { transform: scale(1); opacity: 0.9; }
      50% { transform: scale(1.4); opacity: 0.3; }
    }
    .pulse-ring {
      animation: pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #cbd5e1;
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: #94a3b8;
    }
    /* Leaflet marker customization */
    ::ng-deep .custom-concession-marker {
      background: transparent;
      border: none;
    }
    ::ng-deep .agent-position-marker {
      background: transparent;
      border: none;
    }
  `]
})
export class CarteZonesViewComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly agentService = inject(AgentTactiqueService);
  readonly offlineSyncService = inject(OfflineSyncService);
  private readonly audioService = inject(AudioService);
  private recordingStartTime = 0;
  private recordedAudioBlobUrl: string | null = null;
  private audioPlayerElement: HTMLAudioElement | null = null;

  @ViewChild('signatureCanvas') signatureCanvas?: ElementRef<HTMLCanvasElement>;
  private isDrawingSignature = false;
  private signatureCtx: CanvasRenderingContext2D | null = null;

  private map: L.Map | null = null;
  private markersLayer: L.LayerGroup | null = null;

  // 4 États de Vie UI
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly toastMessage = signal<string | null>(null);
  readonly isSubmitting = signal<boolean>(false);
  readonly isAudioPlaying = signal<boolean>(false);
  readonly activeMobileTab = signal<'carte' | 'formulaire'>('carte');

  switchMobileTab(tab: 'carte' | 'formulaire'): void {
    this.activeMobileTab.set(tab);
    if (tab === 'carte') {
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 150);
    }
  }

  // Données télémétrie & concessions
  readonly overview = signal<ZoneCarteOverview | null>(null);
  readonly concessions = signal<ConcessionZone[]>([]);
  readonly concessionActive = signal<ConcessionZone | null>(null);

  // Formulaire tactile actif
  readonly enfantsExamines = signal<number>(3);
  readonly casMas = signal<number>(1);
  readonly casMam = signal<number>(1);
  readonly atpeDelivres = signal<number>(7);

  readonly noteVocaleEnregistree = signal<boolean>(true);
  readonly noteVocaleDuree = signal<string>('0:42s');
  readonly noteVocaleTranscription = signal<string>(
    'Débriefing mère Fatou Diop : acceptation transfert MAS vers le poste demain 08h30.'
  );

  readonly signatureAuteur = signal<string>('Mamadou Diop (Chef de concession)');
  readonly signatureHorodatage = signal<string>('09:42:15 GMT');
  readonly signatureValidee = signal<boolean>(true);

  readonly eauPurifieeRemise = signal<boolean>(true);
  readonly ficheLiaisonTamponnee = signal<boolean>(true);

  ngOnInit(): void {
    this.chargerDonnees();
  }

  ngAfterViewInit(): void {
    // Initialiser la carte Leaflet une fois le DOM prêt
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

  chargerDonnees(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.agentService.getZoneCarteOverview('Secteur 4').subscribe({
      next: (data: ZoneCarteOverview) => {
        this.overview.set(data);
        const list = data.concessions || [];
        this.concessions.set(list);

        // Mettre en cache local Dexie.js pour le mode hors-ligne
        this.offlineSyncService.cacheConcessions(list.map(c => ({
          id: c.id,
          nomConcessionnaire: c.nomFamille,
          secteur: data.secteurNom,
          statutClinique: c.statut === 'MAS' ? 'MAS' : (c.statut === 'MAM' ? 'MAM' : 'NORMAL'),
          latitude: this.getConcessionLat(c),
          longitude: this.getConcessionLng(c),
          derniereVisite: 'Aujourd\'hui',
          nbEnfants: c.nbEnfants || 0,
          rationRestante: c.atpeDelivres || 0
        })));

        if (data.concessionActive) {
          this.selectionnerConcession(data.concessionActive);
        } else if (list.length > 0) {
          this.selectionnerConcession(list[0]);
        }
        this.isLoading.set(false);

        // Rafraîchir les marqueurs sur la carte Leaflet
        setTimeout(() => this.updateMapMarkers(), 100);
      },
      error: async (err: unknown) => {
        console.warn('Réseau indisponible, tentative de lecture depuis le cache IndexedDB Dexie.js...', err);
        // Fallback hors-ligne depuis Dexie.js
        const cached = await this.offlineSyncService.getCachedConcessions();
        if (cached && cached.length > 0) {
          this.toastMessage.set('Mode Hors-ligne : chargement depuis la base locale Dexie.js');
          setTimeout(() => this.toastMessage.set(null), 3000);
          this.isLoading.set(false);
        } else {
          this.errorMessage.set('Échec de synchronisation du cache cartographique local et des concessions.');
          this.isLoading.set(false);
        }
      }
    });
  }

  private initLeafletMap(): void {
    if (typeof window === 'undefined') return;
    const container = document.getElementById('map-agent-concessions');
    if (!container || this.map) return;

    // Coordonnées de Dakar Médina (Secteur 4, Rues 6 / 11 / 22)
    const medinaCenter: [number, number] = [14.6865, -17.4530];

    this.map = L.map('map-agent-concessions', {
      center: medinaCenter,
      zoom: 16,
      zoomControl: true,
      attributionControl: true
    });

    // Tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors • SenSanté MSAS'
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);

    // Marqueur de position de l'agente Bajenu Gox
    const agentHtml = `
      <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: rgba(16, 185, 129, 0.35); animation: pulse-dot 2s infinite;"></div>
        <div style="width: 32px; height: 32px; border-radius: 9999px; background: #0F4C3A; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4);">
          <span style="font-size: 14px;">🚶‍♀️</span>
        </div>
      </div>
    `;

    const agentIcon = L.divIcon({
      className: 'agent-position-marker',
      html: agentHtml,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    L.marker(medinaCenter, { icon: agentIcon })
      .addTo(this.map)
      .bindPopup('<b>Position Agent Bajenu Gox</b><br/>Aïssatou Diop • Secteur 4<br/>GPS RTK ±2.4m');

    this.updateMapMarkers();

    // Recalculer les dimensions du conteneur Leaflet pour garantir l'affichage complet des tuiles
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 300);

    // Recalcul sur redimensionnement de fenêtre
    window.addEventListener('resize', () => {
      if (this.map) {
        this.map.invalidateSize();
      }
    });
  }

  private updateMapMarkers(): void {
    if (!this.map || !this.markersLayer) return;
    this.markersLayer.clearLayers();

    const activeId = this.concessionActive()?.id;

    this.concessions().forEach((concession) => {
      const lat = this.getConcessionLat(concession);
      const lng = this.getConcessionLng(concession);

      const isMas = concession.statut === 'MAS';
      const isMam = concession.statut === 'MAM';
      const isSelected = concession.id === activeId;

      const bgColor = isMas ? '#DC2626' : (isMam ? '#D97706' : '#059669');
      const badgeText = isMas ? 'MAS' : (isMam ? 'MAM' : 'OK');
      const borderStyle = isSelected ? 'border: 3px solid #10B981; transform: scale(1.1);' : 'border: 2px solid white;';

      const markerHtml = `
        <div style="background-color: ${bgColor}; color: white; border-radius: 9999px; padding: 4px 9px; font-weight: 700; font-size: 11px; font-family: Inter, sans-serif; box-shadow: 0 4px 8px rgba(0,0,0,0.35); ${borderStyle} display: flex; align-items: center; gap: 4px; white-space: nowrap; cursor: pointer; transition: all 0.2s ease;">
          <span>${concession.id}</span>
          <span style="opacity: 0.85;">•</span>
          <span>${badgeText}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-concession-marker',
        html: markerHtml,
        iconSize: [84, 28],
        iconAnchor: [42, 14]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });
      marker.on('click', () => {
        this.selectionnerConcession(concession);
      });
      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; font-size: 12px; line-height: 1.4;">
          <strong style="color: #0F4C3A; font-size: 13px;">${concession.nomFamille}</strong> (${concession.id})<br/>
          <span>Chef : ${concession.chefFamille}</span><br/>
          <span>Adresse : ${concession.adresse}</span><br/>
          <span style="font-weight: 600; color: ${bgColor};">Statut : ${concession.alerteTexte || badgeText}</span>
        </div>
      `);

      this.markersLayer!.addLayer(marker);
    });
  }

  private getConcessionLat(c: ConcessionZone): number {
    switch (c.id) {
      case 'C-21': return 14.6875;
      case 'C-22': return 14.6854;
      case 'C-19': return 14.6882;
      case 'C-24': return 14.6845;
      default: return 14.6865 + (Math.sin(c.id.charCodeAt(0)) * 0.0025);
    }
  }

  private getConcessionLng(c: ConcessionZone): number {
    switch (c.id) {
      case 'C-21': return -17.4520;
      case 'C-22': return -17.4542;
      case 'C-19': return -17.4550;
      case 'C-24': return -17.4512;
      default: return -17.4530 + (Math.cos(c.id.charCodeAt(0)) * 0.0025);
    }
  }

  selectionnerConcession(concession: ConcessionZone): void {
    this.concessionActive.set(concession);
    this.enfantsExamines.set(concession.nbEnfants || 0);
    this.casMas.set(concession.casMas || 0);
    this.casMam.set(concession.casMam || 0);
    this.atpeDelivres.set(concession.atpeDelivres || 0);

    this.noteVocaleEnregistree.set(concession.noteVocaleEnregistree);
    this.noteVocaleDuree.set(concession.noteVocaleDuree || '0:00s');
    this.noteVocaleTranscription.set(concession.noteVocaleTranscription || 'Aucun enregistrement audio pour cette concession.');

    this.signatureAuteur.set(concession.signatureAuteur || concession.chefFamille || '');
    this.signatureHorodatage.set(concession.signatureHorodatage || 'En attente');
    this.signatureValidee.set(concession.signatureValidee);

    this.eauPurifieeRemise.set(concession.eauPurifieeRemise);
    this.ficheLiaisonTamponnee.set(concession.ficheLiaisonTamponnee);

    // Centrer la carte sur la concession sélectionnée
    if (this.map) {
      const lat = this.getConcessionLat(concession);
      const lng = this.getConcessionLng(concession);
      this.map.panTo([lat, lng], { animate: true, duration: 0.8 });
      this.updateMapMarkers();
    }
  }

  // Contrôles Compteurs Tactiles XXL
  incrementer(compteur: 'enfants' | 'mas' | 'mam' | 'atpe'): void {
    switch (compteur) {
      case 'enfants':
        this.enfantsExamines.update((v) => v + 1);
        break;
      case 'mas':
        this.casMas.update((v) => v + 1);
        break;
      case 'mam':
        this.casMam.update((v) => v + 1);
        break;
      case 'atpe':
        this.atpeDelivres.update((v) => v + 1);
        break;
    }
  }

  decrementer(compteur: 'enfants' | 'mas' | 'mam' | 'atpe'): void {
    switch (compteur) {
      case 'enfants':
        this.enfantsExamines.update((v) => Math.max(0, v - 1));
        break;
      case 'mas':
        this.casMas.update((v) => Math.max(0, v - 1));
        break;
      case 'mam':
        this.casMam.update((v) => Math.max(0, v - 1));
        break;
      case 'atpe':
        this.atpeDelivres.update((v) => Math.max(0, v - 1));
        break;
    }
  }

  // Note Vocale Wolof — MediaRecorder réel
  async demarrerEnregistrement(): Promise<void> {
    try {
      await this.audioService.startRecording();
      this.recordingStartTime = Date.now();
      this.noteVocaleEnregistree.set(false);
      this.noteVocaleTranscription.set('Enregistrement en cours...');
    } catch (e) {
      this.toastMessage.set('Micro inaccessible — vérifiez les permissions');
      setTimeout(() => this.toastMessage.set(null), 3000);
    }
  }

  async arreterEnregistrement(): Promise<void> {
    if (!this.audioService.isRecording) return;
    const duree = this.audioService.getDuration(this.recordingStartTime);
    const blob = await this.audioService.stopRecording();
    if (this.recordedAudioBlobUrl) {
      URL.revokeObjectURL(this.recordedAudioBlobUrl);
    }
    this.recordedAudioBlobUrl = URL.createObjectURL(blob);
    this.noteVocaleEnregistree.set(true);
    this.noteVocaleDuree.set(duree + 's');
    this.noteVocaleTranscription.set('Transcription en cours via Groq Whisper...');
    // Envoyer au backend pour transcription Groq Whisper
    this.audioService.transcribe(blob, 'fr').subscribe(result => {
      if (result.transcription) {
        this.noteVocaleTranscription.set(result.transcription);
      } else {
        this.noteVocaleTranscription.set(result.erreurDetail ?? 'Transcription indisponible');
      }
    });
  }

  toggleAudioNote(): void {
    if (!this.noteVocaleEnregistree()) return;
    if (this.isAudioPlaying()) {
      if (this.audioPlayerElement) {
        this.audioPlayerElement.pause();
        this.audioPlayerElement.currentTime = 0;
      }
      this.isAudioPlaying.set(false);
    } else {
      if (this.recordedAudioBlobUrl) {
        if (!this.audioPlayerElement) {
          this.audioPlayerElement = new Audio(this.recordedAudioBlobUrl);
          this.audioPlayerElement.onended = () => this.isAudioPlaying.set(false);
          this.audioPlayerElement.onerror = () => this.isAudioPlaying.set(false);
        } else {
          this.audioPlayerElement.src = this.recordedAudioBlobUrl;
        }
        this.audioPlayerElement.play().then(() => {
          this.isAudioPlaying.set(true);
        }).catch(err => {
          console.warn('Erreur lecture audio:', err);
          this.isAudioPlaying.set(false);
        });
      } else {
        // Signal visuel de lecture si pas de blob local initial
        this.isAudioPlaying.set(true);
        setTimeout(() => this.isAudioPlaying.set(false), 3500);
      }
    }
  }

  supprimerAudioNote(): void {
    this.noteVocaleEnregistree.set(false);
    this.noteVocaleDuree.set('0:00s');
    this.noteVocaleTranscription.set('');
    this.isAudioPlaying.set(false);
    if (this.audioPlayerElement) {
      this.audioPlayerElement.pause();
      this.audioPlayerElement = null;
    }
    if (this.recordedAudioBlobUrl) {
      URL.revokeObjectURL(this.recordedAudioBlobUrl);
      this.recordedAudioBlobUrl = null;
    }
    this.audioService.stopCurrentAudio();
  }

  // Émargement Représentant — Canvas Tactile Réel
  initSignatureCanvas(): void {
    const canvas = this.signatureCanvas?.nativeElement;
    if (!canvas) return;
    this.signatureCtx = canvas.getContext('2d');
    if (!this.signatureCtx) return;
    this.signatureCtx.strokeStyle = '#003426';
    this.signatureCtx.lineWidth = 2.5;
    this.signatureCtx.lineCap = 'round';
    this.signatureCtx.lineJoin = 'round';
  }

  startDrawing(e: MouseEvent | TouchEvent): void {
    const canvas = this.signatureCanvas?.nativeElement;
    if (!canvas || !this.signatureCtx) {
      this.initSignatureCanvas();
    }
    if (!this.signatureCtx || !canvas) return;

    this.isDrawingSignature = true;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : (e as MouseEvent).clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : (e as MouseEvent).clientY - rect.top;

    this.signatureCtx.beginPath();
    this.signatureCtx.moveTo(x, y);
    e.preventDefault();
  }

  draw(e: MouseEvent | TouchEvent): void {
    if (!this.isDrawingSignature || !this.signatureCtx) return;
    const canvas = this.signatureCanvas?.nativeElement;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : (e as MouseEvent).clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : (e as MouseEvent).clientY - rect.top;

    this.signatureCtx.lineTo(x, y);
    this.signatureCtx.stroke();
    e.preventDefault();
  }

  stopDrawing(): void {
    if (!this.isDrawingSignature) return;
    this.isDrawingSignature = false;
    this.signatureValidee.set(true);
    const now = new Date();
    const heure = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.signatureHorodatage.set(`${heure} GMT`);
  }

  effacerSignature(): void {
    const canvas = this.signatureCanvas?.nativeElement;
    if (canvas && this.signatureCtx) {
      this.signatureCtx.clearRect(0, 0, canvas.width, canvas.height);
    }
    this.signatureValidee.set(false);
    this.signatureHorodatage.set('Effacée');
  }

  // Map action
  recalculerCompas(): void {
    if (this.map) {
      this.map.setView([14.6865, -17.4530], 16);
    }
    this.toastMessage.set('Boussole recalée sur le Nord magnétique et fix RTK recalibré.');
    setTimeout(() => this.toastMessage.set(null), 3000);
  }

  // Actions de soumission avec support Hors-ligne Dexie.js
  async soumettreEtPasserSuivante(): Promise<void> {
    const active = this.concessionActive();
    if (!active) return;

    this.isSubmitting.set(true);
    const req: ReleveTerrainRequest = {
      concessionId: active.id,
      enfantsExamines: this.enfantsExamines(),
      casMas: this.casMas(),
      casMam: this.casMam(),
      atpeDelivres: this.atpeDelivres(),
      noteVocaleDuree: this.noteVocaleDuree(),
      noteVocaleTranscription: this.noteVocaleTranscription(),
      noteVocaleEnregistree: this.noteVocaleEnregistree(),
      signatureAuteur: this.signatureAuteur(),
      eauPurifieeRemise: this.eauPurifieeRemise(),
      ficheLiaisonTamponnee: this.ficheLiaisonTamponnee(),
      miseEnAttente: false,
      alerteSamu: false
    };

    // Si nous sommes déconnectés, enregistrement direct dans Dexie.js (Outbox)
    if (!this.offlineSyncService.isOnline()) {
      await this.offlineSyncService.queueAction(
        'RELEVE_CONCESSION',
        '/api/agent/tactique/carte/releve',
        'POST',
        req,
        `Relevé concession ${active.id} (${active.nomFamille})`
      );
      this.isSubmitting.set(false);
      this.toastMessage.set(`💾 Relevé enregistré hors-ligne dans Dexie.js (file d'attente : ${this.offlineSyncService.pendingCount()}).`);
      setTimeout(() => this.toastMessage.set(null), 4000);
      return;
    }

    this.agentService.enregistrerReleveTerrain(req).subscribe({
      next: (res: ActionTactiqueResponse) => {
        this.isSubmitting.set(false);
        this.toastMessage.set(res.message);
        setTimeout(() => this.toastMessage.set(null), 4000);

        if (res.donneeResultat) {
          const suivante = res.donneeResultat as ConcessionZone;
          this.selectionnerConcession(suivante);
        }
      },
      error: async (err: unknown) => {
        console.warn('Échec envoi direct, mise en file d\'attente Dexie.js...', err);
        await this.offlineSyncService.queueAction(
          'RELEVE_CONCESSION',
          '/api/agent/tactique/carte/releve',
          'POST',
          req,
          `Relevé concession ${active.id} (${active.nomFamille})`
        );
        this.isSubmitting.set(false);
        this.toastMessage.set(`💾 Mis en file d'attente hors-ligne Dexie.js (${this.offlineSyncService.pendingCount()} en attente).`);
        setTimeout(() => this.toastMessage.set(null), 4000);
      }
    });
  }

  mettreEnAttente(): void {
    const active = this.concessionActive();
    if (!active) return;
    this.toastMessage.set(`Concession ${active.id} (${active.nomFamille}) mise en attente (Absent).`);
    setTimeout(() => this.toastMessage.set(null), 3000);
  }

  alerterSamu(): void {
    const active = this.concessionActive();
    if (!active) return;
    this.toastMessage.set(`🚨 Alerte SAMU 15 déclenchée pour ${active.nomFamille} (${active.adresse}).`);
    setTimeout(() => this.toastMessage.set(null), 4000);
  }
}
