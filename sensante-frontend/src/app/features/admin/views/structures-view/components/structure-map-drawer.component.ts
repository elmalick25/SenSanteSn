import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StructureSante } from '../../../../../core/models/structure-sante.model';

@Component({
  selector: 'app-structure-map-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- BACKDROP -->
    <div
      class="fixed inset-0 bg-slate-900/40 z-40 transition-opacity duration-300 backdrop-blur-[1px]"
      [class.opacity-0]="!isOpen"
      [class.pointer-events-none]="!isOpen"
      (click)="close.emit()"
    ></div>

    <!-- FLYOUT / DRAWER CARTOGRAPHIQUE (520PX) -->
    <aside
      class="fixed top-0 right-0 z-50 h-full w-[520px] max-w-[95vw] bg-white shadow-2xl border-l border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col"
      [class.translate-x-full]="!isOpen"
      [class.translate-x-0]="isOpen"
    >
      <!-- Drawer Header -->
      <div class="px-5 py-3.5 bg-[#003426] text-white flex items-center justify-between border-b border-[#0f4c3a]">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
            <span class="material-symbols-outlined text-[#a4f2d4] text-lg">travel_explore</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="font-bold text-sm text-white tracking-tight">Inspection Spatiale &amp; SIG National</h2>
              <span class="px-1.5 py-0.2 rounded bg-emerald-400/20 text-[#a4f2d4] text-[10px] font-semibold border border-[#a4f2d4]/30 font-mono">Live DGPS</span>
            </div>
            <p class="text-[11px] text-emerald-200/80">Couverture territoriale, isochrones &amp; géofencing sanitaire</p>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <button
            type="button"
            class="text-white/70 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
            title="Agrandir en plein écran"
            (click)="toggleFullscreen()"
          >
            <span class="material-symbols-outlined text-lg">{{ isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}</span>
          </button>
          <button
            type="button"
            class="text-white/70 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
            title="Fermer le tiroir"
            (click)="close.emit()"
          >
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
      </div>

      <!-- Geographic Selection & Buffer Toolbar -->
      <div class="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-col gap-2">
        <div class="flex items-center justify-between text-xs">
          <span class="font-semibold text-slate-700 flex items-center gap-1">
            <span class="material-symbols-outlined text-sm text-[#003426]">near_me</span>
            Outil de Sélection Géographique
          </span>
          <span class="text-[11px] text-slate-500 font-mono">Centre: {{ activeCenterName }}</span>
        </div>

        <!-- Geo Tools Controls -->
        <div class="grid grid-cols-3 gap-2 text-xs">
          <!-- Rayon / Buffer -->
          <div class="flex flex-col">
            <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Rayon d'action</label>
            <select
              [(ngModel)]="selectedRadius"
              class="h-7 text-xs bg-white border border-slate-300 rounded px-1.5 text-slate-800 font-mono focus:border-[#0f4c3a] focus:ring-1 focus:ring-[#0f4c3a] outline-none"
            >
              <option value="5">Rayon 5 km</option>
              <option value="10">Rayon 10 km</option>
              <option value="25">Rayon 25 km</option>
              <option value="50">Rayon 50 km</option>
              <option value="30m">Isochrone 30 min</option>
            </select>
          </div>

          <!-- Zone Couverture -->
          <div class="flex flex-col">
            <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Couverture Sanitaire</label>
            <select
              [(ngModel)]="selectedBassin"
              class="h-7 text-xs bg-white border border-slate-300 rounded px-1.5 text-slate-800 focus:border-[#0f4c3a] focus:ring-1 focus:ring-[#0f4c3a] outline-none"
            >
              <option value="all">Tous les bassins</option>
              <option value="low">Bassin &lt; 5 000 hab.</option>
              <option value="high">Bassin &gt; 15 000 hab.</option>
              <option value="shadow">Zone d'Ombre (Déficit)</option>
            </select>
          </div>

          <!-- Calques SIG -->
          <div class="flex flex-col">
            <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Tracés &amp; Limites</label>
            <select
              [(ngModel)]="selectedLayer"
              class="h-7 text-xs bg-white border border-slate-300 rounded px-1.5 text-slate-800 focus:border-[#0f4c3a] focus:ring-1 focus:ring-[#0f4c3a] outline-none"
            >
              <option value="districts">Tracé Districts (79)</option>
              <option value="regions">Limites Régions (14)</option>
              <option value="postes">Postes Ruraux</option>
              <option value="routes">Réseau Routier Prioritaire</option>
            </select>
          </div>
        </div>

        <!-- Active Filter Badges inside Drawer -->
        <div class="flex items-center gap-1.5 flex-wrap pt-1 text-[10px]">
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {{ structures.length }} Structures actives
          </span>
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 font-mono">
            Rayon: {{ selectedRadius }}km • Actif
          </span>
          <button
            type="button"
            class="ml-auto text-[10px] text-[#003426] hover:underline font-semibold flex items-center gap-0.5"
            (click)="resetMapView()"
          >
            <span class="material-symbols-outlined text-xs">layers</span> Calques SIG (4)
          </button>
        </div>
      </div>

      <!-- Interactive SVG / Vector Map Container -->
      <div class="relative flex-1 bg-slate-100 overflow-hidden flex flex-col">
        <div class="relative w-full h-full min-h-[300px] bg-[#e6ebed] overflow-hidden select-none">
          <svg class="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern-drawer" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#d5dee2" stroke-width="0.75" />
              </pattern>
              <radialGradient id="bufferGlowDrawer" cx="48%" cy="52%" r="45%">
                <stop offset="0%" stop-color="#10B981" stop-opacity="0.25" />
                <stop offset="60%" stop-color="#0F4C3A" stop-opacity="0.12" />
                <stop offset="100%" stop-color="#0F4C3A" stop-opacity="0" />
              </radialGradient>
            </defs>

            <!-- Base grid -->
            <rect width="100%" height="100%" fill="#edf3f5" />
            <rect width="100%" height="100%" fill="url(#grid-pattern-drawer)" />

            <!-- Coastline & Geography of Senegal / Dakar peninsula -->
            <path
              d="M 0,0 L 160,0 Q 210,80 230,170 T 160,250 Q 80,310 110,390 T 260,430 L 520,430 L 520,0 Z"
              fill="#f8fafc"
              stroke="#cbd5e1"
              stroke-width="1.5"
            />
            <path
              d="M 120,220 Q 90,240 70,255 Q 60,270 85,275 Q 120,280 150,260 Z"
              fill="#e2e8f0"
              stroke="#cbd5e1"
              stroke-width="1"
            />

            <!-- Ocean Label -->
            <text x="35" y="120" fill="#94a3b8" font-family="Inter" font-size="11" letter-spacing="3" transform="rotate(-30 35 120)">
              OCÉAN ATLANTIQUE
            </text>

            <!-- District Boundaries -->
            <path d="M 230,170 Q 280,210 320,180 T 420,240 T 520,200" fill="none" stroke="#0F4C3A" stroke-dasharray="3,3" stroke-width="1.5" opacity="0.6" />
            <path d="M 160,250 Q 240,290 310,300 T 450,340" fill="none" stroke="#0F4C3A" stroke-dasharray="3,3" stroke-width="1.5" opacity="0.6" />
            <path d="M 260,430 Q 320,380 400,390" fill="none" stroke="#0F4C3A" stroke-dasharray="3,3" stroke-width="1.5" opacity="0.6" />

            <!-- District Names -->
            <text x="180" y="195" fill="#475569" font-family="Inter" font-size="9" font-weight="600">DAKAR NORD</text>
            <text x="145" y="270" fill="#475569" font-family="Inter" font-size="9" font-weight="600">DAKAR CENTRE</text>
            <text x="260" y="250" fill="#475569" font-family="Inter" font-size="9" font-weight="600">PIKINE - GUÉDIAWAYE</text>
            <text x="360" y="280" fill="#475569" font-family="Inter" font-size="9" font-weight="600">RUFISQUE</text>
            <text x="380" y="170" fill="#475569" font-family="Inter" font-size="9" font-weight="600">THIÈS OUEST</text>

            <!-- Buffer Radius Circle -->
            <circle
              [attr.cx]="centerCoordinates.x"
              [attr.cy]="centerCoordinates.y"
              [attr.r]="radiusPixelSize"
              fill="url(#bufferGlowDrawer)"
              stroke="#0F4C3A"
              stroke-dasharray="4,4"
              stroke-width="1.5"
            />
            <line
              [attr.x1]="centerCoordinates.x"
              [attr.y1]="centerCoordinates.y"
              [attr.x2]="centerCoordinates.x + radiusPixelSize"
              [attr.y2]="centerCoordinates.y"
              stroke="#0F4C3A"
              stroke-width="1.5"
            />
            <rect [attr.x]="centerCoordinates.x + 25" [attr.y]="centerCoordinates.y - 12" width="60" height="18" rx="3" fill="#003426" />
            <text
              [attr.x]="centerCoordinates.x + 55"
              [attr.y]="centerCoordinates.y"
              fill="#ffffff"
              font-family="Inter"
              font-size="9"
              font-weight="bold"
              text-anchor="middle"
            >
              R = {{ selectedRadius }} KM
            </text>
          </svg>

          <!-- Interactive Facility Markers based on real data -->
          @for (item of mappedStructures; track item.structure.id) {
            <div
              class="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-200"
              [style.left.px]="item.x"
              [style.top.px]="item.y"
              (click)="selectStructure(item.structure)"
            >
              <div class="relative flex items-center justify-center">
                @if (selectedStructure?.id === item.structure.id) {
                  <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-500 opacity-50"></span>
                }
                <div
                  class="w-6 h-6 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white z-10"
                  [ngClass]="getMarkerColor(item.structure)"
                >
                  <span class="material-symbols-outlined text-[13px] text-white">
                    {{ getMarkerIcon(item.structure) }}
                  </span>
                </div>
                <span class="absolute -bottom-4 bg-slate-900/90 text-white font-mono font-bold text-[8px] px-1 rounded whitespace-nowrap shadow">
                  {{ item.structure.codeNational }}
                </span>
              </div>

              <!-- Tooltip on hover -->
              <div class="absolute bottom-7 left-1/2 -translate-x-1/2 hidden group-hover:block z-30 w-48 p-2.5 bg-slate-900 text-white rounded-md shadow-xl text-[10px] pointer-events-none">
                <div class="font-bold text-[#a4f2d4] truncate">{{ item.structure.nom }}</div>
                <div class="text-slate-300 mt-0.5">{{ item.structure.capaciteLits }} lits • {{ item.structure.agrementCren }}</div>
                <div class="text-[9px] text-emerald-300 font-mono mt-1">
                  {{ item.structure.latitude }}° N, {{ item.structure.longitude }}° W
                </div>
              </div>
            </div>
          }

          <!-- Floating Map Controls -->
          <div class="absolute top-3 right-3 flex flex-col gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-md shadow-md border border-slate-200 text-slate-700 z-20">
            <button
              type="button"
              class="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded text-slate-800"
              title="Zoom avant"
              (click)="zoomIn()"
            >
              <span class="material-symbols-outlined text-base">add</span>
            </button>
            <div class="h-px bg-slate-200"></div>
            <button
              type="button"
              class="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded text-slate-800"
              title="Zoom arrière"
              (click)="zoomOut()"
            >
              <span class="material-symbols-outlined text-base">remove</span>
            </button>
            <div class="h-px bg-slate-200"></div>
            <button
              type="button"
              class="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded text-slate-800"
              title="Recentrer sur le Sénégal"
              (click)="resetMapView()"
            >
              <span class="material-symbols-outlined text-sm">crop_free</span>
            </button>
          </div>

          <!-- Floating Map Legend Overlay -->
          <div class="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-lg shadow-md border border-slate-200 text-[10px] space-y-1 max-w-[210px] z-20">
            <div class="font-bold text-slate-800 text-[11px] mb-1 flex items-center justify-between">
              <span>Légende Cartographique</span>
              <span class="material-symbols-outlined text-xs text-slate-400">info</span>
            </div>
            <div class="flex items-center gap-1.5 text-slate-700">
              <span class="w-2.5 h-2.5 rounded-full bg-[#003426] ring-1 ring-slate-400"></span> Hôpital National / Rég.
            </div>
            <div class="flex items-center gap-1.5 text-slate-700">
              <span class="w-2.5 h-2.5 rounded-full bg-teal-600 ring-1 ring-slate-400"></span> Centre de Santé (CS)
            </div>
            <div class="flex items-center gap-1.5 text-slate-700">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-700 ring-1 ring-slate-400"></span> Poste de Santé (PS)
            </div>
            <div class="flex items-center gap-1.5 text-slate-700 pt-0.5 border-t border-slate-200">
              <span class="w-4 h-0.5 border-t-2 border-dashed border-emerald-600"></span> Tracé Périmètre ({{ selectedRadius }}km)
            </div>
          </div>
        </div>

        <!-- Live Inspector Details Card -->
        <div class="p-3.5 bg-white border-t border-slate-200 overflow-y-auto max-h-56">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-900 flex items-center gap-1">
              <span class="material-symbols-outlined text-sm text-[#003426]">hub</span>
              Périmètre Analysé : {{ activeCenterName }} ({{ selectedRadius }}km)
            </span>
            <span class="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              {{ structuresInRadius.length }} structures captées
            </span>
          </div>

          <!-- Quick stats inside polygon -->
          <div class="grid grid-cols-3 gap-2 text-center text-xs mb-3">
            <div class="p-1.5 bg-slate-50 rounded border border-slate-200">
              <div class="text-[10px] text-slate-500 uppercase">Capacité</div>
              <div class="font-bold text-slate-800 font-mono">{{ totalBedsInRadius }} lits</div>
            </div>
            <div class="p-1.5 bg-slate-50 rounded border border-slate-200">
              <div class="text-[10px] text-slate-500 uppercase">Pôles CREN</div>
              <div class="font-bold text-amber-700 font-mono">{{ crenCountInRadius }} Agréés</div>
            </div>
            <div class="p-1.5 bg-slate-50 rounded border border-slate-200">
              <div class="text-[10px] text-slate-500 uppercase">Couverture</div>
              <div class="font-bold text-emerald-700 font-mono">94.2% Hab.</div>
            </div>
          </div>

          <!-- Quick Inspection List -->
          <div class="space-y-1.5 text-xs">
            @for (s of structuresInRadius.slice(0, 4); track s.id) {
              <div
                class="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-emerald-50/50 cursor-pointer transition-colors"
                (click)="selectStructure(s)"
              >
                <div class="min-w-0 pr-2">
                  <div class="font-semibold text-slate-900 text-[11px] truncate">{{ s.nom }} ({{ s.codeNational }})</div>
                  <div class="text-[10px] text-slate-500 truncate">{{ s.district || s.region }} • {{ s.type }} • {{ s.capaciteLits }} lits</div>
                </div>
                <button
                  type="button"
                  class="px-2 py-1 text-[10px] font-bold text-[#003426] bg-white border border-slate-300 rounded shadow-xs hover:bg-[#003426] hover:text-white transition-colors whitespace-nowrap shrink-0"
                  (click)="centerOnStructure(s); $event.stopPropagation()"
                >
                  Centrer
                </button>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Drawer Footer Action Bar -->
      <div class="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded border border-slate-300 transition-colors whitespace-nowrap"
          (click)="close.emit()"
        >
          Fermer l'Inspection
        </button>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="px-3 py-1.5 text-xs font-semibold text-[#003426] bg-white border border-[#003426]/40 hover:bg-emerald-50 rounded flex items-center gap-1 transition-colors whitespace-nowrap"
            (click)="exportGeoJSON()"
          >
            <span class="material-symbols-outlined text-sm">file_download</span>
            Export GeoJSON
          </button>
          <button
            type="button"
            class="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0f4c3a] hover:bg-[#166b53] rounded flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
            (click)="applyFilterToTable()"
          >
            <span class="material-symbols-outlined text-sm">check</span>
            Appliquer au Tableau ({{ structuresInRadius.length }})
          </button>
        </div>
      </div>
    </aside>
  `
})
export class StructureMapDrawerComponent {
  @Input() isOpen = false;
  @Input() structures: StructureSante[] = [];
  @Input() selectedStructure: StructureSante | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() structureSelected = new EventEmitter<StructureSante>();
  @Output() filterApplied = new EventEmitter<StructureSante[]>();

  selectedRadius = '10';
  selectedBassin = 'all';
  selectedLayer = 'districts';
  isFullscreen = false;

  activeCenterName = 'Dakar Plateau';
  centerCoordinates = { x: 190, y: 245 };
  zoomLevel = 1.0;

  get radiusPixelSize(): number {
    const r = parseInt(this.selectedRadius, 10) || 10;
    return Math.min(180, Math.max(30, r * 9.5 * this.zoomLevel));
  }

  get mappedStructures(): { structure: StructureSante; x: number; y: number }[] {
    // Project structures onto the 520x430 SVG viewbox based on relative coords
    const predefinedCoords: Record<string, { x: number; y: number }> = {
      'SN-DK-001': { x: 165, y: 260 }, // Hôpital Principal
      'SN-DK-014': { x: 200, y: 215 }, // CS Nabil Choucair
      'SN-DK-002': { x: 225, y: 195 }, // PS Yoff
      'SN-DK-003': { x: 245, y: 230 }, // PS Médina
      'SN-DK-004': { x: 180, y: 240 }, // Abass Ndao
      'SN-TH-022': { x: 390, y: 210 }, // Hôpital Régional Thiès
      'SN-SL-005': { x: 330, y: 110 }, // CS Saint-Louis
      'SN-KL-031': { x: 370, y: 310 }, // PS Kahone
      'SN-ZG-012': { x: 310, y: 330 }, // CS Bignona
      'SN-TB-089': { x: 420, y: 260 }, // Touba
      'SN-KD-004': { x: 470, y: 370 }  // Salémata
    };

    return this.structures.map((s, idx) => {
      const point = predefinedCoords[s.codeNational] || {
        x: 150 + ((idx * 37) % 320),
        y: 160 + ((idx * 29) % 200)
      };
      return { structure: s, x: point.x, y: point.y };
    });
  }

  get structuresInRadius(): StructureSante[] {
    const r = this.radiusPixelSize;
    return this.mappedStructures
      .filter((item) => {
        const dx = item.x - this.centerCoordinates.x;
        const dy = item.y - this.centerCoordinates.y;
        return Math.sqrt(dx * dx + dy * dy) <= r;
      })
      .map((item) => item.structure);
  }

  get totalBedsInRadius(): number {
    return this.structuresInRadius.reduce((acc, s) => acc + (s.capaciteLits || 0), 0);
  }

  get crenCountInRadius(): number {
    return this.structuresInRadius.filter(
      (s) => s.agrementCren && s.agrementCren !== ('AUCUN' as any)
    ).length;
  }

  selectStructure(s: StructureSante): void {
    this.selectedStructure = s;
    this.structureSelected.emit(s);
  }

  centerOnStructure(s: StructureSante): void {
    this.selectedStructure = s;
    this.activeCenterName = s.nom;
    const mapped = this.mappedStructures.find((m) => m.structure.id === s.id);
    if (mapped) {
      this.centerCoordinates = { x: mapped.x, y: mapped.y };
    }
  }

  zoomIn(): void {
    this.zoomLevel = Math.min(2.0, this.zoomLevel + 0.2);
  }

  zoomOut(): void {
    this.zoomLevel = Math.max(0.6, this.zoomLevel - 0.2);
  }

  resetMapView(): void {
    this.zoomLevel = 1.0;
    this.centerCoordinates = { x: 190, y: 245 };
    this.activeCenterName = 'Dakar Plateau';
    this.selectedRadius = '10';
  }

  toggleFullscreen(): void {
    this.isFullscreen = !this.isFullscreen;
  }

  getMarkerColor(s: StructureSante): string {
    if (s.type === 'HOPITAL_NATIONAL' || s.type === 'HOPITAL_REGIONAL' || s.type === 'HOPITAL') {
      return 'bg-[#003426]';
    }
    if (s.type === 'CENTRE_DE_SANTE') {
      return 'bg-teal-600';
    }
    return 'bg-emerald-700';
  }

  getMarkerIcon(s: StructureSante): string {
    if (s.type === 'HOPITAL_NATIONAL' || s.type === 'HOPITAL_REGIONAL' || s.type === 'HOPITAL') {
      return 'apartment';
    }
    if (s.type === 'CENTRE_DE_SANTE') {
      return 'local_hospital';
    }
    return 'home_health';
  }

  exportGeoJSON(): void {
    const geojson = {
      type: 'FeatureCollection',
      name: 'SenSante_SIG_National',
      features: this.structures.map((s) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [s.longitude || -17.433, s.latitude || 14.6648]
        },
        properties: {
          id: s.id,
          codeNational: s.codeNational,
          nom: s.nom,
          type: s.type,
          statut: s.statut,
          region: s.region,
          district: s.district,
          capaciteLits: s.capaciteLits,
          agrementCren: s.agrementCren,
          telephone: s.telephone
        }
      }))
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SenSante_SIG_Structures_${new Date().toISOString().slice(0, 10)}.geojson`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  applyFilterToTable(): void {
    this.filterApplied.emit(this.structuresInRadius);
    this.close.emit();
  }
}
