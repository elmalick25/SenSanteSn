import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-security-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 lg:p-8 flex flex-col gap-6">
      <div class="border-b border-slate-100 pb-4">
        <h3 class="text-base font-bold text-slate-900 tracking-tight text-balance">
          Sécurité &amp; Habilitations Cryptographiques DSI
        </h3>
        <p class="text-xs text-slate-500 mt-0.5 text-pretty">
          Gestion des identifiants d'accès renforcé, authentification multifacteur et clés matérielles FIDO2.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 1. Changement de mot de passe -->
        <div class="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between gap-4">
          <div>
            <h4 class="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px] text-emerald-700">lock_reset</span>
              <span>Renouvellement du Mot de Passe</span>
            </h4>

            <div class="space-y-3">
              <div>
                <label class="text-[11px] font-semibold text-slate-600 block mb-1">Mot de passe actuel</label>
                <input 
                  type="password" 
                  class="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  placeholder="••••••••••••"
                />
              </div>
              <div>
                <label class="text-[11px] font-semibold text-slate-600 block mb-1">Nouveau mot de passe (min. 12 caractères)</label>
                <input 
                  type="password" 
                  class="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  placeholder="••••••••••••"
                />
              </div>
              <div>
                <label class="text-[11px] font-semibold text-slate-600 block mb-1">Confirmer le nouveau mot de passe</label>
                <input 
                  type="password" 
                  class="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  placeholder="••••••••••••"
                />
              </div>
            </div>
          </div>

          <button 
            type="button"
            (click)="onChangePassword.emit()"
            class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer self-start whitespace-nowrap"
          >
            Mettre à jour le mot de passe
          </button>
        </div>

        <!-- 2. Authentification Forte & Clé Sécurisée -->
        <div class="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between gap-4">
          <div>
            <h4 class="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px] text-emerald-700">key</span>
              <span>Authentification Forte &amp; Jetons ANSSI-SN</span>
            </h4>

            <div class="space-y-3">
              <!-- Token 2FA Actif -->
              <div class="p-3 bg-white rounded-xl border border-emerald-200 flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <span class="material-symbols-outlined text-emerald-600 text-[20px]">verified_user</span>
                  <div>
                    <p class="text-xs font-bold text-slate-800">Double Facteur (TOTP) Activé</p>
                    <p class="text-[10px] text-slate-500">Application Microsoft/Google Authenticator liée</p>
                  </div>
                </div>
                <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-bold">Actif</span>
              </div>

              <!-- Clé FIDO2 Hardware -->
              <div class="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <span class="material-symbols-outlined text-blue-600 text-[20px]">usb</span>
                  <div>
                    <p class="text-xs font-bold text-slate-800">Clé Matérielle FIDO2 / YubiKey</p>
                    <p class="text-[10px] text-slate-500">Certificat X.509 ANSSI Sénégal enregistré</p>
                  </div>
                </div>
                <span class="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-[10px] font-bold">Configuré</span>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
            <span>Certificat Session : <strong>#SN-8942-DSI</strong></span>
            <span class="text-emerald-700 font-semibold">Chiffrement AES-256</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileSecurityTabComponent {
  onChangePassword = output<void>();
}
