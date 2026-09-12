export interface AuditStats {
  indiceSouverainete: number;
  variationSouverainete: string;
  descriptionSouverainete: string;

  scoreSecretMedical: number;
  statutSecretMedical: string;
  descriptionSecretMedical: string;

  adoptionMfa: number;
  variationMfa: string;
  praticiensMfaActifs: number;
  descriptionMfa: string;

  incidentsSecurite: number;
  statutAudit: string;
  descriptionIntegrite: string;

  horodatageArbitrage: string;
  serveurSouverain: string;
  periodeConsolidee: string;
}

export interface RegionalCompliance {
  region: string;
  structuresAuditees: string;
  scoreSsi: number;
  grade: string;
  accesJustifies: number;
  totalAcces: number;
  pourcentageJustifie: number;
  statutLegal: 'Homologué' | 'Sous revue';
  noteAlerte?: string;
}

export interface LegalAuditLog {
  id: number;
  titre: string;
  dateAudit: string;
  organisme: string;
  description: string;
  hashSha256: string;
  labelSignature: string;
  statut: string;
  documentPdfUrl?: string;
}

export interface MacroFlowPoint {
  labelDate: string;
  volumePediatrie: number;
  volumeMaternite: number;
  volumeUrgences: number;
  volumePharmacie: number;
}

export interface GeneratedReportResult {
  statut: string;
  reference: string;
  certificatSha256: string;
  message: string;
}
