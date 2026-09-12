export interface PointPesee {
  id?: number;
  dateBilan: string;
  ageMois: number;
  poidsKg: number;
  tailleCm?: number;
  perimetreBrachialCm?: number;
  zScorePoidsAge?: number;
  zScorePoidsTaille?: number;
  examinateurNom: string;
  examinateurTitre: string;
  structureNom: string;
  statut: 'NORMAL' | 'MAM' | 'MAS';
}

export interface CourbesReferenceOms {
  moisAxe: number[];
  plusUnSdKg: number[];
  medianeKg: number[];
  moinsDeuxSdKg: number[];
  moinsTroisSdKg: number[];
}

export interface CroissanceOmsData {
  enfantId: number;
  nomComplet: string;
  prenom: string;
  nom: string;
  genre: 'MASCULIN' | 'FEMININ';
  dateNaissance: string;
  ageEnMois: number;
  codeNational: string;
  nomStructureSante: string;
  regionMedicale: string;
  dernierPoids: number;
  derniereTaille: number;
  dernierPerimetreBrachial: number;
  dernierZScorePoidsAge: number;
  deltaPoidsCeMoisKg: number;
  vitesseGainPonderalGJour: number;
  statutNutritionnel: 'NORMAL' | 'MAM' | 'MAS';
  interpretationClinique: string;
  historiquePesees: PointPesee[];
  referencesOms: CourbesReferenceOms;
}

export type IndicateurCroissance = 'POIDS_AGE' | 'TAILLE_AGE' | 'PERIMETRE_BRACHIAL' | 'POIDS_TAILLE';
