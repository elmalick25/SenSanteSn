import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HealthToastService {
  readonly toasts = signal<ToastMessage[]>([]);
  private nextId = 1;

  show(message: string, type: 'success' | 'warning' | 'info' | 'error' = 'success', durationMs = 3500): void {
    const id = this.nextId++;
    const iconMap: Record<string, string> = {
      success: '✓',
      warning: '⚠️',
      info: 'ℹ️',
      error: '✕'
    };

    const toast: ToastMessage = {
      id,
      message,
      type,
      icon: iconMap[type] || '✓'
    };

    this.toasts.update(list => [...list, toast]);

    setTimeout(() => {
      this.dismiss(id);
    }, durationMs);
  }

  dismiss(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
