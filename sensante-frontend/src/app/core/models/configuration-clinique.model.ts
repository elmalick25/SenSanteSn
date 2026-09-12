export interface MuacThresholds {
  masMaxMm: number; // e.g. 115 mm
  mamMaxMm: number; // e.g. 124 mm
  normalMinMm: number; // e.g. 125 mm
}

export interface QueueBufferConfig {
  bufferInterConsultationMinutes: number; // e.g. 15 min
  toleranceRetardMinutes: number;          // e.g. 10 min
  plafondUrgencesParVacation: number;      // e.g. 4 cas
  tauxOccupationCalibrePct: number;        // e.g. 78%
  reductionAttenteEstimeePct: number;      // e.g. 42%
}

export interface ZScoreReferenceRow {
  id: string;
  ageMois: number;
  sexe: 'F' | 'M';
  indicateur: 'POIDS_AGE' | 'TAILLE_AGE';
  masMoins3ET: number;
  mamMoins2ET: number;
  medianeOms: number;
  plus2ET: number;
  unite: string;
  statutValidation: 'CONFORME_OMS' | 'DEROGATION';
}

export interface AtpeTier {
  id: string;
  tranchePoids: string; // e.g. "3.5 - 4.9 kg"
  poidsMin: number;
  poidsMax: number;
  sachetsParJour: number; // e.g. 2
  equivKcalJour: number;   // e.g. 1000
  dureePrescription: string; // "7 jours (phase 1)"
  uniteConditionnement: string; // "Sachet 92g (500 kcal)"
  rationHebdoTotale: number; // sachetsParJour * 7
  triageSpecialise: boolean;
  recommandationSpeciale?: string;
}

export interface ConfigurationClinique {
  versionProtocole: string;
  derniereRevisionDate: string;
  derniereRevisionTexte: string;
  modifiePar: string;
  titreAuteur: string;
  postesSynchronisesCount: number;
  modificationsEnAttenteCount: number;
  coefficientTamponPna: number;

  muac: MuacThresholds;
  queueBuffer: QueueBufferConfig;
  zscoreRows: ZScoreReferenceRow[];
  atpeTiers: AtpeTier[];
}

export interface DiffusionResult {
  statut: string;
  postesSynchronises: number;
  versionProtocole: string;
  timestampGmt: string;
  message: string;
}
