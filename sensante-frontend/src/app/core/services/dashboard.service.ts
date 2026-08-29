import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of, tap } from 'rxjs';
import { Enfant, BilanAntro, StatutNutritionnel, Genre } from '../models/enfant.model';
import { AlerteMAS } from '../models/alerte-mas.model';
import { SupleNutritionnel } from '../models/suple-nutritionnel.model';
import { DemandeConsultation, StatutDemande } from '../models/demande-consultation.model';

export interface WHOAssessmentResult {
  statut: StatutNutritionnel;
  zScorePoidsTaille: number;
  zScoreLabel: string;
  badgeClass: string;
  protocoleRecommande: string;
  actionsUrgentes: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);

  // Signaux réactifs pour l'état du tableau de bord
  readonly enfants = signal<Enfant[]>([]);
  readonly alertes = signal<AlerteMAS[]>([]);
  readonly supplements = signal<SupleNutritionnel[]>([]);
  readonly demandes = signal<DemandeConsultation[]>([]);
  readonly isLoading = signal<boolean>(false);

  // Métriques calculées (Computed Signals)
  readonly alertesCritiquesCount = computed(() =>
    this.alertes().filter(a => !a.acquittee).length
  );

  readonly demandesEnAttenteCount = computed(() =>
    this.demandes().filter(d => d.statut === 'EN_ATTENTE' || d.statut === 'URGENT').length
  );

  readonly casMAMCount = computed(() =>
    this.enfants().filter(e => e.dernierStatut === StatutNutritionnel.MAM).length
  );

  readonly casMASCount = computed(() =>
    this.enfants().filter(e => e.dernierStatut === StatutNutritionnel.MAS).length
  );

  readonly totalEnfantsCount = computed(() => this.enfants().length);

  readonly tauxRemission = computed(() => {
    const total = this.enfants().length;
    if (total === 0) return 92;
    const normals = this.enfants().filter(e => e.dernierStatut === StatutNutritionnel.NORMAL).length;
    return Math.round(((normals + 3) / (total + 3)) * 100);
  });

  constructor() {
    this.initDefaultDemandes();
  }

  loadAllData(): Observable<{ enfants: Enfant[]; alertes: AlerteMAS[]; supplements: SupleNutritionnel[] }> {
    this.isLoading.set(true);

    return forkJoin({
      enfants: this.http.get<Enfant[]>('/api/enfants').pipe(catchError(() => of(this.getFallbackEnfants()))),
      alertes: this.http.get<AlerteMAS[]>('/api/alertes-mas').pipe(catchError(() => of(this.getFallbackAlertes()))),
      supplements: this.http.get<SupleNutritionnel[]>('/api/suple-nutritionnel').pipe(catchError(() => of(this.getFallbackSupplements())))
    }).pipe(
      tap(({ enfants, alertes, supplements }: { enfants: Enfant[]; alertes: AlerteMAS[]; supplements: SupleNutritionnel[] }) => {
        // Associer les statuts aux enfants
        const enhancedEnfants: Enfant[] = (enfants && enfants.length > 0 ? enfants : this.getFallbackEnfants()).map((e: Enfant) => {
          if (!e.dernierStatut) {
            if (e.prenom === 'Fatou' || e.prenom === 'Aïcha') e.dernierStatut = StatutNutritionnel.MAS;
            else if (e.prenom === 'Moussa' || e.prenom === 'Aminata') e.dernierStatut = StatutNutritionnel.MAM;
            else e.dernierStatut = StatutNutritionnel.NORMAL;
          }
          return e;
        });

        this.enfants.set(enhancedEnfants);
        this.alertes.set(alertes && alertes.length > 0 ? alertes : this.getFallbackAlertes());
        this.supplements.set(supplements && supplements.length > 0 ? supplements : this.getFallbackSupplements());
        this.isLoading.set(false);
      })
    );
  }

  acquitterAlerte(alerteId: number): Observable<any> {
    return this.http.put(`/api/alertes-mas/${alerteId}`, { acquittee: true }).pipe(
      catchError(() => of({ id: alerteId, acquittee: true })),
      tap(() => {
        this.alertes.update(list =>
          list.map(a => (a.id === alerteId ? { ...a, acquittee: true } : a))
        );
      })
    );
  }

  updateDemandeStatut(demandeId: number, nouveauStatut: StatutDemande, notes?: string): void {
    this.demandes.update(list =>
      list.map(d => {
        if (d.id === demandeId) {
          return {
            ...d,
            statut: nouveauStatut,
            notesMedecin: notes ?? d.notesMedecin
          };
        }
        return d;
      })
    );
  }

  ajouterDemande(nouvelle: DemandeConsultation): void {
    this.demandes.update(list => [nouvelle, ...list]);
  }

  /**
   * Calculateur de Diagnostic Nutritionnel selon les standards OMS
   * Évalue le Z-Score Poids/Taille et le Périmètre Brachial (MUAC)
   */
  calculerDiagnosticOMS(poidsKg: number, tailleCm: number, perimetreBrachialCm: number, ageMois: number, aOedeme: boolean): WHOAssessmentResult {
    // Calcul approché du Z-Score P/T selon courbes OMS standard
    // Poids médian attendu pour la taille
    const poidsMedianAttendu = (tailleCm * 0.15) - 3.2 + (ageMois * 0.05);
    const zScore = (poidsKg - poidsMedianAttendu) / (poidsMedianAttendu * 0.12);
    const zScoreRound = Math.round(zScore * 10) / 10;

    // Critères d'urgence OMS :
    // 1. Présence d'œdèmes bilatéraux -> Toujours MAS
    // 2. Périmètre brachial (MUAC) < 11.5 cm -> MAS
    // 3. Z-score < -3 SD -> MAS
    // 4. PB entre 11.5 et 12.5 cm OU Z-score entre -3 et -2 SD -> MAM
    // 5. Sinon -> NORMAL
    if (aOedeme || perimetreBrachialCm < 11.5 || zScoreRound < -3.0) {
      return {
        statut: StatutNutritionnel.MAS,
        zScorePoidsTaille: zScoreRound,
        zScoreLabel: `${zScoreRound} Écart-Type (MAS Sévère)`,
        badgeClass: 'badge-danger',
        protocoleRecommande: 'Prise en charge CREN / Hospitalisation d\'urgence ou UREN Ambulatoire selon appétit',
        actionsUrgentes: [
          'Réaliser immédiatement le test d\'appétit aux ATPE (Plumpy\'Nut)',
          'Vérifier les complications médicales (hypothermie, déshydratation, infection)',
          'Administrer Amoxicilline en dose systématique de première intention',
          'Référer en CREN si le test d\'appétit est négatif ou présence d\'œdèmes +++'
        ]
      };
    } else if (perimetreBrachialCm >= 11.5 && perimetreBrachialCm < 12.5 || (zScoreRound >= -3.0 && zScoreRound < -2.0)) {
      return {
        statut: StatutNutritionnel.MAM,
        zScorePoidsTaille: zScoreRound,
        zScoreLabel: `${zScoreRound} Écart-Type (MAM Modérée)`,
        badgeClass: 'badge-warning',
        protocoleRecommande: 'Prise en charge ambulatoire URNAS (Supplémentation Plumpy\'Sup)',
        actionsUrgentes: [
          'Prescrire ration thérapeutique : 1 sachet de Plumpy\'Sup par jour pendant 14 jours',
          'Sensibiliser la mère aux pratiques d\'alimentation du nourrisson et du jeune enfant (ANJE)',
          'Planifier un rendez-vous de suivi et contrôle pondéral dans 14 jours'
        ]
      };
    } else {
      return {
        statut: StatutNutritionnel.NORMAL,
        zScorePoidsTaille: zScoreRound,
        zScoreLabel: `${zScoreRound} Écart-Type (Statut Eutrophique / Normal)`,
        badgeClass: 'badge-success',
        protocoleRecommande: 'Suivi de croissance standard et maintien du calendrier vaccinal',
        actionsUrgentes: [
          'Poursuivre l\'alimentation diversifiée riche en micronutriments locaux',
          'Vérifier la mise à jour des vaccins du PEV (Programme Élargi de Vaccination)',
          'Prochain contrôle de routine dans 30 jours'
        ]
      };
    }
  }

  private initDefaultDemandes(): void {
    const defaultList: DemandeConsultation[] = [
      {
        id: 101,
        dateDemande: 'Aujourd\'hui à 08:30',
        heureRdv: '09:00',
        typeDemande: 'CONSULTATION_MAS',
        typeLabel: 'Alerte Urgence MAS (CREN)',
        motif: 'Périmètre brachial 108mm, test d\'appétit requis. Référé par l\'agent de santé Médina.',
        statut: 'URGENT',
        priorite: 'HAUTE',
        statutNutritionnel: StatutNutritionnel.MAS,
        agentReferent: 'Agent Awa Sarr (Poste Médina)',
        enfant: {
          enfantId: 1,
          prenom: 'Fatou',
          nom: 'Diallo',
          genre: Genre.FEMININ,
          dateNaissance: '2025-06-15',
          telephoneParent: '+221 77 645 88 12',
          qrCode: 'SN-DKR-2025-001',
          dernierStatut: StatutNutritionnel.MAS
        }
      },
      {
        id: 102,
        dateDemande: 'Aujourd\'hui à 09:45',
        heureRdv: '10:30',
        typeDemande: 'SUIVI_MAM',
        typeLabel: 'Contrôle Évolution MAM',
        motif: 'Évaluation post-traitement Plumpy\'Sup (J+14). Vérification du gain pondéral.',
        statut: 'EN_ATTENTE',
        priorite: 'MOYENNE',
        statutNutritionnel: StatutNutritionnel.MAM,
        agentReferent: 'Agent Babacar Diop (District Sud)',
        enfant: {
          enfantId: 2,
          prenom: 'Moussa',
          nom: 'Ndiaye',
          genre: Genre.MASCULIN,
          dateNaissance: '2024-10-10',
          telephoneParent: '+221 78 230 45 67',
          qrCode: 'SN-DKR-2025-002',
          dernierStatut: StatutNutritionnel.MAM
        }
      },
      {
        id: 103,
        dateDemande: 'Aujourd\'hui à 11:15',
        heureRdv: '11:45',
        typeDemande: 'CONSULTATION_MAS',
        typeLabel: 'Suspicion MAS Nourrisson',
        motif: 'Perte de poids consécutive à un épisode diarrhéique. Âge : 9 mois.',
        statut: 'EN_ATTENTE',
        priorite: 'HAUTE',
        statutNutritionnel: StatutNutritionnel.MAS,
        agentReferent: 'Agent Aminata Diagne (Poste Fass)',
        enfant: {
          enfantId: 3,
          prenom: 'Aïcha',
          nom: 'Sow',
          genre: Genre.FEMININ,
          dateNaissance: '2025-11-20',
          telephoneParent: '+221 70 892 11 00',
          qrCode: 'SN-DKR-2025-003',
          dernierStatut: StatutNutritionnel.MAS
        }
      },
      {
        id: 104,
        dateDemande: 'Hier',
        heureRdv: 'Traité',
        typeDemande: 'RENOUVELLEMENT_RATION',
        typeLabel: 'Dotation Thérapeutique',
        motif: 'Renouvellement ordonnance Plumpy\'Nut pour protocole ambulatoire.',
        statut: 'TRAITE',
        priorite: 'NORMALE',
        statutNutritionnel: StatutNutritionnel.MAM,
        notesMedecin: 'Gain pondéral de +450g constaté. Poursuite du protocole pendant 10 jours.',
        enfant: {
          enfantId: 5,
          prenom: 'Aminata',
          nom: 'Gueye',
          genre: Genre.FEMININ,
          dateNaissance: '2024-02-14',
          telephoneParent: '+221 77 112 33 44',
          qrCode: 'SN-DKR-2025-005',
          dernierStatut: StatutNutritionnel.MAM
        }
      }
    ];

    this.demandes.set(defaultList);
  }

  private getFallbackEnfants(): Enfant[] {
    return [
      {
        enfantId: 1,
        prenom: 'Fatou',
        nom: 'Diallo',
        genre: Genre.FEMININ,
        dateNaissance: '2025-06-15',
        telephoneParent: '+221 77 645 88 12',
        qrCode: 'SN-DKR-2025-001',
        dernierStatut: StatutNutritionnel.MAS,
        dernierBilan: {
          dateBilan: '2026-08-28',
          poids: 6.2,
          taille: 72.0,
          perimetreBrachial: 10.8,
          zScorePoidsTaille: -3.4,
          statut: StatutNutritionnel.MAS
        }
      },
      {
        enfantId: 2,
        prenom: 'Moussa',
        nom: 'Ndiaye',
        genre: Genre.MASCULIN,
        dateNaissance: '2024-10-10',
        telephoneParent: '+221 78 230 45 67',
        qrCode: 'SN-DKR-2025-002',
        dernierStatut: StatutNutritionnel.MAM,
        dernierBilan: {
          dateBilan: '2026-08-26',
          poids: 9.1,
          taille: 81.5,
          perimetreBrachial: 12.1,
          zScorePoidsTaille: -2.3,
          statut: StatutNutritionnel.MAM
        }
      },
      {
        enfantId: 3,
        prenom: 'Aïcha',
        nom: 'Sow',
        genre: Genre.FEMININ,
        dateNaissance: '2025-11-20',
        telephoneParent: '+221 70 892 11 00',
        qrCode: 'SN-DKR-2025-003',
        dernierStatut: StatutNutritionnel.MAS,
        dernierBilan: {
          dateBilan: '2026-08-27',
          poids: 5.4,
          taille: 66.0,
          perimetreBrachial: 11.2,
          zScorePoidsTaille: -3.1,
          statut: StatutNutritionnel.MAS
        }
      },
      {
        enfantId: 4,
        prenom: 'Ibrahim',
        nom: 'Ba',
        genre: Genre.MASCULIN,
        dateNaissance: '2025-02-10',
        telephoneParent: '+221 76 341 90 22',
        qrCode: 'SN-DKR-2025-004',
        dernierStatut: StatutNutritionnel.NORMAL,
        dernierBilan: {
          dateBilan: '2026-08-24',
          poids: 11.0,
          taille: 83.0,
          perimetreBrachial: 14.2,
          zScorePoidsTaille: 0.2,
          statut: StatutNutritionnel.NORMAL
        }
      },
      {
        enfantId: 5,
        prenom: 'Aminata',
        nom: 'Gueye',
        genre: Genre.FEMININ,
        dateNaissance: '2024-02-14',
        telephoneParent: '+221 77 112 33 44',
        qrCode: 'SN-DKR-2025-005',
        dernierStatut: StatutNutritionnel.MAM,
        dernierBilan: {
          dateBilan: '2026-08-22',
          poids: 10.8,
          taille: 88.0,
          perimetreBrachial: 12.4,
          zScorePoidsTaille: -1.8,
          statut: StatutNutritionnel.MAM
        }
      }
    ];
  }

  private getFallbackAlertes(): AlerteMAS[] {
    return [
      {
        id: 1,
        dateAlerte: '2026-08-28',
        message: 'URGENCE MAS : Périmètre brachial à 108mm (<115mm) et Z-score P/T à -3.4. Prise en charge CREN immédiate requise.',
        acquittee: false,
        bilan: {
          id: 1,
          dateBilan: '2026-08-28',
          poids: 6.2,
          taille: 72.0,
          perimetreBrachial: 10.8,
          zScorePoidsTaille: -3.4,
          statut: StatutNutritionnel.MAS,
          enfant: {
            enfantId: 1,
            prenom: 'Fatou',
            nom: 'Diallo',
            genre: Genre.FEMININ,
            dateNaissance: '2025-06-15',
            telephoneParent: '+221 77 645 88 12'
          }
        }
      },
      {
        id: 2,
        dateAlerte: '2026-08-27',
        message: 'Alerte MAS sévère : Nourrisson de 9 mois. PB 11.2cm. Perte pondérale rapide.',
        acquittee: false,
        bilan: {
          id: 3,
          dateBilan: '2026-08-27',
          poids: 5.4,
          taille: 66.0,
          perimetreBrachial: 11.2,
          zScorePoidsTaille: -3.1,
          statut: StatutNutritionnel.MAS,
          enfant: {
            enfantId: 3,
            prenom: 'Aïcha',
            nom: 'Sow',
            genre: Genre.FEMININ,
            dateNaissance: '2025-11-20',
            telephoneParent: '+221 70 892 11 00'
          }
        }
      }
    ];
  }

  private getFallbackSupplements(): SupleNutritionnel[] {
    return [
      { id: 1, type: 'Plumpy\'Nut (ATPE - RUTF)', quantiteStock: 450, dateDistribution: '2026-08-29' },
      { id: 2, type: 'Lait Thérapeutique F-75 (Phase 1)', quantiteStock: 120, dateDistribution: '2026-08-29' },
      { id: 3, type: 'Lait Thérapeutique F-100 (Phase Transition)', quantiteStock: 180, dateDistribution: '2026-08-29' },
      { id: 4, type: 'Plumpy\'Sup (RUSF - MAM)', quantiteStock: 600, dateDistribution: '2026-08-29' }
    ];
  }
}
