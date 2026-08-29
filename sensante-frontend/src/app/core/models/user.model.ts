import { Role } from './role.enum';

export interface Utilisateur {
  idUser?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  role: Role;
}
