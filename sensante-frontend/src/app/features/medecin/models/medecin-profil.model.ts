export interface MedecinProfil {
  idMedecin: number;
  nomComplet: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  adresse: string;
  specialite: string;
  matriculeOrdre: string;
  structureRattachement: string;
  cabinet: string;
  statutOrdre: string;
  langueFrancaise: boolean;
  langueWolof: boolean;
  avatarUrl: string;
  dateDerniereMiseAJour: string;
  synchroniseDhis2: boolean;
}

export interface UpdateMedecinProfilRequest {
  nomComplet?: string;
  telephone?: string;
  dateNaissance?: string;
  adresse?: string;
  specialite?: string;
  structureRattachement?: string;
  langueFrancaise?: boolean;
  langueWolof?: boolean;
  avatarUrl?: string;
}

export interface UpdateMedecinProfilResponse {
  succes: boolean;
  message: string;
  horodatage: string;
  profil: MedecinProfil;
}
