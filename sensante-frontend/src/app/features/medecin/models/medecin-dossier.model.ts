// ─────────────────────────────────────────────────────────────────────────────
// Espace Médecin — Modèles TypeScript
// Dossier Patient (Vue 360°)
// ─────────────────────────────────────────────────────────────────────────────

export interface PatientHeader {
  idPatient: number;
  nomComplet: string;
  ageLabel: string;
  sexe: string;
  nip: string;
  statutNutritionnel: string;
  statutNutritionnelBadge: string;
  boxAssignation: string;
  avatarUrl: string;

  // Tutrice & Contact
  tutriceNom: string;
  tutriceLien: string;
  adresse: string;
  telephone: string;
  cni: string;

  // Drapeaux cliniques du sous-ruban
  groupeSanguin: string;
  pbMm: number;
  statutPbLabel: string;
  poidsActuelKg: number;
  zScorePoids: string;
  regimeAlimentaire: string;
  poidsNaissanceKg: number;
  mentionNaissance: string;

  // Allergie
  hasAllergie: boolean;
  allergieTitre: string;
  allergieDetail: string;
}

export interface PointCourbeCroissance {
  ageMoisLabel: string;
  ageMois: number;
  poidsReelKg: number | null;
  z0MedianeKg: number;
  zMoins2MamKg: number;
  zMoins3MasKg: number;
  statutPoint: 'NORMAL' | 'ALERTE_MAM' | 'CRITIQUE_MAS';
  isPointActuel: boolean;
}

export interface CourbeCroissance {
  standardReference: string;
  sousTitre: string;
  commentaireVitesse: string;
  alerteClinique: string;
  points: PointCourbeCroissance[];
}

export interface BiometrieJour {
  poidsKg: number;
  zScorePoids: string;
  tailleCm: number;
  zScoreTaille: string;
  pbMm: number;
  statutRubanShakir: string;
  perimetreCranienCm: number;
  percentilePc: string;
  interpretationPediatrique: string;
  actionProtocoleRecommandee: string;
}

export interface AntecedentsNeonatals {
  materniteOrigine: string;
  termeGestationnel: string;
  poidsNaissanceG: number;
  tailleNaissanceCm: number;
  pcNaissanceCm: number;
  scoreApgar1min: string;
  scoreApgar5min: string;
  modeAccouchement: string;
  complicationsPerinatales: string;
  histoireAlimentaire: string;
  serologieVih: string;
  serologieSyphilis: string;
  serologieHbsAg: string;
  certifiePar: string;
  isRegistreValide: boolean;
}

export interface DoseVaccinPev {
  agePrevu: string;
  nomAntigenes: string;
  descriptionMaladies: string;
  dateReelle: string;
  statut: 'VALIDE' | 'A_VENIR' | 'EN_RETARD';
  badgeLabel: string;
}

export interface VaccinationPev {
  pourcentageCouverture: number;
  statutCouvertureLabel: string;
  doses: DoseVaccinPev[];
  supplementationVitA: string;
  mebendazoleStatut: string;
  derniereVerification: string;
}

export interface EvenementTimeline {
  idEvenement: number;
  dateLabel: string;
  relativeTime: string;
  titre: string;
  badgeStatut: string;
  badgeType: 'DANGER' | 'WARNING' | 'SUCCESS' | 'NEUTRAL';
  acteurNom: string;
  acteurRole: string;
  description: string;
  transmissionCanal: string;
  synchronisation: string;
  validation: string;
  puceIcone: string;
}

export interface DossierPatient360 {
  patient: PatientHeader;
  croissance: CourbeCroissance;
  biometrie: BiometrieJour;
  antecedents: AntecedentsNeonatals;
  vaccination: VaccinationPev;
  timeline: EvenementTimeline[];
  totalVisites: number;
}
