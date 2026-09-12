package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SyncConflictDTO {
    private String id; // "conf-001"
    private String reference; // "#SEN-PED-2024-8841"
    private String badgePriorite; // "Priorité Clinique", "Arbitrage Requis", "Gouvernance"
    private String typePriorite; // "rose", "amber", "slate"
    private String titre; // "Conflit Posologie ATPE / Poids Patient"
    private String patientOuPraticien; // "Mamadou Diop (18 mois)"
    private String district; // "District Sanitaire de Kaolack"

    // Version Hors-Ligne
    private String sourceHorsLigne; // "Poste de santé Ndorong (Relais communautaire)"
    private String retardHorsLigne; // "Retard synchro : 48h"
    private String detailsHorsLigne; // "Poids 8.4 kg → Prescription 4 sachets ATPE / jour"

    // Version En Ligne (Serveur National)
    private String sourceEnLigne; // "Centre de Santé de Kaolack (Consultation pédiatrique)"
    private String detailsEnLigne; // "Poids 8.9 kg → Prescription 4 sachets"
    private String noteEnLigne; // "Pesée récente"

    private String statutResolution; // "EN_ATTENTE", "RESOLU_LOCAL", "RESOLU_SERVEUR"
}
