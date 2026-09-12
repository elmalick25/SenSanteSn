// ─────────────────────────────────────────────────────────────────────────────
// Espace Médecin — Modèles TypeScript
// Prise de Service (Chronogramme Opérationnel de Vacation)
// ─────────────────────────────────────────────────────────────────────────────

export interface IndicateurClinique {
  label: string;
  valeur: string;
  /** 'normal' | 'warning' | 'danger' | 'info' */
  niveau: string;
}

export interface PatientCreneau {
  idEnfant: number;
  nom: string;
  prenom: string;
  nomComplet: string;
  nip: string;
  /** Ex: "14 mois • F" */
  ageLabel: string;
  sexe: string;
  typeStatut: string;
  typeStatutLabel: string;
  indicateurs: IndicateurClinique[];
  noteInfirmier: string;
  iconeNote: string;
  couleurNote: string;
}

export interface CreneauVacation {
  idCreneau: number;
  numero: number;
  heureDebut: string;
  heureFin: string;
  /** 'MAS' | 'MAM' | 'ROUTINE' | 'EN_TRIAGE' | 'TAMPON' | 'LIBRE' */
  typeStatut: string;
  patient: PatientCreneau | null;
  couleurBarre: string;
  pulsant: boolean;
}

export interface MedecinIdentite {
  idUser: number;
  nom: string;
  prenom: string;
  nomComplet: string;
  specialite: string;
  cabinet: string;
  avatarUrl: string;
  /** 'EN_VACATION' | 'HORS_VACATION' */
  statutVacation: string;
  structureSante: string;
  email: string;
}

export interface VacationConfig {
  heureDebut: string;
  heureFin: string;
  nombreCreneaux: number;
  dureeCreneau: number;
  /** 'MATIN' | 'APRES_MIDI' | 'GARDE' */
  plageType: string;
  dureeTotaleLabel: string;
  margeTamponMinutes: number;
  maxPatients: number;
}

export interface VacationOverview {
  totalCreneaux: number;
  assignes: number;
  urgencesMAS: number;
  casMAM: number;
  casRoutine: number;
  creneauxLibres: number;
  margeTamponLibelle: string;
  tauxRemplissage: number;
  tauxRemplissageLabel: string;
}

export interface VacationPriseDeService {
  identiteMedecin: MedecinIdentite;
  config: VacationConfig;
  overview: VacationOverview;
  creneaux: CreneauVacation[];
  consigneVacation: string;
  dateVacation: string;
  structureLabel: string;
}

// ── Requêtes / Réponses ─────────────────────────────────────────────────────

export interface AppelerBoxRequest {
  idCreneau: number;
  motif?: string;
}

export interface AppelerBoxResponse {
  /** 'EN_COURS' | 'PATIENT_EN_ROUTE' | 'CONFIRME' | 'ERREUR' */
  statut: string;
  message: string;
  idCreneau: number;
  nomPatient: string | null;
  heurePrevue: string | null;
}

export interface ReconfigurerVacationRequest {
  heureDebut: string;
  heureFin: string;
  nombreCreneaux: number;
  /** 'MATIN' | 'APRES_MIDI' | 'GARDE' */
  plageType: string;
}

// ── UI State helpers ─────────────────────────────────────────────────────────

/** État d'un bouton "Appeler Box" sur une carte créneau */
export interface AppelBoxUiState {
  idCreneau: number;
  /** 'idle' | 'calling' | 'confirmed' */
  etat: 'idle' | 'calling' | 'confirmed';
}
