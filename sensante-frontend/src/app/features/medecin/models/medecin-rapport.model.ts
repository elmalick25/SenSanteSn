export interface ClotureKpi {
  consultationsTerminees: number;
  consultationsTotal: number;
  ratioConsultationsClos: string;
  tempsMoyenMinutes: number;
  creniCount: number;
  creniPourcentage: number;
  crenasCount: number;
  crenasPourcentage: number;
  routineCount: number;
  routinePourcentage: number;
  deriveHoraireMinutes: number;
  deriveAbsorbeeHeure: string;
  picInitialHeure: string;
  picInitialMinutes: number;
  fichesTeletransmises: number;
  fichesTotal: number;
  tauxTeletransmission: string;
}

export interface EvacuationSamu {
  id: number;
  numeroAmbulance: string;
  motif: string;
  patientNom: string;
  patientAge: string;
  soinsEntrepris: string;
  heureReception: string;
  destinationHopital: string;
  litChaudConfirme: boolean;
}

export interface RelaisSurveillance {
  peseesCommunautaires: number;
  peseesZone: string;
  rattrapagesVaccinaux: number;
  rattrapagesDetail: string;
  alertesMasIdentifiees: number;
  alertesMasDetail: string;
  couvertureMuacPourcentage: number;
  noteLiaisonAsc: string;
}

export interface StockIntrantCloture {
  produitNom: string;
  categorie: string;
  quantiteDelivree: number;
  uniteDelivree: string;
  detailsPoids: string;
  sortiesCabinet: number;
  restantPharmacie: number;
  pourcentageDisponible: number;
  statutDotation: string;
}

export interface RapportClotureVacation {
  structureNom: string;
  dateVacation: string;
  praticienNom: string;
  praticienTitre: string;
  cabinetNom: string;
  statutVacation: string;
  horaireVacation: string;
  districtNom: string;
  kpi: ClotureKpi;
  evacuationsSamu: EvacuationSamu[];
  relaisSurveillance: RelaisSurveillance;
  intrantsStock: StockIntrantCloture[];
  pharmacieCentraleNom: string;
  reserveSecuriseeLabel: string;
  medecinChefNom: string;
  medecinChefDistrict: string;
  certificatDhis2: string;
  signatureHorodatage: string;
  estCloturee: boolean;
}

export interface CloturerVacationRequest {
  cabinet?: string;
  dateVacation?: string;
  brouillonSeulement?: boolean;
  commentairePraticien?: string;
}

export interface CloturerVacationResponse {
  success: boolean;
  message: string;
  statut: string;
  certificatDhis2: string;
  horodatage: string;
  rapportPdfUrl: string;
  exportCsvUrl: string;
}
