export interface DistrictZoneGeo {
  id: string;
  code: string;
  nom: string;
  statut: 'CONTROLE' | 'VIGILANCE' | 'CRITIQUE';
  prevalenceMas: number;
  casActifsMas: number;
  tendance: string;
  crenasAssocie: string;
  stockAtpeJours: number;
  latitude: number;
  longitude: number;
  descriptionStatut: string;
}

export interface PatrouilleGps {
  id: string;
  nom: string;
  code: string;
  type: 'RELAIS' | 'VEHICULE_SUPERVISEUR';
  zone: string;
  xPos: number;
  yPos: number;
  derniereSynchro: string;
  actif: boolean;
}

export interface AlerteTriage {
  id: number;
  enfantId: number;
  nomComplet: string;
  ageMois: number;
  centreSanteNom: string;
  zoneNom: string;
  perimetreBrachial: number; // in mm
  oedemes: boolean;
  heuresSansPriseEnCharge: number;
  typeAlerte: 'MAS_SEVERE' | 'RUPTURE_ATPE' | 'VISITE_RELAIS' | 'TRANSFERT';
  statutUrgence: 'CRITIQUE' | 'ELEVEE' | 'VIGILANCE';
  libelleDelai: string;
  acquittee: boolean;
}

export interface SupervisionCommandCenter {
  pays: string;
  region: string;
  district: string;
  semaineEpidemiologique: string;
  datesSemaine: string;
  latitude: number;
  longitude: number;
  superviseurNom: string;
  superviseurTitre: string;
  superviseurEmail: string;
  superviseurPhoto: string;

  // 6 KPIs
  enfantsSuivis: number;
  tendanceEnfantsSuivis: string;
  cohorteDepisteePourcentage: string;

  prevalenceMas: number;
  tendancePrevalence: string;
  nouveauxCasSemaine: number;
  alerteSeuilOmsDepasse: boolean;

  tauxGuerisonCrenas: number;
  cibleGuerison: string;
  ecartCibleGuerison: string;

  postesCouverts: number;
  totalPostes: number;
  transmissionRetard: string;

  relaisActifs: number;
  totalRelais: number;
  tauxRelaisActifs: number;
  superviseursZone: number;

  tauxPerdusDeVue: number;
  ciblePerdusDeVue: string;
  alertePerdusDeVueZone: string;

  // Focal zone
  zoneFocaleInitiale: string;

  zones: DistrictZoneGeo[];
  patrouilles: PatrouilleGps[];
  alertes: AlerteTriage[];
}

export interface DeploiementEquipeRequest {
  zoneCible: string;
  motif?: string;
  niveauPriorite?: string;
  alerteId?: number;
}

export interface DeploiementEquipeResponse {
  numeroMission: string;
  statut: string;
  zoneCible: string;
  superviseurAstreinte: string;
  dateDeploiement: string;
  message: string;
}

export type PrioriteMissionType = 'NORMALE' | 'HAUTE' | 'URGENCE_VITALE';
export type StatutMissionType = 'A_INTERVENIR' | 'EN_COURS' | 'RAPPORT_SOUMIS' | 'VALIDE';

export interface MissionTerrain {
  id: number;
  codeMission: string;
  zoneCiblee: string;
  posteSante: string;
  agentNom: string;
  agentInitiale: string;
  agentStatut: string;
  objectifChiffre: string;
  progression: number;
  cibleAtteinte: number;
  cibleTotale: number;
  dateLimite: string;
  heureEcheance: string;
  echeanceLibelle: string;
  priorite: PrioriteMissionType;
  statut: StatutMissionType;
  dotationMuac: boolean;
  dotationAtpe: boolean;
  dotationRegistres: boolean;
}

export interface CreateMissionRequest {
  zoneCiblee: string;
  agentNom: string;
  objectifChiffre: string;
  dateLimite?: string;
  heureEcheance?: string;
  priorite?: PrioriteMissionType;
  dotationMuac?: boolean;
  dotationAtpe?: boolean;
  dotationRegistres?: boolean;
  deployerImmediatement?: boolean;
}

export interface MissionsOverview {
  totalMissionsActives: number;
  aIntervenir: number;
  enCours: number;
  rapportsSoumis: number;
  validees: number;
}

export type TypeMissionValidationType = 'CRENAS_MAS' | 'DEPISTAGE_SYSTEMATIQUE' | 'VISITE_MENAGE' | 'RAVITAILLEMENT_POSTE';
export type StatutValidationRapportType = 'EN_ATTENTE' | 'VALIDE_DHIS2' | 'COMPLEMENT_DEMANDE' | 'REJETE';

export interface PreuvePhoto {
  titre: string;
  tag: string;
  heureGmt: string;
  imageUrl: string;
  statutExif: string;
}

export interface RapportValidationSummary {
  id: number;
  numeroRapport: string;
  typeMission: TypeMissionValidationType;
  agentNom: string;
  agentRole: string;
  agentInitiales: string;
  zoneCiblee: string;
  posteSante: string;
  tempsRelatif: string;
  masDetectes: number;
  mamDetectes: number;
  enfantsDepistes: number;
  tauxCiblePourcent: number;
  atpeDelivresCartons: number;
  geofenceConforme: boolean;
  distanceFoyerMetres: number;
  prioriteClinique: string;
  statutValidation: StatutValidationRapportType;
}

export interface RapportValidationDetail {
  id: number;
  numeroRapport: string;
  typeMission: TypeMissionValidationType;
  titreMission: string;
  agentNom: string;
  agentRole: string;
  agentInitiales: string;
  zoneCiblee: string;
  posteSante: string;
  distanceFoyerMetres: number;
  latitude: number;
  longitude: number;
  geofenceConforme: boolean;
  heureCheckIn: string;
  heureCheckOut: string;
  dureeTerrain: string;
  enfantsDepistes: number;
  cibleInitiale: number;
  tauxCiblePourcent: number;
  masDetectes: number;
  mamDetectes: number;
  atpeDelivresCartons: number;
  lotAtpe: string;
  observationsTerrain: string;
  prioriteClinique: string;
  dateSoumission: string;
  tempsRelatif: string;
  statutValidation: StatutValidationRapportType;
  motifComplement?: string;
  commentaireMedecinChef?: string;
  preuvesPhotos: PreuvePhoto[];
}

export interface ValiderRapportPayload {
  commentaireMedecinChef?: string;
  certifierDhis2?: boolean;
}

export interface DemandeComplementPayload {
  motif: string;
}

export interface ValidationQueueOverview {
  totalEnAttente: number;
  totalCrenasMas: number;
  totalDepistages: number;
  totalMenages: number;
  totalRavitaillement: number;
  tempsMoyenValidation: string;
  statutDhis2: string;
  derniereSyncHeure: string;
}

// ==========================================
// RAPPORTS QUOTIDIENS & TÉLÉMÉTRIE DISTRICT
// ==========================================

export interface StructurePromptitude {
  structureNom: string;
  typeStructure: string;
  creneaux: string[];
  scoreJourPourcent: number;
  clotureHeure: string;
  statutBadge: 'OK' | 'RETARD' | 'CRITIQUE' | 'GROUPE' | string;
  id?: number;
  nomStructure?: string;
  responsable?: string;
  enRetard?: boolean;
  anomaliesDetectees?: number;
  statutsHoraires?: string[];
  derniereTransmission?: string;
}

export interface PointControleMas {
  heureLabel: string;
  tauxMas: number;
  seuilUcl: number;
  seuilLcl: number;
  estPicAlerte: boolean;
  annotationPic?: string;
  heure?: string;
  limiteSuperieureUCL?: number;
  limiteInferieureLCL?: number;
  depassementSeuil?: boolean;
  casDetectes?: number;
  totalConsultations?: number;
}

export interface IssueCliniqueStructure {
  structureNom: string;
  totalCas: number;
  pourcentAmbulatoire: number;
  pourcentHospitalisation: number;
  pourcentRavitaillement: number;
  pourcentEnAttente: number;
  libelleDetail: string;
}

export interface StockAtpeFlux {
  stockInitialMatin: number;
  entreesRavitaillement: number;
  sortiesRationsTerrain: number;
  stockActuelVerifie: number;
  ecartDetecte: number;
  joursAutonomie: number;
  seuilCritiqueDistrict: number;
  capaciteMaxDistrict: number;
  depotNom: string;
  zoneEcart: string;
}

export interface AnomalieJournaliere {
  id: string | number;
  typeAlerte?: string;
  structureNom?: string;
  nomStructure?: string;
  titre?: string;
  description: string;
  ecartChiffre?: string;
  niveauCriticite?: 'CRITIQUE' | 'ATTENTION' | string;
  gravite?: 'CRITIQUE' | 'MAJEURE' | 'MINEURE' | string;
  statutLibelle?: string;
  actionLibelle?: string;
  recommandation?: string;
  heureDetection?: string;
}

export interface RapportJournalierTelemetrie {
  dateJournee: string;
  dateLibelle: string;
  fluxDhis2Statut: string;
  tauxPromptitude: number;
  evolutionPromptitude: number;
  rapportsATemps: number;
  rapportsAttendus: number;
  structuresPromptitude: StructurePromptitude[];
  pointsControleMas: PointControleMas[];
  alertePicGraphique: string;
  issuesCliniques: IssueCliniqueStructure[];
  totalConsultationsOrientees: number;
  stockAtpe: StockAtpeFlux;
  anomalies: AnomalieJournaliere[];
  numeroCertificat: string;
  autoriteNom: string;
  autoriteTitre: string;
  horodatageSha256: string;
  estCloture: boolean;
  dateCloture?: string;
  kpiPromptitudeGlobale?: number;
  totalConsultations?: number;
  tauxMasMoyenDistrict?: number;
  structuresEnAlerteRupture?: number;
  estCloturee?: boolean;
  signataire?: string;
  hashSignature?: string;
}

export interface ClotureJourneePayload {
  commentaireSuperviseur?: string;
  certifierDhis2?: boolean;
  observations?: string;
  signerNom?: string;
}

export interface ClotureJourneeResult {
  statut: string;
  numeroCertificat: string;
  horodatageSha256: string;
  autoriteSignataire: string;
  message: string;
}

// ==========================================
// VUE 5 : STOCKS ATPE & INTRANTS NUTRITIONNELS
// ==========================================

export interface StockProduitDetail {
  codeProduit: string;
  nomProduit: string;
  autonomieJours: number;
  quantiteDisponible: number;
  uniteMesure: string;
  niveauAlerte: 'RUPTURE_IMMINENTE' | 'CRITIQUE' | 'VIGILANCE' | 'SECURITAIRE' | string;
}

export interface StructureStockMatrix {
  structureNom: string;
  roleLogistique: string;
  sousTitre: string;
  enAlerteRupture: boolean;
  hubDonneur: boolean;
  stocksIntrants: StockProduitDetail[];
}

export interface ZoneResilienceScore {
  zoneNom: string;
  scoreGlobal: number;
  autonomieGlobale: number;
  rotationStock: number;
  promptitudeCommande: number;
  stockTampon: number;
  conformiteSigl: number;
}

export interface StocksAtpeOverview {
  totalCartonsPlumpyNut: number;
  autonomieMoyenneJours: number;
  structuresEnAlerteRupture: number;
  structuresEnVigilance: number;
  debitDistributionQuotidien: number;
  evolutionDebitPourcent: number;
  cartonsEnTransitPna: number;
  dateLivraisonPrevuePna: string;
  bordereauLivraisonPna: string;
  matriceStructures: StructureStockMatrix[];
  scoresResilienceZones: ZoneResilienceScore[];
  prochaineLivraisonCamion: string;
  bonCommandeActifPna: string;
}

export interface TransfertPerequationPayload {
  posteDonneur: string;
  posteBeneficiaire: string;
  quantiteCartons: number;
  vecteurTransport?: string;
  chauffeurRelais?: string;
}

export interface TransfertPerequationResult {
  numeroBonTransfert: string;
  statut: string;
  donneurNouvelleAutonomie: number;
  beneficiaireNouvelleAutonomie: number;
  beneficiaireSortieCrise: boolean;
  message: string;
  horodatage: string;
}

export interface OrdreReapproPnaPayload {
  quantiteCartons?: number;
  motifUrgence?: string;
  commentaire?: string;
}

export interface OrdreReapproPnaResult {
  bonCommandeNumero: string;
  quantiteCommandee: number;
  statut: string;
  dateLivraisonPrevue: string;
  message: string;
  horodatage: string;
}

// =========================================================================
// VUE 6 — EXPORTS DHIS2 & REGISTRES NATIONAUX (Studio Télémétrie RMAN)
// =========================================================================

export interface Dhis2KpiMetric {
  code: string;
  libelle: string;
  valeurFormatee: string;
  valeur: number;
  variationPourcent: string | null;
  variationPositive: boolean;
  sousTitre: string;
  couleurTheme: 'emerald' | 'teal' | 'amber' | 'blue';
  icone: string;
  sparklinePoints: number[];
}

export interface Dhis2MonthlyDataPoint {
  moisLibelle: string;
  moisCourt: string;
  volumeDepistages: number;
  estMoisActif: boolean;
}

export interface SphereStandardIndicator {
  code: string;
  libelle: string;
  valeurPourcent: number;
  seuilPourcent: number;
  seuilEstMinimum: boolean;
  respecteNorme: boolean;
  libelleSeuil: string;
  couleur: string;
  dashArrayValeur: number;
}

export interface PrnNationalTarget {
  code: string;
  libelle: string;
  tauxActuel: number;
  cibleTaux: number;
  volumeRealise: number;
  volumeCible: number;
  statut: 'SURPERFORMÉ' | 'DANS_LA_CIBLE' | 'ÉCART';
  ecartTexte: string;
  badgeCouleur: string;
  noteRattrapage: string | null;
}

export interface Dhis2BordereauArchive {
  id: number;
  moisAnnee: string;
  moisAnneeCode: string;
  numeroAccuse: string;
  dateClotureFormatee: string;
  signataire: string;
  statut: 'VALIDE' | 'EN_ATTENTE' | 'REJETÉ';
  hashSha256: string;
  telechargementUrl: string | null;
}

export interface Dhis2StudioOverview {
  uuidBordereau: string;
  periodeMoisAnnee: string;
  periodCode: string;
  instanceVersion: string;
  consolidationTotal: number;
  consolidationRecu: number;
  consolidationPourcent: number;
  dernierSyncMinutes: number;
  empreinteSha256: string;
  kpiDepistagesMasMam: Dhis2KpiMetric;
  kpiAdmissionsCrenas: Dhis2KpiMetric;
  kpiHospitalisationsCreni: Dhis2KpiMetric;
  kpiConsommationAtpe: Dhis2KpiMetric;
  historiqueMensuel: Dhis2MonthlyDataPoint[];
  indicateursSphere: SphereStandardIndicator[];
  objectifsPrn: PrnNationalTarget[];
  archivesBordereaux: Dhis2BordereauArchive[];
}

export interface TeletransmissionDhis2Payload {
  periode: string;
  codeDistrict: string;
  observations?: string;
  signataire?: string;
}

export interface TeletransmissionDhis2Result {
  success: boolean;
  uuidTransmission: string;
  numeroAccuse: string;
  empreinteSha256: string;
  message: string;
  dateHorodatage: string;
}

// ==========================================
// VUE 7 — PROFIL SUPERVISEUR & ACCRÉDITATIONS
// ==========================================

export interface SupervisedStructure {
  code: string;
  name: string;
  type: 'HUB' | 'HOPITAL' | 'CRENAS' | 'POSTE' | string;
  isHub: boolean;
  commune: string;
}

export interface SupervisorProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  birthdate: string;
  address: string;
  districtName: string;
  regionName: string;
  matricule: string;
  roleLabel: string;
  avatarUrl: string;
  lastSyncDate: string;
  preferredLanguage: 'fr' | 'wo';
  totalStructuresSupervised: number;
  conformityRate: number;
  msasAccreditationActive: boolean;
  structures: SupervisedStructure[];
}

export interface SupervisorProfileUpdate {
  fullName: string;
  phone: string;
  birthdate?: string;
  address?: string;
  preferredLanguage?: 'fr' | 'wo' | string;
  avatarUrl?: string;
}


