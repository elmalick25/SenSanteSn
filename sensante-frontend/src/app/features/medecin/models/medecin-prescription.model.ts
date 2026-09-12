import { PatientHeader } from './medecin-examen.model';

export interface MedicamentPrescrit {
  id: number;
  nomCommercial: string;
  dci: string;
  forme: string;
  posologiePonderale: string;
  doseCalculeeMl: number;
  doseCalculeeMg: number;
  doseAfficheeLabel: string;
  frequenceRythme: string;
  frequenceDetail: string;
  dureeJours: number;
  dureeLabel: string;
  indicationClinique: string;
  alerteAllergieLiee: boolean;
  substitutionAppliquee: boolean;
}

export interface DotationAtpe {
  produit: string;
  rationQuotidienne: string;
  dureeJours: number;
  volumeTotalSachets: number;
  apportKcalJour: string;
  modalitesAdministration: string[];
  slot1Horaire: string;
  slot1Titre: string;
  slot1Description: string;
  slot1Calorie: string;
  slot1MedicamentAssocie: string;
  slot2Horaire: string;
  slot2Titre: string;
  slot2Description: string;
  slot2Calorie: string;
  slot2Boisson: string;
}

export interface JalonCureAtpe {
  jour: number;
  label: string;
  datePrevue: string;
  type: 'START' | 'VAD' | 'ROUTINE' | 'BILAN' | string;
  description: string;
  actif: boolean;
}

export interface FicheContreReference {
  relaisNom: string;
  relaisSecteur: string;
  relaisPoste: string;
  relaisTelephone: string;
  frequenceVad: string;
  prochainControleDate: string;
  prochainControleHeure: string;
  prochainControleLieu: string;
  statutRdv: string;
  directivesAlerteAggravation: string;
}

export interface DocumentOfficiel {
  numeroOrdonnance: string;
  dateEmission: string;
  republiqueEnTete: string;
  ministereEnTete: string;
  structureEnTete: string;
  cabinetEnTete: string;
  praticienNom: string;
  praticienNumeroOrdre: string;
  praticienSpecialite: string;
  mentionAllergie: string;
  codeQrVerification: string;
  signatureCertificat: string;
  signatureHorodatage: string;
}

export interface PrescriptionMedicale {
  patient: PatientHeader;
  centreDeSante: string;
  datePrescription: string;
  syncEnDirect: boolean;
  poidsCalculeKg: number;
  alerteAllergieActive: boolean;
  alerteAllergieTitre: string;
  alerteAllergieMessage: string;
  medicaments: MedicamentPrescrit[];
  historiqueOrdonnancesCount: number;
  dotationAtpe: DotationAtpe;
  jalonsCure: JalonCureAtpe[];
  contreReference: FicheContreReference;
  documentOfficiel: DocumentOfficiel;
}

export interface GenererOrdonnanceResponse {
  success: boolean;
  message: string;
  numeroOrdonnance: string;
  nip: string;
  codeQrVerification: string;
  signatureCertificat: string;
  urlTelechargementPdf: string;
  smsNotifie: boolean;
}
