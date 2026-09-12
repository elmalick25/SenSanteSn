import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarnetSanteData } from '../../../../core/models/carnet-sante.model';
import QRCode from 'qrcode';

@Component({
  selector: 'app-fullscreen-qr-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 bg-gray-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        (click)="$event.stopPropagation()"
        class="bg-white p-6 sm:p-7 rounded-3xl shadow-2xl max-w-sm w-full flex flex-col items-center text-center border border-gray-100">
        
        <!-- Header -->
        <div class="w-full flex justify-between items-center mb-4">
          <span class="text-xs text-[#064e3b] uppercase tracking-wider font-bold flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px] text-emerald-600">verified_user</span>
            MSAS Certifié
          </span>
          <button 
            (click)="close.emit()"
            type="button"
            class="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-800 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <!-- High Contrast Real QR Code -->
        <div class="p-3 bg-white rounded-2xl border-2 border-emerald-900/10 shadow-inner flex items-center justify-center my-2 min-h-[260px]">
          <img 
            *ngIf="qrCodeDataUrl()" 
            [src]="qrCodeDataUrl()" 
            [alt]="'QR Code de consultation plein écran de ' + data.nomComplet" 
            class="w-60 h-60 object-contain" 
          />
          <div *ngIf="!qrCodeDataUrl()" class="w-60 h-60 flex flex-col items-center justify-center gap-2 text-emerald-800">
            <span class="material-symbols-outlined text-3xl animate-spin">progress_activity</span>
            <span class="text-xs text-gray-500">Génération haute définition...</span>
          </div>
        </div>

        <!-- Identification details -->
        <h4 class="text-xl font-bold text-gray-900 mt-2 text-balance">{{ data.nomComplet }}</h4>
        <span class="text-xs text-gray-500 font-mono mt-0.5">{{ data.codeNational }} • {{ data.ageEnMois }} mois</span>

        <p class="text-[11px] text-gray-500 mt-3 bg-emerald-50 text-emerald-800 font-medium px-3.5 py-1.5 rounded-full border border-emerald-900/5">
          Luminosité maximale pour lecteur optique dispensaire
        </p>

        <button 
          (click)="close.emit()"
          type="button" 
          class="mt-5 w-full py-3 rounded-xl bg-[#064e3b] text-white font-bold text-sm hover:bg-[#0b513d] active:scale-98 transition-all shadow-sm">
          Fermer
        </button>
      </div>
    </div>
  `
})
export class FullscreenQrModalComponent implements OnInit, OnChanges {
  @Input({ required: true }) data!: CarnetSanteData;
  @Output() close = new EventEmitter<void>();

  readonly qrCodeDataUrl = signal<string>('');

  @HostListener('window:keydown.escape')
  onEsc(): void {
    this.close.emit();
  }

  ngOnInit(): void {
    this.generateRealQrCode();
  }

  ngOnChanges(): void {
    this.generateRealQrCode();
  }

  private async generateRealQrCode(): Promise<void> {
    if (!this.data) return;

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
        width: 600,
        margin: 1,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      this.qrCodeDataUrl.set(dataUrl);
    } catch (err) {
      console.error('[FullscreenQrModalComponent] Erreur génération QR code:', err);
    }
  }
}
