import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditStats } from '../../../../../core/models/audit.model';

@Component({
  selector: 'app-audit-scorecards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Card 1: Souveraineté des Données -->
      <div class="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-4 flex flex-col justify-between transition-all hover:bg-white/15">
        <div class="flex items-center justify-between">
          <span class="text-[11px] uppercase tracking-wider text-emerald-200 font-bold whitespace-nowrap">
            Souveraineté des Données
          </span>
          <span class="material-symbols-outlined text-emerald-300 text-[20px]">cloud_done</span>
        </div>
        <div class="my-2">
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-extrabold font-code-num text-white">
              {{ stats?.indiceSouverainete || 99.8 }}%
            </span>
            <span class="text-xs font-semibold text-emerald-300 flex items-center whitespace-nowrap">
              <span class="material-symbols-outlined text-xs">arrow_upward</span>
              {{ stats?.variationSouverainete || '+0.4%' }}
            </span>
          </div>
          <p class="text-xs text-emerald-100/75 mt-1 text-pretty">
            {{ stats?.descriptionSouverainete || '100% des hébergements certifiés sur le territoire sénégalais' }}
          </p>
        </div>
        <div class="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
          <div
            class="bg-emerald-400 h-full rounded-full transition-all duration-500"
            [style.width.%]="stats?.indiceSouverainete || 99.8"
          ></div>
        </div>
      </div>

      <!-- Card 2: Respect Secret Médical ONMS -->
      <div class="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-4 flex flex-col justify-between transition-all hover:bg-white/15">
        <div class="flex items-center justify-between">
          <span class="text-[11px] uppercase tracking-wider text-emerald-200 font-bold whitespace-nowrap">
            Secret Médical (ONMS)
          </span>
          <span class="material-symbols-outlined text-emerald-300 text-[20px]">privacy_tip</span>
        </div>
        <div class="my-2">
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-extrabold font-code-num text-white">
              {{ stats?.scoreSecretMedical || 98.4 }}%
            </span>
            <span class="text-xs font-semibold text-emerald-300 flex items-center whitespace-nowrap">
              <span class="material-symbols-outlined text-xs">check_circle</span>
              {{ stats?.statutSecretMedical || 'Conforme' }}
            </span>
          </div>
          <p class="text-xs text-emerald-100/75 mt-1 text-pretty">
            {{ stats?.descriptionSecretMedical || defaultSecretMedicalDesc }}
          </p>
        </div>
        <div class="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
          <div
            class="bg-teal-300 h-full rounded-full transition-all duration-500"
            [style.width.%]="stats?.scoreSecretMedical || 98.4"
          ></div>
        </div>
      </div>

      <!-- Card 3: Adoption MFA Personnel -->
      <div class="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-4 flex flex-col justify-between transition-all hover:bg-white/15">
        <div class="flex items-center justify-between">
          <span class="text-[11px] uppercase tracking-wider text-emerald-200 font-bold whitespace-nowrap">
            Adoption MFA Personnel
          </span>
          <span class="material-symbols-outlined text-emerald-300 text-[20px]">fingerprint</span>
        </div>
        <div class="my-2">
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-extrabold font-code-num text-white">
              {{ stats?.adoptionMfa || 99.4 }}%
            </span>
            <span class="text-xs font-semibold text-emerald-300 flex items-center whitespace-nowrap">
              <span class="material-symbols-outlined text-xs">arrow_upward</span>
              {{ stats?.variationMfa || '+1.8%' }}
            </span>
          </div>
          <p class="text-xs text-emerald-100/75 mt-1 text-pretty">
            Authentification biométrique / OTP active pour {{ (stats?.praticiensMfaActifs || 18420) | number }} praticiens
          </p>
        </div>
        <div class="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
          <div
            class="bg-emerald-400 h-full rounded-full transition-all duration-500"
            [style.width.%]="stats?.adoptionMfa || 99.4"
          ></div>
        </div>
      </div>

      <!-- Card 4: Zéro Fuite de Données -->
      <div class="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-4 flex flex-col justify-between transition-all hover:bg-white/15">
        <div class="flex items-center justify-between">
          <span class="text-[11px] uppercase tracking-wider text-emerald-200 font-bold whitespace-nowrap">
            Intégrité &amp; Fuite de Données
          </span>
          <span class="material-symbols-outlined text-emerald-300 text-[20px]">security</span>
        </div>
        <div class="my-2">
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-extrabold font-code-num text-white">
              {{ stats?.incidentsSecurite || 0 }} Incident
            </span>
            <span class="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 text-[11px] font-semibold whitespace-nowrap">
              {{ stats?.statutAudit || 'Audit Sans Réserve' }}
            </span>
          </div>
          <p class="text-xs text-emerald-100/75 mt-1 text-pretty">
            {{ stats?.descriptionIntegrite || 'Aucune exfiltration avérée ni violation de données sur 365 jours' }}
          </p>
        </div>
        <div class="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
          <div class="bg-emerald-300 h-full rounded-full" style="width: 100%"></div>
        </div>
      </div>
    </div>
  `
})
export class AuditScorecardsComponent {
  @Input() stats: AuditStats | null = null;

  readonly defaultSecretMedicalDesc = "Index d'accès cloisonné selon le serment de l'Ordre des Médecins";
}
