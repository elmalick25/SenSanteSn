export interface TraitementNutritionnelDTO {
  id: number;
  protocole: string;
  nomTraitement: string;
  produit: string;
  typeProduit: string;
  numeroLot: string;
  description: string;

  stockTotal: number;
  stockRestant: number;
  pourcentageStock: number;
  joursAutonomieEstimee: number;
  jourCureCourant: number;
  totalJoursCure: number;
  semaineCourante: number;
  totalSemaines: number;
  rationsParJourPrescrit: number;

  centreDotation: string;
  prescripteur: string;
  conseillereNom: string;
  conseillereTelephone: string;
  conseillereLieu: string;

  dateDebut?: string;
  dateFinPrevue?: string;
  actif: boolean;
}

export interface PriseNutritionnelleDTO {
  id: number;
  datePrise: string;
  heurePrevue?: string;
  heureReelle?: string;
  heurePrevueAffichee: string;
  heureReelleAffichee?: string;

  typeRation: 'PLUMPY_SUP' | 'REPAS_FORTIFIE_421' | string;
  titreRation: string;
  statut: 'VALIDE' | 'A_DONNER' | 'PROGRAMME' | 'MANQUE' | string;
  instructions: string;
  notesObservation?: string;
}

export interface ObservanceJourDTO {
  date: string;
  jourNomCourt: string; // "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Auj"
  prisesEffectuees: number;
  prisesPrescrites: number;
  pourcentage: number;
  estAujourdhui: boolean;
}

export interface RecetteNutritionnelleDTO {
  id: string;
  titre: string;
  sousTitreBadge: string;
  badgeCouleur: string;
  description: string;
  photoUrl: string;
  photoAlt: string;
  ingredients: string[];
  conseilBadienGox: string;
  tempsPreparation: string;
  beneficeSante: string;
  etapesPreparation: string[];
}

export interface PilulierPageDataDTO {
  enfantId: number;
  nomCompletEnfant: string;
  ageMois: number;
  statutNutritionnel: string;
  perimetreBrachial: string;
  synchronisationStatut: string;
  estHorsLigne: boolean;

  traitement: TraitementNutritionnelDTO | null;
  prisesAujourdhui: PriseNutritionnelleDTO[];
  observance7Jours: ObservanceJourDTO[];
  tauxObservanceAffiche: string;
  pourcentageObservance: number;

  recettes: RecetteNutritionnelleDTO[];
}

export interface ValiderPriseResponseDTO {
  succes: boolean;
  message: string;
  priseValidee: PriseNutritionnelleDTO;
  traitementMisAJour: TraitementNutritionnelDTO;
}
