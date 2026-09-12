export type StatutRendezVous = 'DEMANDE_SOUMISE' | 'EN_TRIAGE' | 'CONFIRME' | 'EFFECTUE' | 'ANNULE';

export interface RendezVousDTO {
  id?: number;
  enfantId: number;
  nomEnfant: string;
  codeDossierRef: string;
  titre: string;
  typeConsultation: string;
  dateRendezVous: string;
  heureRendezVous: string;
  statut: StatutRendezVous;
  priorite: string;
  motifParent: string;
  nomPraticien: string;
  specialitePraticien: string;
  ordreMedecin: string;
  nomStructure: string;
  localisationSalle: string;
  nomRelais: string;
  roleRelais: string;
  telephoneRelais: string;
  telephoneStructure: string;
  instructionsTuteur: string;
  distanceEstimee: string;
  crenauPropose: string;
  photoJointesInfo?: string;
}

export interface ConsultationArchiveDTO {
  id: number;
  enfantId: number;
  dateConsultation: string;
  titre: string;
  categorie: 'NUTRITION' | 'VACCINATION' | 'GENERALE';
  statutBadge: string;
  nomStructure: string;
  nomPraticien: string;
  notesCliniques: string;
  poidsKg: number;
  perimetreBrachialCm: number;
  prescription: string;
  referenceDocument: string;
  typeDocument: 'FICHE_F04' | 'ORDONNANCE' | 'CERTIFICAT_PEV';
}

export interface DemandeRdvRequestDTO {
  enfantId: number;
  motif: string;
  specialite: string;
  typeConsultation: string;
  creneauPrefere: string;
  dateSouhaitee?: string;
  heureSouhaitee?: string;
  observations?: string;
  symptomesCoches: string[];
}

export interface RdvPageDataDTO {
  enfantId: number;
  nomEnfant: string;
  ageEnMois: number;
  codeNational: string;
  statutNutritionnel: string;
  rendezVousActif?: RendezVousDTO;
  consultationsPassees: ConsultationArchiveDTO[];
  statutTriage: string;
  tempsEstimeAttente: string;
}
