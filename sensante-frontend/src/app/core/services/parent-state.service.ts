import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BackendBilanAntro, BackendEnfant, BackendSupleNutritionnel, Child, MuacZone } from '../models/parent-space.model';
import { catchError, of, forkJoin } from 'rxjs';

import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ParentStateService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Core State Signals
  readonly children = signal<Child[]>([]);
  readonly selectedChildId = signal<number | null>(null);
  readonly bilans = signal<BackendBilanAntro[]>([]);
  readonly supplements = signal<BackendSupleNutritionnel[]>([]);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  // Selected Child Derived Signal
  readonly selectedChild = computed<Child | null>(() => {
    const list = this.children();
    const id = this.selectedChildId();
    if (!list || list.length === 0) return null;
    return list.find(c => c.id === id) ?? list[0];
  });

  // Pillbox & Offline Synchronization Signals
  readonly pillboxState = signal<{ [key: string]: { done: boolean; timestamp?: string } }>({
    'slot-1': { done: true, timestamp: '08:12' },
    'slot-2': { done: false },
    'slot-3': { done: false }
  });

  readonly isSyncing = signal<boolean>(false);
  readonly lastSyncLabel = signal<string>('Dernière synchro relais : il y a 2 min • Enregistré hors-ligne');
  readonly appointmentConfirmed = signal<boolean>(false);
  readonly appointmentPostponed = signal<boolean>(false);

  // Computed Pillbox completion counter
  readonly pillboxProgress = computed(() => {
    const state = this.pillboxState();
    let count = 0;
    const total = 3;
    Object.values(state).forEach(s => {
      if (s.done) count++;
    });
    return `${count}/${total} pris`;
  });

  constructor() {
    this.restorePillboxState();
    this.loadParentData();
  }

  /**
   * Charge la liste des enfants rattachés au parent connecté depuis l'API Spring Boot
   */
  loadParentData(): void {
    this.loading.set(true);
    this.error.set(null);

    if (!this.authService.isAuthenticated()) {
      this.loading.set(false);
      this.error.set('Connexion requise : Veuillez vous connecter avec votre compte parent.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/parent/dashboard' } });
      return;
    }

    // Endpoint sécurisé : le backend extrait l'email depuis le JWT.
    // Aucun paramètre client n'est utilisé — isolation totale par utilisateur.
    const url = `/api/enfants/mes-enfants`;

    this.http.get<BackendEnfant[]>(url).pipe(
      catchError((err: unknown) => {
        console.error('Erreur chargement enfants parent:', err);
        const httpErr = err as HttpErrorResponse;
        if (httpErr && (httpErr.status === 403 || httpErr.status === 401)) {
          this.error.set('Session expirée ou non autorisée. Redirection vers la page de connexion...');
          setTimeout(() => {
            this.authService.logout();
          }, 1000);
        } else {
          this.error.set('Impossible de récupérer les enfants du foyer. Veuillez vérifier votre connexion.');
        }
        return of([] as BackendEnfant[]);
      })
    ).subscribe((backendChildren: BackendEnfant[]) => {
      if (!backendChildren || backendChildren.length === 0) {
        this.children.set([]);
        this.loading.set(false);
        return;
      }

      // Pour chaque enfant, requêter ses bilans anthropométriques réels en parallèle
      const bilanRequests = backendChildren.map((child: BackendEnfant) =>
        this.http.get<BackendBilanAntro[]>(`/api/bilan-anthro/enfant/${child.enfantId}`).pipe(
          catchError(() => of([] as BackendBilanAntro[]))
        )
      );

      forkJoin(bilanRequests).subscribe({
        next: (bilansPerChild: BackendBilanAntro[][]) => {
          const mappedChildren: Child[] = backendChildren.map((child: BackendEnfant, index: number) => {
            const childBilans = bilansPerChild[index] || [];
            return this.mapToDomainChild(child, childBilans);
          });

          this.children.set(mappedChildren);
          if (mappedChildren.length > 0 && !this.selectedChildId()) {
            this.selectedChildId.set(mappedChildren[0].id);
            this.loadBilansForCurrentChild(mappedChildren[0].id);
          }
          this.loading.set(false);
        },
        error: (err: unknown) => {
          console.error('Erreur bilans enfants:', err);
          this.loading.set(false);
        }
      });
    });
  }

  /**
   * Sélectionne un enfant dans le sélecteur de fratrie
   */
  selectChild(id: number): void {
    this.selectedChildId.set(id);
    this.loadBilansForCurrentChild(id);
  }

  /**
   * Charge l'historique des bilans pour l'enfant sélectionné (utilisé pour les courbes)
   */
  loadBilansForCurrentChild(childId: number): void {
    this.http.get<BackendBilanAntro[]>(`/api/bilan-anthro/enfant/${childId}`).pipe(
      catchError(() => of([] as BackendBilanAntro[]))
    ).subscribe((data: BackendBilanAntro[]) => {
      this.bilans.set(data || []);
    });

    this.http.get<BackendSupleNutritionnel[]>(`/api/suples-nutritionnels/enfant/${childId}`).pipe(
      catchError(() => of([] as BackendSupleNutritionnel[]))
    ).subscribe((data: BackendSupleNutritionnel[]) => {
      this.supplements.set(data || []);
    });

    // Chargement du RDV médical actif pour enrichir l'enfant sélectionné
    this.http.get<any>(`/api/rendez-vous/enfant/${childId}`).pipe(
      catchError(() => of(null))
    ).subscribe((rdvData: any) => {
      if (rdvData?.rendezVousActif) {
        const rdv = rdvData.rendezVousActif;
        this.children.update(list => list.map(c => {
          if (c.id === childId) {
            return {
              ...c,
              rdvDateStr: rdv.dateRendezVous,
              rdvHeure: rdv.heureRendezVous,
              rdvMotif: rdv.motifParent || rdv.titre,
              rdvPraticien: rdv.nomPraticien,
              rdvLieu: rdv.nomStructure,
              rdvDaysLeft: rdv.joursAvantRdv ?? null
            };
          }
          return c;
        }));
      }
    });

    // Chargement du carnet vaccinal pour enrichir l'enfant sélectionné
    this.http.get<any>(`/api/carnet-sante/enfant/${childId}`).pipe(
      catchError(() => of(null))
    ).subscribe((carnetData: any) => {
      if (carnetData?.vaccinsNaissance) {
        const totalVaccins = carnetData.vaccinsNaissance.length;
        this.children.update(list => list.map(c => {
          if (c.id === childId) {
            return {
              ...c,
              vaccinsCount: `${totalVaccins} vaccins reçus`,
              vaccinsPct: Math.min(100, Math.round((totalVaccins / 12) * 100)),
              prochainRappel: totalVaccins >= 10 ? 'VAR 2 (18 mois)' : 'Prochain rappel PEV'
            };
          }
          return c;
        }));
      }
    });
  }

  /**
   * Bascule l'état d'une prise du pilulier avec horodatage et sauvegarde locale
   */
  togglePillboxSlot(slotId: string, defaultHour: string): boolean {
    const current = this.pillboxState();
    const slot = current[slotId] || { done: false };
    const newDone = !slot.done;

    const now = new Date();
    const timeStr = newDone
      ? `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      : undefined;

    const updated = {
      ...current,
      [slotId]: {
        done: newDone,
        timestamp: timeStr
      }
    };

    this.pillboxState.set(updated);
    this.savePillboxState(updated);
    return newDone;
  }

  /**
   * Synchronisation manuelle avec l'agent Badien Gox
   */
  syncPillbox(): void {
    this.isSyncing.set(true);
    setTimeout(() => {
      this.isSyncing.set(false);
      this.lastSyncLabel.set('Synchronisé à l\'instant avec le poste de santé');
    }, 900);
  }

  confirmAppointment(): void {
    this.appointmentConfirmed.set(true);
  }

  postponeAppointment(): void {
    this.appointmentPostponed.set(true);
  }

  // --- Mappings & Calculs Métier ---

  private mapToDomainChild(child: BackendEnfant, bilans: BackendBilanAntro[]): Child {
    // Dernier bilan chronologique
    const lastBilan = bilans.length > 0 ? bilans[bilans.length - 1] : null;

    const ageMonths = this.calculateAgeMonths(child.dateNaissance);
    const muac = lastBilan ? lastBilan.perimetreBrachial : 0;
    const muacZone: MuacZone = muac > 0
      ? (muac < 11.5 ? 'MAS' : muac <= 12.5 ? 'MAM' : 'NORMAL')
      : 'NORMAL'; // Pas de bilan = pas de zone à afficher

    // Nom du centre issu de l'entité StructureSante liée à l'enfant (via backend)
    const nomCentre = child.structureSanteNom || 'Centre non renseigné';

    // Calcul du gain pondéral réel entre les deux derniers bilans
    let gainHebdo: string | null = null;
    if (bilans.length >= 2) {
      const last = bilans[bilans.length - 1];
      const prev = bilans[bilans.length - 2];
      if (last.poids != null && prev.poids != null) {
        const diffG = Math.round((last.poids - prev.poids) * 1000);
        gainHebdo = diffG >= 0 ? `+${diffG}g ce mois` : `${diffG}g ce mois`;
      }
    }

    const matricule = child.matricule || child.qrCode || `SN-DKR-${child.enfantId}`;

    return {
      id: child.enfantId,
      matricule: matricule,
      nom: child.nom,
      prenom: child.prenom,
      genre: child.genre === 'FEMININ' ? 'F' : 'M',
      dateNaissance: child.dateNaissance,
      ageMois: ageMonths,
      photoUrl: child.genre === 'FEMININ' ? '/assets/avatars/child-girl.png' : '/assets/avatars/child-boy.png',
      muac: muac,
      muacZone: muacZone,
      statutPcima: muacZone === 'MAS'
        ? 'Malnutrition Aiguë Sévère'
        : muacZone === 'MAM'
          ? 'Malnutrition Aiguë Modérée'
          : 'Statut Nutritionnel Normal',
      poidsActuel: lastBilan?.poids ?? null,
      tailleActuelle: lastBilan?.taille ?? null,
      pcActuel: lastBilan?.perimetreCranien ?? null,
      groupeSanguin: child.groupeSanguin || 'O+',
      zScorePoidsTaille: lastBilan?.zScorePoidsTaille ?? null,
      gainHebdo: gainHebdo,
      centreRattachement: nomCentre,
      protocoleActuel: muacZone !== 'NORMAL' ? "Dotation PRN \u2022 Plumpy'Sup" : 'Suivi Préventif PEV & Croissance',
      protocoleType: muacZone,
      vaccinsCount: null,
      vaccinsPct: null,
      prochainRappel: null,
      sachetsParJour: null,
      progressionGuerisonPct: null,
      rdvDateStr: null,
      rdvDaysLeft: null,
      rdvMotif: null,
      rdvHeure: null,
      rdvPraticien: null,
      rdvLieu: null,
      rdvConfirmed: false,
      isActive: true
    };
  }

  private calculateAgeMonths(birthDateStr: string): number {
    if (!birthDateStr) return 7;
    const birth = new Date(birthDateStr);
    const now = new Date();
    const yearsDiff = now.getFullYear() - birth.getFullYear();
    const monthsDiff = now.getMonth() - birth.getMonth();
    return Math.max(1, yearsDiff * 12 + monthsDiff);
  }

  private restorePillboxState(): void {
    try {
      const stored = localStorage.getItem('sensante_pillbox_state');
      if (stored) {
        this.pillboxState.set(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Impossible de restaurer le pilulier:', e);
    }
  }

  private savePillboxState(state: any): void {
    try {
      localStorage.setItem('sensante_pillbox_state', JSON.stringify(state));
    } catch (e) {
      console.warn('Impossible de sauvegarder le pilulier:', e);
    }
  }
}
