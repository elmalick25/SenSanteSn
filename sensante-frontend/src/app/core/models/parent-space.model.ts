export type MuacZone = 'MAS' | 'MAM' | 'NORMAL';

export interface HeroPulse {
  title: string;
  message: string;
  tone: 'calm' | 'warning' | 'critical';
  badgeText: string;
  badgeClass: string;
  bgGradient: string;
}

export interface NextAction {
  id: number;
  time: string;
  title: string;
  subtitle: string;
  tag: string;
  isDone: boolean;
  buttonLabel: string;
}

export interface PerinatalData {
  numActeNaissance: string;
  matriculeNational: string;
  lieuNaissance: string;
  heureNaissance: string;
  termeSA: string;
  modeAccouchement: 'Voie basse eutocique' | 'Voie basse dystocique' | 'Césarienne programmée' | 'Césarienne en urgence';
  apgar1min: string;
  apgar5min: string;
  poidsNaissanceKg: number;
  tailleNaissanceCm: number;
  pcNaissanceCm: number; // Périmètre Crânien
  groupeSanguin: 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';
  electrophoreseHb: 'Hb AA (Normal)' | 'Hb AS (Trait drépanocytaire)' | 'Hb SS (Drépanocytose majeure)' | 'Non effectuée';
  allergiesConnues: string[];
  nomPere: string;
  nomMere: string;
  telephoneTuteur: string;
  concessionFamille: string;
}

export interface PrescriptionItem {
  medicament: string;
  forme: string; // ex: Sirop 250mg/5ml, Gélule, Sachet
  posologie: string; // ex: 1 cuillère-mesure matin et soir
  duree: string; // ex: 7 jours
  remarques?: string;
}

export interface ConsultationRecord {
  id: number;
  date: string;
  praticienNom: string;
  praticienTitre: string;
  structureNom: string;
  motif: string;
  temperatureC: number;
  poidsKg: number;
  tailleCm: number;
  muacCm: number;
  pcCm: number;
  oedemes: 'Absents (Grade 0)' | 'Pieds (+)' | 'Jambes (++)' | 'Généralisés (+++)';
  diagnostic: string;
  prescriptions: PrescriptionItem[];
  conseilsDietetiques: string;
  prochainControle: string;
}

export interface SupplementationRecord {
  id: number;
  type: 'Vitamine A' | 'Mébendazole (Déparasitage)' | 'Zinc Préventif' | 'Fer + Folates';
  dose: string;
  dateAdministration: string;
  ageAdministration: string;
  lot: string;
  agent: string;
  prochaineDose: string;
}

export interface VaccineRecord {
  id: number;
  code: string;
  nom: string;
  maladiesCibles: string;
  ageRecommande: string;
  statut: 'done' | 'pending' | 'overdue';
  dateAdministration?: string;
  centre: string;
  lotNumber?: string;
  agentVaccinateur?: string;
  rappelRequis?: boolean;
}

export interface WeightHistoryEntry {
  date: string;
  childId: number;
  childName: string;
  ageMois?: number;
  poids: number;
  taille?: number;
  pc?: number; // Périmètre Crânien
  muac: number;
  oedemes: string;
  zScorePoidsTaille?: number;
  zScorePoidsAge?: number;
  statutPcima: string;
  agentReferent: string;
  lieuMesure?: 'Dispensaire' | 'Relais à Domicile' | 'Auto-mesure Parent';
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  timeAgo: string;
  type: 'vaccin' | 'pesee' | 'ration' | 'dispensaire';
  isRead: boolean;
  actionTab?: string;
  urgent?: boolean;
}

export interface Child {
  id: number;
  matricule?: string;
  nom: string;
  prenom: string;
  genre: 'F' | 'M';
  dateNaissance: string;
  ageMois: number;
  photoUrl: string;
  initials?: string;
  initialsBg?: string;
  initialsBorder?: string;
  initialsText?: string;
  muac: number;
  muacZone: MuacZone;
  muacPos?: string;
  statutPcima: string;
  poidsActuel: number | null;       // null si aucun bilan disponible
  tailleActuelle: number | null;    // null si aucun bilan disponible
  groupeSanguin?: string;
  pcActuel?: number | null;
  zScorePoidsTaille: number | null; // null si aucun bilan disponible
  gainHebdo?: string | null;        // null = calculé depuis l'historique
  centreRattachement: string;
  protocoleActuel: string;
  protocoleType: 'MAS' | 'MAM' | 'NORMAL';
  vaccinsCount: string | null;      // null = chargé depuis /api/vaccins
  vaccinsPct?: number | null;
  prochainRappel: string | null;    // null = chargé depuis /api/vaccins
  sachetsParJour?: number | null;   // null = chargé depuis /api/suples-nutritionnels
  progressionGuerisonPct?: number | null;
  rdvDateStr: string | null;        // null = chargé depuis /api/rendez-vous
  rdvDaysLeft: number | null;
  rdvMotif: string | null;
  rdvHeure: string | null;
  rdvPraticien: string | null;
  rdvLieu: string | null;
  rdvConfirmed: boolean;
  isActive: boolean;
  heroPulse?: HeroPulse;
  nextAction?: NextAction;
  perinatal?: PerinatalData;
  vaccinsList?: VaccineRecord[];
  consultations?: ConsultationRecord[];
  supplementations?: SupplementationRecord[];
  mesuresCroissance?: WeightHistoryEntry[];
}

export interface ClinicMilestone {
  id: number;
  childId: number;
  date: string;
  isUpcoming: boolean;
  badgeLabel: string;
  title: string;
  subtitle: string;
  details: string;
  doctor: string;
  location: string;
  tags?: string[];
}

export interface DailyRationItem {
  id: number;
  childId: number;
  childName: string;
  time: string;
  title: string;
  description: string;
  status: 'done' | 'pending' | 'planned';
}

export interface WeekSachetDay {
  dayKey: string;
  dayLabel: string;
  dateStr: string;
  isToday: boolean;
  morningTaken: boolean;
  afternoonTaken: boolean;
  statusText: string;
}

export interface HealthcareContact {
  id: number;
  initials: string;
  nom: string;
  titre: string;
  centre: string;
  telephone: string;
  whatsapp: string;
  colorScheme: 'emerald' | 'amber' | 'slate';
}

export interface ParentProfile {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  quartier: string;
  ville: string;
  role: string;
  avatarUrl: string;
  enfantsCount: number;
}

export interface BackendEnfant {
  enfantId: number;
  nom: string;
  prenom: string;
  genre: 'MASCULIN' | 'FEMININ';
  dateNaissance: string;
  telephoneParent: string;
  qrCode?: string;
  groupeSanguin?: string;
  matricule?: string;
  structureSanteNom?: string; // Nom du centre de santé rattaché (sérialisé depuis StructureSante)
}

export interface BackendBilanAntro {
  id: number;
  dateBilan: string;
  poids: number;
  taille: number;
  perimetreBrachial: number;
  perimetreCranien?: number; // Optionnel selon les mesures enregistrées
  zScorePoidsTaille: number;
  zScorePoidsAge: number;
  statut: 'MAS' | 'MAM' | 'NORMAL';
  enfant?: BackendEnfant;
}

export interface BackendSupleNutritionnel {
  id: number;
  type: string;
  quantiteStock: number;
  dateDistribution: string;
  enfant?: BackendEnfant;
}

