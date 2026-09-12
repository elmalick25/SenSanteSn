export interface AntecedentNeonatal {
  poidsNaissance: number;
  tailleNaissance: number;
  perimetreCranien: number;
  scoreApgar: string;
  statutDrepanocytose: string;
  modeAccouchement: string;
  allaitementMaternelExclusif: boolean;
  materniteOrigine: string;
}

export interface VaccinEnfant {
  id?: number;
  codeVaccin: string;
  nomVaccin: string;
  dateAdministration: string;
  effectue: boolean;
  agentSanteNom?: string;
}

export interface DocumentCertifie {
  id: string;
  titre: string;
  description: string;
  dateSignature: string;
  tailleFichier: string;
  nomSignataire: string;
  roleSignataire: string;
  empreinteSecurite: string;
  typeDocument: string;
}

export interface CarnetSanteData {
  enfantId: number;
  nomComplet: string;
  prenom: string;
  nom: string;
  genre: 'MASCULIN' | 'FEMININ';
  dateNaissance: string;
  ageEnMois: number;
  codeNational: string;
  qrCodeToken: string;
  groupeSanguin: string;
  nomStructureSante: string;
  regionMedicale: string;
  tuteurNom: string;
  dernierPoids: number;
  derniereTaille: number;
  dernierPerimetreBrachial: number;
  statutNutritionnel: 'NORMAL' | 'MAM' | 'MAS';
  antecedents: AntecedentNeonatal;
  vaccinsNaissance: VaccinEnfant[];
  documentsOfficiels: DocumentCertifie[];
  hashCryptographiqueSHA256: string;
}
