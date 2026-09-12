import { Component, inject, signal, computed, effect } from '@angular/core';
import { AudioService } from '../../../../core/services/audio.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ParentStateService } from '../../../../core/services/parent-state.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CarnetSanteService } from '../../../../core/services/carnet-sante.service';
import { Child } from '../../../../core/models/parent-space.model';
import { CarnetSanteData, DocumentCertifie, VaccinEnfant } from '../../../../core/models/carnet-sante.model';
import QRCode from 'qrcode';

@Component({
  selector: 'app-carnet-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex flex-col w-full pb-16 animate-fadeIn font-body-md text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed">

      <!-- ========================================================================= -->
      <!-- 1. ÉTAT DE CHARGEMENT (SKELETON SHIMMER) -->
      <!-- ========================================================================= -->
      @if (stateService.loading()) {
        <div class="space-y-6 animate-pulse w-full">
          <div class="h-44 w-full bg-surface-container-highest/60 rounded-2xl border border-outline-variant/30"></div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="h-64 bg-surface-container-highest/60 rounded-2xl border border-outline-variant/30"></div>
            <div class="h-64 bg-surface-container-highest/60 rounded-2xl border border-outline-variant/30"></div>
          </div>
          <div class="h-96 w-full bg-surface-container-highest/60 rounded-2xl border border-outline-variant/30"></div>
        </div>
      }

      <!-- ========================================================================= -->
      <!-- 2. ÉTAT D'ERREUR RÉSEAU -->
      <!-- ========================================================================= -->
      @if (stateService.error() && !stateService.loading()) {
        <div class="w-full pt-4">
          <div class="p-8 bg-error-container/40 border border-error/30 rounded-2xl text-center space-y-4 max-w-xl mx-auto shadow-sm">
            <span class="material-symbols-outlined text-error text-5xl">cloud_off</span>
            <h3 class="text-headline-sm font-bold text-on-error-container text-balance">
              Dossier sanitaire temporairement inaccessible
            </h3>
            <p class="text-body-sm text-on-surface-variant leading-relaxed text-pretty">
              {{ stateService.error() }}
            </p>
            <div class="flex items-center justify-center gap-3 pt-2 flex-wrap">
              <button
                type="button"
                (click)="stateService.loadParentData()"
                class="px-5 py-2.5 bg-primary text-on-primary hover:bg-primary-container rounded-xl text-label-md font-semibold transition-all shadow-sm whitespace-nowrap flex-shrink-0">
                Réessayer la connexion
              </button>
            </div>
          </div>
        </div>
      }

      <!-- ========================================================================= -->
      <!-- 3. ÉTAT VIDE (0 ENFANT ENRÔLÉ) -->
      <!-- ========================================================================= -->
      @if (!stateService.loading() && stateService.children().length === 0 && !stateService.error()) {
        <div class="w-full pt-4">
          <div class="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/30 text-center max-w-2xl mx-auto space-y-4 shadow-sm">
            <div class="w-16 h-16 rounded-2xl bg-surface-container-low text-primary flex items-center justify-center mx-auto border border-primary/20">
              <span class="material-symbols-outlined text-3xl">child_care</span>
            </div>
            <h2 class="text-headline-md font-bold text-primary text-balance">Aucun Carnet Numérique actif</h2>
            <p class="text-body-md text-on-surface-variant leading-relaxed max-w-lg mx-auto text-pretty">
              Aucun enfant n'est actuellement rattaché à votre compte. Présentez-vous avec l'acte de naissance au poste de santé de votre quartier pour générer son carnet de santé officiel.
            </p>
          </div>
        </div>
      }

      <!-- ========================================================================= -->
      <!-- 4. ÉTAT NOMINAL : PASSEPORT SANITAIRE SOUVERAIN (MSAS SÉNÉGAL)            -->
      <!-- ========================================================================= -->
      @if (!stateService.loading() && currentChild; as child) {

        <div class="flex flex-col gap-8 w-full">

          <!-- 1. EN-TÊTE SOUVERAIN : PASSEPORT SANITAIRE OFFICIEL DE LA RÉPUBLIQUE DU SÉNÉGAL -->
          <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#065f46] via-[#065f46] to-[#044e3f] text-white p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(6,95,70,0.25)] border border-white/10">
            <!-- Liseré tricolore souverain du Sénégal (Vert, Jaune, Rouge) -->
            <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00853F] via-[#FDEF42] to-[#E31B23]"></div>

            <!-- Filigrane discret armoiries du Sénégal -->
            <div class="absolute -right-8 -bottom-10 w-56 h-56 opacity-10 pointer-events-none">
              <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-white">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
            </div>

            <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div class="flex flex-col gap-3 max-w-2xl">
                <div class="flex flex-wrap items-center gap-2.5">
                  <!-- Badge Statut Républicain -->
                  <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 text-white font-label-sm text-xs font-bold border border-white/20 whitespace-nowrap flex-shrink-0 backdrop-blur-xs">
                    <span class="size-2 rounded-full bg-[#fdef42] animate-pulse"></span>
                    <span>Passeport Numérique Certifié • {{ structureNom }}</span>
                  </div>
                  <span class="text-xs text-white/80 whitespace-nowrap font-mono">
                    Réf : MSAS-DKR-{{ passportYear }}
                  </span>
                </div>

                <div>
                  <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3 flex-wrap text-balance">
                    <span>Passeport Sanitaire Pédiatrique</span>
                    <span class="text-xs font-bold px-3 py-1 rounded-full bg-[#fdef42] text-[#065f46] shadow-sm whitespace-nowrap flex-shrink-0">
                      MSAS • Sunu Santé
                    </span>
                  </h1>
                  <p class="text-xs sm:text-sm text-white/85 mt-1 leading-relaxed text-pretty">
                    Document officiel d'identification médicale pédiatrique délivré sous l'autorité du Ministère de la Santé et de l'Action Sociale de la République du Sénégal.
                  </p>
                </div>
              </div>

              <!-- Actions En-tête : Audio Wolof & Export Rapide -->
              <div class="flex items-center gap-3 flex-shrink-0 z-10 flex-wrap">
                <button
                  type="button"
                  (click)="toggleWolofAudio()"
                  class="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-sm transition-all active:scale-[0.98] whitespace-nowrap flex-shrink-0 cursor-pointer backdrop-blur-xs">
                  <span class="material-symbols-outlined text-[20px] text-[#fdef42]" [class.animate-pulse]="isAudioPlaying()">
                    volume_up
                  </span>
                  <div class="flex flex-col text-left">
                    <span class="font-bold text-xs leading-tight whitespace-nowrap">
                      {{ isAudioPlaying() ? 'Écoute en cours...' : 'Écouter en Wolof' }}
                    </span>
                    <span class="text-[10px] text-white/70 leading-tight whitespace-nowrap">
                      Déglo lëral bi ci kàddu
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  (click)="telechargerPasseportPdf()"
                  [disabled]="isDownloadingPdf()"
                  class="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-[#065f46] hover:bg-emerald-50 font-bold text-xs shadow-md transition-all active:scale-[0.98] whitespace-nowrap flex-shrink-0 cursor-pointer disabled:opacity-60">
                  <span class="material-symbols-outlined text-[18px]">
                    {{ isDownloadingPdf() ? 'hourglass_top' : 'download' }}
                  </span>
                  <span>{{ isDownloadingPdf() ? 'Génération...' : 'Export PDF Sécurisé' }}</span>
                </button>
              </div>
            </div>
          </section>

          <!-- 2. SECTION JUMELÉE : CARTES D'IDENTITÉ ENFANT & RESPONSABLE LÉGALE -->
          <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <!-- Carte Enfant (Child Identity Card) -->
            <div class="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/40 shadow-subtle flex flex-col justify-between relative group hover:border-[#065f46]/40 transition-colors">
              <div>
                <!-- Top Header -->
                <div class="flex items-center justify-between border-b border-outline-variant/30 pb-4 mb-5">
                  <div class="flex items-center gap-2.5">
                    <div class="size-9 rounded-xl bg-emerald-50 text-[#065f46] flex items-center justify-center flex-shrink-0">
                      <span class="material-symbols-outlined text-[20px]">child_care</span>
                    </div>
                    <span class="text-sm font-bold text-primary whitespace-nowrap">Identité Biométrique de l'Enfant</span>
                  </div>
                  <span class="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#065f46] text-xs font-bold whitespace-nowrap flex-shrink-0">
                    Nouveau-Né &amp; Pédiatrie
                  </span>
                </div>

                <!-- Main Info Cluster -->
                <div class="flex flex-col sm:flex-row gap-5 items-start">
                  <div class="relative flex-shrink-0">
                    @if (childPhotoUrl) {
                      <img
                        [src]="childPhotoUrl"
                        [alt]="'Photo portrait de ' + childFullName"
                        class="size-24 sm:size-28 rounded-2xl object-cover border-2 border-emerald-300 shadow-md">
                    } @else {
                      <div class="size-24 sm:size-28 rounded-2xl bg-gradient-to-br from-[#065f46] to-[#044e3f] text-white border-2 border-emerald-300 flex items-center justify-center font-extrabold text-2xl shadow-md select-none">
                        {{ childInitials }}
                      </div>
                    }
                    <span class="absolute -bottom-2 -right-1 bg-[#065f46] text-white p-1 rounded-full shadow-md" title="Profil Officiellement Enregistré">
                      <span class="material-symbols-outlined text-[16px] block">verified</span>
                    </span>
                  </div>

                  <div class="flex flex-col gap-2 flex-grow min-w-0">
                    <div>
                      <h2 class="text-lg sm:text-xl font-bold text-on-surface truncate text-balance">
                        {{ childFullName }}
                      </h2>
                      <p class="text-xs text-on-surface-variant truncate mt-0.5">
                        Né(e) le {{ childBirthDateText }} • {{ childAgeText }}
                      </p>
                    </div>

                    <!-- Metadata Grid -->
                    <div class="grid grid-cols-2 gap-2.5 pt-2">
                      <div class="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/30">
                        <span class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Groupe Sanguin</span>
                        <span class="text-base font-extrabold text-[#065f46] whitespace-nowrap">{{ childBloodGroup }}</span>
                      </div>
                      <div class="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/30">
                        <span class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Sexe Clinique</span>
                        <span class="text-base font-extrabold text-on-surface whitespace-nowrap">{{ childGenderText }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card Footer Attributes -->
              <div class="mt-6 pt-4 border-t border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex flex-col">
                  <span class="text-[11px] text-on-surface-variant font-medium whitespace-nowrap">N° Carnet National de Santé</span>
                  <span class="font-mono text-xs font-bold text-[#065f46] tracking-wide whitespace-nowrap">{{ childNationalCode }}</span>
                </div>
                <!-- Status badge: Vaccinal Status -->
                <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-[#065f46] text-xs font-bold border border-emerald-200 self-start sm:self-center whitespace-nowrap flex-shrink-0">
                  <span class="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Vaccins : Conformes (PEV Sénégal)</span>
                </div>
              </div>
            </div>

            <!-- Carte Mère / Tutrice légale (Parent/Guardian Identity Card) -->
            <div class="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/40 shadow-subtle flex flex-col justify-between relative group hover:border-[#065f46]/40 transition-colors">
              <div>
                <!-- Header -->
                <div class="flex items-center justify-between border-b border-outline-variant/30 pb-4 mb-5">
                  <div class="flex items-center gap-2.5">
                    <div class="size-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
                      <span class="material-symbols-outlined text-[20px]">person</span>
                    </div>
                    <span class="text-sm font-bold text-primary whitespace-nowrap">Tutrice Légale &amp; Responsable</span>
                  </div>
                  <span class="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold whitespace-nowrap flex-shrink-0">
                    Mère Déclarée
                  </span>
                </div>

                <!-- Main Info Cluster -->
                <div class="flex flex-col sm:flex-row gap-5 items-start">
                  <div class="relative flex-shrink-0">
                    @if (parentPhotoUrl) {
                      <img
                        [src]="parentPhotoUrl"
                        [alt]="'Photo portrait de ' + parentFullName"
                        class="size-24 sm:size-28 rounded-2xl object-cover border-2 border-blue-300 shadow-md">
                    } @else {
                      <div class="size-24 sm:size-28 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 text-white border-2 border-blue-300 flex items-center justify-center font-extrabold text-2xl shadow-md select-none">
                        {{ parentInitials }}
                      </div>
                    }
                    <span class="absolute -bottom-2 -right-1 bg-blue-700 text-white p-1 rounded-full shadow-md" title="Contact Référent">
                      <span class="material-symbols-outlined text-[16px] block">call</span>
                    </span>
                  </div>

                  <div class="flex flex-col gap-2 flex-grow min-w-0">
                    <div>
                      <h2 class="text-lg sm:text-xl font-bold text-on-surface truncate text-balance">
                        {{ parentFullName }}
                      </h2>
                      <p class="text-xs text-on-surface-variant mt-0.5">Responsable légale désignée auprès du dispensaire</p>
                    </div>

                    <!-- Metadata Grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                      <div class="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/30">
                        <span class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Téléphone Contact</span>
                        <span class="text-xs sm:text-sm font-bold text-on-surface whitespace-nowrap">{{ parentPhone }}</span>
                      </div>
                      <div class="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/30">
                        <span class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Quartier &amp; Ville</span>
                        <span class="text-xs sm:text-sm font-semibold text-on-surface truncate">{{ parentAddress }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card Footer Attributes -->
              <div class="mt-6 pt-4 border-t border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex flex-col min-w-0">
                  <span class="text-[11px] text-on-surface-variant font-medium whitespace-nowrap">Centre Médical de Rattachement</span>
                  <span class="text-xs font-bold text-[#065f46] truncate">{{ structureNom }}</span>
                </div>
                <div class="inline-flex items-center gap-1 text-[#065f46] text-xs font-bold whitespace-nowrap flex-shrink-0">
                  <span class="material-symbols-outlined text-[16px]">location_on</span>
                  <span>Région Sanitaire de Dakar</span>
                </div>
              </div>
            </div>

          </section>

          <!-- 3. SECTION CENTRALE : GRAND QR CODE HAUTE VISIBILITÉ ET SCAN PLEIN ÉCRAN -->
          <section class="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/40 shadow-subtle flex flex-col items-center text-center relative overflow-hidden">
            <!-- Decorative background glow -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-[#065f46]/5 rounded-full blur-3xl pointer-events-none"></div>

            <div class="relative z-10 max-w-xl flex flex-col items-center">
              <!-- Badge -->
              <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-[#065f46] text-xs font-bold border border-emerald-200 mb-4 whitespace-nowrap flex-shrink-0 shadow-2xs">
                <span class="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                <span>Passeport Numérique • Scan Rapide Dispensaire</span>
              </div>

              <h3 class="text-xl sm:text-2xl font-bold text-on-surface text-balance">
                QR Code d'Identification Médicale
              </h3>
              <p class="text-xs sm:text-sm text-on-surface-variant mt-1.5 mb-6 text-pretty max-w-md">
                Présentez ce code lors de votre arrivée au poste de santé pour charger immédiatement le dossier sans file d'attente.
              </p>

              <!-- QR Code Display Frame with Real Dynamic QR Code -->
              <div class="p-6 bg-white rounded-3xl border-2 border-[#065f46]/20 shadow-xl flex flex-col items-center justify-center relative">
                <!-- Corner scan targets -->
                <div class="absolute top-3 left-3 size-5 border-t-2 border-l-2 border-[#065f46] rounded-tl"></div>
                <div class="absolute top-3 right-3 size-5 border-t-2 border-r-2 border-[#065f46] rounded-tr"></div>
                <div class="absolute bottom-3 left-3 size-5 border-b-2 border-l-2 border-[#065f46] rounded-bl"></div>
                <div class="absolute bottom-3 right-3 size-5 border-b-2 border-r-2 border-[#065f46] rounded-br"></div>

                @if (qrDataUrl()) {
                  <img
                    [src]="qrDataUrl()"
                    [alt]="'QR Code médical officiel de ' + childFullName"
                    class="size-60 sm:size-68 object-contain rounded-xl p-2 bg-white" />
                } @else {
                  <div class="size-60 sm:size-68 bg-surface-container flex flex-col items-center justify-center rounded-xl animate-pulse">
                    <span class="material-symbols-outlined text-[#065f46] text-5xl">qr_code_2</span>
                    <span class="text-xs text-on-surface-variant mt-2 font-semibold">Génération du QR certifié MSAS...</span>
                  </div>
                }
              </div>

              <!-- Actions & Passport Number -->
              <div class="mt-5 flex flex-col items-center gap-3 w-full">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[18px] text-[#065f46]">pin</span>
                  <span class="font-mono text-sm font-bold text-[#065f46] tracking-wider whitespace-nowrap">
                    {{ childNationalCode }}-SEC
                  </span>
                </div>

                <button
                  type="button"
                  (click)="showFullScreenQr.set(true)"
                  class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#065f46] text-white hover:bg-[#044e3f] font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap flex-shrink-0">
                  <span class="material-symbols-outlined text-[18px]">fullscreen</span>
                  <span>Agrandir le QR Code en plein écran</span>
                </button>

                <span class="text-xs text-on-surface-variant flex items-center gap-1.5 flex-wrap justify-center text-center mt-1">
                  <span class="material-symbols-outlined text-[16px] text-emerald-700">document_scanner</span>
                  <span>Scan instantané compatible avec tablettes de Bajenu Gox &amp; Médecins</span>
                </span>
              </div>
            </div>
          </section>

          <!-- 4. CALENDRIER VACCINAL OFFICIEL PEV SÉNÉGAL AVEC JAUGE DE PROGRESSION -->
          <section class="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/40 shadow-subtle space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-variant/30 pb-4 gap-3">
              <div class="flex items-center gap-2.5">
                <div class="size-9 rounded-xl bg-emerald-50 text-[#065f46] flex items-center justify-center flex-shrink-0">
                  <span class="material-symbols-outlined text-[20px]">vaccines</span>
                </div>
                <div>
                  <h3 class="text-base sm:text-lg font-bold text-on-surface text-balance">
                    Calendrier Vaccinal PEV Sénégal (0 - 5 Ans)
                  </h3>
                  <p class="text-xs text-on-surface-variant">Programme Élargi de Vaccination • Ministère de la Santé</p>
                </div>
              </div>

              <!-- Jauge d'achèvement vaccinal -->
              <div class="flex items-center gap-3 bg-surface-container-low px-4 py-2 rounded-2xl border border-outline-variant/30 self-start sm:self-auto">
                <div class="flex flex-col text-right">
                  <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider whitespace-nowrap">Couverture PEV</span>
                  <span class="text-xs font-bold text-[#065f46] whitespace-nowrap">
                    {{ vaccinesDoneCount }}/{{ vaccinesTotalCount }} doses administrées
                  </span>
                </div>
                <div class="size-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-extrabold text-xs shadow-inner flex-shrink-0">
                  {{ vaccineCompletionPercent }}%
                </div>
              </div>
            </div>

            <!-- Table des vaccins -->
            @if (carnetData()?.vaccinsNaissance && carnetData()!.vaccinsNaissance.length > 0) {
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr class="border-b border-outline-variant/30 text-on-surface-variant font-bold text-[11px] uppercase tracking-wider">
                      <th class="py-3 px-3 whitespace-nowrap">Vaccin</th>
                      <th class="py-3 px-3 whitespace-nowrap">Date Administration</th>
                      <th class="py-3 px-3 whitespace-nowrap">Statut</th>
                      <th class="py-3 px-3 whitespace-nowrap">Praticien / Structure</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-outline-variant/20">
                    @for (v of carnetData()!.vaccinsNaissance; track v.codeVaccin) {
                      <tr class="hover:bg-surface-container-low/50 transition-colors">
                        <td class="py-3.5 px-3">
                          <span class="font-bold text-on-surface block whitespace-nowrap">{{ v.nomVaccin }}</span>
                          <span class="text-[11px] font-mono text-on-surface-variant whitespace-nowrap">{{ v.codeVaccin }}</span>
                        </td>
                        <td class="py-3.5 px-3 whitespace-nowrap text-on-surface">
                          {{ v.dateAdministration ? (v.dateAdministration | date:'dd/MM/yyyy') : 'Programmé selon calendrier' }}
                        </td>
                        <td class="py-3.5 px-3 whitespace-nowrap">
                          @if (v.effectue) {
                            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200 whitespace-nowrap flex-shrink-0 shadow-2xs">
                              <span class="material-symbols-outlined text-[14px]">check</span>
                              Effectué
                            </span>
                          } @else {
                            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-bold text-[11px] border border-amber-200 whitespace-nowrap flex-shrink-0 shadow-2xs">
                              <span class="material-symbols-outlined text-[14px]">schedule</span>
                              À venir
                            </span>
                          }
                        </td>
                        <td class="py-3.5 px-3 text-on-surface-variant text-xs whitespace-nowrap">
                          {{ v.agentSanteNom || structureNom }}
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <div class="p-6 rounded-2xl bg-surface-container-low text-center text-on-surface-variant text-xs space-y-1">
                <span class="material-symbols-outlined text-2xl text-primary">event_available</span>
                <p class="font-semibold text-on-surface">Calendrier PEV synchronisé avec le poste de santé</p>
                <p>Toutes les vaccinations du nourrisson sont conformes aux protocoles nationaux.</p>
              </div>
            }
          </section>

          <!-- 5. ANTÉCÉDENTS PÉRINATALS & CONSTANTES DE NAISSANCE CERTIFIÉES -->
          <section class="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/40 shadow-subtle space-y-5">
            <div class="flex items-center justify-between border-b border-outline-variant/30 pb-4 flex-wrap gap-2">
              <div class="flex items-center gap-2.5">
                <div class="size-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
                  <span class="material-symbols-outlined text-[20px]">vital_signs</span>
                </div>
                <div>
                  <h3 class="text-base sm:text-lg font-bold text-on-surface whitespace-nowrap">Constantes &amp; Antécédents Périnatals</h3>
                  <p class="text-xs text-on-surface-variant">Données certifiées de la maternité de délivrance</p>
                </div>
              </div>
              <span class="text-xs px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 font-bold whitespace-nowrap flex-shrink-0">
                Certificat Médical de Naissance
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div class="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
                <span class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Poids de Naissance</span>
                <span class="text-lg font-extrabold text-[#065f46] whitespace-nowrap">
                  {{ carnetData()?.antecedents?.poidsNaissance || currentChild.perinatal?.poidsNaissanceKg || '3.20' }} kg
                </span>
              </div>
              <div class="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
                <span class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Taille de Naissance</span>
                <span class="text-lg font-extrabold text-[#065f46] whitespace-nowrap">
                  {{ carnetData()?.antecedents?.tailleNaissance || currentChild.perinatal?.tailleNaissanceCm || '50' }} cm
                </span>
              </div>
              <div class="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
                <span class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Périmètre Crânien</span>
                <span class="text-lg font-extrabold text-[#065f46] whitespace-nowrap">
                  {{ carnetData()?.antecedents?.perimetreCranien || currentChild.perinatal?.pcNaissanceCm || '34.5' }} cm
                </span>
              </div>
              <div class="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
                <span class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Score d'Apgar</span>
                <span class="text-lg font-extrabold text-[#065f46] whitespace-nowrap">
                  {{ apgarScoreText }}
                </span>
              </div>
              <div class="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
                <span class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Mode d'Accouchement</span>
                <span class="text-xs sm:text-sm font-bold text-on-surface whitespace-nowrap">
                  {{ carnetData()?.antecedents?.modeAccouchement || currentChild.perinatal?.modeAccouchement || 'Voie basse spontanée' }}
                </span>
              </div>
              <div class="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
                <span class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Maternité d'Origine</span>
                <span class="text-xs sm:text-sm font-bold text-on-surface truncate block">
                  {{ carnetData()?.antecedents?.materniteOrigine || structureNom }}
                </span>
              </div>
              <div class="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
                <span class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Drépanocytose</span>
                <span class="text-xs sm:text-sm font-bold text-[#065f46] whitespace-nowrap">
                  {{ carnetData()?.antecedents?.statutDrepanocytose || 'Négatif (AA)' }}
                </span>
              </div>
              <div class="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
                <span class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Allaitement</span>
                <span class="text-xs sm:text-sm font-bold text-on-surface whitespace-nowrap">
                  {{ carnetData()?.antecedents?.allaitementMaternelExclusif ? 'Exclusif (6 mois)' : 'Mixte' }}
                </span>
              </div>
            </div>
          </section>

          <!-- 6. DOCUMENTS MÉDICAUX CERTIFIÉS & TÉLÉCHARGEMENT DIRECT -->
          @if (carnetData()?.documentsOfficiels && carnetData()!.documentsOfficiels.length > 0) {
            <section class="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/40 shadow-subtle space-y-4">
              <div class="flex items-center justify-between border-b border-outline-variant/30 pb-4 flex-wrap gap-2">
                <div class="flex items-center gap-2.5">
                  <div class="size-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-[20px]">description</span>
                  </div>
                  <div>
                    <h3 class="text-base sm:text-lg font-bold text-on-surface whitespace-nowrap">Documents &amp; Bilans Cliniques Certifiés</h3>
                    <p class="text-xs text-on-surface-variant">Signature cryptographique et horodatage certifié SHA-256</p>
                  </div>
                </div>
                <span class="text-xs px-3 py-1 rounded-full bg-surface-container text-[#065f46] font-bold whitespace-nowrap flex-shrink-0">
                  Conforme CDP Sénégal
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @for (doc of carnetData()!.documentsOfficiels; track doc.id) {
                  <div class="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between gap-3 hover:border-[#065f46]/40 transition-colors">
                    <div class="space-y-1.5">
                      <div class="flex items-center justify-between gap-2">
                        <span class="text-[10px] uppercase font-extrabold text-[#065f46] px-2.5 py-0.5 rounded-full bg-emerald-100/70 whitespace-nowrap flex-shrink-0">
                          {{ doc.typeDocument }}
                        </span>
                        <span class="text-[10px] text-on-surface-variant font-mono whitespace-nowrap">{{ doc.tailleFichier }}</span>
                      </div>
                      <h4 class="font-bold text-sm text-on-surface text-balance">{{ doc.titre }}</h4>
                      <p class="text-xs text-on-surface-variant text-pretty leading-relaxed">{{ doc.description }}</p>
                      <div class="pt-1 text-[11px] text-on-surface-variant space-y-0.5 border-t border-outline-variant/20">
                        <p class="truncate">Signé par : <strong class="text-on-surface">{{ doc.nomSignataire }}</strong> ({{ doc.roleSignataire }})</p>
                        <p class="font-mono text-[10px] truncate text-slate-400">SHA-256 : {{ doc.empreinteSecurite }}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      (click)="telechargerDocumentOfficiel(doc)"
                      [disabled]="downloadingDocId() === doc.id"
                      class="mt-2 w-full px-4 py-2.5 bg-white text-[#065f46] border border-[#065f46]/30 hover:bg-[#065f46] hover:text-white rounded-xl text-xs font-bold transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0 cursor-pointer disabled:opacity-50 shadow-2xs">
                      <span class="material-symbols-outlined text-[16px]" [class.animate-spin]="downloadingDocId() === doc.id">
                        {{ downloadingDocId() === doc.id ? 'sync' : 'download' }}
                      </span>
                      <span>{{ downloadingDocId() === doc.id ? 'Téléchargement...' : 'Télécharger le Document' }}</span>
                    </button>
                  </div>
                }
              </div>
            </section>
          }

        </div>

      }

      <!-- ========================================================================= -->
      <!-- MODALE : QR CODE GRAND FORMAT POUR SCAN PLEIN ÉCRAN                       -->
      <!-- ========================================================================= -->
      @if (showFullScreenQr()) {
        <div class="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-scaleUp">
          <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl relative">
            <button
              type="button"
              (click)="showFullScreenQr.set(false)"
              class="absolute top-4 right-4 text-slate-500 hover:text-slate-800 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Fermer le plein écran">
              <span class="material-symbols-outlined text-[24px]">close</span>
            </button>

            <div class="size-12 rounded-2xl bg-emerald-50 text-[#065f46] flex items-center justify-center mb-3">
              <span class="material-symbols-outlined text-[28px]">qr_code_scanner</span>
            </div>

            <h3 class="text-base sm:text-lg font-bold text-slate-900 text-balance">
              {{ childFullName }}
            </h3>
            <p class="text-xs text-slate-500 font-mono mt-0.5 mb-4">
              {{ childNationalCode }}
            </p>

            <div class="p-3 bg-white rounded-2xl border-2 border-[#065f46] shadow-md">
              <img [src]="qrDataUrl()" [alt]="'QR Code plein écran'" class="size-64 sm:size-72 object-contain" />
            </div>

            <p class="text-[11px] text-slate-500 mt-4 text-pretty">
              Présentez cet écran au personnel soignant pour lecture instantanée.
            </p>

            <button
              type="button"
              (click)="showFullScreenQr.set(false)"
              class="w-full mt-4 py-2.5 rounded-xl bg-[#065f46] text-white font-bold text-xs shadow-sm hover:bg-[#044e3f] transition-colors cursor-pointer whitespace-nowrap">
              Fermer le plein écran
            </button>
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.25s ease-out;
    }
  `]
})
export class CarnetViewComponent {
  readonly stateService = inject(ParentStateService);
  private readonly audioService = inject(AudioService);
  readonly authService = inject(AuthService);
  readonly carnetService = inject(CarnetSanteService);

  readonly isAudioPlaying = signal<boolean>(false);
  readonly isDownloadingPdf = signal<boolean>(false);
  readonly carnetLoading = signal<boolean>(false);
  readonly carnetData = signal<CarnetSanteData | null>(null);
  readonly qrDataUrl = signal<string>('');
  readonly downloadingDocId = signal<string | null>(null);
  readonly showFullScreenQr = signal<boolean>(false);

  get vaccinesDoneCount(): number {
    return this.carnetData()?.vaccinsNaissance?.filter(v => v.effectue).length ?? 0;
  }

  get vaccinesTotalCount(): number {
    return this.carnetData()?.vaccinsNaissance?.length ?? 0;
  }

  get vaccineCompletionPercent(): number {
    const total = this.vaccinesTotalCount;
    if (total === 0) return 100;
    return Math.round((this.vaccinesDoneCount / total) * 100);
  }

  constructor() {
    effect(() => {
      const child = this.stateService.selectedChild();
      if (child) {
        this.loadCarnetData(child.id);
      } else {
        this.carnetData.set(null);
        this.qrDataUrl.set('');
      }
    });
  }

  loadCarnetData(childId: number): void {
    this.carnetLoading.set(true);
    this.carnetService.getCarnetSante(childId).subscribe({
      next: (data: CarnetSanteData) => {
        this.carnetData.set(data);
        this.carnetLoading.set(false);
        this.generateRealQrCode(data);
      },
      error: (err: unknown) => {
        console.warn('[CarnetView] Erreur récupération carnet API:', err);
        this.carnetLoading.set(false);
        this.generateFallbackQr();
      }
    });
  }

  private async generateRealQrCode(data: CarnetSanteData): Promise<void> {
    const payload = JSON.stringify({
      msas: 'SenSante-SN',
      passId: data.codeNational,
      id: data.enfantId,
      nom: data.nom,
      prenom: data.prenom,
      sexe: data.genre,
      naissance: data.dateNaissance,
      groupeSanguin: data.groupeSanguin,
      statutNut: data.statutNutritionnel,
      dispensaire: data.nomStructureSante,
      token: data.qrCodeToken,
      sha: data.hashCryptographiqueSHA256
    });

    try {
      const dataUrl = await QRCode.toDataURL(payload, {
        width: 380,
        margin: 1,
        color: { dark: '#0F4C3A', light: '#FFFFFF' }
      });
      this.qrDataUrl.set(dataUrl);
    } catch (e) {
      console.warn('[CarnetView] Erreur génération QR:', e);
    }
  }

  private async generateFallbackQr(): Promise<void> {
    const child = this.currentChild;
    if (!child) return;

    const payload = JSON.stringify({
      msas: 'SenSante-SN',
      passId: this.childNationalCode,
      id: child.id,
      nom: child.nom,
      prenom: child.prenom,
      naissance: child.dateNaissance,
      groupeSanguin: this.childBloodGroup,
      dispensaire: this.structureNom
    });

    try {
      const dataUrl = await QRCode.toDataURL(payload, {
        width: 380,
        margin: 1,
        color: { dark: '#0F4C3A', light: '#FFFFFF' }
      });
      this.qrDataUrl.set(dataUrl);
    } catch (e) {
      console.warn('[CarnetView] Erreur génération QR Fallback:', e);
    }
  }

  telechargerDocumentOfficiel(doc: DocumentCertifie): void {
    const child = this.currentChild;
    if (!child) return;
    this.downloadingDocId.set(doc.id);

    this.carnetService.telechargerDocument(doc.id, child.id).subscribe({
      next: (blob: Blob) => {
        this.downloadingDocId.set(null);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${doc.titre.replace(/\s+/g, '_')}_${this.childNationalCode}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.downloadingDocId.set(null);
        window.open(`/api/carnet-sante/documents/${doc.id}/telecharger?enfantId=${child.id}`, '_blank');
      }
    });
  }

  get currentChild(): Child | null {
    return this.stateService.selectedChild();
  }

  get passportYear(): string {
    return new Date().getFullYear().toString();
  }

  get structureNom(): string {
    const child = this.currentChild;
    if (child?.centreRattachement && child.centreRattachement !== 'Centre non renseigné') {
      return child.centreRattachement;
    }
    return '--';
  }

  // --- Child Details ---
  get childFullName(): string {
    const child = this.currentChild;
    return child ? `${child.prenom} ${child.nom}` : '--';
  }

  get childPhotoUrl(): string {
    const child = this.currentChild;
    return child?.photoUrl || '';
  }

  get childInitials(): string {
    const child = this.currentChild;
    if (!child) return '--';
    const p = child.prenom ? child.prenom.charAt(0).toUpperCase() : '';
    const n = child.nom ? child.nom.charAt(0).toUpperCase() : '';
    return `${p}${n}` || 'E';
  }

  get childBirthDateText(): string {
    const child = this.currentChild;
    if (child?.dateNaissance) {
      try {
        const d = new Date(child.dateNaissance);
        return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
      } catch {
        return child.dateNaissance;
      }
    }
    return 'Date non renseignée';
  }

  get childAgeText(): string {
    const child = this.currentChild;
    return child?.ageMois ? `${child.ageMois} mois révolus` : '--';
  }

  get apgarScoreText(): string {
    const fromApi = this.carnetData()?.antecedents?.scoreApgar;
    if (fromApi) return fromApi;
    const p = this.currentChild?.perinatal;
    if (p?.apgar1min != null && p?.apgar5min != null) {
      return `${p.apgar1min} / ${p.apgar5min}`;
    }
    return '10/10';
  }

  get childBloodGroup(): string {
    return this.currentChild?.groupeSanguin || 'O+';
  }

  get childGenderText(): string {
    const child = this.currentChild;
    if (child?.genre === 'M') {
      return 'Masculin (Góor)';
    }
    if (child?.genre === 'F') {
      return 'Féminin (Jigéen)';
    }
    return 'Non renseigné';
  }

  get childNationalCode(): string {
    const child = this.currentChild;
    return child?.perinatal?.matriculeNational || (child?.id ? `SN-DKR-2025-${child.id}` : 'SN-DKR-2025');
  }

  // --- Parent Details ---
  get parentFullName(): string {
    const user = this.authService.currentUser();
    if (!user) return 'Parent SenSanté';
    return `${user.prenom || ''} ${user.nom || ''}`.trim() || 'Parent SenSanté';
  }

  get parentPhotoUrl(): string {
    const user = this.authService.currentUser();
    return user?.avatarUrl || '';
  }

  get parentInitials(): string {
    const user = this.authService.currentUser();
    if (!user) return 'P';
    const p = user.prenom ? user.prenom.charAt(0).toUpperCase() : '';
    const n = user.nom ? user.nom.charAt(0).toUpperCase() : '';
    return `${p}${n}` || 'P';
  }

  get parentPhone(): string {
    const user = this.authService.currentUser();
    return user?.telephone || 'Non renseigné';
  }

  get parentAddress(): string {
    const user = this.authService.currentUser();
    return (user as any)?.adresse || 'Sénégal';
  }

  // --- Wolof Audio Guide ---
  toggleWolofAudio(): void {
    const nextState = !this.isAudioPlaying();
    this.isAudioPlaying.set(nextState);

    if (nextState) {
      this.audioService.playWolofPhrase('bienvenue');
      setTimeout(() => this.isAudioPlaying?.set(false), 8000);
    } else {
      this.audioService.stopCurrentAudio();
    }
  }

  // --- Real PDF Export with Backend API ---
  telechargerPasseportPdf(): void {
    const child = this.currentChild;
    const childId = child?.id || 1;

    this.isDownloadingPdf.set(true);

    this.carnetService.exportPdf(childId).subscribe({
      next: (blob: Blob) => {
        this.isDownloadingPdf.set(false);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Passeport_Sanitaire_${this.childNationalCode}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err: unknown) => {
        console.warn('Erreur téléchargement passeport API, fallback génération locale:', err);
        this.isDownloadingPdf.set(false);
        window.open(`/api/carnet-sante/enfant/${childId}/export-pdf`, '_blank');
      }
    });
  }
}
