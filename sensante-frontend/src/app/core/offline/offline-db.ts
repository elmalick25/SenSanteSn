import Dexie, { Table } from 'dexie';

export interface OfflineSyncAction {
  id?: number;
  actionType: 'NOUVEAU_BILAN' | 'DELIVRANCE_ATPE' | 'RELEVE_CONCESSION' | 'ALERTE_SAMU' | 'MESSAGE_SMS';
  endpoint: string;
  method: 'POST' | 'PUT';
  payload: any;
  timestamp: string;
  description: string;
  statut: 'PENDING' | 'SYNCING' | 'FAILED' | 'SYNCED';
  retryCount: number;
  errorMessage?: string;
}

export interface CachedConcession {
  id: string;
  nomConcessionnaire: string;
  secteur: string;
  statutClinique: 'MAS' | 'MAM' | 'NORMAL';
  latitude: number;
  longitude: number;
  derniereVisite: string;
  nbEnfants: number;
  rationRestante: number;
}

export interface CachedEnfant {
  id: number;
  matricule: string;
  nomComplet: string;
  ageMois: number;
  muacMm: number;
  statutNutritionnel: 'MAS' | 'MAM' | 'NORMAL';
  structureNom: string;
  tuteurNom: string;
  telephoneTuteur: string;
}

export class SenSanteOfflineDatabase extends Dexie {
  outboxSyncQueue!: Table<OfflineSyncAction, number>;
  concessionsCache!: Table<CachedConcession, string>;
  enfantsCache!: Table<CachedEnfant, number>;

  constructor() {
    super('SenSanteOfflineDB');
    this.version(1).stores({
      outboxSyncQueue: '++id, actionType, timestamp, statut, retryCount',
      concessionsCache: 'id, nomConcessionnaire, secteur, statutClinique',
      enfantsCache: 'id, matricule, nomComplet, statutNutritionnel'
    });
  }
}

export const offlineDB = new SenSanteOfflineDatabase();
