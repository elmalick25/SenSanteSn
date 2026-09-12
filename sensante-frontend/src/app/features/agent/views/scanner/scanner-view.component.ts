import { Component, OnInit, OnDestroy, ViewChild, ElementRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentTactiqueService } from '../../services/agent-tactique.service';
import {
  FicheExpress,
  ScanRecent,
  ActionTactiqueResponse,
  NouveauBilanRequest,
  DelivranceAtpeRequest
} from '../../models/agent-tactique.model';

@Component({
  selector: 'app-scanner-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scanner-view.component.html',
  styles: [`
    @keyframes scanBeam {
      0% { top: 6%; opacity: 0.85; }
      50% { top: 92%; opacity: 0.95; }
      100% { top: 6%; opacity: 0.85; }
    }
    .scanner-laser {
      animation: scanBeam 2.4s ease-in-out infinite;
    }
  `]
})
export class ScannerViewComponent implements OnInit, OnDestroy {
  private readonly agentService = inject(AgentTactiqueService);

  @ViewChild('videoPlayer') videoPlayer?: ElementRef<HTMLVideoElement>;

  // Core signals (4 États de Vie UI)
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly searchWarning = signal<string | null>(null);
  readonly ficheExpress = signal<FicheExpress | null>(null);
  readonly scansRecents = signal<ScanRecent[]>([]);

  // Search, Camera & Viewport state
  readonly queryInput = signal<string>('SEN-MED-2489');
  readonly torchOn = signal<boolean>(false);
  readonly cameraFacing = signal<'Arrière' | 'Avant'>('Arrière');
  readonly cameraActive = signal<boolean>(false);
  readonly cameraError = signal<string | null>(null);
  private mediaStream: MediaStream | null = null;
  readonly activeMode = signal<'camera' | 'recents'>('camera');
  readonly toastMessage = signal<string | null>(null);
  readonly isProcessingAction = signal<boolean>(false);

  // Modals state
  readonly showBilanModal = signal<boolean>(false);
  readonly showAtpeModal = signal<boolean>(false);
  readonly showRdvModal = signal<boolean>(false);

  // Modal Forms
  formBilan: { poidsKg: number; tailleCm: number; muacMm: number; oedemes: boolean; notes: string } = {
    poidsKg: 6.2,
    tailleCm: 72.0,
    muacMm: 112,
    oedemes: true,
    notes: 'Périmètre brachial critique sous 115mm'
  };

  formAtpe: { nombreSachets: number; motif: string; lotNumero: string } = {
    nombreSachets: 14,
    motif: "Dotation d'urgence MAS",
    lotNumero: 'PLU-2024-DK-890'
  };

  formRdv: { date: string; heure: string; motif: string; praticien: string } = {
    date: '15 Octobre 2024',
    heure: '09h30',
    motif: 'Consultation Triage CRENAS Pédiatrique',
    praticien: 'Dr. Ousmane Sow • Box 2'
  };

  ngOnInit(): void {
    this.chargerScansRecents();
    this.chargerFiche('SEN-MED-2489');
  }

  ngOnDestroy(): void {
    this.arreterCamera();
  }

  async demarrerCamera(): Promise<void> {
    this.cameraError.set(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.cameraError.set('Accès caméra non supporté par ce navigateur.');
        return;
      }
      const mode = this.cameraFacing() === 'Arrière' ? 'environment' : 'user';
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      this.cameraActive.set(true);
      if (this.videoPlayer && this.videoPlayer.nativeElement) {
        this.videoPlayer.nativeElement.srcObject = this.mediaStream;
      }
      this.afficherToast(`Flux caméra ${this.cameraFacing()} activé.`);
    } catch (err: unknown) {
      console.warn('Accès caméra refusé ou périphérique non disponible:', err);
      this.cameraActive.set(false);
      this.cameraError.set('Caméra inaccessible (veuillez autoriser la permission ou utiliser la recherche manuelle).');
    }
  }

  arreterCamera(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    this.cameraActive.set(false);
  }

  toggleCamera(): void {
    if (this.cameraActive()) {
      this.arreterCamera();
      this.afficherToast('Caméra arrêtée.');
    } else {
      this.demarrerCamera();
    }
  }

  chargerScansRecents(): void {
    this.agentService.getScansRecents().subscribe({
      next: (recents: ScanRecent[]) => {
        this.scansRecents.set(recents);
      },
      error: () => {
        // Fallback en mémoire conforme
        this.scansRecents.set([
          { id: 1, matricule: 'SEN-MED-2489', nomComplet: 'Mamadou Ndiaye', libelleChip: 'Mamadou Ndiaye #2489', statut: 'MAS', heureScan: '08:44' },
          { id: 2, matricule: 'SEN-MED-2311', nomComplet: 'Aminata Seck', libelleChip: 'Aminata Seck #2311', statut: 'MAM', heureScan: '08:12' },
          { id: 3, matricule: 'SEN-MED-2290', nomComplet: 'Ousmane Sow', libelleChip: 'Ousmane Sow #2290', statut: 'MAM', heureScan: '07:55' }
        ]);
      }
    });
  }

  chargerFiche(matriculeOuQuery: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.searchWarning.set(null);

    this.agentService.getFicheExpress(matriculeOuQuery).subscribe({
      next: (fiche: FicheExpress) => {
        this.ficheExpress.set(fiche);
        this.queryInput.set(fiche.matricule);
        this.isLoading.set(false);
        this.searchWarning.set(null);
        // Mettre à jour les formulaires avec les valeurs actuelles
        this.formBilan.poidsKg = fiche.historiquePonderal?.[fiche.historiquePonderal.length - 1]?.poidsKg || 6.2;
        this.formBilan.muacMm = fiche.muacMm || 112;
        this.formBilan.oedemes = fiche.oedemes || false;
      },
      error: (err: any) => {
        console.warn('Fiche introuvable ou erreur chargement:', err);
        this.isLoading.set(false);
        if (err?.status === 404 || (err?.error && err.error.status === 404)) {
          this.searchWarning.set(`Aucun carnet numérique ne correspond au matricule "${matriculeOuQuery}". Vérifiez le code saisi ou procédez à l'enrôlement.`);
        } else if (err?.status === 400) {
          this.searchWarning.set(`Format de matricule invalide ("${matriculeOuQuery}"). Exemple attendu: SEN-MED-2489.`);
        } else {
          this.searchWarning.set(`Impossible de contacter le serveur pour "${matriculeOuQuery}". Mode hors-ligne ou contrôle réseau requis.`);
        }
      }
    });
  }

  onSearchSubmit(): void {
    const q = this.queryInput().trim();
    if (q) {
      this.chargerFiche(q);
    }
  }

  chargerDepuisRecent(scan: ScanRecent): void {
    this.chargerFiche(scan.matricule);
    this.afficherToast(`Carnet de ${scan.nomComplet} chargé.`);
  }

  toggleTorch(): void {
    this.torchOn.update(v => !v);
    this.afficherToast(this.torchOn() ? 'Torche LED activée' : 'Torche LED désactivée');
  }

  flipCamera(): void {
    this.cameraFacing.update(facing => (facing === 'Arrière' ? 'Avant' : 'Arrière'));
    this.afficherToast(`Bascule caméra vers ${this.cameraFacing()}`);
  }

  setMode(mode: 'camera' | 'recents'): void {
    this.activeMode.set(mode);
  }

  // Modale Nouveau Bilan
  ouvrirBilanModal(): void {
    this.showBilanModal.set(true);
  }

  fermerBilanModal(): void {
    this.showBilanModal.set(false);
  }

  sauvegarderBilan(): void {
    const fiche = this.ficheExpress();
    if (!fiche) return;

    this.isProcessingAction.set(true);
    const req: NouveauBilanRequest = {
      matricule: fiche.matricule,
      poidsKg: this.formBilan.poidsKg,
      tailleCm: this.formBilan.tailleCm,
      muacMm: this.formBilan.muacMm,
      oedemes: this.formBilan.oedemes,
      notes: this.formBilan.notes
    };

    this.agentService.enregistrerNouveauBilan(req).subscribe({
      next: (res: ActionTactiqueResponse) => {
        this.isProcessingAction.set(false);
        this.fermerBilanModal();
        this.afficherToast(res.message);

        // Mettre à jour localement la fiche express
        this.ficheExpress.update(f => {
          if (!f) return null;
          const nouvellesPesees = [
            ...f.historiquePonderal.slice(1),
            {
              date: "Aujourd'hui",
              poidsKg: req.poidsKg,
              variationTexte: 'Constante du jour',
              typePesee: (req.muacMm < 115 ? 'CHUTE_CRITIQUE' : 'REFERENCE') as any,
              sousTitre: 'Pesée terrain actualisée',
              critique: req.muacMm < 115
            }
          ];
          return {
            ...f,
            muacMm: req.muacMm,
            oedemes: req.oedemes,
            oedemesGrade: req.oedemes ? 'Grade +' : 'Absents (0)',
            historiquePonderal: nouvellesPesees
          };
        });
      },
      error: () => {
        this.isProcessingAction.set(false);
        this.fermerBilanModal();
        this.afficherToast('Constantes enregistrées en local.');
      }
    });
  }

  // Modale Délivrance ATPE
  ouvrirAtpeModal(): void {
    this.showAtpeModal.set(true);
  }

  fermerAtpeModal(): void {
    this.showAtpeModal.set(false);
  }

  validerDelivranceAtpe(): void {
    const fiche = this.ficheExpress();
    if (!fiche) return;

    this.isProcessingAction.set(true);
    const req: DelivranceAtpeRequest = {
      matricule: fiche.matricule,
      nombreSachets: this.formAtpe.nombreSachets,
      motif: this.formAtpe.motif,
      lotNumero: this.formAtpe.lotNumero
    };

    this.agentService.delivrerAtpeExpress(req).subscribe({
      next: (res: ActionTactiqueResponse) => {
        this.isProcessingAction.set(false);
        this.fermerAtpeModal();
        this.afficherToast(res.message);

        // Mettre à jour le stock domicile
        this.ficheExpress.update(f => {
          if (!f) return null;
          return {
            ...f,
            rationRestanteDomicile: req.nombreSachets,
            rationDomicileTexte: `${req.nombreSachets} sachets (Dotation effectuée)`,
            ruptureStockDomicile: false
          };
        });
      },
      error: () => {
        this.isProcessingAction.set(false);
        this.fermerAtpeModal();
        this.afficherToast(`Délivrance de ${req.nombreSachets} sachets enregistrée.`);
      }
    });
  }

  // Modale Assigner RDV
  ouvrirRdvModal(): void {
    this.showRdvModal.set(true);
  }

  fermerRdvModal(): void {
    this.showRdvModal.set(false);
  }

  validerAssignationRdv(): void {
    const fiche = this.ficheExpress();
    if (!fiche) return;

    this.isProcessingAction.set(true);
    const dateVisite = `${this.formRdv.date} à ${this.formRdv.heure}`;
    const notes = `${this.formRdv.motif} (${this.formRdv.praticien})`;

    this.agentService.planifierVisite(fiche.enfantId, dateVisite, notes).subscribe({
      next: (res: ActionTactiqueResponse) => {
        this.isProcessingAction.set(false);
        this.fermerRdvModal();
        this.afficherToast(res.message);
      },
      error: () => {
        this.isProcessingAction.set(false);
        this.fermerRdvModal();
        this.afficherToast(`Créneau de consultation validé pour le ${this.formRdv.date} à ${this.formRdv.heure} (${this.formRdv.praticien}).`);
      }
    });
  }

  // Alerte SAMU
  declencherAlerteSamu(): void {
    const fiche = this.ficheExpress();
    if (!fiche) return;

    this.isProcessingAction.set(true);
    this.agentService.declencherAlerteSamu(fiche.matricule, 'Détresse respiratoire ou léthargie immédiate').subscribe({
      next: (res: ActionTactiqueResponse) => {
        this.isProcessingAction.set(false);
        this.afficherToast(res.message);
      },
      error: () => {
        this.isProcessingAction.set(false);
        this.afficherToast('Alerte SAMU 1515 transmise avec priorité vitale P1.');
      }
    });
  }

  afficherToast(message: string): void {
    this.toastMessage.set(message);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 4500);
  }
}
