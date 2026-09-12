package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketAdmissionDTO {
    private String numeroTicket;         // "#CNV-2024-1015-89"
    private String qrCodeTexte;          // "CNV-1015-89-SEN"
    private String statutBadge;          // "Accès Prioritaire Immédiat"
    private String orientationTitre;     // "ORIENTATION DIRECTE : BOX PÉDIATRIE 1 — SANS PASSAGE PAR LA SALLE D'ATTENTE GÉNÉRALE"
    private String patientNom;           // "Mamadou Ndiaye"
    private String patientAgeTexte;      // "14 mois"
    private String matricule;            // "SEN-MED-2489"
    private String praticienNom;         // "Dr. Babacar Diop"
    private String boxNom;               // "Box 1 • Spécialiste MAS"
    private String heurePassage;         // "09:45 précises"
    private String datePassage;          // "Mardi 15 Octobre"
    private String tuteurNom;            // "Fatou Fall"
    private String tuteurTelephone;      // "+221 77 412 89 20"
    private String smsWolof;             // "Na dem Poste de Santé Médina bala 09h40. Duggil direct ci Box 1 Dr Diop, waxal ak Bajenu Gox Aïssatou Diop."
    private String signatureRegulation;  // "Régulation signée par Bajenu Gox Aïssatou Diop (Poste Médina Dakar)"
    private String versionReference;     // "Triage MAS v2.4 • Réf: RG-2024-998"
}
