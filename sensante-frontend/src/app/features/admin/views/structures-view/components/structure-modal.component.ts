import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AgrementCren,
  CreateStructurePayload,
  StatutStructure,
  StructureSante,
  TypeStructure
} from '../../../../../core/models/structure-sante.model';
import { StructureSanteService } from '../../../../../core/services/structure-sante.service';

@Component({
  selector: 'app-structure-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fadeIn">
        <div class="bg-white rounded-xl max-w-2xl w-full border border-slate-300 shadow-[0_20px_25px_-5px_rgba(15,23,42,0.2),0_8px_10px_-6px_rgba(15,23,42,0.1)] overflow-hidden flex flex-col max-h-[92vh]">
          <!-- Modal Header -->
          <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded bg-[#0f4c3a] text-white flex items-center justify-center">
                <span class="material-symbols-outlined text-lg">
                  {{ isEditMode ? 'edit_location' : 'add_business' }}
                </span>
              </div>
              <div>
                <h2 class="font-bold text-sm text-[#003426] tracking-tight">
                  @if (isEditMode) { Modification de la Structure - MSAS } @else { Enregistrement d'une Structure Sanitaire - MSAS }
                </h2>
                <p class="text-[11px] text-slate-500">Attribution automatique de l'identifiant national et géoréférencement SIG</p>
              </div>
            </div>
            <button
              type="button"
              class="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors"
              (click)="close.emit()"
            >
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <!-- Modal Body (Scrollable) -->
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6 overflow-y-auto space-y-4 text-xs">
            @if (errorMessage) {
              <div class="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                <span class="material-symbols-outlined text-base text-red-600">error</span>
                <span>{{ errorMessage }}</span>
              </div>
            }

            <!-- Field: Nom Officiel -->
            <div>
              <label class="block font-semibold text-slate-700 mb-1">
                Nom officiel de la structure <span class="text-red-600">*</span>
              </label>
              <input
                type="text"
                formControlName="nom"
                class="w-full h-[38px] px-3 text-xs bg-white border rounded focus:border-[#0f4c3a] focus:ring-1 focus:ring-[#0f4c3a] outline-none"
                [class.border-red-500]="isFieldInvalid('nom')"
                [class.border-slate-300]="!isFieldInvalid('nom')"
                placeholder="Ex: Centre de Santé de Guédiawaye Sud"
              />
              @if (isFieldInvalid('nom')) {
                <p class="text-[10px] text-red-600 mt-1">Le nom de la structure est obligatoire.</p>
              }
            </div>

            <!-- Row: Type & Statut -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">
                  Type d'établissement <span class="text-red-600">*</span>
                </label>
                <select
                  formControlName="type"
                  class="w-full h-[38px] px-3 text-xs bg-white border border-slate-300 rounded focus:border-[#0f4c3a] focus:ring-1 focus:ring-[#0f4c3a] text-slate-800"
                >
                  <option value="">Sélectionner une typologie...</option>
                  <option [value]="TypeStructure.HOPITAL_NATIONAL">Hôpital National (Niveau 3)</option>
                  <option [value]="TypeStructure.HOPITAL_REGIONAL">Hôpital Régional (Niveau 2)</option>
                  <option [value]="TypeStructure.CENTRE_DE_SANTE">Centre de Santé (CS - Référence)</option>
                  <option [value]="TypeStructure.POSTE_DE_SANTE">Poste de Santé (PS)</option>
                  <option [value]="TypeStructure.DISPENSAIRE">Dispensaire Communal</option>
                  <option [value]="TypeStructure.CREN_AUTONOME">CREN Autonome</option>
                </select>
                @if (isFieldInvalid('type')) {
                  <p class="text-[10px] text-red-600 mt-1">Veuillez choisir un type d'établissement.</p>
                }
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Statut initial d'exploitation</label>
                <select
                  formControlName="statut"
                  class="w-full h-[38px] px-3 text-xs bg-white border border-slate-300 rounded focus:border-[#0f4c3a] focus:ring-1 focus:ring-[#0f4c3a] text-slate-800"
                >
                  <option [value]="StatutStructure.OPERATIONNEL">Opérationnel (En service)</option>
                  <option [value]="StatutStructure.SOUS_SURVEILLANCE">Sous surveillance (Revue requise)</option>
                  <option [value]="StatutStructure.FERMETURE_TEMPORAIRE">Fermeture temporaire / Travaux</option>
                </select>
              </div>
            </div>

            <!-- Découpage Territorial Cascade -->
            <div class="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2.5">
              <span class="font-semibold uppercase tracking-wider text-slate-500 block text-[10px]">
                Découpage Territorial MSAS
              </span>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                <div>
                  <label class="block text-[11px] text-slate-600 mb-1">
                    Région Médicale <span class="text-red-600">*</span>
                  </label>
                  <select
                    formControlName="region"
                    class="w-full h-[34px] px-2 text-xs bg-white border border-slate-300 rounded focus:border-[#0f4c3a] outline-none"
                    (change)="onRegionChange()"
                  >
                    <option value="">Sélectionner...</option>
                    @for (r of regionsList; track r) {
                      <option [value]="r">{{ r }}</option>
                    }
                  </select>
                  @if (isFieldInvalid('region')) {
                    <p class="text-[10px] text-red-600 mt-0.5">Région obligatoire.</p>
                  }
                </div>
                <div>
                  <label class="block text-[11px] text-slate-600 mb-1">
                    District Sanitaire <span class="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    formControlName="district"
                    class="w-full h-[34px] px-2.5 text-xs bg-white border border-slate-300 rounded focus:border-[#0f4c3a] outline-none"
                    placeholder="Ex: Dakar Centre"
                  />
                </div>
                <div>
                  <label class="block text-[11px] text-slate-600 mb-1">
                    Commune / Arrondissement
                  </label>
                  <input
                    type="text"
                    formControlName="commune"
                    class="w-full h-[34px] px-2.5 text-xs bg-white border border-slate-300 rounded focus:border-[#0f4c3a] outline-none"
                    placeholder="Ex: Médina"
                  />
                </div>
              </div>
            </div>

            <!-- Coordonnées GPS & SIG -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div class="md:col-span-5">
                <label class="block font-semibold text-slate-700 mb-1">Latitude (DGPS)</label>
                <input
                  type="number"
                  step="0.0001"
                  formControlName="latitude"
                  class="w-full h-[36px] px-3 text-xs bg-white border border-slate-300 rounded focus:border-[#0f4c3a] font-mono outline-none"
                  placeholder="14.6937"
                />
              </div>
              <div class="md:col-span-5">
                <label class="block font-semibold text-slate-700 mb-1">Longitude (DGPS)</label>
                <input
                  type="number"
                  step="0.0001"
                  formControlName="longitude"
                  class="w-full h-[36px] px-3 text-xs bg-white border border-slate-300 rounded focus:border-[#0f4c3a] font-mono outline-none"
                  placeholder="-17.4440"
                />
              </div>
              <div class="md:col-span-2">
                <button
                  type="button"
                  class="w-full h-[36px] bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded flex items-center justify-center gap-1 transition-colors"
                  title="Obtenir position actuelle par géolocalisation"
                  (click)="fetchCurrentLocation()"
                >
                  <span class="material-symbols-outlined text-base text-[#003426]">my_location</span>
                  <span class="text-[11px] font-medium">GPS</span>
                </button>
              </div>
            </div>

            <!-- Capacité & CREN -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Capacité d'Accueil</label>
                <div class="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    formControlName="capaciteLits"
                    class="w-full h-[36px] px-2.5 text-xs bg-white border border-slate-300 rounded focus:border-[#0f4c3a] font-mono outline-none"
                    placeholder="Lits hospitalisation"
                  />
                  <input
                    type="number"
                    formControlName="litsReanimation"
                    class="w-full h-[36px] px-2.5 text-xs bg-white border border-slate-300 rounded focus:border-[#0f4c3a] font-mono outline-none"
                    placeholder="Lits réanimation"
                  />
                </div>
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Agréments Nutrition CREN</label>
                <select
                  formControlName="agrementCren"
                  class="w-full h-[36px] px-2 bg-slate-50 border border-slate-200 rounded text-slate-800"
                >
                  <option [value]="AgrementCren.AUCUN">Sans unité CREN</option>
                  <option [value]="AgrementCren.CRENI">CRENI (Intensif Hospitalier)</option>
                  <option [value]="AgrementCren.CRENAS">CRENAS (Ambulatoire Sévère)</option>
                  <option [value]="AgrementCren.CRENAM">CRENAM (Modéré)</option>
                </select>
              </div>
            </div>

            <!-- Services d'urgence et plateau technique -->
            <div class="flex items-center gap-6 p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg">
              <label class="inline-flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
                <input type="checkbox" formControlName="urgences247" class="rounded border-slate-300 text-[#0f4c3a] focus:ring-0" />
                <span>Urgences 24/7</span>
              </label>
              <label class="inline-flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
                <input type="checkbox" formControlName="blocOperatoire" class="rounded border-slate-300 text-[#0f4c3a] focus:ring-0" />
                <span>Bloc Opératoire</span>
              </label>
              <label class="inline-flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
                <input type="checkbox" formControlName="secteurRural" class="rounded border-slate-300 text-[#0f4c3a] focus:ring-0" />
                <span>Zone Rurale</span>
              </label>
            </div>

            <!-- Médecin Chef & Téléphone officiel -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Médecin Chef / Responsable</label>
                <input
                  type="text"
                  formControlName="responsable"
                  class="w-full h-[36px] px-3 text-xs bg-white border border-slate-300 rounded focus:border-[#0f4c3a] outline-none"
                  placeholder="Dr. Prénom Nom"
                />
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Téléphone d'astreinte officiel</label>
                <input
                  type="text"
                  formControlName="telephone"
                  class="w-full h-[36px] px-3 text-xs bg-white border border-slate-300 rounded focus:border-[#0f4c3a] font-mono outline-none"
                  placeholder="+221 33 800 00 00"
                />
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span class="text-[11px] text-slate-500 italic">Signature numérique MSAS requise lors de l'enregistrement.</span>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded border border-slate-300 transition-colors whitespace-nowrap"
                  (click)="close.emit()"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  [disabled]="form.invalid || isSubmitting"
                  class="px-4 py-2 text-xs font-semibold text-white bg-[#0f4c3a] hover:bg-[#166b53] disabled:opacity-50 rounded flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
                >
                  @if (isSubmitting) {
                    <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                    <span>Enregistrement...</span>
                  } @else {
                    <span class="material-symbols-outlined text-sm">save</span>
                    <span>{{ isEditMode ? 'Mettre à jour' : 'Enregistrer & Générer Code MSAS' }}</span>
                  }
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class StructureModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() structureToEdit: StructureSante | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<StructureSante>();

  private readonly fb = inject(FormBuilder);
  private readonly structureService = inject(StructureSanteService);

  readonly TypeStructure = TypeStructure;
  readonly StatutStructure = StatutStructure;
  readonly AgrementCren = AgrementCren;

  readonly regionsList = [
    'Dakar',
    'Thiès',
    'Saint-Louis',
    'Diourbel',
    'Kaolack',
    'Ziguinchor',
    'Tambacounda',
    'Kédougou',
    'Fatick',
    'Kolda',
    'Louga',
    'Matam',
    'Sédhiou',
    'Kaffrine'
  ];

  form!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  get isEditMode(): boolean {
    return !!this.structureToEdit;
  }

  constructor() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['structureToEdit']) {
      this.patchForm();
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      nom: ['', [Validators.required]],
      type: [TypeStructure.POSTE_DE_SANTE, [Validators.required]],
      statut: [StatutStructure.OPERATIONNEL],
      region: ['Dakar', [Validators.required]],
      district: ['Dakar Centre', [Validators.required]],
      commune: [''],
      latitude: [null],
      longitude: [null],
      capaciteLits: [10],
      litsReanimation: [0],
      agrementCren: [AgrementCren.AUCUN],
      urgences247: [false],
      blocOperatoire: [false],
      secteurRural: [false],
      responsable: [''],
      telephone: ['+221 ']
    });
  }

  private patchForm(): void {
    if (this.structureToEdit) {
      this.form.patchValue({
        nom: this.structureToEdit.nom,
        type: this.structureToEdit.type,
        statut: this.structureToEdit.statut,
        region: this.structureToEdit.region,
        district: this.structureToEdit.district || '',
        commune: this.structureToEdit.commune || '',
        latitude: this.structureToEdit.latitude,
        longitude: this.structureToEdit.longitude,
        capaciteLits: this.structureToEdit.capaciteLits,
        litsReanimation: this.structureToEdit.litsReanimation || 0,
        agrementCren: this.structureToEdit.agrementCren || AgrementCren.AUCUN,
        urgences247: !!this.structureToEdit.urgences247,
        blocOperatoire: !!this.structureToEdit.blocOperatoire,
        secteurRural: !!this.structureToEdit.secteurRural,
        responsable: this.structureToEdit.responsable || '',
        telephone: this.structureToEdit.telephone || ''
      });
    } else {
      this.form.reset({
        nom: '',
        type: TypeStructure.POSTE_DE_SANTE,
        statut: StatutStructure.OPERATIONNEL,
        region: 'Dakar',
        district: 'Dakar Centre',
        commune: '',
        latitude: null,
        longitude: null,
        capaciteLits: 10,
        litsReanimation: 0,
        agrementCren: AgrementCren.AUCUN,
        urgences247: false,
        blocOperatoire: false,
        secteurRural: false,
        responsable: '',
        telephone: '+221 '
      });
    }
  }

  isFieldInvalid(name: string): boolean {
    const field = this.form.get(name);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  onRegionChange(): void {
    const reg = this.form.get('region')?.value;
    if (reg === 'Dakar') this.form.patchValue({ district: 'Dakar Centre' });
    else if (reg === 'Thiès') this.form.patchValue({ district: 'Thiès Ville' });
    else if (reg === 'Saint-Louis') this.form.patchValue({ district: 'Saint-Louis' });
  }

  fetchCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.form.patchValue({
            latitude: Math.round(pos.coords.latitude * 10000) / 10000,
            longitude: Math.round(pos.coords.longitude * 10000) / 10000
          });
        },
        () => {
          // Default to Dakar if geolocation blocked
          this.form.patchValue({ latitude: 14.6937, longitude: -17.444 });
        }
      );
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = null;

    const payload: CreateStructurePayload = {
      ...this.form.value,
      capaciteLits: Number(this.form.value.capaciteLits) || 0,
      litsReanimation: Number(this.form.value.litsReanimation) || 0,
      latitude: this.form.value.latitude ? Number(this.form.value.latitude) : undefined,
      longitude: this.form.value.longitude ? Number(this.form.value.longitude) : undefined,
      gpsValide: !!(this.form.value.latitude && this.form.value.longitude)
    };

    const action$ = this.isEditMode
      ? this.structureService.updateStructure(this.structureToEdit!.id, payload)
      : this.structureService.createStructure(payload);

    action$.subscribe({
      next: (res: StructureSante) => {
        this.isSubmitting = false;
        this.saved.emit(res);
        this.close.emit();
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || "Erreur lors de l'enregistrement de la structure.";
      }
    });
  }
}
