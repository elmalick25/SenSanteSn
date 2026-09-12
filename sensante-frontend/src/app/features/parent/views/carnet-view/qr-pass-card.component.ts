import { Component, EventEmitter, Input, OnChanges, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarnetSanteData } from '../../../../core/models/carnet-sante.model';
import { HealthToastService } from '../../../../core/services/health-toast.service';
import QRCode from 'qrcode';

@Component({
  selector: 'app-qr-pass-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-[#064e3b] rounded-2xl p-6 lg:p-7 text-white shadow-md flex flex-col justify-between h-full relative overflow-hidden">
      <!-- Glow ambient light effect -->
      <div class="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-emerald-400/10 pointer-events-none blur-2xl"></div>

      <div>
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-emerald-300 text-[24px]">qr_code_scanner</span>
            <h3 class="text-base font-bold tracking-tight text-white text-balance">Accès Rapide Clinique</h3>
          </div>
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[11px] font-bold flex items-center gap-1 border border-emerald-400/30">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Actif & Certifié MSAS
          </span>
        </div>
        <p class="text-xs text-emerald-100/80 leading-relaxed">
          Scannez ce QR code officiel avec n'importe quel smartphone ou lecteur optique pour charger instantanément le dossier pédiatrique d'{{ data.prenom }}.
        </p>
      </div>

      <!-- High Visibility Real QR Code Container -->
      <div class="my-5 self-center p-4 bg-white rounded-2xl shadow-xl flex flex-col items-center">
        <div class="relative p-1 bg-white rounded-xl flex items-center justify-center min-h-[176px]">
          <img 
            *ngIf="qrCodeDataUrl()" 
            [src]="qrCodeDataUrl()" 
            [alt]="'QR Code médical certifié de ' + data.nomComplet" 
            class="w-44 h-44 sm:w-48 sm:h-48 object-contain rounded-lg" 
          />
          <div *ngIf="!qrCodeDataUrl()" class="w-44 h-44 flex flex-col items-center justify-center gap-2 text-emerald-800">
            <span class="material-symbols-outlined text-3xl animate-spin">progress_activity</span>
            <span class="text-[10px] font-medium text-gray-500">Génération sécurisée...</span>
          </div>
        </div>

        <div class="flex items-center gap-1.5 mt-2.5 px-3 py-1 bg-gray-100 rounded-full">
          <span class="material-symbols-outlined text-emerald-700 text-[15px]">sensors</span>
          <span class="text-[11px] text-gray-800 font-mono font-bold tracking-wider">TOKEN: {{ data.qrCodeToken }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-2 gap-2.5">
        <button 
          (click)="openFullscreen.emit()"
          type="button" 
          class="py-2.5 px-3 rounded-xl bg-white text-[#064e3b] hover:bg-emerald-50 active:scale-95 transition-all text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
          <span class="material-symbols-outlined text-[18px]">fullscreen</span>
          Plein Écran
        </button>
        <button 
          (click)="downloadOfflineQr()"
          type="button" 
          class="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10">
          <span class="material-symbols-outlined text-[18px]">cloud_download</span>
          Hors-Ligne (PNG)
        </button>
      </div>
    </div>
  `
})
export class QrPassCardComponent implements OnInit, OnChanges {
  @Input({ required: true }) data!: CarnetSanteData;
  @Output() openFullscreen = new EventEmitter<void>();

  readonly qrCodeDataUrl = signal<string>('');
  private readonly toastService = inject(HealthToastService);

  ngOnInit(): void {
    this.generateRealQrCode();
  }

  ngOnChanges(): void {
    this.generateRealQrCode();
  }

  private async generateRealQrCode(): Promise<void> {
    if (!this.data) return;

    // Payload clinique officiel encodé selon le standard MSAS
    const payload = JSON.stringify({
      msas: "SenSante-SN",
      passId: this.data.codeNational,
      id: this.data.enfantId,
      nom: this.data.nom,
      prenom: this.data.prenom,
      sexe: this.data.genre,
      naissance: this.data.dateNaissance,
      groupeSanguin: this.data.groupeSanguin,
      statutNut: this.data.statutNutritionnel,
      pbCm: this.data.dernierPerimetreBrachial,
      dispensaire: this.data.nomStructureSante,
      token: this.data.qrCodeToken,
      url: `https://sensante.sn/dossier/${this.data.codeNational}?token=${this.data.qrCodeToken}`
    });

    try {
      const dataUrl = await QRCode.toDataURL(payload, {
        width: 450,
        margin: 1,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#064e3b',
          light: '#ffffff'
        }
      });
      this.qrCodeDataUrl.set(dataUrl);
    } catch (err) {
      console.error('[QrPassCardComponent] Erreur génération QR code réel:', err);
    }
  }

  downloadOfflineQr(): void {
    const dataUrl = this.qrCodeDataUrl();
    if (!dataUrl) {
      this.toastService.show('QR Code en cours de préparation...', 'warning');
      return;
    }

    const link = document.createElement('a');
    link.download = `QR_Sanitaire_${this.data.codeNational}.png`;
    link.href = dataUrl;
    link.click();

    this.toastService.show(`QR Code réel enregistré (${this.data.codeNational})`, 'success');
  }
}
