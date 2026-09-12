import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { offlineDB, OfflineSyncAction, CachedConcession, CachedEnfant } from './offline-db';

@Injectable({
  providedIn: 'root'
})
export class OfflineSyncService {
  private readonly http = inject(HttpClient);

  readonly isOnline = signal<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  readonly pendingCount = signal<number>(0);
  readonly isSyncing = signal<boolean>(false);
  readonly lastSyncTimestamp = signal<string | null>(null);

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline.set(true);
        this.flushQueue();
      });

      window.addEventListener('offline', () => {
        this.isOnline.set(false);
      });
    }

    this.refreshPendingCount();
  }

  async refreshPendingCount(): Promise<number> {
    try {
      const count = await offlineDB.outboxSyncQueue
        .where('statut')
        .equals('PENDING')
        .count();
      this.pendingCount.set(count);
      return count;
    } catch {
      return 0;
    }
  }

  async queueAction(
    actionType: OfflineSyncAction['actionType'],
    endpoint: string,
    method: 'POST' | 'PUT',
    payload: any,
    description: string
  ): Promise<OfflineSyncAction> {
    const action: OfflineSyncAction = {
      actionType,
      endpoint,
      method,
      payload,
      timestamp: new Date().toISOString(),
      description,
      statut: 'PENDING',
      retryCount: 0
    };

    const id = await offlineDB.outboxSyncQueue.add(action);
    action.id = id;
    await this.refreshPendingCount();

    // Tentative immédiate si en ligne
    if (this.isOnline()) {
      this.flushQueue();
    }

    return action;
  }

  async flushQueue(): Promise<{ synced: number; failed: number }> {
    if (this.isSyncing() || !this.isOnline()) {
      return { synced: 0, failed: 0 };
    }

    this.isSyncing.set(true);
    let synced = 0;
    let failed = 0;

    try {
      const pendingActions = await offlineDB.outboxSyncQueue
        .where('statut')
        .equals('PENDING')
        .toArray();

      for (const item of pendingActions) {
        if (!item.id) continue;

        await offlineDB.outboxSyncQueue.update(item.id, { statut: 'SYNCING' });

        try {
          if (item.method === 'POST') {
            await firstValueFrom(this.http.post(item.endpoint, item.payload));
          } else {
            await firstValueFrom(this.http.put(item.endpoint, item.payload));
          }

          // Action synchronisée : supprimer de la file
          await offlineDB.outboxSyncQueue.delete(item.id);
          synced++;
        } catch (err: any) {
          failed++;
          const retry = item.retryCount + 1;
          await offlineDB.outboxSyncQueue.update(item.id, {
            statut: retry >= 5 ? 'FAILED' : 'PENDING',
            retryCount: retry,
            errorMessage: err?.message || 'Erreur réseau de synchronisation'
          });
        }
      }

      this.lastSyncTimestamp.set(new Date().toLocaleTimeString('fr-FR'));
    } finally {
      await this.refreshPendingCount();
      this.isSyncing.set(false);
    }

    return { synced, failed };
  }

  async getPendingActions(): Promise<OfflineSyncAction[]> {
    return offlineDB.outboxSyncQueue.toArray();
  }

  async cacheConcessions(concessions: CachedConcession[]): Promise<void> {
    await offlineDB.concessionsCache.clear();
    await offlineDB.concessionsCache.bulkPut(concessions);
  }

  async getCachedConcessions(): Promise<CachedConcession[]> {
    return offlineDB.concessionsCache.toArray();
  }

  async cacheEnfants(enfants: CachedEnfant[]): Promise<void> {
    await offlineDB.enfantsCache.clear();
    await offlineDB.enfantsCache.bulkPut(enfants);
  }

  async getCachedEnfants(): Promise<CachedEnfant[]> {
    return offlineDB.enfantsCache.toArray();
  }
}
