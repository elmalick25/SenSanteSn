export enum StatutNutritionnel {
  NORMAL = 'NORMAL',
  MAM = 'MAM',
  MAS = 'MAS'
}

export enum Genre {
  MASCULIN = 'MASCULIN',
  FEMININ = 'FEMININ'
}

export interface Enfant {
  enfantId?: number;
  idEnfant?: number;
  nom: string;
  prenom: string;
  genre: Genre;
  dateNaissance: string;
  telephoneParent?: string;
  qrCode?: string;
  adresse?: string;
  dernierStatut?: StatutNutritionnel;
  dernierBilan?: BilanAntro;
}

export interface BilanAntro {
  id?: number;
  idBilan?: number;
  dateBilan: string;
  poids: number;
  taille: number;
  perimetreBrachial: number; // in cm or mm (ex: 11.2 cm)
  zScorePoidsTaille?: number;
  zScorePoidsAge?: number;
  oedeme?: boolean;
  statut: StatutNutritionnel;
  enfant?: Enfant;
  enfantId?: number;
}
