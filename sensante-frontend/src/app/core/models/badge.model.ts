import { Role } from './role.enum';

export type StatutCompte = 'ACTIF' | 'SUSPENDU' | 'EN_ATTENTE';

export interface Badge {
  idUser: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: Role;
  avatarUrl?: string;
  dateNaissance?: string;
  cni?: string;
  cniMasquee?: string;
  numeroOrdre?: string;
  matriculeEtat?: string;
  titrePoste?: string;
  codeStructure?: string;
  nomStructure?: string;
  regionSanitaire?: string;
  districtSanitaire?: string;
  statutCompte: StatutCompte;
  securiteMfa?: string;
  motifSuspension?: string;
  codeBadge?: string;
  accreditation?: string;
  idCarnet?: string;
  enfantsAssociesCount?: number;
}

export interface BadgeStats {
  totalBadges: number;
  totalValides: number;
  totalEnAttente: number;
  totalSuspendus: number;
  medecinsChefsCount: number;
  agentsSanteCount: number;
  superviseursCount: number;
  administrateursCount: number;
  parentsCount: number;
}

export interface CreateBadgePayload {
  role: Role;
  nom: string;
  prenom?: string;
  dateNaissance?: string;
  cni: string;
  avatarUrl?: string;
  numeroOrdre?: string;
  matriculeEtat?: string;
  regionSanitaire?: string;
  districtSanitaire?: string;
  nomStructure?: string;
  codeStructure?: string;
  titrePoste?: string;
  email: string;
  telephone: string;
  motDePasse?: string;
}

export interface PageBadgesResponse {
  content: Badge[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
