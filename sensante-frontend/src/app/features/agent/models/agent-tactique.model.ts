export interface AgentIdentite {
  idUser: number;
  nom: string;
  prenom: string;
  nomComplet: string;
  email: string;
  telephone: string;
  avatarUrl: string;
  role: string;
  titrePoste: string;
  structure: string;
  secteur: string;
  localisationDescription: string;
  statutConnexion: string;
  heureDerniereSynchro: string;
  statutReseau: string;
}

export interface UrgenceMasBanniere {
  alerteId: number;
  enfantId: number;
  nomCompletEnfant: string;
  ageMois: number;
  ageTexte: string;
  matricule: string;
  muacMm: number;
  muacTexte: string;
  oedemes: boolean;
  oedemesTexte: string;
  tuteurNom: string;
  tuteurTelephone: string;
  adresse: string;
  noteClinique: string;
  nonAcquittee: boolean;
  dateAlerte: string;
}

export interface AgentKpiMetrics {
  enfantsActifsSuivis: number;
  variationSemaine: string;
  statutCarnet: string;
  alertesMasCritiques: number;
  badgeMas: string;
  sousTitreMas: string;
  casMamTotal: number;
  sousTitreMam: string;
  statutMam: string;
  perdusDeVue: number;
  badgePerdus: string;
  actionPerdus: string;
  stockAtpeCartons: number;
  pourcentageStock: number;
  autonomieEstimee: string;
}

export interface EnfantTactique {
  id: number;
  matricule: string;
  nom: string;
  prenom: string;
  nomComplet: string;
  initiales: string;
  ageMois: number;
  ageTexte: string;
  genre: 'MASCULIN' | 'FEMININ';
  tuteurNom: string;
  tuteurTelephone: string;
  adresse: string;
  secteur: string;
  anomalieLocalisation: boolean;
  statutNutritionnel: 'MAS' | 'MAM' | 'NORMAL';
  muacMm: number;
  muacBadgeTexte: string;
  statutCliniqueDetail: string;
  alerteCritique: boolean;
  evolutionTexte: string;
  directionTendance: 'BAISSE' | 'HAUSSE' | 'STABLE' | 'INCONNU';
  poidsActuelKg: number;
  statutSurveillance: string;
  sachetsRestants: number;
  rationStatutTexte: string;
  rationSousTitre: string;
  statutStockBadge: 'EPUISE' | 'VALIDE' | 'SEVRAGE' | 'NA';
  actionPrincipaleType: 'REFERER_SAMU' | 'DISPENSER_ATPE' | 'VISITE_DOMICILE' | 'RELANCER' | 'CLOTURER' | 'PLANIFIER_VISITE';
  actionPrincipaleLabel: string;
  perduDeVue: boolean;
  selected?: boolean;
}

export interface AgentTactiqueOverview {
  identite: AgentIdentite;
  urgencePrioritaire: UrgenceMasBanniere;
  kpis: AgentKpiMetrics;
  cohorte: EnfantTactique[];
  totalAlertesActives: number;
  pageCourante: number;
  totalPages: number;
  secteursDisponibles: string[];
  tranchesAgeDisponibles: string[];
  dateDuJour: string;
  zoneGeographique: string;
}

export interface ActionTactiqueRequest {
  idAlerte?: number;
  idEnfant?: number;
  typeAction: string;
  motif?: string;
  nombreRations?: number;
  dateVisite?: string;
  notes?: string;
}

export interface ActionTactiqueResponse {
  succes: boolean;
  message: string;
  statutMisAJour: string;
  donneeResultat?: any;
}

export interface PeseeHistorique {
  date: string;
  poidsKg: number;
  variationTexte: string;
  typePesee: 'REFERENCE' | 'ALERTE_BAISSE' | 'CHUTE_CRITIQUE' | 'EN_HAUSSE' | 'STAGNANT';
  sousTitre: string;
  critique?: boolean;
}

export interface ScanRecent {
  id: number;
  matricule: string;
  nomComplet: string;
  libelleChip: string;
  statut: 'MAS' | 'MAM' | 'NORMAL';
  heureScan: string;
}

export interface FicheExpress {
  matricule: string;
  horodatageValidation: string;
  heureScan: string;
  enfantId: number;
  nomCompletEnfant: string;
  prenom: string;
  nom: string;
  ageMois: number;
  ageTexte: string;
  dateNaissanceTexte: string;
  sexe: string;
  photoEnfantUrl: string;
  idRegistre: string;
  secteurRue: string;
  nomTuteur: string;
  telephoneTuteur: string;
  langue: string;
  concession: string;
  suiviCommunautaire: string;
  photoTuteurUrl: string;
  presenteAuxPesees: boolean;
  statutNutritionnel: 'MAS' | 'MAM' | 'NORMAL';
  statutBadgeTexte: string;
  muacMm: number;
  muacZone: string;
  oedemes: boolean;
  oedemesGrade: string;
  oedemesNote: string;
  historiquePonderal: PeseeHistorique[];
  rationRestanteDomicile: number;
  rationDomicileTexte: string;
  ruptureStockDomicile: boolean;
}

export interface NouveauBilanRequest {
  matricule: string;
  poidsKg: number;
  tailleCm?: number;
  muacMm: number;
  oedemes: boolean;
  notes?: string;
}

export interface NouveauTriageRequest {
  prenom: string;
  nom: string;
  ageMois: number;
  genre: 'MASCULIN' | 'FEMININ';
  poids: number;
  taille: number;
  muac: number;
  oedemes: boolean;
  tuteurNom: string;
  tuteurTelephone: string;
  adresse: string;
}

export interface DelivranceAtpeRequest {
  matricule: string;
  nombreSachets: number;
  motif?: string;
  lotNumero?: string;
}

// ==========================================
// VUE 4 : TRIAGE RDV & MATRICE MULTI-BOX
// ==========================================

export interface PatientTriage {
  id: number;
  matricule: string;
  nomComplet: string;
  ageMois: number;
  poidsKg: number;
  niveauGravite: number;
  niveauLibelle: string;
  photoUrl: string;
  photoAlt?: string;
  tuteurNom: string;
  tuteurTelephone: string;
  adresse: string;
  heureArrivee: string;
  muacMm: number;
  muacLibelle: string;
  oedemes: boolean;
  oedemesLibelle: string;
  temperature: string;
  observationClinique: string;
  delaiPreconise: string;
  orientationBox: string;
  statutOrientation: string;
  isUrgent: boolean;
  isSelectionne: boolean;
  metricChips: string[];
}

export interface BoxPraticien {
  boxId: number;
  nomBox: string;
  docteurNom: string;
  specialite: string;
  statutService: string;
  isGarde: boolean;
}

export interface SlotTemps {
  slotId: string;
  heureDebut: string;
  heureFin: string;
  plageHoraireTexte: string;
  isUrgence: boolean;
}

export interface CelluleMatrice {
  slotId: string;
  boxId: number;
  statut: 'OCCUPE' | 'LIBRE' | 'AFFECTE' | 'RESERVE_MAS';
  patientNom: string;
  motifOuSousTitre: string;
  badgeTexte: string;
  isLocked: boolean;
  isEnCours: boolean;
  isAffecte: boolean;
}

export interface MatriceTriage {
  dateTexte: string;
  nbBoxActifs: number;
  boxes: BoxPraticien[];
  slots: SlotTemps[];
  cellules: CelluleMatrice[];
  creneauAffecteResume: string;
}

export interface TicketAdmission {
  numeroTicket: string;
  qrCodeTexte: string;
  statutBadge: string;
  orientationTitre: string;
  patientNom: string;
  patientAgeTexte: string;
  matricule: string;
  praticienNom: string;
  boxNom: string;
  heurePassage: string;
  datePassage: string;
  tuteurNom: string;
  tuteurTelephone: string;
  smsWolof: string;
  signatureRegulation: string;
  versionReference: string;
}

export interface AssignationSlotRequest {
  patientId: number;
  slotId: string;
  boxId: number;
  motif?: string;
}

// ==========================================
// MODULE CARTE DES ZONES & RADAR CONCESSIONS
// ==========================================

export interface ConcessionZone {
  id: string;
  codeConcession: string;
  nomFamille: string;
  chefFamille: string;
  adresse: string;
  statut: 'MAS' | 'MAM' | 'NORMAL' | 'VISITE';
  distanceMetres: number;
  distanceTexte: string;
  alerteTexte: string;
  ordrePriorite: number;
  nbEnfants: number;
  casMas: number;
  casMam: number;
  atpeDelivres: number;
  coordX: number;
  coordY: number;
  noteVocaleDuree: string;
  noteVocaleTranscription?: string;
  noteVocaleEnregistree: boolean;
  signatureAuteur?: string;
  signatureHorodatage?: string;
  signatureValidee: boolean;
  eauPurifieeRemise: boolean;
  ficheLiaisonTamponnee: boolean;
  numeroVisite: number;
  totalVisites: number;
  gpsPrecision: string;
}

export interface ZoneCarteOverview {
  posteSante: string;
  secteurNom: string;
  tourneeLibelle: string;
  cacheStatut: string;
  cacheTaille: string;
  gpsFixDetails: string;
  modeHorsLigneActif: boolean;
  sosNumero: string;
  solaireCourant: string;
  batteriePct: number;
  batterieAutonomie: string;
  fileAttenteLocaleCount: number;
  concessions: ConcessionZone[];
  concessionActive?: ConcessionZone;
}

export interface ReleveTerrainRequest {
  concessionId: string;
  enfantsExamines: number;
  casMas: number;
  casMam: number;
  atpeDelivres: number;
  noteVocaleDuree?: string;
  noteVocaleTranscription?: string;
  noteVocaleEnregistree: boolean;
  signatureAuteur?: string;
  eauPurifieeRemise: boolean;
  ficheLiaisonTamponnee: boolean;
  miseEnAttente?: boolean;
  alerteSamu?: boolean;
}

// ==========================================
// MODULE CLÔTURE DU JOUR & VISA NUMÉRIQUE
// ==========================================

export interface DepistageMuacLigne {
  categorie: string;
  couleur: 'VERT' | 'JAUNE' | 'ROUGE';
  seuilMuac: string;
  effectifConstate: number;
  pourcentage: number;
  protocolesMesures: string;
  statutCloture: string;
}

export interface RefereUrgenceLigne {
  enfantNom: string;
  enfantAgeSexe: string;
  muacMm: number;
  concessionOrigine: string;
  heureAlerte: string;
  medecinAssigne: string;
  medecinRole: string;
  vecteurTransport: string;
  typeVecteur: 'CHARIOT' | 'PIED' | 'AMBULANCE';
  statutPriseEnCharge: string;
}

export interface MouvementStockAtpe {
  numeroLot: string;
  dotationInitiale: number;
  delivresTerrain: number;
  restePhysique: number;
  ecartStock: number;
  statutEcart: string;
  consommationPourcent: number;
  quotaPreserveTexte: string;
  variancePourcent: number;
  inventaireValide: boolean;
}

export interface VisiteConcessionResume {
  concessionsVisitees: number;
  bornageGpsCertifie: boolean;
  triageRdvEmis: number;
  delivresParSms: boolean;
  femmesSuivies: number;
  creneauxDemain: string;
  reductionFluxPourcent: number;
  signaturesBiometriques: boolean;
}

export interface VisaJuridiquePartie {
  roleTitre: string;
  nomComplet: string;
  initiales: string;
  matricule: string;
  posteStructure: string;
  certificatOuCanal: string;
  horodatage: string;
  badgeStatutTexte: string;
  visaPillTexte: string;
  estSigne: boolean;
}

export interface ClotureRegistreOverview {
  titreBordereau: string;
  juridictionAdministrative: string;
  sousTitreLegal: string;
  visaStampTexte: string;
  posteNom: string;
  secteurNom: string;
  referenceNumero: string;
  decretReference: string;
  empreinteSha256: string;
  scelleHorodatage: string;
  dateFinServiceTexte: string;
  totalEnfantsExamines: number;
  totalRefereUren: number;
  depistagesMuac: DepistageMuacLigne[];
  referesUrgence: RefereUrgenceLigne[];
  mouvementStockAtpe: MouvementStockAtpe;
  visiteConcessionResume: VisiteConcessionResume;
  visaAgente: VisaJuridiquePartie;
  visaDistrict: VisaJuridiquePartie;
  transmisDistrict: boolean;
}

export interface TransmissionDistrictRequest {
  dateCloture?: string;
  signatureAgenteId?: string;
  notesTransmission?: string;
}

// ==========================================
// MODULE MON PROFIL & RÉGLAGES AGENT
// ==========================================

export interface AgentProfil {
  idUser: number;
  nomComplet: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  indicatifPays: string;
  dateNaissance: string;
  residence: string;
  matricule: string;
  structureSante: string;
  zonesIntervention: string;
  langueService: 'FR' | 'WO';
  statutService: string;
  titrePoste: string;
  districtRattachement: string;
  agrementMinistere: string;
  avatarUrl: string;
  dateDerniereMiseAJour: string;
  liaisonCousActive: boolean;
}

export interface UpdateAgentProfilRequest {
  nomComplet: string;
  telephone: string;
  dateNaissance?: string;
  residence?: string;
  structureSante?: string;
  zonesIntervention?: string;
  langueService?: string;
  avatarUrl?: string;
}





