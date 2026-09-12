import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-preferences-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 lg:p-8 flex flex-col gap-6">
      <div class="border-b border-slate-100 pb-4">
        <h3 class="text-base font-bold text-slate-900 tracking-tight text-balance">
          Préférences d'Administration &amp; Notifications MSAS
        </h3>
        <p class="text-xs text-slate-500 mt-0.5 text-pretty">
          Personnalisez la réception des alertes d'urgence épidémiologique et les canaux de transmission opérationnelle.
        </p>
      </div>

      <div class="space-y-4 max-w-2xl">
        <!-- 1. Alertes Rupture PNA -->
        <div class="flex items-center justify-between p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-emerald-700 text-[20px] mt-0.5">notification_important</span>
            <div>
              <h4 class="text-xs font-bold text-slate-800">Alertes Ruptures Logistiques PNA (SMS Prioritaire)</h4>
              <p class="text-[11px] text-slate-500">Notification immédiate en cas de rupture de stock critique d'intrants nutritionnels ou vaccins.</p>
            </div>
          </div>
          <input type="checkbox" checked class="rounded text-emerald-700 focus:ring-emerald-700 h-4 w-4" />
        </div>

        <!-- 2. Rapport Hebdomadaire Consolidé -->
        <div class="flex items-center justify-between p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-blue-700 text-[20px] mt-0.5">mail</span>
            <div>
              <h4 class="text-xs font-bold text-slate-800">Synthèse Hebdomadaire par Email</h4>
              <p class="text-[11px] text-slate-500">Envoi chaque lundi matin du rapport d'impact et des indicateurs du Baromètre National.</p>
            </div>
          </div>
          <input type="checkbox" checked class="rounded text-emerald-700 focus:ring-emerald-700 h-4 w-4" />
        </div>

        <!-- 3. Alertes Sécurité SSI -->
        <div class="flex items-center justify-between p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-purple-700 text-[20px] mt-0.5">security</span>
            <div>
              <h4 class="text-xs font-bold text-slate-800">Journal d'Audit SSI &amp; Détection d'Anomalies</h4>
              <p class="text-[11px] text-slate-500">Alertes en temps réel lors de tentatives d'accès non autorisées ou d'actions sensibles.</p>
            </div>
          </div>
          <input type="checkbox" checked class="rounded text-emerald-700 focus:ring-emerald-700 h-4 w-4" />
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100 flex justify-end">
        <button 
          type="button" 
          (click)="onSavePreferences.emit()"
          class="px-5 py-2.5 rounded-xl bg-[#003426] text-white font-bold text-xs hover:bg-[#0c3c2e] transition-colors cursor-pointer whitespace-nowrap"
        >
          Enregistrer les Préférences
        </button>
      </div>
    </div>
  `
})
export class ProfilePreferencesTabComponent {
  onSavePreferences = output<void>();
}
