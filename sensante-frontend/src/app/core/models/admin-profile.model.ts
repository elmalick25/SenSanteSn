export interface AdminProfile {
  idUser: number;
  nom: string;
  prenom: string;
  nomComplet: string;
  email: string;
  telephone: string;
  indicatifPays: string;
  dateNaissance: string; // ISO format or YYYY-MM-DD
  adresse: string;
  fonction: string;
  matricule: string;
  matriculeVerifie: boolean;
  perimetre: string;
  perimetreVerrouille: boolean;
  langueTravail: 'FR' | 'WO';
  avatarUrl: string;
  role: string;
  roleLabel: string;
  roleNationalNiveau: string;
  compteCertifieCni: boolean;
  derniereConnexion: string;
  derniereSynchronisation: string;
  institution: string;
  direction: string;
  sessionCertificat: string;
}

export interface AdminProfileUpdate {
  nom: string;
  prenom?: string;
  telephone: string;
  dateNaissance: string;
  adresse: string;
  fonction: string;
  matricule: string;
  langueTravail: string;
  avatarUrl?: string;
}

export interface AdminReportResponse {
  status: string;
  generatedAt: string;
  reportUrl: string;
  sessionCertificat: string;
  message: string;
}
