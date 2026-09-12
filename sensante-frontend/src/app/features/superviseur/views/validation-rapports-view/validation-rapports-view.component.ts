import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupervisionService } from '../../services/supervision.service';
import {
  RapportValidationSummary,
  RapportValidationDetail,
  ValidationQueueOverview,
  PreuvePhoto
} from '../../models/supervision.models';

@Component({
  selector: 'app-validation-rapports-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './validation-rapports-view.component.html',
  styleUrls: ['./validation-rapports-view.component.css']
})
export class ValidationRapportsViewComponent implements OnInit {
  private readonly supervisionService = inject(SupervisionService);

  // Reactive State Signals
  queue = signal<RapportValidationSummary[]>([]);
  overview = signal<ValidationQueueOverview | null>(null);
  selectedReport = signal<RapportValidationDetail | null>(null);
  selectedReportId = signal<number | null>(null);

  activeFilter = signal<string>('TOUS'); // 'TOUS' | 'CRENAS_MAS' | 'DEPISTAGE_SYSTEMATIQUE' | 'VISITE_MENAGE'
  searchQuery = signal<string>('');
  sortOption = signal<string>('PRIORITE'); // 'PRIORITE' | 'DATE'

  isLoadingQueue = signal<boolean>(true);
  isLoadingDetail = signal<boolean>(false);
  hasQueueError = signal<boolean>(false);
  isActionInProgress = signal<boolean>(false);

  commentInput = signal<string>('');
  toastMessage = signal<{ title: string; subtitle: string } | null>(null);
  lightboxPhoto = signal<PreuvePhoto | null>(null);

  // Computed count of filtered list
  filteredCount = computed(() => this.queue().length);

  ngOnInit(): void {
    this.loadOverview();
    this.loadQueue(true);
  }

  loadOverview(): void {
    this.supervisionService.getValidationOverview().subscribe({
      next: (ov: ValidationQueueOverview) => this.overview.set(ov),
      error: (err: unknown) => console.error('Erreur overview:', err)
    });
  }

  loadQueue(autoSelectFirst: boolean = false): void {
    this.isLoadingQueue.set(true);
    this.hasQueueError.set(false);

    const type = this.activeFilter() === 'TOUS' ? '' : this.activeFilter();
    this.supervisionService.getValidationQueue(type, this.searchQuery(), this.sortOption()).subscribe({
      next: (data: RapportValidationSummary[]) => {
        this.queue.set(data);
        this.isLoadingQueue.set(false);

        if (data.length > 0) {
          if (autoSelectFirst || !this.selectedReportId()) {
            this.selectReport(data[0].id);
          } else {
            // Check if currently selected is still in list
            const found = data.find(r => r.id === this.selectedReportId());
            if (found) {
              this.selectReport(found.id);
            } else {
              this.selectReport(data[0].id);
            }
          }
        } else {
          this.selectedReport.set(null);
          this.selectedReportId.set(null);
        }
      },
      error: (err: unknown) => {
        console.error('Erreur chargement file:', err);
        this.isLoadingQueue.set(false);
        this.hasQueueError.set(true);
      }
    });
  }

  selectReport(id: number): void {
    if (this.selectedReportId() === id && this.selectedReport()) {
      return;
    }
    this.selectedReportId.set(id);
    this.isLoadingDetail.set(true);

    this.supervisionService.getRapportDetail(id).subscribe({
      next: (detail: RapportValidationDetail) => {
        this.selectedReport.set(detail);
        this.isLoadingDetail.set(false);
      },
      error: (err: unknown) => {
        console.error('Erreur chargement détail rapport:', err);
        this.isLoadingDetail.set(false);
      }
    });
  }

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
    this.loadQueue(true);
  }

  onSearch(val: string): void {
    this.searchQuery.set(val);
    this.loadQueue(true);
  }

  toggleSort(): void {
    const current = this.sortOption();
    const next = current === 'PRIORITE' ? 'DATE' : 'PRIORITE';
    this.sortOption.set(next);
    this.loadQueue(false);
    this.showToast('Tri mis à jour', `Tri actif : ${next === 'PRIORITE' ? 'Priorité clinique' : 'Date de soumission'}`);
  }

  validerSelection(): void {
    const report = this.selectedReport();
    if (!report) return;

    this.isActionInProgress.set(true);
    const comment = this.commentInput().trim();

    this.supervisionService.validerRapport(report.id, {
      commentaireMedecinChef: comment || undefined,
      certifierDhis2: true
    }).subscribe({
      next: (res: RapportValidationDetail) => {
        this.isActionInProgress.set(false);
        this.commentInput.set('');
        this.showToast(
          `Rapport ${res.numeroRapport} Validé`,
          'Synchronisation instantanée avec le registre DHIS2 District Dakar Ouest.'
        );
        this.loadOverview();
        this.loadQueue(true);
      },
      error: (err: unknown) => {
        console.error('Erreur validation rapport:', err);
        this.isActionInProgress.set(false);
        this.showToast('Erreur de validation', 'Impossible de synchroniser avec DHIS2.');
      }
    });
  }

  demanderComplement(): void {
    const report = this.selectedReport();
    if (!report) return;

    const motif = this.commentInput().trim();
    if (!motif) {
      this.showToast('Motif requis', 'Veuillez saisir les motifs du complément dans le champ ci-dessous.');
      return;
    }

    this.isActionInProgress.set(true);
    this.supervisionService.demanderComplement(report.id, { motif }).subscribe({
      next: (res: RapportValidationDetail) => {
        this.isActionInProgress.set(false);
        this.commentInput.set('');
        this.showToast(
          `Complément demandé pour ${res.numeroRapport}`,
          'Notification transmise sur le terminal mobile du relais de terrain.'
        );
        this.loadOverview();
        this.loadQueue(true);
      },
      error: (err: unknown) => {
        console.error('Erreur demande complément:', err);
        this.isActionInProgress.set(false);
        this.showToast('Erreur', 'Impossible de transmettre la demande de complément.');
      }
    });
  }

  validerLot(): void {
    this.isActionInProgress.set(true);
    this.supervisionService.validerLot().subscribe({
      next: (res: { message: string; rapportsValides: number }) => {
        this.isActionInProgress.set(false);
        this.showToast(
          `Validation par lot réussie`,
          `${res.rapportsValides} rapports de terrain certifiés et transmis à DHIS2.`
        );
        this.loadOverview();
        this.loadQueue(true);
      },
      error: (err: unknown) => {
        console.error('Erreur validation lot:', err);
        this.isActionInProgress.set(false);
        this.showToast('Erreur', 'Échec de la validation par lot.');
      }
    });
  }

  openLightbox(photo: PreuvePhoto): void {
    this.lightboxPhoto.set(photo);
  }

  closeLightbox(): void {
    this.lightboxPhoto.set(null);
  }

  printReport(): void {
    window.print();
  }

  showToast(title: string, subtitle: string): void {
    this.toastMessage.set({ title, subtitle });
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 4000);
  }
}
