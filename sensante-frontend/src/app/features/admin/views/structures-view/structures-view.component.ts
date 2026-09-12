import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AgrementCren,
  StatutStructure,
  StructureFilterCriteria,
  StructureSante,
  StructureStats,
  TypeStructure
} from '../../../../core/models/structure-sante.model';
import { StructureSanteService } from '../../../../core/services/structure-sante.service';
import { StructureDonutChartComponent } from './components/structure-donut-chart.component';
import { StructureMapDrawerComponent } from './components/structure-map-drawer.component';
import { StructureModalComponent } from './components/structure-modal.component';

@Component({
  selector: 'app-structures-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StructureDonutChartComponent,
    StructureMapDrawerComponent,
    StructureModalComponent
  ],
  template: `
    <div class="space-y-5">
      <!-- PAGE TITLE BANNER -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h1 class="text-2xl font-bold text-[#003426] tracking-tight text-balance">
            Référentiel National des Structures de Santé
          </h1>
          <p class="text-xs text-slate-500 mt-0.5 text-pretty">
            Dernier recensement validé MSAS:
            <span class="font-semibold text-slate-700 font-mono">
              {{ stats()?.totalStructures || structures().length }} structures actives
            </span>
            réparties sur les 14 Régions Médicales du Sénégal.
          </p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-xs text-slate-500 font-medium whitespace-nowrap">Cartographie DGPS:</span>
          <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100/70 text-emerald-800 text-[11px] font-semibold rounded whitespace-nowrap">
            <span class="material-symbols-outlined text-xs">check_circle</span>
            {{ stats()?.pourcentageGeolocalisees || 98.4 }}% Géolocalisées
          </span>
        </div>
      </div>

      <!-- TOP METRIC & TELEMETRY SECTION (BENTO GRID) -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <!-- Metric Card 1: Hôpitaux Nationaux & Régionaux -->
        <div class="bg-white p-4 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_0_rgba(15,23,42,0.05)] flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Hôpitaux Nationaux &amp; Régionaux</span>
              <div class="flex items-baseline gap-2 mt-1">
                <span class="text-3xl font-bold text-slate-900 font-mono">{{ stats()?.totalHopitaux || 0 }}</span>
                <span class="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
                  +2 en 2024
                </span>
              </div>
            </div>
            <div class="w-8 h-8 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <span class="material-symbols-outlined text-lg">apartment</span>
            </div>
          </div>
          <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Niveau 1: <strong class="text-slate-700 font-mono">{{ stats()?.hopitauxNiveau1 || 0 }}</strong></span>
            <span>Niveau 2: <strong class="text-slate-700 font-mono">{{ stats()?.hopitauxNiveau2 || 0 }}</strong></span>
            <span>Niveau 3: <strong class="text-slate-700 font-mono">{{ stats()?.hopitauxNiveau3 || 0 }}</strong></span>
          </div>
        </div>

        <!-- Metric Card 2: Centres de Santé (CS) -->
        <div class="bg-white p-4 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_0_rgba(15,23,42,0.05)] flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Centres de Santé (CS)</span>
              <div class="flex items-baseline gap-2 mt-1">
                <span class="text-3xl font-bold text-slate-900 font-mono">{{ stats()?.totalCentresSante || 0 }}</span>
                <span class="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
                  100% Connectés
                </span>
              </div>
            </div>
            <div class="w-8 h-8 rounded bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
              <span class="material-symbols-outlined text-lg">local_hospital</span>
            </div>
          </div>
          <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Urgences 24/7: <strong class="text-slate-700 font-mono">{{ stats()?.centresUrgences247 || 0 }}</strong></span>
            <span>Blocs opératoires: <strong class="text-slate-700 font-mono">{{ stats()?.centresBlocOperatoire || 0 }}</strong></span>
          </div>
        </div>

        <!-- Metric Card 3: Postes de Santé (PS) -->
        <div class="bg-white p-4 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_0_rgba(15,23,42,0.05)] flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Postes de Santé &amp; Dispensaires</span>
              <div class="flex items-baseline gap-2 mt-1">
                <span class="text-3xl font-bold text-slate-900 font-mono">{{ stats()?.totalPostesSante || 0 }}</span>
                <span class="text-[11px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 whitespace-nowrap">
                  {{ stats()?.postesSousSurveillance || 0 }} en révision
                </span>
              </div>
            </div>
            <div class="w-8 h-8 rounded bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <span class="material-symbols-outlined text-lg">home_health</span>
            </div>
          </div>
          <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Secteur Rural: <strong class="text-slate-700 font-mono">{{ stats()?.postesRural || 0 }}</strong></span>
            <span>Urbain: <strong class="text-slate-700 font-mono">{{ stats()?.postesUrbain || 0 }}</strong></span>
          </div>
        </div>

        <!-- Metric Card 4: Donut Chart - Répartition Typologique (Chart.js) -->
        <app-structure-donut-chart [stats]="stats()"></app-structure-donut-chart>
      </div>

      <!-- HIERARCHICAL GEOGRAPHICAL FILTER BAR -->
      <section class="bg-white p-3.5 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_0_rgba(15,23,42,0.05)]">
        <div class="flex flex-wrap items-center gap-2.5">
          <div class="flex items-center gap-1 text-xs font-semibold text-slate-700 mr-1">
            <span class="material-symbols-outlined text-base text-[#003426]">filter_alt</span>
            <span>Filtres</span>
          </div>

          <!-- Region Filter -->
          <div class="min-w-[140px]">
            <select
              [(ngModel)]="filterCriteria.region"
              (change)="onFilterChange()"
              class="w-full h-[34px] px-2.5 text-xs bg-white border border-slate-300 rounded focus:border-[#0f4c3a] text-slate-800 outline-none"
            >
              <option value="Toutes les Régions (14)">Toutes les Régions (14)</option>
              <option value="Dakar">Dakar</option>
              <option value="Thiès">Thiès</option>
              <option value="Saint-Louis">Saint-Louis</option>
              <option value="Kaolack">Kaolack</option>
              <option value="Diourbel">Diourbel</option>
              <option value="Ziguinchor">Ziguinchor</option>
              <option value="Tambacounda">Tambacounda</option>
              <option value="Kédougou">Kédougou</option>
              <option value="Fatick">Fatick</option>
              <option value="Kolda">Kolda</option>
              <option value="Louga">Louga</option>
              <option value="Matam">Matam</option>
              <option value="Sédhiou">Sédhiou</option>
              <option value="Kaffrine">Kaffrine</option>
            </select>
          </div>

          <!-- District Filter -->
          <div class="min-w-[140px]">
            <select
              [(ngModel)]="filterCriteria.district"
              (change)="onFilterChange()"
              class="w-full h-[34px] px-2.5 text-xs bg-white border border-slate-300 rounded focus:border-[#0f4c3a] text-slate-800 outline-none"
            >
              <option value="Tous les Districts (79)">Tous les Districts (79)</option>
              <option value="Dakar Centre">Dakar Centre</option>
              <option value="Dakar Ouest">Dakar Ouest</option>
              <option value="Dakar Nord">Dakar Nord</option>
              <option value="Pikine">Pikine</option>
              <option value="Thiès Ville">Thiès Ville</option>
              <option value="Mbour">Mbour</option>
              <option value="Touba">Touba</option>
              <option value="Saint-Louis">Saint-Louis</option>
              <option value="Salémata">Salémata</option>
              <option value="Bignona">Bignona</option>
            </select>
          </div>

          <!-- Type Filter -->
          <div class="min-w-[130px]">
            <select
              [(ngModel)]="filterCriteria.type"
              (change)="onFilterChange()"
              class="w-full h-[34px] px-2.5 text-xs bg-white border border-slate-300 rounded focus:border-[#0f4c3a] text-slate-800 outline-none"
            >
              <option value="Tous les Types">Tous les Types</option>
              <option [value]="TypeStructure.HOPITAL_NATIONAL">Hôpital National (Niv. 3)</option>
              <option [value]="TypeStructure.HOPITAL_REGIONAL">Hôpital Régional (Niv. 2)</option>
              <option [value]="TypeStructure.CENTRE_DE_SANTE">Centre de Santé (CS)</option>
              <option [value]="TypeStructure.POSTE_DE_SANTE">Poste de Santé (PS)</option>
              <option [value]="TypeStructure.DISPENSAIRE">Dispensaire</option>
            </select>
          </div>

          <!-- Agrément CREN Filter -->
          <div class="min-w-[125px]">
            <select
              [(ngModel)]="filterCriteria.cren"
              (change)="onFilterChange()"
              class="w-full h-[34px] px-2.5 text-xs bg-white border border-slate-300 rounded focus:border-[#0f4c3a] text-slate-800 outline-none"
            >
              <option value="Agréments CREN">Agréments CREN</option>
              <option [value]="AgrementCren.CRENI">CRENI (Intensif)</option>
              <option [value]="AgrementCren.CRENAS">CRENAS (Ambulatoire)</option>
              <option [value]="AgrementCren.CRENAM">CRENAM (Modéré)</option>
              <option [value]="AgrementCren.AUCUN">Sans unité CREN</option>
            </select>
          </div>

          <!-- Statut de fonctionnement -->
          <div class="min-w-[120px]">
            <select
              [(ngModel)]="filterCriteria.statut"
              (change)="onFilterChange()"
              class="w-full h-[34px] px-2.5 text-xs bg-white border border-slate-300 rounded focus:border-[#0f4c3a] text-slate-800 outline-none"
            >
              <option value="Tous Statuts">Tous Statuts</option>
              <option [value]="StatutStructure.OPERATIONNEL">Opérationnel</option>
              <option [value]="StatutStructure.SOUS_SURVEILLANCE">Sous surveillance</option>
              <option [value]="StatutStructure.FERMETURE_TEMPORAIRE">Fermeture temporaire</option>
            </select>
          </div>

          <!-- Reset Filter Button -->
          <button
            type="button"
            class="h-[34px] px-2 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors whitespace-nowrap"
            (click)="resetFilters()"
          >
            <span class="material-symbols-outlined text-sm">refresh</span>
            <span>Réinitialiser</span>
          </button>

          <!-- PROMINENT GIS MAP FILTER TRIGGER BUTTON -->
          <div class="ml-auto flex items-center gap-2">
            <button
              type="button"
              class="h-[36px] px-3.5 bg-[#166b53] hover:bg-[#003426] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm border border-[#a4f2d4]/30 hover:border-[#a4f2d4] transition-all ring-2 ring-[#166b53]/20 whitespace-nowrap"
              (click)="openMapDrawer()"
            >
              <span class="material-symbols-outlined text-base text-[#a4f2d4]">map</span>
              <span class="font-bold">Filtrer par Carte SIG</span>
              <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/20 text-white">
                Afficher {{ filteredStructures().length }} sur la carte
              </span>
              <span class="material-symbols-outlined text-sm opacity-70">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ADMINISTRATIVE DATA TABLE SECTION -->
      <section class="bg-white rounded-lg border border-slate-200/80 shadow-[0_1px_2px_0_rgba(15,23,42,0.05)] overflow-hidden">
        <!-- Table Control Strip -->
        <div class="px-4 py-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-slate-700 whitespace-nowrap">Registre National DGPS</span>
            <span class="text-[11px] text-slate-500 whitespace-nowrap">• {{ paginatedStructures().length }} structures listées ci-dessous</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5 text-xs text-slate-600">
              <label class="text-[11px] whitespace-nowrap" for="per-page">Lignes par page:</label>
              <select
                [(ngModel)]="pageSize"
                (change)="currentPage = 1"
                class="h-6 px-1.5 text-xs bg-white border border-slate-300 rounded text-slate-700 py-0"
                id="per-page"
              >
                <option [ngValue]="8">8</option>
                <option [ngValue]="25">25</option>
                <option [ngValue]="50">50</option>
                <option [ngValue]="100">100</option>
              </select>
            </div>
            <button
              type="button"
              class="text-slate-400 hover:text-slate-700 p-1"
              title="Exporter les lignes affichées en CSV"
              (click)="exportCSV()"
            >
              <span class="material-symbols-outlined text-base">download</span>
            </button>
          </div>
        </div>

        <!-- 4 ÉTATS UI : LOADING, ERROR, EMPTY, SUCCESS -->
        @if (loading()) {
          <!-- ÉTAT 1 : LOADING (Skeletons animés) -->
          <div class="p-6 space-y-3">
            @for (i of [1,2,3,4,5]; track i) {
              <div class="h-10 bg-slate-100 rounded animate-pulse w-full"></div>
            }
          </div>
        } @else if (error()) {
          <!-- ÉTAT 2 : ERROR -->
          <div class="p-8 text-center space-y-3">
            <span class="material-symbols-outlined text-3xl text-red-500">error_outline</span>
            <p class="text-xs text-red-600 font-semibold">{{ error() }}</p>
            <button
              type="button"
              (click)="loadData()"
              class="px-3 py-1.5 bg-[#0f4c3a] text-white rounded text-xs font-semibold whitespace-nowrap hover:bg-[#166b53] transition-colors"
            >
              Réessayer la synchronisation
            </button>
          </div>
        } @else if (filteredStructures().length === 0) {
          <!-- ÉTAT 3 : EMPTY STATE -->
          <div class="p-10 text-center space-y-3">
            <div class="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <span class="material-symbols-outlined text-2xl">domain_disabled</span>
            </div>
            <h3 class="text-sm font-semibold text-slate-800">Aucune structure sanitaire trouvée</h3>
            <p class="text-xs text-slate-500 max-w-sm mx-auto text-pretty">
              Aucune structure ne correspond aux critères de filtre sélectionnés. Essayez de réinitialiser vos filtres.
            </p>
            <div class="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                (click)="resetFilters()"
                class="px-3 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap"
              >
                Réinitialiser les filtres
              </button>
              <button
                type="button"
                (click)="openCreateModal()"
                class="px-3 py-1.5 bg-[#0f4c3a] text-white rounded text-xs font-semibold whitespace-nowrap hover:bg-[#166b53]"
              >
                Ajouter une structure
              </button>
            </div>
          </div>
        } @else {
          <!-- ÉTAT 4 : SUCCESS TABLE -->
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/80 text-[11px] font-semibold text-slate-500 tracking-wider uppercase border-b border-slate-200">
                  <th class="py-2.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      [checked]="isAllSelected"
                      (change)="toggleSelectAll()"
                      class="rounded border-slate-300 text-[#0f4c3a] focus:ring-0"
                    />
                  </th>
                  <th class="py-2.5 px-3 whitespace-nowrap">Code National</th>
                  <th class="py-2.5 px-3 whitespace-nowrap">Nom de la Structure</th>
                  <th class="py-2.5 px-3 whitespace-nowrap">Type Établissement</th>
                  <th class="py-2.5 px-3 whitespace-nowrap">Région / District</th>
                  <th class="py-2.5 px-3 whitespace-nowrap">Coordonnées GPS</th>
                  <th class="py-2.5 px-3 whitespace-nowrap">Agrément CREN</th>
                  <th class="py-2.5 px-3 text-right whitespace-nowrap">Capacité Lits</th>
                  <th class="py-2.5 px-3 text-center whitespace-nowrap">Statut</th>
                  <th class="py-2.5 px-3 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
                @for (s of paginatedStructures(); track s.id) {
                  <tr
                    class="hover:bg-slate-50/80 transition-colors"
                    [ngClass]="{ 'bg-amber-50/30': s.statut === StatutStructure.SOUS_SURVEILLANCE }"
                  >
                    <td class="py-2 px-3 text-center">
                      <input
                        type="checkbox"
                        [checked]="selectedIds.has(s.id)"
                        (change)="toggleSelectRow(s.id)"
                        class="rounded border-slate-300 text-[#0f4c3a] focus:ring-0"
                      />
                    </td>
                    <td class="py-2 px-3 font-mono font-semibold text-[#003426] whitespace-nowrap">
                      {{ s.codeNational }}
                    </td>
                    <td class="py-2 px-3">
                      <div class="font-semibold text-slate-900 truncate max-w-xs">{{ s.nom }}</div>
                      <div class="text-[10px] text-slate-400 truncate">
                        {{ s.responsable || 'Direction Médicale' }} • {{ s.telephone || 'Non renseigné' }}
                      </div>
                    </td>
                    <td class="py-2 px-3 whitespace-nowrap">
                      <span
                        class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border"
                        [ngClass]="getTypeBadgeClass(s.type)"
                      >
                        {{ formatTypeLabel(s.type) }}
                      </span>
                    </td>
                    <td class="py-2 px-3 whitespace-nowrap">
                      <div class="font-medium text-slate-800">{{ s.region }}</div>
                      <div class="text-[11px] text-slate-500">{{ s.district || s.commune || 'Centre' }}</div>
                    </td>
                    <td class="py-2 px-3 font-mono whitespace-nowrap">
                      @if (s.latitude && s.longitude) {
                        <div class="flex items-center gap-1 text-[11px] text-slate-600">
                          <span class="material-symbols-outlined text-xs text-emerald-600">location_on</span>
                          <span>{{ s.latitude }}° N, {{ s.longitude }}° W</span>
                        </div>
                        <span class="text-[10px] text-emerald-700 font-medium">Validé DGPS</span>
                      } @else {
                        <span class="text-[10px] text-amber-700 font-medium">En attente DGPS</span>
                      }
                    </td>
                    <td class="py-2 px-3 whitespace-nowrap">
                      <span
                        class="px-2 py-0.5 rounded text-[10px] font-bold border"
                        [ngClass]="getCrenBadgeClass(s.agrementCren)"
                      >
                        {{ formatCrenLabel(s.agrementCren) }}
                      </span>
                    </td>
                    <td class="py-2 px-3 text-right font-mono font-semibold text-slate-900 whitespace-nowrap">
                      {{ s.capaciteLits }} lits
                    </td>
                    <td class="py-2 px-3 text-center whitespace-nowrap">
                      @if (s.statut === StatutStructure.OPERATIONNEL) {
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Opérationnel
                        </span>
                      } @else if (s.statut === StatutStructure.SOUS_SURVEILLANCE) {
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Sous surveillance
                        </span>
                      } @else {
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-800 border border-red-200">
                          <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span> Fermeture
                        </span>
                      }
                    </td>
                    <td class="py-2 px-3 text-right whitespace-nowrap">
                      <div class="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          class="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                          (click)="inspectOnMap(s)"
                          title="Localiser sur la carte SIG"
                        >
                          <span class="material-symbols-outlined text-base text-[#003426]">pin_drop</span>
                        </button>
                        <button
                          type="button"
                          class="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                          (click)="editStructure(s)"
                          title="Modifier la structure"
                        >
                          <span class="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          type="button"
                          class="p-1 hover:bg-red-100 hover:text-red-700 rounded text-slate-400 transition-colors"
                          (click)="deleteStructure(s)"
                          title="Supprimer"
                        >
                          <span class="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- PAGINATION STRIP -->
          <div class="px-4 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div>
              Affichage de
              <span class="font-semibold text-slate-900 font-mono">{{ startIndex + 1 }} à {{ endIndex }}</span>
              sur
              <span class="font-semibold text-slate-900 font-mono">{{ filteredStructures().length }}</span>
              structures
            </div>
            <div class="flex items-center gap-1">
              <button
                type="button"
                class="px-2.5 py-1.5 rounded border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center whitespace-nowrap"
                [disabled]="currentPage === 1"
                (click)="prevPage()"
              >
                <span class="material-symbols-outlined text-sm">chevron_left</span>
                <span class="ml-1">Précédent</span>
              </button>

              @for (page of visiblePages(); track page) {
                <button
                  type="button"
                  class="px-2.5 py-1 rounded font-semibold font-mono text-xs transition-colors"
                  [ngClass]="page === currentPage ? 'bg-[#0f4c3a] text-white' : 'hover:bg-slate-100 text-slate-700'"
                  (click)="goToPage(page)"
                >
                  {{ page }}
                </button>
              }

              <button
                type="button"
                class="px-2.5 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center whitespace-nowrap"
                [disabled]="currentPage >= totalPages()"
                (click)="nextPage()"
              >
                <span class="mr-1">Suivant</span>
                <span class="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        }
      </section>

      <!-- DRAWER SIG CARTOGRAPHIQUE -->
      <app-structure-map-drawer
        [isOpen]="isMapDrawerOpen"
        [structures]="filteredStructures()"
        [selectedStructure]="selectedStructureForMap"
        (close)="isMapDrawerOpen = false"
        (structureSelected)="onMapStructureSelected($event)"
        (filterApplied)="onMapFilterApplied($event)"
      ></app-structure-map-drawer>

      <!-- MODAL NOUVELLE STRUCTURE / ÉDITION -->
      <app-structure-modal
        [isOpen]="isModalOpen"
        [structureToEdit]="structureToEdit"
        (close)="isModalOpen = false; structureToEdit = null"
        (saved)="onStructureSaved($event)"
      ></app-structure-modal>
    </div>
  `
})
export class StructuresViewComponent implements OnInit {
  private readonly structureService = inject(StructureSanteService);

  readonly TypeStructure = TypeStructure;
  readonly StatutStructure = StatutStructure;
  readonly AgrementCren = AgrementCren;

  structures = signal<StructureSante[]>([]);
  stats = signal<StructureStats | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  filterCriteria: StructureFilterCriteria = {
    region: 'Toutes les Régions (14)',
    district: 'Tous les Districts (79)',
    type: 'Tous les Types',
    cren: 'Agréments CREN',
    statut: 'Tous Statuts',
    query: ''
  };

  selectedIds = new Set<number>();
  pageSize = 8;
  currentPage = 1;

  isMapDrawerOpen = false;
  isModalOpen = false;
  selectedStructureForMap: StructureSante | null = null;
  structureToEdit: StructureSante | null = null;

  filteredStructures = computed(() => {
    let list = this.structures();
    const c = this.filterCriteria;

    if (c.region && c.region !== 'Toutes les Régions (14)') {
      list = list.filter((s) => s.region.toLowerCase().includes(c.region!.toLowerCase()));
    }
    if (c.district && c.district !== 'Tous les Districts (79)') {
      list = list.filter((s) => s.district?.toLowerCase().includes(c.district!.toLowerCase()));
    }
    if (c.type && c.type !== 'Tous les Types') {
      list = list.filter((s) => s.type === c.type);
    }
    if (c.statut && c.statut !== 'Tous Statuts') {
      list = list.filter((s) => s.statut === c.statut);
    }
    if (c.cren && c.cren !== 'Agréments CREN') {
      list = list.filter((s) => s.agrementCren === c.cren);
    }
    if (c.query && c.query.trim()) {
      const q = c.query.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.nom.toLowerCase().includes(q) ||
          s.codeNational.toLowerCase().includes(q) ||
          s.region.toLowerCase().includes(q) ||
          (s.district && s.district.toLowerCase().includes(q))
      );
    }

    return list;
  });

  totalPages = computed(() => Math.ceil(this.filteredStructures().length / this.pageSize) || 1);

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.filteredStructures().length);
  }

  paginatedStructures = computed(() => {
    return this.filteredStructures().slice(this.startIndex, this.endIndex);
  });

  get isAllSelected(): boolean {
    const list = this.paginatedStructures();
    return list.length > 0 && list.every((s) => this.selectedIds.has(s.id));
  }

  visiblePages = computed(() => {
    const total = this.totalPages();
    const curr = this.currentPage;
    const pages: number[] = [];
    for (let i = Math.max(1, curr - 2); i <= Math.min(total, curr + 2); i++) {
      pages.push(i);
    }
    return pages;
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.error.set(null);

    this.structureService.getStructures().subscribe({
      next: (data: StructureSante[]) => {
        this.structures.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.loading.set(false);
        this.error.set('Impossible de charger les structures de santé depuis le serveur.');
      }
    });

    this.structureService.getStats().subscribe({
      next: (s: StructureStats) => this.stats.set(s),
      error: () => console.warn('Télémétrie indisponible.')
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
  }

  resetFilters(): void {
    this.filterCriteria = {
      region: 'Toutes les Régions (14)',
      district: 'Tous les Districts (79)',
      type: 'Tous les Types',
      cren: 'Agréments CREN',
      statut: 'Tous Statuts',
      query: ''
    };
    this.currentPage = 1;
  }

  toggleSelectAll(): void {
    const allSelected = this.isAllSelected;
    const pageItems = this.paginatedStructures();
    if (allSelected) {
      pageItems.forEach((s) => this.selectedIds.delete(s.id));
    } else {
      pageItems.forEach((s) => this.selectedIds.add(s.id));
    }
  }

  toggleSelectRow(id: number): void {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) this.currentPage++;
  }

  goToPage(p: number): void {
    this.currentPage = p;
  }

  openMapDrawer(): void {
    this.isMapDrawerOpen = true;
  }

  openCreateModal(): void {
    this.structureToEdit = null;
    this.isModalOpen = true;
  }

  editStructure(s: StructureSante): void {
    this.structureToEdit = s;
    this.isModalOpen = true;
  }

  deleteStructure(s: StructureSante): void {
    if (confirm(`Confirmez-vous la suppression de ${s.nom} (${s.codeNational}) ?`)) {
      this.structureService.deleteStructure(s.id).subscribe({
        next: () => {
          this.structures.update((list) => list.filter((item) => item.id !== s.id));
          this.loadData();
        },
        error: () => alert('Erreur lors de la suppression.')
      });
    }
  }

  inspectOnMap(s: StructureSante): void {
    this.selectedStructureForMap = s;
    this.isMapDrawerOpen = true;
  }

  onMapStructureSelected(s: StructureSante): void {
    this.selectedStructureForMap = s;
  }

  onMapFilterApplied(filtered: StructureSante[]): void {
    this.structures.set(filtered);
    this.currentPage = 1;
  }

  onStructureSaved(saved: StructureSante): void {
    this.loadData();
  }

  exportCSV(): void {
    const list = this.filteredStructures();
    let csv = 'CodeNational,Nom,Type,Statut,Region,District,CapaciteLits,AgrementCREN,Latitude,Longitude\n';
    list.forEach((s) => {
      csv += `"${s.codeNational}","${s.nom}","${s.type}","${s.statut}","${s.region}","${s.district || ''}",${s.capaciteLits},"${s.agrementCren || ''}",${s.latitude || ''},${s.longitude || ''}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SenSante_Structures_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  getTypeBadgeClass(type: TypeStructure): string {
    switch (type) {
      case TypeStructure.HOPITAL_NATIONAL:
      case TypeStructure.HOPITAL_REGIONAL:
      case TypeStructure.HOPITAL:
        return 'bg-emerald-100/60 text-emerald-800 border-emerald-200';
      case TypeStructure.CENTRE_DE_SANTE:
        return 'bg-teal-100/70 text-teal-800 border-teal-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }

  formatTypeLabel(type: TypeStructure): string {
    switch (type) {
      case TypeStructure.HOPITAL_NATIONAL:
        return 'Hôpital National (Niv. 3)';
      case TypeStructure.HOPITAL_REGIONAL:
        return 'Hôpital Régional (Niv. 2)';
      case TypeStructure.HOPITAL:
        return 'Hôpital';
      case TypeStructure.CENTRE_DE_SANTE:
        return 'Centre de Santé';
      case TypeStructure.POSTE_DE_SANTE:
        return 'Poste de Santé';
      case TypeStructure.DISPENSAIRE:
        return 'Dispensaire';
      case TypeStructure.CREN_AUTONOME:
        return 'CREN Autonome';
      default:
        return type;
    }
  }

  getCrenBadgeClass(cren?: AgrementCren): string {
    switch (cren) {
      case AgrementCren.CRENI:
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case AgrementCren.CRENAS:
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case AgrementCren.CRENAM:
        return 'bg-teal-100 text-teal-900 border-teal-300';
      default:
        return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  }

  formatCrenLabel(cren?: AgrementCren): string {
    switch (cren) {
      case AgrementCren.CRENI:
        return 'CRENI (Intensif)';
      case AgrementCren.CRENAS:
        return 'CRENAS (Ambul.)';
      case AgrementCren.CRENAM:
        return 'CRENAM (Modéré)';
      default:
        return 'Aucun';
    }
  }
}
