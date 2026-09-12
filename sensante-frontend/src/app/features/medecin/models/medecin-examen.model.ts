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
  tutriceNom: string;
  tutriceLien: string;
  adresse: string;
  telephone: string;
  cni: string;
  groupeSanguin: string;
  pbMm: number;
  statutPbLabel: string;
  poidsActuelKg: number;
  zScorePoids: string;
  regimeAlimentaire: string;
  poidsNaissanceKg: number;
  mentionNaissance: string;
  hasAllergie: boolean;
  allergieTitre?: string;
  allergieDetail?: string;
  temperatureC: number;
  temperatureLabel: string;
  frequenceRespiratoire: number;
  frequenceRespiratoireLabel: string;
}

export interface SigneDangerItem {
  code: string;
  libelle: string;
  sousTitre: string;
  present: boolean;
  alerte: boolean;
  detailClinique: string;
}

export interface OedemeHydratation {
  oedemesBilaterauxLabel: string;
  oedemesGrade: number;
  godetTestDetails: string;
  pliCutaneAbdominal: string;
  pliCutaneTestDetails: string;
  diarrheePersistante: boolean;
  diarrheeJours: number;
  diarrheeType: string;
  diarrheeDetails: string;
}

export interface TestAppetit {
  statut: string;
  statutBadge: string;
  rationConsommeeLabel: string;
  observationDureeMinutes: number;
  observationValidee: boolean;
  observationDetails: string;
  substanceTestee: string;
  portionIngeree: string;
  observationClinique: string;
}

export interface ProtocoleItem {
  numero: number;
  titre: string;
  description: string;
  posologie: string;
  alerte: boolean;
  badgeType: 'DEFAULT' | 'ALERTE' | 'SUIVI' | string;
}

export interface OrientationBranche {
  code: string;
  titre: string;
  statut: string;
  statutBadge: string;
  conditions: string;
  protocoleReference: string;
  retenue: boolean;
  detailsOrientation: string;
  itemsProtocole: ProtocoleItem[];
}

export interface ExamenCliniquePcime {
  patient: PatientHeader;
  protocoleTitre: string;
  protocoleVersion: string;
  synchronisationSource: string;
  zScoreOmsValide: boolean;
  signesDanger: SigneDangerItem[];
  alertesDangerCount: number;
  oedemeHydratation: OedemeHydratation;
  testAppetit: TestAppetit;
  pbMesureMm: number;
  pbClassification: string;
  pbZoneLabel: string;
  zScorePoidsTaille: number;
  zScoreLabel: string;
  branches: OrientationBranche[];
  brancheRetenueCode: string;
  brancheRetenueBadge: string;
  statutValidationGlobal: string;
}

export interface ValiderExamenRequest {
  nip: string;
  brancheChoisie: string;
  avisReferentDemande: boolean;
  avisReferentNotes?: string;
  codesSignesDangerPresents: string[];
  observationMedecin?: string;
}

export interface ValiderExamenResponse {
  success: boolean;
  message: string;
  nip: string;
  brancheRetenue: string;
  codeConsultation: string;
  prochaineEtapeUrl: string;
}
