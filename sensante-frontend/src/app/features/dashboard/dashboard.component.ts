import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { DemandeConsultation, StatutDemande } from '../../core/models/demande-consultation.model';
import { Enfant, StatutNutritionnel } from '../../core/models/enfant.model';
import { AlerteMAS } from '../../core/models/alerte-mas.model';

export type MedicalNavTab = 'demandes' | 'enfants' | 'alertes';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly dashboardService = inject(DashboardService);

  // État du Sidebar rétractable
  isSidebarCollapsed = signal<boolean>(false);
  activeTab = signal<MedicalNavTab>('demandes');

  // Filtres et recherche
  demandesFilter = signal<string>('ALL');
  searchTerm = signal<string>('');
  enfantsStatusFilter = signal<string>('ALL');

  // Consultation en cours / Modal d'examen clinique
  selectedDemande = signal<DemandeConsultation | null>(null);
  showConsultationModal = signal<boolean>(false);
  consultationNotes = signal<string>('');
  prescriptionSupplement = signal<string>('Plumpy\'Nut (ATPE - 3 sachets/jour)');
  consignesMedicales = signal<string>('Surveillance pondérale hebdomadaire et respect strict du protocole ANJE.');

  feedbackMessage = signal<{ type: 'success' | 'info' | 'danger'; text: string } | null>(null);

  // Liste filtrée des demandes de traitement
  filteredDemandes = computed(() => {
    const list = this.dashboardService.demandes();
    const filter = this.demandesFilter();
    const search = this.searchTerm().toLowerCase().trim();

    return list.filter(d => {
      const matchFilter = filter === 'ALL' || d.statut === filter;
      const matchSearch =
        search === '' ||
        d.enfant.nom.toLowerCase().includes(search) ||
        d.enfant.prenom.toLowerCase().includes(search) ||
        d.motif.toLowerCase().includes(search) ||
        (d.agentReferent && d.agentReferent.toLowerCase().includes(search));
      return matchFilter && matchSearch;
    });
  });

  // Liste filtrée des enfants / dossiers
  filteredEnfants = computed(() => {
    const list = this.dashboardService.enfants();
    const filter = this.enfantsStatusFilter();
    const search = this.searchTerm().toLowerCase().trim();

    return list.filter(e => {
      const matchFilter = filter === 'ALL' || e.dernierStatut === filter;
      const matchSearch =
        search === '' ||
        e.nom.toLowerCase().includes(search) ||
        e.prenom.toLowerCase().includes(search) ||
        (e.telephoneParent && e.telephoneParent.includes(search)) ||
        (e.qrCode && e.qrCode.toLowerCase().includes(search));
      return matchFilter && matchSearch;
    });
  });

  ngOnInit(): void {
    this.dashboardService.loadAllData().subscribe();
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(val => !val);
  }

  setTab(tab: MedicalNavTab): void {
    this.activeTab.set(tab);
    this.searchTerm.set('');
  }

  // Consultation et traitement du patient
  ouvrirConsultation(demande: DemandeConsultation): void {
    this.selectedDemande.set(demande);
    this.consultationNotes.set(demande.notesMedecin || '');
    this.showConsultationModal.set(true);
  }

  fermerConsultationModal(): void {
    this.showConsultationModal.set(false);
    this.selectedDemande.set(null);
  }

  validerPriseEnCharge(): void {
    const demande = this.selectedDemande();
    if (!demande) return;

    const note = `[Traité par Dr. Malick le ${new Date().toLocaleDateString('fr-FR')}] : ${this.consultationNotes()} | Traitement : ${this.prescriptionSupplement()} | Consignes : ${this.consignesMedicales()}`;
    this.dashboardService.updateDemandeStatut(demande.id, 'TRAITE', note);

    this.fermerConsultationModal();
    this.afficherFeedback('success', `Traitement validé pour le patient ${demande.enfant.prenom} ${demande.enfant.nom}.`);
  }

  marquerEnCours(demande: DemandeConsultation, event: Event): void {
    event.stopPropagation();
    this.dashboardService.updateDemandeStatut(demande.id, 'EN_COURS');
    this.afficherFeedback('info', `Consultation en cours pour ${demande.enfant.prenom} ${demande.enfant.nom}.`);
  }

  acquitterAlerte(alerte: AlerteMAS, event: Event): void {
    event.stopPropagation();
    if (!alerte.id) return;

    this.dashboardService.acquitterAlerte(alerte.id).subscribe({
      next: () => {
        this.afficherFeedback('success', `Alerte #${alerte.id} prise en charge avec succès.`);
      }
    });
  }

  calculerAgeMois(dateNaissanceStr: string): number {
    if (!dateNaissanceStr) return 12;
    const birth = new Date(dateNaissanceStr);
    const now = new Date();
    return Math.max(1, Math.round((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30.4375)));
  }

  afficherFeedback(type: 'success' | 'info' | 'danger', text: string): void {
    this.feedbackMessage.set({ type, text });
    setTimeout(() => {
      this.feedbackMessage.set(null);
    }, 4000);
  }

  logout(): void {
    this.authService.logout();
  }
}
