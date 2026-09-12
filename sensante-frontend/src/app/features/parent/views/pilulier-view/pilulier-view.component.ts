import { Component, OnInit, inject, signal, effect, ElementRef, ViewChild } from '@angular/core';
import { AudioService } from '../../../../core/services/audio.service';
import { CommonModule } from '@angular/common';
import { ParentStateService } from '../../../../core/services/parent-state.service';
import { PilulierService } from '../../../../core/services/pilulier.service';
import { HealthToastService } from '../../../../core/services/health-toast.service';
import { PilulierPageDataDTO, RecetteNutritionnelleDTO } from '../../../../core/models/pilulier.model';

interface HygieneRule {
  id: number;
  icon: string;
  iconBgClass: string;
  iconTextClass: string;
  title: string;
  description: string;
  wolofProverb: string;
  wolofAudioText: string;
}

@Component({
  selector: 'app-pilulier-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 w-full pb-16 animate-fadeIn font-body-md text-on-surface antialiased">

      <!-- ========================================================================= -->
      <!-- 1. ÉTAT DE CHARGEMENT (SKELETON SHIMMER)                                  -->
      <!-- ========================================================================= -->
      @if (loading()) {
        <div class="space-y-8 animate-pulse w-full">
          <div class="h-32 w-full bg-surface-container-highest/60 rounded-3xl border border-outline-variant/30"></div>
          <div class="h-56 w-full bg-surface-container-highest/60 rounded-3xl border border-outline-variant/30"></div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div class="h-48 bg-surface-container-highest/60 rounded-3xl border border-outline-variant/30"></div>
            <div class="h-48 bg-surface-container-highest/60 rounded-3xl border border-outline-variant/30"></div>
            <div class="h-48 bg-surface-container-highest/60 rounded-3xl border border-outline-variant/30"></div>
          </div>
          <div class="flex gap-6 overflow-hidden">
            <div class="w-80 h-72 bg-surface-container-highest/60 rounded-3xl flex-shrink-0"></div>
            <div class="w-80 h-72 bg-surface-container-highest/60 rounded-3xl flex-shrink-0"></div>
            <div class="w-80 h-72 bg-surface-container-highest/60 rounded-3xl flex-shrink-0"></div>
          </div>
        </div>
      }

      <!-- ========================================================================= -->
      <!-- 2. ÉTAT D'ERREUR RÉSEAU                                                   -->
      <!-- ========================================================================= -->
      @if (error() && !loading()) {
        <div class="w-full pt-4">
          <div class="p-8 bg-error-container/40 border border-error/30 rounded-3xl text-center space-y-4 max-w-xl mx-auto shadow-sm">
            <span class="material-symbols-outlined text-error text-5xl">cloud_off</span>
            <h3 class="text-headline-sm font-bold text-on-error-container text-balance">
              Données de dotation nutritionnelle indisponibles
            </h3>
            <p class="text-body-sm text-on-surface-variant leading-relaxed text-pretty">
              {{ error() }}
            </p>
            <div class="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                (click)="loadData()"
                class="px-5 py-2.5 bg-[#065f46] text-white hover:bg-[#047857] rounded-xl text-label-md font-semibold transition-all shadow-sm whitespace-nowrap flex-shrink-0 cursor-pointer">
                Réessayer la synchronisation
              </button>
            </div>
          </div>
        </div>
      }

      <!-- ========================================================================= -->
      <!-- 3. ÉTAT VIDE (AUCUN ENFANT ENREGISTRÉ)                                    -->
      <!-- ========================================================================= -->
      @if (!loading() && !data() && !error()) {
        <div class="w-full pt-4">
          <div class="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 text-center max-w-2xl mx-auto space-y-4 custom-shadow-card">
            <div class="size-16 rounded-2xl bg-emerald-50 text-[#065f46] flex items-center justify-center mx-auto border border-emerald-200">
              <span class="material-symbols-outlined text-3xl">child_care</span>
            </div>
            <h2 class="text-headline-md font-bold text-[#065f46] text-balance">Aucun enfant enregistré sur ce compte</h2>
            <p class="text-body-md text-on-surface-variant leading-relaxed max-w-lg mx-auto text-pretty">
              Aucun dossier pédiatrique n'est actuellement rattaché à votre profil. Dès l'enregistrement de votre enfant au poste de santé, ses dotations et cures nutritionnelles s'afficheront ici.
            </p>
          </div>
        </div>
      }

      <!-- ========================================================================= -->
      <!-- 4. ÉTAT NOMINAL : INTERFACE SUPPLÉMENTS & RECETTES SOVEREIGN 20/20         -->
      <!-- ========================================================================= -->
      @if (!loading() && data(); as pilulier) {

        <!-- SOVEREIGN HEADER CARD WITH SENEGAL RIBBON -->
        <header class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#065f46] via-[#047857] to-[#0f4c3a] text-white p-6 sm:p-8 custom-shadow-card">
          <!-- Senegal National Ribbon -->
          <div class="absolute top-0 left-0 right-0 h-1.5 flex">
            <div class="h-full flex-1 bg-[#00853F]"></div>
            <div class="h-full flex-1 bg-[#FDEF42]"></div>
            <div class="h-full flex-1 bg-[#E31B23]"></div>
          </div>

          <!-- Watermark Background -->
          <div class="absolute -right-8 -bottom-10 opacity-10 pointer-events-none select-none">
            <span class="material-symbols-outlined text-[180px]">nutrition</span>
          </div>

          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="space-y-2">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-emerald-100 text-xs font-semibold border border-white/15 whitespace-nowrap flex-shrink-0">
                <span class="material-symbols-outlined text-[15px] text-[#FDEF42]">verified</span>
                <span>Programme National de Lutte contre la Malnutrition • MSAS</span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance">
                Suppléments Micronutriments &amp; Recettes Locales
              </h1>
              <p class="text-sm sm:text-base text-emerald-100/90 max-w-2xl text-pretty leading-relaxed">
                Dotation MNPS (Micronutrient Powders), Cures ATPE/Plumpy'Nut et recettes locales fortifiées pour <strong class="text-white">{{ childPrenom }}</strong>.
              </p>
            </div>

            <!-- Wolof Vocal Guide Button -->
            <button
              type="button"
              (click)="toggleGeneralWolofAudio()"
              class="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-[0.98] border border-white/25 text-white transition-all shadow-md whitespace-nowrap flex-shrink-0 self-start md:self-auto cursor-pointer"
              title="Écouter les explications nutritionnelles en Wolof">
              <span class="material-symbols-outlined text-[24px] text-[#FDEF42]">
                {{ isAudioPlaying() ? 'volume_up' : 'volume_up' }}
              </span>
              <div class="text-left">
                <span class="text-[11px] uppercase tracking-wider text-emerald-200 block font-bold">Audio Wolof</span>
                <span class="text-xs font-bold text-white block">
                  {{ isAudioPlaying() ? 'Écoute en cours...' : 'Déglo leral bi ci Wolof' }}
                </span>
              </div>
            </button>
          </div>
        </header>

        <!-- 2. CARTE DE PROGRESSION DU TRAITEMENT & PILULIER INTERACTIF -->
        @if (pilulier.traitement; as tr) {
          <section class="bg-surface-container-lowest p-6 sm:p-7 rounded-3xl border border-outline-variant/30 custom-shadow-card space-y-6">
            <!-- Top Row: Icon, Title & Action Button -->
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-outline-variant/20">
              <div class="flex items-start gap-4">
                <div class="size-14 rounded-2xl bg-emerald-100 text-[#065f46] flex items-center justify-center flex-shrink-0 font-bold">
                  <span class="material-symbols-outlined text-3xl">medication</span>
                </div>
                <div class="space-y-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h2 class="text-lg sm:text-xl font-bold text-[#065f46] text-balance">
                      {{ tr.nomTraitement || ('Cure ' + tr.produit) }}
                    </h2>
                    <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-[#065f46] border border-emerald-200 whitespace-nowrap flex-shrink-0">
                      Semaine {{ tr.semaineCourante || 1 }}/{{ tr.totalSemaines || 4 }}
                    </span>
                  </div>
                  <p class="text-xs sm:text-sm text-on-surface-variant text-pretty leading-relaxed">
                    {{ tr.description || (tr.rationsParJourPrescrit + ' ration(s) par jour prescrites par ' + tr.prescripteur) }}
                  </p>
                </div>
              </div>

              <!-- Action Button: Valider la prise du jour -->
              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button
                  type="button"
                  id="validate-dose-btn"
                  (click)="validerDoseAujourdhui()"
                  [disabled]="isDoseValidating() || isDoseAlreadyValidated || !prochainePriseId"
                  class="flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-xs shadow-md transition-all active:scale-[0.98] whitespace-nowrap flex-shrink-0 cursor-pointer disabled:cursor-not-allowed"
                  [ngClass]="isDoseAlreadyValidated ? 'bg-emerald-100 text-[#065f46] border border-emerald-300' : 'bg-[#065f46] text-white hover:bg-[#047857]'">
                  <span class="material-symbols-outlined text-lg" [class.animate-spin]="isDoseValidating()">
                    {{ isDoseValidating() ? 'sync' : (isDoseAlreadyValidated ? 'check_circle' : 'task_alt') }}
                  </span>
                  <span class="whitespace-nowrap">{{ isDoseAlreadyValidated ? 'Prise du jour validée !' : 'Valider la prise du jour' }}</span>
                </button>
                <span class="text-xs text-on-surface-variant flex items-center gap-1 whitespace-nowrap">
                  <span class="material-symbols-outlined text-sm text-[#065f46]">schedule</span>
                  <span>{{ lastDoseTimeAffichee }}</span>
                </span>
              </div>
            </div>

            <!-- Visual Progress Grid (12 cols) -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <!-- Progress Bar & Metrics (8 cols) -->
              <div class="md:col-span-8 space-y-4">
                <div class="flex items-end justify-between">
                  <div>
                    <span class="text-3xl sm:text-4xl font-extrabold text-[#065f46] leading-none">
                      {{ sachetsPrisCount }}
                    </span>
                    <span class="text-base sm:text-lg text-on-surface-variant font-medium whitespace-nowrap">
                      / {{ sachetsTotalCount }} rations consommées
                    </span>
                    <p class="text-xs font-bold text-[#065f46] mt-1 whitespace-nowrap">
                      {{ sachetsRestantsCount }} rations restantes pour cette cure
                    </p>
                  </div>
                  <div class="text-right">
                    <span class="px-3 py-1 rounded-full bg-emerald-100 text-[#065f46] text-xs font-bold whitespace-nowrap">
                      {{ completionPercentage }}% Complété
                    </span>
                    <p class="text-[11px] text-on-surface-variant mt-1 whitespace-nowrap">
                      Assiduité globale ({{ assiduitePercentage }}%)
                    </p>
                  </div>
                </div>

                <!-- Progress Track with Animated Gradient -->
                <div class="w-full h-3.5 bg-surface-container rounded-full overflow-hidden p-0.5 ring-1 ring-outline-variant/30">
                  <div
                    class="h-full bg-gradient-to-r from-[#065f46] to-[#047857] rounded-full transition-all duration-700 relative"
                    [style.width.%]="completionPercentage">
                    <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>

                <!-- Progress Milestones -->
                <div class="flex justify-between text-xs text-on-surface-variant">
                  <span class="whitespace-nowrap">Jour 1 (Début)</span>
                  <span class="font-bold text-[#065f46] whitespace-nowrap">
                    Aujourd'hui (Jour {{ currentDayCure }})
                  </span>
                  <span class="whitespace-nowrap">Objectif {{ totalDaysTarget }} j</span>
                </div>
              </div>

              <!-- Next Resupply Callout (4 cols) -->
              <div class="md:col-span-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 flex items-start gap-3">
                <span class="material-symbols-outlined text-[#065f46] text-2xl flex-shrink-0">local_hospital</span>
                <div class="space-y-1">
                  <p class="text-xs font-bold text-[#065f46] whitespace-nowrap">
                    Centre de dotation référent
                  </p>
                  <p class="text-xs text-on-surface-variant text-pretty leading-relaxed">
                    Dotation suivie au <strong class="text-[#065f46] font-bold">{{ tr.centreDotation || structureNomAffichee }}</strong> par {{ tr.prescripteur || 'l\\'équipe pédiatrique' }}.
                  </p>
                  @if (tr.conseillereNom) {
                    <div class="inline-flex items-center gap-1 text-xs font-bold text-[#065f46] pt-1 whitespace-nowrap">
                      <span class="material-symbols-outlined text-sm">support_agent</span>
                      <span>Relais : {{ tr.conseillereNom }} ({{ tr.conseillereTelephone }})</span>
                    </div>
                  }
                </div>
              </div>
            </div>
          </section>
        } @else {
          <section class="bg-surface-container-lowest p-6 sm:p-7 rounded-3xl border border-outline-variant/30 custom-shadow-card">
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div class="size-14 rounded-2xl bg-emerald-50 text-[#065f46] flex items-center justify-center border border-emerald-200 flex-shrink-0">
                <span class="material-symbols-outlined text-3xl">health_and_safety</span>
              </div>
              <div class="space-y-1">
                <h2 class="text-base sm:text-lg font-bold text-[#065f46] text-balance">
                  Aucun traitement ou supplément nutritionnel actif
                </h2>
                <p class="text-xs sm:text-sm text-on-surface-variant text-pretty leading-relaxed">
                  {{ childPrenom }} ne suit actuellement aucun protocole de récupération nutritionnelle (ATPE / MNP). Consultez les recettes locales enrichies et les règles d'or d'hygiène ci-dessous pour son équilibre quotidien.
                </p>
              </div>
            </div>
          </section>
        }

        <!-- 3. CHECKLIST ILLUSTRÉE DES RÈGLES D'OR DE PRÉPARATION (3 CARTES) -->
        <section class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-[#065f46] text-balance">
                Règles d'or pour la préparation
              </h2>
              <p class="text-xs text-on-surface-variant text-pretty">
                3 gestes indispensables recommandés par le MSAS pour garantir l'efficacité et la sécurité des nutriments.
              </p>
            </div>
            <span class="px-3 py-1 rounded-full bg-emerald-50 text-[#065f46] border border-emerald-200 text-xs font-bold hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap flex-shrink-0">
              <span class="material-symbols-outlined text-sm">shield</span>
              <span>Guide Hygiène Sanitaire MSAS</span>
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            @for (rule of hygieneRules; track rule.id) {
              <article class="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/30 custom-shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div
                      class="size-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-emerald-50 text-[#065f46] border border-emerald-200">
                      <span class="material-symbols-outlined text-2xl">{{ rule.icon }}</span>
                    </div>
                    <!-- Audio Wolof Button for Rule -->
                    <button
                      type="button"
                      (click)="playRuleAudio(rule)"
                      class="size-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#065f46] flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                      [title]="'Écouter la règle en Wolof : ' + rule.title">
                      <span class="material-symbols-outlined text-lg">
                        {{ activePlayingRuleId() === rule.id ? 'volume_up' : 'volume_up' }}
                      </span>
                    </button>
                  </div>

                  <h3 class="text-sm font-bold text-on-surface text-balance">
                    {{ rule.title }}
                  </h3>
                  <p class="text-xs text-on-surface-variant text-pretty leading-relaxed">
                    {{ rule.description }}
                  </p>
                </div>

                <div class="pt-3 border-t border-outline-variant/20 flex items-center gap-1.5 text-xs text-[#065f46] font-semibold whitespace-nowrap">
                  <span class="material-symbols-outlined text-sm text-[#065f46] flex-shrink-0">check_circle</span>
                  <span class="italic truncate">{{ rule.wolofProverb }}</span>
                </div>
              </article>
            }
          </div>
        </section>

        <!-- 4. LISTE HORIZONTALE SCROLLABLE DE RECETTES LOCALES ENRICHIES -->
        <section class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-[#065f46] text-balance">
                Recettes Fortifiées du Terroir Sénégalais
              </h2>
              <p class="text-xs text-on-surface-variant text-pretty">
                Aliments de transition hautement nutritifs à base d'ingrédients locaux (Moringa, Niébé, Bouye, Arachide).
              </p>
            </div>
            <!-- Scroll Navigation Arrows -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                id="recipe-scroll-left"
                (click)="scrollRecipes(-360)"
                aria-label="Recette précédente"
                class="size-9 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center text-[#065f46] hover:bg-emerald-50 transition-colors shadow-xs cursor-pointer">
                <span class="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                type="button"
                id="recipe-scroll-right"
                (click)="scrollRecipes(360)"
                aria-label="Recette suivante"
                class="size-9 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center text-[#065f46] hover:bg-emerald-50 transition-colors shadow-xs cursor-pointer">
                <span class="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          <!-- Horizontal Scroll Container -->
          <div
            #recipeContainer
            id="recipe-container"
            class="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory no-scrollbar scroll-smooth">
            @for (recipe of pilulier.recettes; track recipe.id) {
              <article class="flex-none w-[300px] sm:w-[340px] bg-surface-container-lowest rounded-3xl border border-outline-variant/30 custom-shadow-card overflow-hidden flex flex-col snap-start transition-all hover:shadow-lg">
                <!-- Image Container with Badge -->
                <div class="relative h-44 w-full overflow-hidden bg-surface-container">
                  <img
                    [src]="recipe.photoUrl"
                    [alt]="recipe.photoAlt"
                    class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy">
                  <span class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-[#065f46] text-white shadow-sm whitespace-nowrap flex-shrink-0">
                    {{ recipe.sousTitreBadge }}
                  </span>
                </div>

                <!-- Card Content -->
                <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div class="flex items-center justify-between mb-1 gap-2">
                      <h3 class="text-sm font-bold text-on-surface truncate">
                        {{ recipe.titre }}
                      </h3>
                      <button
                        type="button"
                        (click)="playRecipeAudio(recipe)"
                        class="text-[#065f46] hover:bg-emerald-50 cursor-pointer p-1 rounded-lg flex-shrink-0"
                        [title]="'Écouter la recette ' + recipe.titre + ' en Wolof'">
                        <span class="material-symbols-outlined text-lg">volume_up</span>
                      </button>
                    </div>
                    <p class="text-xs text-on-surface-variant line-clamp-2 text-pretty leading-relaxed">
                      {{ recipe.description }}
                    </p>
                  </div>

                  <div class="pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs font-semibold text-on-surface-variant">
                    <span class="flex items-center gap-1 whitespace-nowrap">
                      <span class="material-symbols-outlined text-sm text-[#065f46]">timer</span>
                      {{ recipe.tempsPreparation }}
                    </span>
                    <button
                      type="button"
                      (click)="openRecipeModal(recipe)"
                      class="text-[#065f46] hover:underline font-bold flex items-center gap-0.5 cursor-pointer whitespace-nowrap flex-shrink-0">
                      <span>Voir étapes</span>
                      <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </article>
            }
          </div>
        </section>

      }

      <!-- ========================================================================= -->
      <!-- MODALE DÉTAILS DE LA RECETTE (ÉTAPE PAR ÉTAPE & ASTUCE BADIEN GOX)        -->
      <!-- ========================================================================= -->
      @if (showRecipeModal() && selectedRecipe(); as activeRecipe) {
        <div class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div class="bg-surface-container-lowest rounded-3xl max-w-xl w-full p-6 border border-outline-variant/30 shadow-2xl space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <!-- Modal Header -->
            <div class="flex items-start justify-between pb-3 border-b border-outline-variant/20">
              <div class="flex items-center gap-3">
                <div class="size-11 rounded-2xl bg-emerald-100 text-[#065f46] flex items-center justify-center flex-shrink-0 font-bold">
                  <span class="material-symbols-outlined text-2xl">nutrition</span>
                </div>
                <div>
                  <h3 class="text-base font-bold text-[#065f46] text-balance">
                    {{ activeRecipe.titre }}
                  </h3>
                  <span class="inline-block text-xs text-on-surface-variant font-semibold">
                    {{ activeRecipe.sousTitreBadge }} • {{ activeRecipe.tempsPreparation }}
                  </span>
                </div>
              </div>
              <button
                type="button"
                (click)="showRecipeModal.set(false)"
                class="text-on-surface-variant hover:text-on-surface p-1 rounded-lg cursor-pointer">
                <span class="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <!-- Ingrédients -->
            <div class="space-y-2">
              <h4 class="text-xs font-bold text-[#065f46] flex items-center gap-1.5 uppercase tracking-wider">
                <span class="material-symbols-outlined text-base">shopping_basket</span>
                <span>Ingrédients Requis</span>
              </h4>
              <ul class="space-y-1.5 pl-2">
                @for (ing of activeRecipe.ingredients; track ing) {
                  <li class="flex items-center gap-2 text-xs text-on-surface">
                    <span class="size-1.5 rounded-full bg-[#065f46] flex-shrink-0"></span>
                    <span>{{ ing }}</span>
                  </li>
                }
              </ul>
            </div>

            <!-- Étapes de Préparation -->
            <div class="space-y-2">
              <h4 class="text-xs font-bold text-[#065f46] flex items-center gap-1.5 uppercase tracking-wider">
                <span class="material-symbols-outlined text-base">receipt_long</span>
                <span>Préparation Étape par Étape</span>
              </h4>
              <ol class="space-y-2 pl-1">
                @for (step of activeRecipe.etapesPreparation; track step) {
                  <li class="text-xs text-on-surface-variant leading-relaxed pl-2 border-l-2 border-emerald-300">
                    {{ step }}
                  </li>
                }
              </ol>
            </div>

            <!-- Astuce Clinique Badien Gox -->
            <div class="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
              <span class="material-symbols-outlined text-[#065f46] text-xl flex-shrink-0 mt-0.5">tips_and_updates</span>
              <div>
                <span class="block text-xs font-bold text-[#065f46]">Conseil de la Badien Gox</span>
                <p class="text-xs text-emerald-900 leading-relaxed mt-0.5 italic text-pretty">
                  « {{ activeRecipe.conseilBadienGox }} »
                </p>
              </div>
            </div>

            <!-- Modal Footer Buttons -->
            <div class="pt-3 border-t border-outline-variant/20 flex items-center justify-between flex-wrap gap-2">
              <button
                type="button"
                (click)="playRecipeAudio(activeRecipe)"
                class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#065f46] text-white hover:bg-[#047857] text-xs font-bold transition-colors cursor-pointer whitespace-nowrap flex-shrink-0">
                <span class="material-symbols-outlined text-base">volume_up</span>
                <span class="whitespace-nowrap">Écouter en Wolof</span>
              </button>

              <button
                type="button"
                (click)="showRecipeModal.set(false)"
                class="px-5 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs font-bold hover:bg-surface-container-high transition-colors cursor-pointer whitespace-nowrap flex-shrink-0">
                Fermer
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    .custom-shadow-card {
      box-shadow: 0 4px 16px -2px rgba(6, 95, 70, 0.06), 0 1px 3px 0 rgba(6, 95, 70, 0.03);
    }
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.25s ease-out;
    }
    @keyframes scaleUp {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-scaleUp {
      animation: scaleUp 0.2s ease-out;
    }
  `]
})
export class PilulierViewComponent implements OnInit {
  private readonly audioService = inject(AudioService);
  private readonly parentState = inject(ParentStateService);
  private readonly pilulierService = inject(PilulierService);
  private readonly toast = inject(HealthToastService);

  @ViewChild('recipeContainer') recipeContainer?: ElementRef<HTMLDivElement>;

  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly data = signal<PilulierPageDataDTO | null>(null);

  readonly isAudioPlaying = signal<boolean>(false);
  readonly activePlayingRuleId = signal<number | null>(null);
  readonly isDoseValidating = signal<boolean>(false);
  readonly isDoseAlreadyValidatedSignal = signal<boolean>(false);

  readonly showRecipeModal = signal<boolean>(false);
  readonly selectedRecipe = signal<RecetteNutritionnelleDTO | null>(null);

  readonly hygieneRules: HygieneRule[] = [
    {
      id: 1,
      icon: 'wash',
      iconBgClass: 'bg-emerald-50',
      iconTextClass: 'text-[#065f46]',
      title: '1. Se laver les mains',
      description: "Lavage méticuleux des mains à l'eau propre courante et au savon avant toute manipulation des poudres et de la vaisselle.",
      wolofProverb: 'Raxas loxo yi ak saabu',
      wolofAudioText: "Raxas loxo yi ak saabu ak ndox mu lab bala nga jël poudru micronutriment bi."
    },
    {
      id: 2,
      icon: 'water_drop',
      iconBgClass: 'bg-blue-50',
      iconTextClass: 'text-blue-800',
      title: '2. Eau propre & bouillie',
      description: "Utiliser exclusivement de l'eau potable bouillie ou filtrée pour cuire et tiédir la bouillie avant incorporation.",
      wolofProverb: 'Ndox mu lab te bax',
      wolofAudioText: "Jëfandikool ndox mu lab te bax mu baxe ba nopi bala nga ko ciy def."
    },
    {
      id: 3,
      icon: 'soup_kitchen',
      iconBgClass: 'bg-amber-50',
      iconTextClass: 'text-amber-800',
      title: '3. Pas de dilution excessive',
      description: "Mélanger le sachet entier dans une petite portion que l'enfant finira d'un trait. Ne pas diluer dans un grand bol ni réchauffer après ajout.",
      wolofProverb: 'Boul ko xattal ci mbaar mu reuy',
      wolofAudioText: "Boul ko xattal ci mbaar mu reuy, defal ko ci tuuti rek ba xale bi mën ko jéxal yépp d'un coup."
    }
  ];

  constructor() {
    effect(() => {
      const child = this.parentState.selectedChild();
      if (child) {
        this.loadData();
      } else if (!this.parentState.loading()) {
        this.data.set(null);
        this.loading.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const child = this.parentState.selectedChild();
    if (!child) {
      this.data.set(null);
      this.loading.set(false);
      return;
    }

    const childId = child.id;
    this.loading.set(true);
    this.error.set(null);

    this.pilulierService.getPilulierData(childId).subscribe({
      next: (res: PilulierPageDataDTO) => {
        this.data.set(res);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        console.warn('[PilulierView] Erreur récupération pilulier:', err);
        this.error.set('Impossible de joindre le serveur pour actualiser la dotation.');
        this.loading.set(false);
      }
    });
  }

  // --- Getters dynamiques calculés pour le template ---

  get childPrenom(): string {
    return this.parentState.selectedChild()?.prenom || "L'enfant";
  }

  get isDoseAlreadyValidated(): boolean {
    const prises = this.data()?.prisesAujourdhui || [];
    if (prises.length > 0) {
      return prises.every(p => p.statut === 'VALIDE');
    }
    return this.isDoseAlreadyValidatedSignal();
  }

  get prochainePriseId(): number | null {
    const prises = this.data()?.prisesAujourdhui || [];
    const nonValidee = prises.find(p => p.statut !== 'VALIDE');
    if (nonValidee) return nonValidee.id;
    return prises.length > 0 ? prises[0].id : null;
  }

  get sachetsTotalCount(): number {
    return this.data()?.traitement?.stockTotal || 0;
  }

  get sachetsRestantsCount(): number {
    return this.data()?.traitement?.stockRestant || 0;
  }

  get sachetsPrisCount(): number {
    const total = this.sachetsTotalCount;
    const rest = this.sachetsRestantsCount;
    return Math.max(0, total - rest);
  }

  get completionPercentage(): number {
    if (this.sachetsTotalCount === 0) return 0;
    return Math.min(100, Math.round((this.sachetsPrisCount / this.sachetsTotalCount) * 100));
  }

  get assiduitePercentage(): number {
    const pct = this.data()?.pourcentageObservance;
    return pct != null ? Math.round(pct) : 100;
  }

  get currentDayCure(): number {
    return this.data()?.traitement?.jourCureCourant || 1;
  }

  get totalDaysTarget(): number {
    return this.data()?.traitement?.totalJoursCure || 28;
  }

  get structureNomAffichee(): string {
    const child = this.parentState.selectedChild();
    return child?.centreRattachement || 'Poste de Santé de Pikine';
  }

  get lastDoseTimeAffichee(): string {
    const prises = this.data()?.prisesAujourdhui || [];
    const derniereValidee = [...prises].reverse().find(p => p.statut === 'VALIDE');
    if (derniereValidee && derniereValidee.heureReelleAffichee) {
      return `Validé à ${derniereValidee.heureReelleAffichee}`;
    }
    return this.isDoseAlreadyValidated
      ? "Aujourd'hui, validé"
      : "Aujourd'hui, 09:30 (Matinée)";
  }

  // --- Actions & Interactions ---

  validerDoseAujourdhui(): void {
    if (this.isDoseAlreadyValidated) return;

    const priseId = this.prochainePriseId;
    if (!priseId) {
      this.toast.show('Aucune prise en attente de validation aujourd\'hui.', 'info');
      return;
    }

    this.isDoseValidating.set(true);

    this.pilulierService.validerPrise(priseId).subscribe({
      next: (res) => {
        this.isDoseValidating.set(false);
        this.isDoseAlreadyValidatedSignal.set(true);
        this.toast.show(res.message || 'Prise validée avec succès !', 'success');
        const child = this.parentState.selectedChild();
        if (child) {
          this.loadData();
        }
      },
      error: (err: unknown) => {
        this.isDoseValidating.set(false);
        console.error('[PilulierView] Erreur validation prise:', err);
        this.toast.show('Impossible de valider la prise. Vérifiez votre connexion et vos droits.', 'error');
      }
    });
  }

  scrollRecipes(distance: number): void {
    if (this.recipeContainer?.nativeElement) {
      this.recipeContainer.nativeElement.scrollBy({ left: distance, behavior: 'smooth' });
    }
  }

  openRecipeModal(recipe: RecetteNutritionnelleDTO): void {
    this.selectedRecipe.set(recipe);
    this.showRecipeModal.set(true);
  }

  toggleGeneralWolofAudio(): void {
    const next = !this.isAudioPlaying();
    this.isAudioPlaying.set(next);

    if (next) {
      this.speakWolof(
        "Séétal li ci poudru micronutriment yi. Sa sachet bi bu bëccëg, defal ko ci bouillie bi bu tiédir ba noppi. Boul ko togg ak gaz bi."
      );
    } else {
      this.stopSpeech();
    }
  }

  playRuleAudio(rule: HygieneRule): void {
    this.activePlayingRuleId.set(rule.id);
    this.speakWolof(rule.wolofAudioText, () => {
      this.activePlayingRuleId.set(null);
    });
  }

  playRecipeAudio(recipe: RecetteNutritionnelleDTO): void {
    const text = `Toggu ${recipe.titre}. ${recipe.description}. ${recipe.conseilBadienGox}`;
    this.speakWolof(text);
  }

  private speakWolof(text: string, onEnd?: () => void): void {
    const phraseKey = text.includes('MAS') ? 'muac_mas'
      : text.includes('MAM') ? 'muac_mam'
      : text.includes('Toggu') ? 'pilulier_rappel'
      : 'pilulier_rappel';
    this.audioService.playWolofPhrase(phraseKey);
    setTimeout(() => {
      this.isAudioPlaying?.set(false);
      onEnd?.();
    }, 8000);
  }

  private stopSpeech(): void {
    this.audioService.stopCurrentAudio();
    this.isAudioPlaying.set(false);
    this.activePlayingRuleId.set(null);
  }
}
