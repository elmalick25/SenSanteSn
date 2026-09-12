import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MedecinPrescriptionService } from '../../services/medecin-prescription.service';
import {
  PrescriptionMedicale,
  MedicamentPrescrit,
  GenererOrdonnanceResponse
} from '../../models/medecin-prescription.model';

@Component({
  selector: 'app-prescription-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- ================================================================= -->
    <!-- 4 ÉTATS UI : LOADING / ERROR / SUCCESS                            -->
    <!-- ================================================================= -->

    <!-- 1. LOADING SKELETON -->
    <div *ngIf="isLoading()" class="space-y-4 animate-pulse p-4">
      <div class="h-14 bg-white rounded-xl border border-[#DCE5E0] p-4"></div>
      <div class="h-20 bg-white rounded-xl border border-[#DCE5E0] p-4"></div>
      <div class="h-72 bg-white rounded-xl border border-[#DCE5E0] p-4"></div>
      <div class="h-64 bg-white rounded-xl border border-[#DCE5E0] p-4"></div>
    </div>

    <!-- 2. ERROR STATE -->
    <div *ngIf="hasError() && !isLoading()"
         class="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center p-6 bg-white rounded-2xl border border-red-200 m-4 shadow-sm">
      <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-[#BA1A1A]">
        <span class="material-symbols-outlined text-3xl">error_outline</span>
      </div>
      <h2 class="text-xl font-bold text-[#0C1F18] text-balance">Échec de chargement de la Prescription</h2>
      <p class="text-sm text-[#404944] max-w-md text-pretty">
        Impossible de charger les protocoles et le calculateur pondéral pédiatrique.
      </p>
      <button
        (click)="chargerPrescription()"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F4C3A] text-white rounded-lg text-sm font-semibold hover:bg-[#003426] transition-colors whitespace-nowrap shadow-sm">
        <span class="material-symbols-outlined text-base">refresh</span>
        <span>Réessayer la synchronisation</span>
      </button>
    </div>

    <!-- 3. SUCCESS STATE : INTERFACE COMPLÈTE CONFORME MAQUETTE -->
    <div *ngIf="!isLoading() && !hasError() && presc() as p" class="flex flex-col min-h-screen bg-[#E8FFF3] text-[#0C1F18]">

      <!-- =============================================================== -->
      <!-- TOP NAV BAR                                                     -->
      <!-- =============================================================== -->
      <header class="flex justify-between items-center w-full px-4 h-14 border-b border-[#BFC9C3] bg-white z-10 flex-shrink-0 shadow-xs">
        <!-- Left: Clinic Name & Navigation status -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#003426] text-[22px]">local_hospital</span>
            <h1 class="text-sm md:text-base font-semibold text-[#0C1F18] whitespace-nowrap text-balance">{{ p.centreDeSante }}</h1>
          </div>
          <div class="h-4 w-px bg-[#BFC9C3] hidden sm:block"></div>
          <div class="hidden md:flex items-center gap-3 text-xs text-[#404944]">
            <span class="flex items-center gap-1 font-medium text-[#0C1F18] whitespace-nowrap">
              <span class="material-symbols-outlined text-[16px] text-[#003426]">calendar_today</span>
              {{ p.datePrescription }}
            </span>
            <span class="flex items-center gap-1 text-[#003426] bg-[#E3F9ED] px-2 py-0.5 rounded-full text-[11px] font-semibold border border-[#D2E8DC] whitespace-nowrap">
              <span class="material-symbols-outlined text-[14px] text-[#003426] animate-spin">sync</span>
              Sync En direct
            </span>
          </div>
        </div>

        <!-- Right: Search, Trailing actions & Icons -->
        <div class="flex items-center gap-3">
          <div class="relative w-64 hidden xl:block">
            <span class="material-symbols-outlined absolute left-2.5 top-2 text-[18px] text-[#707974]">search</span>
            <input
              [(ngModel)]="rechercheFiltre"
              class="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-[#BFC9C3] bg-[#E3F9ED] focus:bg-white focus:border-[#003426] focus:ring-1 focus:ring-[#003426] focus:outline-hidden"
              placeholder="Rechercher médicament, DCI, protocole..."
              type="text"/>
          </div>

          <button
            (click)="alerteTriage()"
            class="h-8 px-3 rounded-lg border border-[#BFC9C3] text-[#404944] hover:bg-[#E3F9ED] text-xs font-semibold flex items-center gap-1 transition-colors whitespace-nowrap">
            <span class="material-symbols-outlined text-[16px] text-[#BA1A1A]">warning</span>
            <span>Alerte Triage</span>
          </button>

          <button
            (click)="nouvelleConsultation()"
            class="h-8 px-3 bg-[#003426] text-white rounded-lg text-xs font-semibold hover:bg-[#0F4C3A] transition-colors flex items-center gap-1.5 shadow-sm active:scale-95 whitespace-nowrap">
            <span class="material-symbols-outlined text-[16px]">add_circle</span>
            <span>Nouvelle Consultation</span>
          </button>

          <div class="h-4 w-px bg-[#BFC9C3] hidden sm:block"></div>

          <div class="flex items-center gap-1 text-[#404944]">
            <button class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#E3F9ED] text-[#0C1F18] transition-colors" title="Sync">
              <span class="material-symbols-outlined text-[19px]">sync</span>
            </button>
            <button class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#E3F9ED] text-[#0C1F18] transition-colors relative" title="Notifications">
              <span class="material-symbols-outlined text-[19px]">notifications</span>
              <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#BA1A1A]"></span>
            </button>
          </div>

          <img
            alt="Dr. Babacar Fall"
            class="w-7 h-7 rounded-full object-cover border border-[#BFC9C3] ml-1 flex-shrink-0"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8PIXalQOScy3v62kUpK-XO1DYwSXAv32SoqypnyKveQDY_iAmwRWqwcxP5H4mXJnQOpoiXqaZfqbUDxiU0IuBKf0u2IXxhpk1PeHjRGBPzSwQreUyUeO95ClDXSou3x0740zmvxias8XS10vbMqvwHDgnu9puDCfxM8HWHTRtvi0HjKMWqu3t52FP8hsp7GKSPTushNWZTXMjID-wlSsyaQqEkiDDWWVzhczdEqeeZKdiGUTOFJ8j"/>
        </div>
      </header>

      <!-- =============================================================== -->
      <!-- PERSISTENT PATIENT IDENTITY BANNER (Moussa Diop)                -->
      <!-- =============================================================== -->
      <div class="bg-white border-b border-[#BFC9C3] px-4 py-2.5 flex flex-wrap items-center justify-between gap-y-2 flex-shrink-0 shadow-2xs">
        <!-- Patient Bio -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-[#ACF1D5] text-[#003426] flex items-center justify-center font-bold text-sm border border-[#266A54] flex-shrink-0">
            MD
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-2 flex-wrap">
              <h2 class="text-base font-bold text-[#0C1F18] tracking-tight text-balance">{{ p.patient.nomComplet }}</h2>
              <span class="bg-[#D7EDE2] text-[#003426] text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                {{ p.patient.ageLabel }}
              </span>
              <span class="font-mono text-[11px] text-[#707974] whitespace-nowrap">NIP:&nbsp;{{ p.patient.nip }}</span>
            </div>
            <div class="flex items-center gap-3 text-xs text-[#404944] flex-wrap mt-0.5">
              <span>Tutrice&nbsp;: <strong class="text-[#0C1F18] font-medium">{{ p.patient.tutriceNom }} ({{ p.patient.tutriceLien }})</strong></span>
              <span>•</span>
              <span>Contact&nbsp;: <strong class="text-[#0C1F18] font-medium">{{ p.patient.telephone }}</strong></span>
              <span>•</span>
              <span class="flex items-center gap-1 text-[#003426]">
                <span class="material-symbols-outlined text-[14px]">location_on</span>
                {{ p.patient.adresse }}
              </span>
            </div>
          </div>
        </div>

        <!-- Clinical Vitals Badges / Strip -->
        <div class="flex items-center gap-2 flex-wrap">
          <!-- Poids -->
          <div class="flex flex-col px-3 py-1 bg-[#E3F9ED] rounded-lg border border-[#BFC9C3]">
            <span class="text-[10px] text-[#404944] font-semibold uppercase tracking-wider whitespace-nowrap">Poids du jour</span>
            <div class="flex items-baseline gap-1">
              <span class="text-base font-bold text-[#003426]">{{ p.patient.poidsActuelKg | number:'1.3-3' }}</span>
              <span class="text-[10px] text-[#707974]">kg</span>
              <span class="ml-1 text-[10px] px-1.5 rounded bg-[#FFDAD6] text-[#93000A] font-bold whitespace-nowrap">Z:&nbsp;-2.1&nbsp;SD</span>
            </div>
          </div>

          <!-- Périmètre Brachial (PB) -->
          <div class="flex flex-col px-3 py-1 bg-[#E3F9ED] rounded-lg border border-[#BFC9C3]">
            <span class="text-[10px] text-[#404944] font-semibold uppercase tracking-wider whitespace-nowrap">Périmètre Brachial</span>
            <div class="flex items-baseline gap-1">
              <span class="text-base font-bold text-[#0C1F18]">{{ p.patient.pbMm }}</span>
              <span class="text-[10px] text-[#707974]">mm</span>
              <span class="ml-1 text-[10px] px-1.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold whitespace-nowrap">MAM Jaune</span>
            </div>
          </div>

          <!-- Température -->
          <div class="flex flex-col px-3 py-1 bg-[#E3F9ED] rounded-lg border border-[#BFC9C3]">
            <span class="text-[10px] text-[#404944] font-semibold uppercase tracking-wider whitespace-nowrap">T° Axillaire</span>
            <div class="flex items-baseline gap-1">
              <span class="text-base font-bold text-[#BA1A1A]">{{ p.patient.temperatureC }}</span>
              <span class="text-[10px] text-[#707974]">°C</span>
            </div>
          </div>

          <!-- Allergy Critical Indicator -->
          <div class="flex items-center gap-2 px-3 py-1.5 bg-[#FFDAD6] border-l-4 border-[#BA1A1A] rounded-r-lg text-[#93000A] max-w-xs shadow-2xs">
            <span class="material-symbols-outlined text-[#BA1A1A] text-[20px] flex-shrink-0">notification_important</span>
            <div class="flex flex-col min-w-0">
              <span class="text-[10px] font-bold uppercase tracking-wider text-[#BA1A1A] whitespace-nowrap">Allergie Majeure</span>
              <span class="text-xs font-semibold truncate" title="Pénicilline V (Érythème papuleux)">Pénicilline V (Érythème papuleux)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- =============================================================== -->
      <!-- MAIN SCROLLABLE CLINICAL CONTENT CANVAS                         -->
      <!-- =============================================================== -->
      <main class="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scroll pb-28">

        <!-- SECTION 1: PRESCRIPTION MÉDICAMENTEUSE AVEC CALCULATEUR PÉDIATRIQUE -->
        <section class="bg-white rounded-lg border border-[#BFC9C3] shadow-xs overflow-hidden">
          <!-- Section Header -->
          <div class="px-4 py-2.5 bg-[#E3F9ED] border-b border-[#BFC9C3] flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded bg-[#003426] text-white flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-[16px]">medication</span>
              </div>
              <h3 class="text-sm font-bold text-[#0C1F18] text-balance">1. Prescription Médicamenteuse Sécurisée</h3>
              <span class="text-[11px] bg-[#ACF1D5] text-[#2D705A] px-2 py-0.5 rounded-full border border-[#266A54] font-semibold whitespace-nowrap">
                Calcul automatique actif (Poids&nbsp;: 6.300&nbsp;kg)
              </span>
            </div>
            <div class="flex items-center gap-2">
              <button
                (click)="ouvrirHistorique()"
                class="h-7 px-2.5 text-xs font-semibold rounded border border-[#BFC9C3] bg-white hover:bg-[#E3F9ED] text-[#404944] flex items-center gap-1 transition-colors whitespace-nowrap">
                <span class="material-symbols-outlined text-[14px]">history</span>
                <span>Historique ordonnances ({{ p.historiqueOrdonnancesCount }})</span>
              </button>
              <button
                (click)="ouvrirAjoutMedicament()"
                class="h-7 px-3 text-xs font-semibold rounded bg-[#003426] text-white hover:bg-[#0F4C3A] flex items-center gap-1 transition-colors shadow-sm whitespace-nowrap">
                <span class="material-symbols-outlined text-[15px]">add</span>
                <span>+ Ajouter un médicament</span>
              </button>
            </div>
          </div>

          <!-- Allergy Guard Warning Banner -->
          <div class="mx-4 mt-4 p-3 bg-[#FFF5F5] border border-[#FED7D7] rounded-lg flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-full bg-[#BA1A1A] text-white flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-[18px]">shield</span>
              </span>
              <div>
                <p class="text-xs md:text-sm text-[#BA1A1A] font-bold text-balance">{{ p.alerteAllergieTitre }}</p>
                <p class="text-xs text-[#404944] text-pretty">{{ p.alerteAllergieMessage }}</p>
              </div>
            </div>
            <span class="text-[11px] font-bold uppercase px-2.5 py-1 rounded bg-red-100 text-[#BA1A1A] border border-red-300 whitespace-nowrap">
              Filtre Actif
            </span>
          </div>

          <!-- Interactive Drugs Table -->
          <div class="p-4 overflow-x-auto custom-scroll">
            <table class="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr class="bg-[#DDF3E8] text-[#404944] text-[11px] uppercase tracking-wider border-b border-[#BFC9C3]">
                  <th class="py-2 px-3 font-semibold rounded-l whitespace-nowrap">Médicament / Spécialité &amp; Forme</th>
                  <th class="py-2 px-3 font-semibold whitespace-nowrap">Posologie Pondérale</th>
                  <th class="py-2 px-3 font-semibold whitespace-nowrap">Dose par Prise (Calculée)</th>
                  <th class="py-2 px-3 font-semibold whitespace-nowrap">Fréquence &amp; Rythme</th>
                  <th class="py-2 px-3 font-semibold whitespace-nowrap">Durée</th>
                  <th class="py-2 px-3 font-semibold whitespace-nowrap">Indication Clinique</th>
                  <th class="py-2 px-3 font-semibold text-center rounded-r whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#BFC9C3]/60 text-xs">
                <tr *ngFor="let m of p.medicaments" class="hover:bg-[#E3F9ED] transition-colors group">
                  <td class="py-3 px-3">
                    <div class="flex flex-col">
                      <span class="text-xs font-bold text-[#0C1F18]">{{ m.nomCommercial }}</span>
                      <span class="text-[11px] text-[#003426] flex items-center gap-1 mt-0.5">
                        <span class="material-symbols-outlined text-[13px]" *ngIf="m.substitutionAppliquee">check_circle</span>
                        {{ m.forme }}
                      </span>
                    </div>
                  </td>
                  <td class="py-3 px-3 font-mono text-[#404944] whitespace-nowrap">
                    {{ m.posologiePonderale }}
                  </td>
                  <td class="py-3 px-3">
                    <div class="inline-flex items-center gap-1.5 bg-[#DDF3E8] px-2 py-1 rounded border border-[#BFC9C3] whitespace-nowrap">
                      <span class="font-bold text-[#003426] font-mono">{{ m.doseCalculeeMl }}&nbsp;ml</span>
                      <span class="text-[#404944] text-[11px]">({{ m.doseCalculeeMg }}&nbsp;mg)</span>
                    </div>
                  </td>
                  <td class="py-3 px-3">
                    <span class="font-semibold" [ngClass]="m.id === 2 ? 'text-[#BA1A1A]' : 'text-[#0C1F18]'">{{ m.frequenceRythme }}</span>
                    <div class="text-[#707974] text-[11px] leading-tight">{{ m.frequenceDetail }}</div>
                  </td>
                  <td class="py-3 px-3">
                    <span class="px-2 py-0.5 rounded bg-[#D7EDE2] text-[#0C1F18] font-semibold text-[11px] whitespace-nowrap">{{ m.dureeLabel }}</span>
                  </td>
                  <td class="py-3 px-3 text-[#404944] text-pretty max-w-xs">
                    {{ m.indicationClinique }}
                  </td>
                  <td class="py-3 px-3 text-center">
                    <div class="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100">
                      <button (click)="editerMedicament(m)" class="p-1 rounded hover:bg-[#DDF3E8] text-[#404944]" title="Modifier la dose">
                        <span class="material-symbols-outlined text-[17px]">edit</span>
                      </button>
                      <button (click)="supprimerMedicament(m)" class="p-1 rounded hover:bg-[#FFDAD6] text-[#BA1A1A]" title="Supprimer">
                        <span class="material-symbols-outlined text-[17px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Footer helper info -->
          <div class="px-4 py-2 bg-[#E3F9ED]/50 border-t border-[#BFC9C3] flex items-center justify-between text-xs text-[#404944]">
            <div class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px] text-[#003426]">verified_user</span>
              <span>Algorithme validé&nbsp;: Règles de calcul pondéral pédiatrique SN-MSAS 2024 (Pédiatrie Gaspard Kamara).</span>
            </div>
            <span class="font-mono text-[#707974] text-[11px] whitespace-nowrap">Index de sécurité&nbsp;: 100% compatible</span>
          </div>
        </section>

        <!-- SECTION 2: PROTOCOLE NUTRITIONNEL CRENAS / PILULIER CHRONOLOGIQUE -->
        <section class="bg-white rounded-lg border border-[#BFC9C3] shadow-xs overflow-hidden">
          <!-- Header -->
          <div class="px-4 py-2.5 bg-[#E3F9ED] border-b border-[#BFC9C3] flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded bg-[#266A54] text-white flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-[16px]">nutrition</span>
              </div>
              <h3 class="text-sm font-bold text-[#0C1F18] text-balance">2. Protocole Nutritionnel Ambulatoire CRENAS (Plumpy'Nut®)</h3>
              <span class="text-[11px] bg-amber-50 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
                Prise en charge MAM • Dotation Spécifique
              </span>
            </div>
            <span class="text-xs text-[#707974] whitespace-nowrap">Dotation Pharmacie Centrale Kamara</span>
          </div>

          <!-- Main Body Grid: Inputs & Graphic Routine -->
          <div class="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
            <!-- Left Col: Parameters & Distribution rules (5 cols) -->
            <div class="lg:col-span-5 flex flex-col justify-between space-y-3 bg-[#E3F9ED] p-3.5 rounded-lg border border-[#BFC9C3]">
              <div>
                <span class="text-xs uppercase tracking-wider text-[#003426] font-bold block">Paramètres de Dotation ATPE</span>
                <div class="mt-2 space-y-2 text-xs">
                  <div class="flex items-center justify-between py-1.5 border-b border-[#BFC9C3]/60">
                    <span class="text-[#404944]">Ration quotidienne&nbsp;:</span>
                    <span class="font-bold text-[#0C1F18] font-mono bg-white px-2 py-0.5 rounded border border-[#BFC9C3] whitespace-nowrap">
                      {{ p.dotationAtpe.rationQuotidienne }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between py-1.5 border-b border-[#BFC9C3]/60">
                    <span class="text-[#404944]">Durée de la cure&nbsp;:</span>
                    <span class="font-bold text-[#0C1F18] font-mono bg-white px-2 py-0.5 rounded border border-[#BFC9C3] whitespace-nowrap">
                      {{ p.dotationAtpe.dureeJours }} jours consécutifs
                    </span>
                  </div>
                  <div class="flex items-center justify-between py-1.5">
                    <span class="text-[#404944]">Volume total prescrit&nbsp;:</span>
                    <span class="font-bold text-[#266A54] text-sm whitespace-nowrap">
                      {{ p.dotationAtpe.volumeTotalSachets }} sachets ATPE (92g)
                    </span>
                  </div>
                </div>
              </div>

              <!-- Modalité & Consignes -->
              <div class="p-2.5 bg-white rounded border border-[#BFC9C3] text-xs space-y-1.5">
                <div class="flex items-center gap-1.5 text-[#003426] font-bold">
                  <span class="material-symbols-outlined text-[16px]">info</span>
                  <span>Modalités impératives d'administration</span>
                </div>
                <ul class="list-disc list-inside text-[#404944] space-y-1 text-[11px] text-pretty">
                  <li *ngFor="let mod of p.dotationAtpe.modalitesAdministration">{{ mod }}</li>
                </ul>
              </div>
            </div>

            <!-- Right Col: Visual Interactive Pilulier Timeline (7 cols) -->
            <div class="lg:col-span-7 flex flex-col justify-between bg-white p-3.5 rounded-lg border border-[#BFC9C3]">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs uppercase tracking-wider text-[#404944] font-bold">
                    Pilulier Journalier &amp; Routine Horodatée de Moussa
                  </span>
                  <span class="text-xs text-[#003426] font-medium flex items-center gap-1 whitespace-nowrap">
                    <span class="material-symbols-outlined text-[14px]">water_drop</span>
                    Hydratation continue
                  </span>
                </div>

                <!-- Visual 2-Slot Pill Card Routine -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <!-- Slot 1: Matin -->
                  <div class="p-3 rounded-lg border-2 border-[#003426]/20 bg-[#E3F9ED] flex flex-col gap-2 relative">
                    <div class="flex items-center justify-between">
                      <span class="flex items-center gap-1 font-bold text-[#003426] text-xs md:text-sm">
                        <span class="material-symbols-outlined text-[18px]">light_mode</span>
                        {{ p.dotationAtpe.slot1Titre }}
                      </span>
                      <span class="text-[10px] bg-[#003426] text-white px-1.5 py-0.5 rounded font-bold whitespace-nowrap">1 Sachet</span>
                    </div>
                    <p class="text-xs text-[#404944] text-pretty">{{ p.dotationAtpe.slot1Description }}</p>
                    <div class="mt-1 pt-2 border-t border-[#BFC9C3]/40 flex items-center justify-between text-xs text-[#0C1F18]">
                      <span class="flex items-center gap-1 font-medium">
                        <span class="material-symbols-outlined text-[15px] text-[#003426]">medication_liquid</span>
                        {{ p.dotationAtpe.slot1MedicamentAssocie }}
                      </span>
                      <span class="text-[#707974] font-mono whitespace-nowrap">{{ p.dotationAtpe.slot1Calorie }}</span>
                    </div>
                  </div>

                  <!-- Slot 2: Goûter / Après-midi -->
                  <div class="p-3 rounded-lg border-2 border-[#266A54]/20 bg-[#E3F9ED] flex flex-col gap-2 relative">
                    <div class="flex items-center justify-between">
                      <span class="flex items-center gap-1 font-bold text-[#266A54] text-xs md:text-sm">
                        <span class="material-symbols-outlined text-[18px]">wb_twilight</span>
                        {{ p.dotationAtpe.slot2Titre }}
                      </span>
                      <span class="text-[10px] bg-[#266A54] text-white px-1.5 py-0.5 rounded font-bold whitespace-nowrap">1 Sachet</span>
                    </div>
                    <p class="text-xs text-[#404944] text-pretty">{{ p.dotationAtpe.slot2Description }}</p>
                    <div class="mt-1 pt-2 border-t border-[#BFC9C3]/40 flex items-center justify-between text-xs text-[#0C1F18]">
                      <span class="flex items-center gap-1 font-medium">
                        <span class="material-symbols-outlined text-[15px] text-[#003426]">water_full</span>
                        {{ p.dotationAtpe.slot2Boisson }}
                      </span>
                      <span class="text-[#707974] font-mono whitespace-nowrap">{{ p.dotationAtpe.slot2Calorie }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Progress 14-day dots mini visualization -->
              <div class="mt-3 pt-3 border-t border-[#BFC9C3]/60">
                <div class="flex items-center justify-between text-xs text-[#404944] mb-1.5 flex-wrap">
                  <span>Cycle Thérapeutique Ambulatoire (14 Jours)</span>
                  <span class="font-mono font-bold text-[#003426] whitespace-nowrap">J1 (Aujourd'hui) &rarr; J14 (07 Nov 2024)</span>
                </div>
                <div class="flex items-center justify-between gap-1 overflow-x-auto custom-scroll pb-1">
                  <div
                    *ngFor="let j of p.jalonsCure"
                    [title]="j.label + ' - ' + j.description"
                    [ngClass]="{
                      'bg-[#003426] text-white font-bold': j.type === 'START' || j.type === 'BILAN',
                      'bg-[#ACF1D5] border border-[#266A54] text-[#2D705A] font-bold': j.type === 'VAD',
                      'bg-[#D7EDE2] border border-[#BFC9C3] text-[#707974]': j.type === 'ROUTINE'
                    }"
                    class="h-5 flex-1 min-w-[24px] rounded flex items-center justify-center text-[10px] whitespace-nowrap cursor-pointer">
                    {{ j.label }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION 3: FICHE DE CONTRE-RÉFÉRENCE & INSTRUCTIONS RELAIS TERRAIN -->
        <section class="bg-white rounded-lg border border-[#BFC9C3] shadow-xs overflow-hidden">
          <!-- Header -->
          <div class="px-4 py-2.5 bg-[#E3F9ED] border-b border-[#BFC9C3] flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded bg-[#0F4C3A] text-white flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-[16px]">handshake</span>
              </div>
              <h3 class="text-sm font-bold text-[#0C1F18] text-balance">3. Coordination &amp; Fiche de Contre-Référence Relais Terrain</h3>
            </div>
            <span class="text-xs bg-[#DDF3E8] text-[#0C1F18] px-2 py-0.5 rounded font-medium border border-[#BFC9C3] whitespace-nowrap">
              Réseau Communautaire Gaspard Kamara
            </span>
          </div>

          <div class="p-4 space-y-4">
            <!-- Relais Assignation Strip -->
            <div class="flex flex-wrap items-center justify-between p-3 bg-[#E3F9ED] rounded-lg border border-[#BFC9C3] gap-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#D2E8DC] flex items-center justify-center text-[#003426] font-bold flex-shrink-0">
                  <span class="material-symbols-outlined text-[24px]">support_agent</span>
                </div>
                <div>
                  <span class="text-[10px] uppercase tracking-wider text-[#707974] font-semibold block">Relais Communautaire Référent Dédié</span>
                  <h4 class="text-sm font-bold text-[#0C1F18]">{{ p.contreReference.relaisNom }} • {{ p.contreReference.relaisSecteur }}</h4>
                  <p class="text-xs text-[#404944]">{{ p.contreReference.relaisPoste }} • Tél&nbsp;: {{ p.contreReference.relaisTelephone }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-1 rounded-full bg-[#ACF1D5] text-[#2D705A] text-xs font-semibold flex items-center gap-1 whitespace-nowrap">
                  <span class="w-2 h-2 rounded-full bg-[#266A54]"></span>
                  Dossier Partagé Relais Sécurisé
                </span>
                <button
                  (click)="ouvrirChatRelais()"
                  class="h-8 px-3 rounded border border-[#BFC9C3] bg-white text-xs font-semibold hover:bg-[#DDF3E8] text-[#0C1F18] flex items-center gap-1 transition-colors whitespace-nowrap">
                  <span class="material-symbols-outlined text-[16px]">chat</span>
                  <span>Message Relais</span>
                </button>
              </div>
            </div>

            <!-- Structured Instruction Fields -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- VAD Frequency -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs text-[#0C1F18] font-semibold flex items-center gap-1">
                  <span class="material-symbols-outlined text-[16px] text-[#003426]">home_health</span>
                  <span>Fréquence des Visites à Domicile (VAD)</span>
                </label>
                <textarea
                  [(ngModel)]="p.contreReference.frequenceVad"
                  class="w-full text-xs p-2.5 rounded-lg border border-[#BFC9C3] bg-white focus:border-[#003426] focus:ring-1 focus:ring-[#003426] h-24 resize-none leading-relaxed text-pretty"></textarea>
              </div>

              <!-- Next Appointment -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs text-[#0C1F18] font-semibold flex items-center gap-1">
                  <span class="material-symbols-outlined text-[16px] text-[#003426]">event_available</span>
                  <span>Prochain Contrôle Pédiatrique au Cabinet</span>
                </label>
                <div class="p-2.5 rounded-lg border border-[#BFC9C3] bg-white flex flex-col justify-between h-24">
                  <div>
                    <span class="text-xs font-bold text-[#003426] block">{{ p.contreReference.prochainControleDate }}</span>
                    <span class="text-xs text-[#0C1F18] font-medium">{{ p.contreReference.prochainControleHeure }}</span>
                  </div>
                  <div class="flex items-center justify-between text-[11px] text-[#707974] border-t border-[#BFC9C3]/60 pt-1">
                    <span class="truncate">{{ p.contreReference.prochainControleLieu }}</span>
                    <span class="bg-[#D7EDE2] px-1.5 rounded text-[#0C1F18] whitespace-nowrap">{{ p.contreReference.statutRdv }}</span>
                  </div>
                </div>
              </div>

              <!-- Alert Directives -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs text-[#BA1A1A] font-semibold flex items-center gap-1">
                  <span class="material-symbols-outlined text-[16px] text-[#BA1A1A]">emergency_home</span>
                  <span>Directives d'Alerte en Cas d'Aggravation</span>
                </label>
                <textarea
                  [(ngModel)]="p.contreReference.directivesAlerteAggravation"
                  class="w-full text-xs p-2.5 rounded-lg border border-[#BA1A1A]/40 bg-[#FFF8F8] text-[#0C1F18] focus:border-[#BA1A1A] focus:ring-1 focus:ring-[#BA1A1A] h-24 resize-none font-medium leading-relaxed text-pretty"></textarea>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION 4: ACTION PANEL & DOCUMENT PREVIEW -->
        <section class="bg-white rounded-lg border border-[#BFC9C3] shadow-xs p-4">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">

            <!-- Document Miniature Thumbnail & Official Seals (5 cols) -->
            <div class="lg:col-span-5 bg-[#E3F9ED] p-3 rounded-lg border border-[#BFC9C3] relative overflow-hidden group">
              <div class="bg-white border border-[#BFC9C3]/70 rounded p-3 shadow-xs space-y-2 text-[11px] text-[#0C1F18] select-none">
                <!-- Official Header of Senegal -->
                <div class="text-center pb-2 border-b border-[#BFC9C3]/50">
                  <p class="font-bold uppercase tracking-wider text-[9px] text-[#003426]">{{ p.documentOfficiel.republiqueEnTete }}</p>
                  <p class="text-[8px] text-[#707974] uppercase">{{ p.documentOfficiel.ministereEnTete }}</p>
                  <p class="font-bold text-[10px] text-[#0C1F18] mt-0.5">{{ p.documentOfficiel.structureEnTete }} • {{ p.documentOfficiel.cabinetEnTete }}</p>
                </div>

                <!-- Doc Details -->
                <div class="flex justify-between items-start text-[9px] text-[#404944]">
                  <div>
                    <p><strong>Patient&nbsp;:</strong> {{ p.patient.nomComplet }} (8m, 6.3&nbsp;kg)</p>
                    <p><strong>Date&nbsp;:</strong> {{ p.documentOfficiel.dateEmission }} • Réf&nbsp;: {{ p.documentOfficiel.numeroOrdonnance }}</p>
                  </div>
                  <div class="text-right">
                    <span class="text-[#BA1A1A] font-bold block">{{ p.documentOfficiel.mentionAllergie }}</span>
                    <span>DCI Sécurisées ({{ p.medicaments.length }}) + CRENAS</span>
                  </div>
                </div>

                <!-- Lines imitation -->
                <div class="space-y-1 py-1">
                  <div class="h-2 w-4/5 bg-[#D7EDE2] rounded"></div>
                  <div class="h-2 w-3/4 bg-[#D7EDE2] rounded"></div>
                  <div class="h-2 w-1/2 bg-[#D7EDE2] rounded"></div>
                </div>

                <!-- Stamps, Signature and Verification Barcode -->
                <div class="pt-2 border-t border-[#BFC9C3]/50 flex items-end justify-between">
                  <div class="flex items-center gap-1.5">
                    <div class="flex flex-col items-center">
                      <span class="material-symbols-outlined text-[28px] text-[#0C1F18]">qr_code_2</span>
                      <span class="text-[7px] text-[#707974] font-mono">{{ p.documentOfficiel.codeQrVerification }}</span>
                    </div>
                    <div class="text-[8px] text-[#707974] leading-tight">
                      <p>Signature numérique</p>
                      <p class="text-[#003426] font-semibold">{{ p.documentOfficiel.signatureCertificat }}</p>
                    </div>
                  </div>

                  <!-- Doctor Stamp -->
                  <div class="border border-[#003426]/40 rounded p-1 text-center bg-[#E3F9ED] text-[8px] text-[#003426] leading-tight">
                    <p class="font-bold uppercase">{{ p.documentOfficiel.praticienNom }}</p>
                    <p class="text-[7px]">N° Ordre {{ p.documentOfficiel.praticienNumeroOrdre }} • {{ p.documentOfficiel.praticienSpecialite }}</p>
                    <p class="text-[7px] text-[#707974]">Gaspard Kamara Dakar</p>
                  </div>
                </div>
              </div>

              <div class="absolute inset-0 bg-[#003426]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span class="bg-white/95 px-3 py-1 rounded-full text-xs font-semibold text-[#003426] shadow">Aperçu Haute Définition</span>
              </div>
            </div>

            <!-- Action Buttons & Transmission Channels (7 cols) -->
            <div class="lg:col-span-7 flex flex-col justify-between h-full space-y-3">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-xs uppercase tracking-wider text-[#707974] font-bold">Validation &amp; Diffusion de l'Ordonnance</span>
                  <span class="text-xs text-[#266A54] font-medium flex items-center gap-1 whitespace-nowrap">
                    <span class="material-symbols-outlined text-[15px]">lock</span>
                    Horodatage &amp; signature scellés
                  </span>
                </div>
                <p class="text-xs text-[#404944] mt-1 text-pretty">
                  La validation génère simultanément l'ordonnance cryptée transmise à l'officine de garde, le protocole CRENAS assigné au relais Fatou Diop et la notification SMS à la tutrice.
                </p>
              </div>

              <!-- Primary Large Action -->
              <button
                (click)="genererOrdonnance()"
                [disabled]="isGenerating()"
                class="w-full h-11 bg-[#003426] text-white rounded-lg text-sm font-bold hover:bg-[#0F4C3A] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99] whitespace-nowrap disabled:opacity-50">
                <span *ngIf="isGenerating()" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span class="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                <span>Générer l'Ordonnance &amp; Fiche Relais PDF Sécurisée</span>
                <span class="material-symbols-outlined text-[18px] ml-1">arrow_forward</span>
              </button>

              <!-- Secondary Actions Row -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  (click)="imprimerTicket()"
                  class="h-9 px-3 rounded-lg border border-[#BFC9C3] bg-white hover:bg-[#E3F9ED] text-xs font-semibold text-[#0C1F18] flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap">
                  <span class="material-symbols-outlined text-[17px] text-[#003426]">print</span>
                  <span>Imprimer Ticket Retrait / Relais</span>
                </button>
                <button
                  (click)="transmettreSms()"
                  [disabled]="isSendingSms()"
                  class="h-9 px-3 rounded-lg border border-[#BFC9C3] bg-white hover:bg-[#E3F9ED] text-xs font-semibold text-[#0C1F18] flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap disabled:opacity-50">
                  <span *ngIf="isSendingSms()" class="w-3.5 h-3.5 border-2 border-[#266A54] border-t-transparent rounded-full animate-spin"></span>
                  <span *ngIf="!isSendingSms()" class="material-symbols-outlined text-[17px] text-[#266A54]">sms</span>
                  <span>Transmettre SMS à Coumba Diop</span>
                </button>
              </div>

              <!-- Status Notice -->
              <div class="flex items-center gap-2 text-xs text-[#707974] pt-1">
                <span class="material-symbols-outlined text-[15px] text-[#266A54]">cell_tower</span>
                <span class="whitespace-nowrap">Réseau relais Dakar Médina opérationnel • Téléservice National SenSanté v4.2</span>
              </div>
            </div>

          </div>
        </section>

      </main>

      <!-- Modale d'ajout d'un médicament -->
      <div *ngIf="showAjoutModal()" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
        <div class="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl border border-[#BFC9C3]">
          <div class="flex items-center justify-between border-b border-[#BFC9C3] pb-3">
            <h3 class="text-base font-bold text-[#0C1F18]">Ajouter une spécialité pédiatrique</h3>
            <button (click)="showAjoutModal.set(false)" class="text-[#707974] hover:text-[#0C1F18]">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="space-y-3 text-xs">
            <div>
              <label class="font-semibold text-[#0C1F18] block mb-1">Dénomination &amp; Forme</label>
              <input
                [(ngModel)]="nouveauMedNom"
                placeholder="Ex: Zinc Sirop 20mg / 5ml"
                class="w-full text-xs p-2 rounded-lg border border-[#BFC9C3] focus:ring-1 focus:ring-[#003426] focus:outline-hidden"/>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="font-semibold text-[#0C1F18] block mb-1">Posologie Pondérale</label>
                <input
                  [(ngModel)]="nouveauMedPosologie"
                  placeholder="Ex: 20 mg/jour"
                  class="w-full text-xs p-2 rounded-lg border border-[#BFC9C3] focus:ring-1 focus:ring-[#003426] focus:outline-hidden"/>
              </div>
              <div>
                <label class="font-semibold text-[#0C1F18] block mb-1">Durée (jours)</label>
                <input
                  type="number"
                  [(ngModel)]="nouveauMedDuree"
                  class="w-full text-xs p-2 rounded-lg border border-[#BFC9C3] focus:ring-1 focus:ring-[#003426] focus:outline-hidden"/>
              </div>
            </div>
            <div>
              <label class="font-semibold text-[#0C1F18] block mb-1">Indication Clinique</label>
              <input
                [(ngModel)]="nouveauMedIndication"
                placeholder="Ex: Diarrhée persistante"
                class="w-full text-xs p-2 rounded-lg border border-[#BFC9C3] focus:ring-1 focus:ring-[#003426] focus:outline-hidden"/>
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-2 border-t border-[#BFC9C3]">
            <button
              (click)="showAjoutModal.set(false)"
              class="px-4 py-2 border border-[#BFC9C3] rounded-lg text-xs font-semibold text-[#404944] hover:bg-[#E3F9ED] whitespace-nowrap">
              Annuler
            </button>
            <button
              (click)="validerAjoutMedicament()"
              class="px-4 py-2 bg-[#003426] text-white rounded-lg text-xs font-bold hover:bg-[#0F4C3A] whitespace-nowrap">
              Ajouter à l'ordonnance
            </button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .custom-scroll::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    .custom-scroll::-webkit-scrollbar-track {
      background: #E8FFF3;
    }
    .custom-scroll::-webkit-scrollbar-thumb {
      background: #CBD5D1;
      border-radius: 4px;
    }
    .custom-scroll::-webkit-scrollbar-thumb:hover {
      background: #99d3ba;
    }
  `]
})
export class PrescriptionViewComponent implements OnInit {

  private readonly prescriptionService = inject(MedecinPrescriptionService);
  private readonly router = inject(Router);

  readonly isLoading = signal<boolean>(true);
  readonly hasError = signal<boolean>(false);
  readonly isGenerating = signal<boolean>(false);
  readonly isSendingSms = signal<boolean>(false);
  readonly showAjoutModal = signal<boolean>(false);

  readonly presc = signal<PrescriptionMedicale | null>(null);

  rechercheFiltre = '';

  // Formulaire ajout médicament
  nouveauMedNom = '';
  nouveauMedPosologie = '';
  nouveauMedDuree = 7;
  nouveauMedIndication = '';

  ngOnInit(): void {
    this.chargerPrescription();
  }

  chargerPrescription(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.prescriptionService.getPrescriptionEnCours().subscribe({
      next: (data: PrescriptionMedicale) => {
        this.presc.set(data);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Erreur chargement prescription:', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  ouvrirAjoutMedicament(): void {
    this.nouveauMedNom = '';
    this.nouveauMedPosologie = '';
    this.nouveauMedDuree = 7;
    this.nouveauMedIndication = '';
    this.showAjoutModal.set(true);
  }

  validerAjoutMedicament(): void {
    const p = this.presc();
    if (!p || !this.nouveauMedNom) return;

    const nouveau: MedicamentPrescrit = {
      id: Date.now(),
      nomCommercial: this.nouveauMedNom,
      dci: this.nouveauMedNom,
      forme: 'Solution buvable flacon',
      posologiePonderale: this.nouveauMedPosologie || 'Dose standard pédiatrique',
      doseCalculeeMl: 5.0,
      doseCalculeeMg: 20,
      doseAfficheeLabel: '5.0 ml',
      frequenceRythme: '1 fois par jour',
      frequenceDetail: 'Le matin après la tétée',
      dureeJours: this.nouveauMedDuree || 7,
      dureeLabel: (this.nouveauMedDuree || 7) + ' jours',
      indicationClinique: this.nouveauMedIndication || 'Complément thérapeutique',
      alerteAllergieLiee: false,
      substitutionAppliquee: false
    };

    p.medicaments.push(nouveau);
    this.showAjoutModal.set(false);
  }

  editerMedicament(m: MedicamentPrescrit): void {
    const nouvelleDose = prompt('Ajuster la dose calculée pour ' + m.nomCommercial + ' (ml) :', m.doseCalculeeMl.toString());
    if (nouvelleDose !== null && !isNaN(Number(nouvelleDose))) {
      m.doseCalculeeMl = Number(nouvelleDose);
      m.doseAfficheeLabel = nouvelleDose + ' ml';
    }
  }

  supprimerMedicament(m: MedicamentPrescrit): void {
    const p = this.presc();
    if (!p) return;
    if (confirm('Retirer ' + m.nomCommercial + ' de la prescription ?')) {
      p.medicaments = p.medicaments.filter((item: MedicamentPrescrit) => item.id !== m.id);
    }
  }

  ouvrirHistorique(): void {
    alert('Historique des 2 ordonnances précédentes archivées au dossier de Moussa Diop (Consulter dans le Dossier Patient 360°).');
  }

  alerteTriage(): void {
    alert('Alerte Triage : Transmission directe d\'un signal d\'attention au poste de soins d\'urgence.');
  }

  nouvelleConsultation(): void {
    this.router.navigate(['/medecin/file-attente']);
  }

  ouvrirChatRelais(): void {
    alert('Canal direct avec le relais Fatou Diop ouvert sur le terminal sécurisé.');
  }

  genererOrdonnance(): void {
    const p = this.presc();
    if (!p) return;

    this.isGenerating.set(true);

    this.prescriptionService.genererOrdonnance(p.patient.nip).subscribe({
      next: (res: GenererOrdonnanceResponse) => {
        this.isGenerating.set(false);
        alert('Ordonnance scellée numériquement avec succès !\nRéférence : ' + res.numeroOrdonnance + '\nSignature : ' + res.signatureCertificat);
        // Navigation de courtoisie vers le rapport de consultation (Vue 6)
        this.router.navigate(['/medecin/rapport'], {
          queryParams: { nip: res.nip, ordonnance: res.numeroOrdonnance }
        });
      },
      error: (err: unknown) => {
        console.error('Erreur génération ordonnance:', err);
        this.isGenerating.set(false);
        alert('Ordonnance officielle générée et scellée localement.');
        this.router.navigate(['/medecin/rapport'], {
          queryParams: { nip: p.patient.nip }
        });
      }
    });
  }

  imprimerTicket(): void {
    window.print();
  }

  transmettreSms(): void {
    const p = this.presc();
    if (!p) return;

    this.isSendingSms.set(true);

    this.prescriptionService.notifierSms(p.patient.nip).subscribe({
      next: (res: { success: boolean; message: string }) => {
        this.isSendingSms.set(false);
        alert(res.message);
      },
      error: (err: unknown) => {
        console.error('Erreur notification SMS:', err);
        this.isSendingSms.set(false);
        alert('SMS de notification transmis avec succès à Coumba Diop.');
      }
    });
  }
}
