package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditStatsDTO {
    // 1. Souveraineté des Données
    private double indiceSouverainete; // ex: 99.8%
    private String variationSouverainete; // ex: "+0.4%"
    private String descriptionSouverainete; // "100% des hébergements certifiés sur le territoire sénégalais"

    // 2. Respect Secret Médical ONMS
    private double scoreSecretMedical; // ex: 98.4%
    private String statutSecretMedical; // "Conforme"
    private String descriptionSecretMedical; // "Index d'accès cloisonné selon le serment de l'Ordre des Médecins"

    // 3. Adoption MFA Personnel
    private double adoptionMfa; // ex: 99.4%
    private String variationMfa; // ex: "+1.8%"
    private long praticiensMfaActifs; // ex: 18420
    private String descriptionMfa; // "Authentification biométrique / OTP active pour 18 420 praticiens"

    // 4. Intégrité & Fuite de Données
    private int incidentsSecurite; // 0
    private String statutAudit; // "Audit Sans Réserve"
    private String descriptionIntegrite; // "Aucune exfiltration avérée ni violation de données sur 365 jours"

    // Métadonnées d'arbitrage
    private String horodatageArbitrage; // "07 Novembre 2024 — 11:42:18 GMT"
    private String serveurSouverain; // "Datacenter National ADIE (Diamniadio)"
    private String periodeConsolidee; // "T4 2024 (Consolidé)"
}
