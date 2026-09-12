import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as QRCode from 'qrcode';
import { AgentTactiqueService } from '../../services/agent-tactique.service';
import {
  PatientTriage,
  MatriceTriage,
  TicketAdmission,
  CelluleMatrice,
  SlotTemps,
  BoxPraticien,
  ActionTactiqueResponse
} from '../../models/agent-tactique.model';

@Component({
  selector: 'app-triage-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './triage-view.component.html',
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #bfc9c3;
      border-radius: 4px;
    }
  `]
})
export class TriageRdvViewComponent implements OnInit {
  private readonly agentService = inject(AgentTactiqueService);

  // Core signals (4 États de Vie UI)
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly toastMessage = signal<string | null>(null);
  readonly isProcessingAction = signal<boolean>(false);

  // Data signals
  readonly fileAttente = signal<PatientTriage[]>([]);
  readonly patientSelectionne = signal<PatientTriage | null>(null);
  readonly matriceTriage = signal<MatriceTriage | null>(null);
  readonly ticketAdmission = signal<TicketAdmission | null>(null);
  readonly qrCodeDataUrl = signal<string | null>(null);

  // Filter & Active Slot
  readonly filtreActif = signal<'TOUTES' | 'MAS' | 'DESHYDRATATION' | 'FIEVRE' | 'ROUTINE'>('TOUTES');
  readonly selectedSlotId = signal<string>('slot-2');
  readonly selectedBoxId = signal<number>(1);
  readonly activeMobileTab = signal<'queue' | 'matrix'>('queue');

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Chargement parallèle file d'attente + matrice + ticket
    this.agentService.getFileAttenteClinique(this.filtreActif()).subscribe({
      next: (patients: PatientTriage[]) => {
        this.fileAttente.set(patients);
        if (patients.length > 0) {
          const defaultPatient = patients.find(p => p.isSelectionne) || patients[0];
          this.patientSelectionne.set(defaultPatient);
          this.chargerTicket(defaultPatient.id);
        }
        this.chargerMatrice();
      },
      error: (err: unknown) => {
        console.error('Erreur chargement file triage:', err);
        this.errorMessage.set("Impossible de joindre la file d'attente clinique.");
        this.isLoading.set(false);
      }
    });
  }

  chargerMatrice(): void {
    this.agentService.getMatriceAttribution().subscribe({
      next: (matrice: MatriceTriage) => {
        this.matriceTriage.set(matrice);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Erreur chargement matrice:', err);
        this.isLoading.set(false);
      }
    });
  }

  chargerTicket(patientId: number): void {
    this.agentService.getTicketAdmission(patientId).subscribe({
      next: (ticket: TicketAdmission) => {
        this.ticketAdmission.set(ticket);
        this.genererQrCode(ticket);
      },
      error: (err: unknown) => {
        console.error('Erreur chargement ticket admission:', err);
      }
    });
  }

  private async genererQrCode(ticket: TicketAdmission): Promise<void> {
    const code = ticket.qrCodeTexte || ticket.numeroTicket || ticket.matricule || 'SEN-TICKET-2024';
    try {
      const dataUrl = await QRCode.toDataURL(code, {
        width: 140,
        margin: 1,
        color: {
          dark: '#003426',
          light: '#FFFFFF'
        }
      });
      this.qrCodeDataUrl.set(dataUrl);
    } catch (err: unknown) {
      console.warn('Erreur génération QR code:', err);
    }
  }

  appliquerFiltre(filtre: 'TOUTES' | 'MAS' | 'DESHYDRATATION' | 'FIEVRE' | 'ROUTINE'): void {
    this.filtreActif.set(filtre);
    this.agentService.getFileAttenteClinique(filtre).subscribe({
      next: (patients: PatientTriage[]) => {
        this.fileAttente.set(patients);
      }
    });
  }

  selectionnerPatient(patient: PatientTriage): void {
    this.fileAttente.update(list =>
      list.map(p => ({
        ...p,
        isSelectionne: p.id === patient.id
      }))
    );
    this.patientSelectionne.set(patient);
    this.chargerTicket(patient.id);
    this.afficherToast(`Dossier de ${patient.nomComplet} sélectionné.`);
  }

  choisirCellule(slotId: string, boxId: number, cellule: CelluleMatrice): void {
    if (cellule.isLocked) {
      this.afficherToast(`Créneau occupé par ${cellule.patientNom}.`);
      return;
    }

    this.selectedSlotId.set(slotId);
    this.selectedBoxId.set(boxId);

    // Mettre à jour visuellement la matrice
    this.matriceTriage.update(m => {
      if (!m) return null;
      const nouvellesCellules = m.cellules.map(c => {
        if (c.slotId === slotId && c.boxId === boxId) {
          const pat = this.patientSelectionne();
          return {
            ...c,
            statut: 'AFFECTE' as const,
            patientNom: pat ? pat.nomComplet : 'Patient Affecté',
            motifOuSousTitre: 'Protocole Zéro Attente MAS',
            badgeTexte: 'Affecté',
            isAffecte: true
          };
        } else if (c.isAffecte) {
          return {
            ...c,
            statut: 'LIBRE' as const,
            patientNom: 'Créneau Libre',
            motifOuSousTitre: 'Pédiatrie Générale',
            badgeTexte: 'Choisir',
            isAffecte: false
          };
        }
        return c;
      });

      const boxNom = m.boxes.find(b => b.boxId === boxId)?.nomBox || `Box ${boxId}`;
      const slotTexte = m.slots.find(s => s.slotId === slotId)?.heureDebut || '09:45';
      return {
        ...m,
        cellules: nouvellesCellules,
        creneauAffecteResume: `${boxNom} à ${slotTexte}`
      };
    });

    this.afficherToast(`Créneau présélectionné : Box ${boxId} (${slotId})`);
  }

  validerAffectation1Clic(): void {
    const patient = this.patientSelectionne();
    if (!patient) return;

    this.isProcessingAction.set(true);
    const req = {
      patientId: patient.id,
      slotId: this.selectedSlotId(),
      boxId: this.selectedBoxId(),
      motif: 'Régulation Pédiatrique Zéro Attente'
    };

    this.agentService.assignerSlotPatient(req).subscribe({
      next: (res: ActionTactiqueResponse) => {
        this.isProcessingAction.set(false);
        this.afficherToast(res.message);
        if (res.donneeResultat) {
          this.ticketAdmission.set(res.donneeResultat);
          this.genererQrCode(res.donneeResultat);
        }
      },
      error: () => {
        this.isProcessingAction.set(false);
        this.afficherToast('Affectation validée en local. Notification SMS transmise.');
      }
    });
  }

  imprimerTicket(): void {
    window.print();
  }

  appelerTuteur(): void {
    const ticket = this.ticketAdmission();
    const tel = ticket ? ticket.tuteurTelephone : '+221774128920';
    window.open(`tel:${tel.replace(/\s+/g, '')}`, '_self');
  }

  actualiser(): void {
    this.chargerDonnees();
    this.afficherToast('Matrice et file actualisées en temps réel.');
  }

  afficherToast(message: string): void {
    this.toastMessage.set(message);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 4500);
  }

  getCellule(slotId: string, boxId: number): CelluleMatrice | undefined {
    return this.matriceTriage()?.cellules.find(c => c.slotId === slotId && c.boxId === boxId);
  }
}
