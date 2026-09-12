import { Injectable, signal } from '@angular/core';

export interface AlerteMasRealtimeEvent {
  alerteId: number;
  matriculeEnfant: string;
  nomEnfant: string;
  perimetreBrachial: number;
  oedemes: boolean;
  niveauUrgence: string;
  motif: string;
  structureNom: string;
  agentNom: string;
  timestamp: string;
  hashSignature: string;
}

@Injectable({
  providedIn: 'root'
})
export class RealtimeAlertService {
  private eventSource: EventSource | null = null;

  readonly isConnected = signal<boolean>(false);
  readonly latestAlerte = signal<AlerteMasRealtimeEvent | null>(null);
  readonly alertes = signal<AlerteMasRealtimeEvent[]>([]);
  readonly unreadCount = signal<number>(0);

  constructor() {
    this.connect();
  }

  connect(): void {
    if (typeof window === 'undefined' || typeof EventSource === 'undefined') {
      return;
    }

    if (this.eventSource) {
      this.eventSource.close();
    }

    try {
      this.eventSource = new EventSource('/api/stream/alertes-mas');

      this.eventSource.onopen = () => {
        this.isConnected.set(true);
      };

      this.eventSource.addEventListener('alerte-mas', (event: MessageEvent) => {
        try {
          const alerte: AlerteMasRealtimeEvent = JSON.parse(event.data);
          this.latestAlerte.set(alerte);
          this.alertes.update(list => [alerte, ...list.slice(0, 19)]);
          this.unreadCount.update(c => c + 1);
        } catch {
          // ignore parsing error
        }
      });

      this.eventSource.onerror = () => {
        this.isConnected.set(false);
        // EventSource tente automatiquement de se reconnecter
      };
    } catch {
      this.isConnected.set(false);
    }
  }

  markAllAsRead(): void {
    this.unreadCount.set(0);
  }

  clearLatestAlerte(): void {
    this.latestAlerte.set(null);
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.isConnected.set(false);
    }
  }
}
