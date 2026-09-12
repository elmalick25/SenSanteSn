import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegalAuditLog } from '../../../../../core/models/audit.model';

@Component({
  selector: 'app-legal-audit-register',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
      <!-- En-tête -->
      <div class="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-[22px]">history_edu</span>
          <div>
            <h3 class="text-headline-sm font-headline-sm text-slate-900 font-bold">
              Registre Certifié des Audits Légaux
            </h3>
            <p class="text-xs text-slate-500">
              Archives probatoires scellées par hash SHA-256
            </p>
          </div>
        </div>
        <span class="material-symbols-outlined text-slate-400 text-[20px]">lock</span>
      </div>

      <!-- Liste des Extraits Légaux & Scellés -->
      <div class="divide-y divide-slate-100 p-2">
        <div
          *ngFor="let item of legalLogs"
          class="p-3 rounded-xl hover:bg-slate-50 transition-colors flex flex-col gap-2"
        >
          <div class="flex items-center justify-between">
            <span
              class="px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1"
              [ngClass]="item.organisme.includes('Ordre') ? 'bg-sky-100 text-sky-900' : 'bg-emerald-100 text-emerald-900'"
            >
              <span
                class="material-symbols-outlined text-xs"
                [ngClass]="item.organisme.includes('Ordre') ? 'text-sky-700' : 'text-emerald-700'"
              >
                verified
              </span>
              <span>{{ item.titre }}</span>
            </span>
            <span class="text-xs text-slate-400 font-code-num">{{ item.dateAudit }}</span>
          </div>

          <p class="text-xs text-slate-700 font-medium text-pretty">
            {{ item.description }}
          </p>

          <!-- Cartouche Scellé Cryptographique SHA-256 -->
          <div class="p-2 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-between text-xs">
            <div class="flex items-center gap-1.5 overflow-hidden">
              <span class="material-symbols-outlined text-slate-400 text-sm">fingerprint</span>
              <span class="font-code-num text-slate-600 truncate text-[11px]">
                {{ item.hashSha256 }}... ({{ item.labelSignature }})
              </span>
            </div>
            <button
              type="button"
              (click)="downloadPdf.emit(item)"
              class="text-primary hover:text-primary-container font-semibold flex items-center gap-0.5 text-xs whitespace-nowrap active:scale-[0.98]"
            >
              <span class="material-symbols-outlined text-sm">download</span>
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Sceau Numérique Institutionnel Footer -->
      <div class="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col gap-2">
        <div class="flex items-center gap-2 text-xs text-slate-600">
          <span class="material-symbols-outlined text-emerald-700 text-base shrink-0">security_update_good</span>
          <span class="text-[11px] text-pretty">
            Intégrité des registres vérifiée par autorité d'horodatage nationale certifiée.
          </span>
        </div>
        <button
          type="button"
          (click)="downloadAllZip.emit()"
          class="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs whitespace-nowrap active:scale-[0.98]"
        >
          <span class="material-symbols-outlined text-base">folder_zip</span>
          <span>Télécharger l'ensemble des scellés juridiques (ZIP certifié)</span>
        </button>
      </div>
    </section>
  `
})
export class LegalAuditRegisterComponent {
  @Input() legalLogs: LegalAuditLog[] = [];
  @Output() downloadPdf = new EventEmitter<LegalAuditLog>();
  @Output() downloadAllZip = new EventEmitter<void>();
}
