export enum TypeStructure {
  HOPITAL_NATIONAL = 'HOPITAL_NATIONAL',
  HOPITAL_REGIONAL = 'HOPITAL_REGIONAL',
  HOPITAL = 'HOPITAL',
  CENTRE_DE_SANTE = 'CENTRE_DE_SANTE',
  POSTE_DE_SANTE = 'POSTE_DE_SANTE',
  DISPENSAIRE = 'DISPENSAIRE',
  CREN_AUTONOME = 'CREN_AUTONOME'
}

export enum StatutStructure {
  OPERATIONNEL = 'OPERATIONNEL',
  SOUS_SURVEILLANCE = 'SOUS_SURVEILLANCE',
  FERMETURE_TEMPORAIRE = 'FERMETURE_TEMPORAIRE'
}

export enum AgrementCren {
  CRENI = 'CRENI',
  CRENAS = 'CRENAS',
  CRENAM = 'CRENAM',
  AUCUN = 'AUCUN'
}

export interface StructureSante {
  id: number;
  codeNational: string;
  nom: string;
  type: TypeStructure;
  statut: StatutStructure;
  localisation?: string;
  region: string;
  district?: string;
  commune?: string;
  latitude?: number;
  longitude?: number;
  gpsValide?: boolean;
  agrementCren?: AgrementCren;
  capaciteLits: number;
  litsReanimation?: number;
  urgences247?: boolean;
  blocOperatoire?: boolean;
  secteurRural?: boolean;
  responsable?: string;
  telephone?: string;
}

export interface StructureStats {
  totalStructures: number;
  pourcentageGeolocalisees: number;

  totalHopitaux: number;
  hopitauxNiveau1: number;
  hopitauxNiveau2: number;
  hopitauxNiveau3: number;

  totalCentresSante: number;
  centresUrgences247: number;
  centresBlocOperatoire: number;

  totalPostesSante: number;
  postesRural: number;
  postesUrbain: number;
  postesSousSurveillance: number;

  pctPostes: number;
  pctCentres: number;
  pctHopitaux: number;
  pctAutres: number;

  capaciteTotaleLits: number;
}

export interface CreateStructurePayload {
  codeNational?: string;
  nom: string;
  type: TypeStructure;
  statut: StatutStructure;
  localisation?: string;
  region: string;
  district?: string;
  commune?: string;
  latitude?: number;
  longitude?: number;
  gpsValide?: boolean;
  agrementCren?: AgrementCren;
  capaciteLits?: number;
  litsReanimation?: number;
  urgences247?: boolean;
  blocOperatoire?: boolean;
  secteurRural?: boolean;
  responsable?: string;
  telephone?: string;
}

export interface StructureFilterCriteria {
  region?: string;
  district?: string;
  commune?: string;
  type?: string;
  cren?: string;
  statut?: string;
  query?: string;
}
