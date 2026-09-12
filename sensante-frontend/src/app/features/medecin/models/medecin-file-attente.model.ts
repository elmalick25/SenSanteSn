// ─────────────────────────────────────────────────────────────────────────────
// Espace Médecin — Modèles TypeScript
// File d'Attente & Pupitre de Consultation
// ─────────────────────────────────────────────────────────────────────────────

import { MedecinIdentite } from './medecin-vacation.model';

export interface FileAttenteKpi {
  enRoute: number;
  labelEnRoute: string;
  enSalleAttente: number;
  masEnSalle: number;
  enConsultation: number;
  cabinetEnConsultation: string;
  chronoConsultation: string;
  tempsAttenteMoyenMin: number;
  diffQuotaAttente: string;
}

export interface ConsultationEnCours {
  idPatient: number;
  nomComplet: string;
  ageLabel: string;
  nomAccompagnant: string;
  avatarEnfant: string;
  pbMm: number;
  temperatureC: number;
  poidsKg: number;
  cabinet: string;
  medecinResponsable: string;
  chronoActuel: string;
  dureeEstimeeMin: number;
  progressionPourcent: number;
}

export interface PatientFileAttente {
  idPatient: number;
  nomComplet: string;
  ageLabel: string;
  nomAccompagnant: string;
  lienAccompagnant: string;
  avatarEnfant: string;
  avatarAccompagnant: string;
  nip: string;
  heureArrivee: string;
  tempsAttenteMin: number;
  prioriteGravite: 'MAS' | 'MAM' | 'ROUTINE';
  badgeLabel: string;
  pbMm: number;
  statutAttente: string;
  isFicheActive: boolean;
  isPrioritaire: boolean;
  actionLabel: string;
}

export interface PatientEnRoute {
  idPatient: number;
  nomComplet: string;
  ageLabel: string;
  avatarEnfant: string;
  transportLabel: string;
  heureEstimee: string;
  nomRelais: string;
  statutTransport: string;
}

export interface EnfantIdentite {
  nomComplet: string;
  dateNaissance: string;
  ageLabel: string;
  sexe: string;
  nip: string;
  avatarUrl: string;
  groupeSanguin: string;
  rangFratrie: string;
  couvertureVaccinale: string;
  vaccinsAjour: boolean;
}

export interface TuteurIdentite {
  nomComplet: string;
  lienParente: string;
  adresse: string;
  cni: string;
  telephone: string;
  priseEnCharge: string;
  delegationParentale: string;
  avatarUrl: string;
}

export interface ConstantesPointage {
  poidsKg: number;
  variationPoids: string;
  pbMm: number;
  statutPb: string;
  temperatureC: number;
  statutTemperature: string;
  testAppetit: string;
  detailAppetit: string;
  heurePointage: string;
  agentPointage: string;
  materielPointage: string;
}

export interface TransmissionRelais {
  relaisNom: string;
  relaisQuartier: string;
  motifComplet: string;
  heureAdmission: string;
  infirmiereAdmission: string;
  protocoleNom: string;
  creneauGaranti: string;
}

export interface AlerteClinique {
  hasAlerte: boolean;
  titre: string;
  protocoleDocLabel: string;
}

export interface DossierAccueil {
  idPatient: number;
  enfant: EnfantIdentite;
  tuteur: TuteurIdentite;
  constantes: ConstantesPointage;
  transmission: TransmissionRelais;
  alerte: AlerteClinique;
}

export interface FileAttenteVuePupitre {
  medecin: MedecinIdentite;
  kpis: FileAttenteKpi;
  consultationEnCours: ConsultationEnCours | null;
  patientsEnAttente: PatientFileAttente[];
  patientsEnRoute: PatientEnRoute[];
  dossierActif: DossierAccueil;
  totalPatientsFile: number;
  totalMas: number;
  totalMam: number;
  totalRoutine: number;
}

export interface FaireEntrerRequest {
  idPatient: number;
  cabinet?: string;
}

export interface FaireEntrerResponse {
  success: boolean;
  message: string;
  idPatient?: number;
  nomPatient?: string;
  cabinet?: string;
  heureEntree?: string;
  consultationActive?: ConsultationEnCours;
}
