import { Role } from './role.enum';

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  motDePasse: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  type: string;
  idUser: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  avatarUrl?: string;
  role: Role;
}

export interface UserSession {
  idUser: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  avatarUrl?: string;
  role: Role;
  token: string;
}
