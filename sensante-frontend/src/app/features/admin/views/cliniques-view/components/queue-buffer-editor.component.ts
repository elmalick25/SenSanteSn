import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueueBufferConfig } from '../../../../../core/models/configuration-clinique.model';

@Component({
  selector: 'app-queue-buffer-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full">
      <div>
        <!-- Card Header -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-md bg-teal-100 text-[#003426] flex items-center justify-center">
              <span class="material-symbols-outlined text-lg">timelapse</span>
            </div>
            <h2 class="text-base font-semibold text-slate-900 text-balance">
              Algorithme de File d'Attente « Zéro Attente »
            </h2>
          </div>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap flex-shrink-0">
            Optimisation Flux Patients
          </span>
        </div>

        <!-- Description -->
        <p class="text-xs text-slate-600 mb-4 leading-relaxed text-pretty">
          Calibrage du temps tampon inter-consultations pour l'ordonnancement prédictif des rendez-vous au niveau des postes de santé et centres de triage pédiatrique.
        </p>

        <!-- Input Controls Bento -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <!-- Primary Stepper: Tampon par défaut -->
          <div class="p-3 rounded-lg border border-slate-200 bg-slate-50/70 flex flex-col justify-between">
            <span class="text-xs text-slate-800 font-semibold mb-1 whitespace-nowrap">Tampon Inter-Consultation</span>
            <div class="flex items-center justify-between mt-2">
              <button
                type="button"
                (click)="decrementBuffer()"
                class="w-8 h-8 rounded border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center font-bold text-[#003426] transition-colors whitespace-nowrap"
              >
                -
              </button>
              <div class="flex items-baseline gap-1">
                <span class="font-mono text-xl font-bold text-[#003426]">
                  {{ queue.bufferInterConsultationMinutes }}
                </span>
                <span class="text-xs text-slate-500">min</span>
              </div>
              <button
                type="button"
                (click)="incrementBuffer()"
                class="w-8 h-8 rounded border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center font-bold text-[#003426] transition-colors whitespace-nowrap"
              >
                +
              </button>
            </div>
            <span class="text-[11px] text-slate-500 mt-2 text-center">Désinfection &amp; saisie</span>
          </div>

          <!-- Marge de retard -->
          <div class="p-3 rounded-lg border border-slate-200 bg-slate-50/70 flex flex-col justify-between">
            <span class="text-xs text-slate-800 font-semibold mb-1 whitespace-nowrap">Tolérance Retard Patient</span>
            <div class="flex items-center justify-between mt-2">
              <button
                type="button"
                (click)="decrementRetard()"
                class="w-8 h-8 rounded border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center font-bold text-[#003426] transition-colors whitespace-nowrap"
              >
                -
              </button>
              <div class="flex items-baseline gap-1">
                <span class="font-mono text-xl font-bold text-[#003426]">
                  {{ queue.toleranceRetardMinutes }}
                </span>
                <span class="text-xs text-slate-500">min</span>
              </div>
              <button
                type="button"
                (click)="incrementRetard()"
                class="w-8 h-8 rounded border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center font-bold text-[#003426] transition-colors whitespace-nowrap"
              >
                +
              </button>
            </div>
            <span class="text-[11px] text-slate-500 mt-2 text-center">Réattribution créneau</span>
          </div>

          <!-- Plafond Urgences -->
          <div class="p-3 rounded-lg border border-slate-200 bg-slate-50/70 flex flex-col justify-between">
            <span class="text-xs text-slate-800 font-semibold mb-1 whitespace-nowrap">Plafond Urgences / Vacation</span>
            <div class="flex items-center justify-between mt-2">
              <button
                type="button"
                (click)="decrementUrgences()"
                class="w-8 h-8 rounded border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center font-bold text-[#003426] transition-colors whitespace-nowrap"
              >
                -
              </button>
              <div class="flex items-baseline gap-1">
                <span class="font-mono text-xl font-bold text-[#003426]">
                  {{ queue.plafondUrgencesParVacation }}
                </span>
                <span class="text-xs text-slate-500">cas</span>
              </div>
              <button
                type="button"
                (click)="incrementUrgences()"
                class="w-8 h-8 rounded border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center font-bold text-[#003426] transition-colors whitespace-nowrap"
              >
                +
              </button>
            </div>
            <span class="text-[11px] text-slate-500 mt-2 text-center">Non programmées</span>
          </div>
        </div>

        <!-- Timeline Simulation Visual -->
        <div class="border border-slate-200 rounded-lg p-3 bg-slate-50/70">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] uppercase font-bold text-slate-600">
              Simulation de File Cadencée (Créneau Matin 08:00 - 09:00)
            </span>
            <span class="text-xs text-emerald-700 font-semibold whitespace-nowrap">
              Taux d'occupation calibré : {{ calculateOccupancy() }}%
            </span>
          </div>

          <!-- Visual Bar Representation (12 Columns) -->
          <div class="grid grid-cols-12 gap-1 h-9 rounded-md bg-white border border-slate-200 p-1">
            <!-- Consultation 1 -->
            <div class="col-span-3 bg-[#166b53] text-white rounded flex items-center justify-center px-1 text-[11px] font-semibold truncate shadow-xs">
              08:00 Cons. 1
            </div>
            <!-- Buffer 1 -->
            <div class="col-span-3 bg-slate-100 border border-dashed border-slate-300 text-slate-700 rounded flex items-center justify-center px-1 text-[10px] font-medium truncate">
              Tampon {{ queue.bufferInterConsultationMinutes }}m
            </div>
            <!-- Consultation 2 -->
            <div class="col-span-3 bg-[#166b53] text-white rounded flex items-center justify-center px-1 text-[11px] font-semibold truncate shadow-xs">
              08:30 Cons. 2
            </div>
            <!-- Buffer 2 -->
            <div class="col-span-3 bg-slate-100 border border-dashed border-slate-300 text-slate-700 rounded flex items-center justify-center px-1 text-[10px] font-medium truncate">
              Tampon {{ queue.bufferInterConsultationMinutes }}m
            </div>
          </div>

          <div class="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
            <span>08:00 Début Session</span>
            <span>08:30 Triage Continu</span>
            <span>09:00 Rotation Médicale</span>
          </div>
        </div>
      </div>

      <!-- Footnote -->
      <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500 text-xs">
        <span>Module IA Ordonnancement v3.1</span>
        <span class="text-emerald-700 font-medium">Réduction temps d'attente estimée : -{{ queue.reductionAttenteEstimeePct }}%</span>
      </div>
    </section>
  `
})
export class QueueBufferEditorComponent {
  @Input({ required: true }) queue!: QueueBufferConfig;
  @Output() configChanged = new EventEmitter<void>();

  incrementBuffer(): void {
    if (this.queue.bufferInterConsultationMinutes < 45) {
      this.queue.bufferInterConsultationMinutes += 5;
      this.recalculateOccupancy();
      this.configChanged.emit();
    }
  }

  decrementBuffer(): void {
    if (this.queue.bufferInterConsultationMinutes > 5) {
      this.queue.bufferInterConsultationMinutes -= 5;
      this.recalculateOccupancy();
      this.configChanged.emit();
    }
  }

  incrementRetard(): void {
    if (this.queue.toleranceRetardMinutes < 30) {
      this.queue.toleranceRetardMinutes += 5;
      this.configChanged.emit();
    }
  }

  decrementRetard(): void {
    if (this.queue.toleranceRetardMinutes > 0) {
      this.queue.toleranceRetardMinutes -= 5;
      this.configChanged.emit();
    }
  }

  incrementUrgences(): void {
    if (this.queue.plafondUrgencesParVacation < 12) {
      this.queue.plafondUrgencesParVacation += 1;
      this.configChanged.emit();
    }
  }

  decrementUrgences(): void {
    if (this.queue.plafondUrgencesParVacation > 1) {
      this.queue.plafondUrgencesParVacation -= 1;
      this.configChanged.emit();
    }
  }

  calculateOccupancy(): number {
    // Calcul dynamique : plus le tampon est élevé, plus le taux d'occupation se détend
    const buffer = this.queue.bufferInterConsultationMinutes;
    const computed = Math.round(100 - (buffer * 1.45));
    return Math.max(50, Math.min(95, computed));
  }

  private recalculateOccupancy(): void {
    this.queue.tauxOccupationCalibrePct = this.calculateOccupancy();
  }
}
