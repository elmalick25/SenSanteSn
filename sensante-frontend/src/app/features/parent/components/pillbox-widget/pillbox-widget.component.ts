import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentStateService } from '../../../../core/services/parent-state.service';
import { HealthToastService } from '../../../../core/services/health-toast.service';

@Component({
  selector: 'app-pillbox-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col">
      <!-- En-tête -->
      <div class="flex items-center justify-between pb-3.5 border-b border-slate-100 gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <span class="material-symbols-outlined text-emerald-700 text-[22px] flex-shrink-0">medication</span>
          <h3 class="text-[15px] font-bold text-slate-900 font-sans whitespace-nowrap">Pilulier &amp; Ration du Jour</h3>
        </div>
        <span class="px-2.5 py-0.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex-shrink-0"
              [class.bg-emerald-100]="stateService.pillboxProgress() === '3/3 pris'"
              [class.text-emerald-800]="stateService.pillboxProgress() === '3/3 pris'"
              [class.bg-emerald-50]="stateService.pillboxProgress() !== '3/3 pris'"
              [class.text-emerald-700]="stateService.pillboxProgress() !== '3/3 pris'">
          {{ stateService.pillboxProgress() }}
        </span>
      </div>

      <p class="text-xs text-slate-500 mt-2">
        Plan nutritionnel journalier prescrit. Cochez les prises pour synchroniser le carnet de l'agent Badien Gox en temps réel.
      </p>

      <!-- Liste des Prises -->
      <div class="mt-4 space-y-2.5">
        <!-- Slot 1 : Matin -->
        <div
          class="p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between"
          [class.bg-emerald-50]="isSlotDone('slot-1')"
          [class.border-emerald-200]="isSlotDone('slot-1')"
          [class.bg-slate-50]="!isSlotDone('slot-1')"
          [class.border-transparent]="!isSlotDone('slot-1')"
          (click)="handleToggle('slot-1', '08:00')">
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="w-7 h-7 rounded-lg flex items-center justify-center transition-all shadow-xs flex-shrink-0"
              [class.bg-emerald-700]="isSlotDone('slot-1')"
              [class.text-white]="isSlotDone('slot-1')"
              [class.bg-white]="!isSlotDone('slot-1')"
              [class.border-2]="!isSlotDone('slot-1')"
              [class.border-slate-300]="!isSlotDone('slot-1')">
              <span *ngIf="isSlotDone('slot-1')" class="material-symbols-outlined text-[18px] font-bold">check</span>
            </button>
            <div class="flex flex-col">
              <div class="flex items-center gap-2">
                <span class="text-xs font-medium text-slate-500 whitespace-nowrap">08:00 • Matin</span>
                <span
                  class="px-1.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap flex-shrink-0"
                  [class.bg-emerald-100]="isSlotDone('slot-1')"
                  [class.text-emerald-800]="isSlotDone('slot-1')"
                  [class.bg-slate-200]="!isSlotDone('slot-1')"
                  [class.text-slate-600]="!isSlotDone('slot-1')">
                  {{ isSlotDone('slot-1') ? 'Validé à ' + getSlotTime('slot-1', '08:12') : 'À donner' }}
                </span>
              </div>
              <span class="text-sm font-bold text-slate-900">Plumpy'Sup (1/2 sachet)</span>
              <span class="text-xs" [class.text-emerald-700]="isSlotDone('slot-1')" [class.text-slate-500]="!isSlotDone('slot-1')">
                Pris avec eau tiède bouillie
              </span>
            </div>
          </div>
          <span class="material-symbols-outlined text-[20px]"
                [class.text-emerald-700]="isSlotDone('slot-1')"
                [class.text-slate-400]="!isSlotDone('slot-1')">
            {{ isSlotDone('slot-1') ? 'verified' : 'schedule' }}
          </span>
        </div>

        <!-- Slot 2 : Midi -->
        <div
          class="p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between"
          [class.bg-emerald-50]="isSlotDone('slot-2')"
          [class.border-emerald-200]="isSlotDone('slot-2')"
          [class.bg-slate-50]="!isSlotDone('slot-2')"
          [class.border-transparent]="!isSlotDone('slot-2')"
          (click)="handleToggle('slot-2', '13:00')">
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="w-7 h-7 rounded-lg flex items-center justify-center transition-all shadow-xs flex-shrink-0"
              [class.bg-emerald-700]="isSlotDone('slot-2')"
              [class.text-white]="isSlotDone('slot-2')"
              [class.bg-white]="!isSlotDone('slot-2')"
              [class.border-2]="!isSlotDone('slot-2')"
              [class.border-slate-300]="!isSlotDone('slot-2')">
              <span *ngIf="isSlotDone('slot-2')" class="material-symbols-outlined text-[18px] font-bold">check</span>
            </button>
            <div class="flex flex-col">
              <div class="flex items-center gap-2">
                <span class="text-xs font-medium text-slate-500 whitespace-nowrap">13:00 • Midi</span>
                <span
                  class="px-1.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap flex-shrink-0"
                  [class.bg-emerald-100]="isSlotDone('slot-2')"
                  [class.text-emerald-800]="isSlotDone('slot-2')"
                  [class.bg-amber-100]="!isSlotDone('slot-2')"
                  [class.text-amber-800]="!isSlotDone('slot-2')">
                  {{ isSlotDone('slot-2') ? 'Validé à ' + getSlotTime('slot-2', '13:05') : 'À donner' }}
                </span>
              </div>
              <span class="text-sm font-bold text-slate-900">Plumpy'Sup (1/2 sachet)</span>
              <span class="text-xs text-slate-500">À donner après la tétée</span>
            </div>
          </div>
          <button
            *ngIf="!isSlotDone('slot-2')"
            type="button"
            class="px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all shadow-xs flex items-center gap-1 whitespace-nowrap flex-shrink-0"
            (click)="$event.stopPropagation(); handleToggle('slot-2', '13:00')">
            <span>Donner</span>
            <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
          <span *ngIf="isSlotDone('slot-2')" class="material-symbols-outlined text-emerald-700 text-[20px]">
            verified
          </span>
        </div>

        <!-- Slot 3 : Soir -->
        <div
          class="p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between"
          [class.bg-emerald-50]="isSlotDone('slot-3')"
          [class.border-emerald-200]="isSlotDone('slot-3')"
          [class.bg-slate-50]="!isSlotDone('slot-3')"
          [class.border-transparent]="!isSlotDone('slot-3')"
          (click)="handleToggle('slot-3', '19:00')">
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="w-7 h-7 rounded-lg flex items-center justify-center transition-all shadow-xs flex-shrink-0"
              [class.bg-emerald-700]="isSlotDone('slot-3')"
              [class.text-white]="isSlotDone('slot-3')"
              [class.bg-white]="!isSlotDone('slot-3')"
              [class.border-2]="!isSlotDone('slot-3')"
              [class.border-slate-300]="!isSlotDone('slot-3')">
              <span *ngIf="isSlotDone('slot-3')" class="material-symbols-outlined text-[18px] font-bold">check</span>
            </button>
            <div class="flex flex-col">
              <div class="flex items-center gap-2">
                <span class="text-xs font-medium text-slate-500 whitespace-nowrap">19:00 • Soir</span>
                <span
                  class="px-1.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap flex-shrink-0"
                  [class.bg-emerald-100]="isSlotDone('slot-3')"
                  [class.text-emerald-800]="isSlotDone('slot-3')"
                  [class.bg-slate-200]="!isSlotDone('slot-3')"
                  [class.text-slate-600]="!isSlotDone('slot-3')">
                  {{ isSlotDone('slot-3') ? 'Validé à ' + getSlotTime('slot-3', '19:00') : 'Prévu 19:00' }}
                </span>
              </div>
              <span class="text-sm font-bold text-slate-900">Bouillie Fortifiée Locale</span>
              <span class="text-xs text-slate-500">1 bol (150ml) tiède (Mil-Moringa)</span>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button
              type="button"
              class="p-1 text-emerald-700 hover:text-emerald-900 transition-colors"
              title="Voir ingrédients de la bouillie"
              (click)="$event.stopPropagation(); openRecipe.emit()">
              <span class="material-symbols-outlined text-[20px]">menu_book</span>
            </button>
            <span class="material-symbols-outlined text-[20px]"
                  [class.text-emerald-700]="isSlotDone('slot-3')"
                  [class.text-slate-300]="!isSlotDone('slot-3')">
              {{ isSlotDone('slot-3') ? 'verified' : 'schedule' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Barre de synchronisation basse -->
      <div class="mt-4 p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-slate-600 text-xs border border-slate-100">
        <span class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500" [class.animate-pulse]="stateService.isSyncing()"></span>
          <span>{{ stateService.lastSyncLabel() }}</span>
        </span>
        <button
          type="button"
          class="text-emerald-700 font-bold hover:underline flex items-center gap-1"
          (click)="triggerSync()">
          <span class="material-symbols-outlined text-[14px]" [class.animate-spin]="stateService.isSyncing()">sync</span>
          <span>Actualiser</span>
        </button>
      </div>
    </div>
  `
})
export class PillboxWidgetComponent {
  readonly stateService = inject(ParentStateService);
  private readonly toast = inject(HealthToastService);

  @Output() openRecipe = new EventEmitter<void>();

  isSlotDone(slotId: string): boolean {
    return this.stateService.pillboxState()[slotId]?.done ?? false;
  }

  getSlotTime(slotId: string, fallback: string): string {
    return this.stateService.pillboxState()[slotId]?.timestamp || fallback;
  }

  handleToggle(slotId: string, defaultHour: string): void {
    const isDone = this.stateService.togglePillboxSlot(slotId, defaultHour);
    if (isDone) {
      this.toast.show('Prise enregistrée et horodatée avec succès', 'success');
    } else {
      this.toast.show('Statut de la prise réinitialisé', 'info');
    }
  }

  triggerSync(): void {
    this.stateService.syncPillbox();
    this.toast.show('Synchronisation effectuée avec le carnet PRN', 'success');
  }
}
