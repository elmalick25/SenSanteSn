import { Enfant, StatutNutritionnel } from './enfant.model';

export type StatutDemande = 'EN_ATTENTE' | 'EN_COURS' | 'TRAITE' | 'URGENT';
export type TypeDemande = 'CONSULTATION_MAS' | 'SUIVI_MAM' | 'RENOUVELLEMENT_RATION' | 'CONTROLE_POST_CREN' | 'DEPISSTAGE_TERRAIN';

export interface DemandeConsultation {
  id: number;
  enfant: Enfant;
  dateDemande: string;
  heureRdv?: string;
  typeDemande: TypeDemande;
  typeLabel: string;
  motif: string;
  statut: StatutDemande;
  agentReferent?: string;
  priorite: 'HAUTE' | 'MOYENNE' | 'NORMALE';
  statutNutritionnel: StatutNutritionnel;
  notesMedecin?: string;
}
