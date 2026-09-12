package org.sensante.sn.dto;

import java.util.List;

/**
 * DTO d'agrégation globale pour le Studio Télémétrie DHIS2 — RMAN.
 * Consolide toutes les données nécessaires à l'écran Exports DHIS2.
 */
public class Dhis2StudioOverviewDTO {

    // Métadonnées d'en-tête
    private String uuidBordereau;          // "SEN-DKR-W-202410-V3"
    private String periodeMoisAnnee;       // "Octobre 2024"
    private String periodCode;             // "202410"
    private String instanceVersion;        // "MSAS v2.40"
    private int consolidationTotal;        // 18
    private int consolidationRecu;         // 18
    private double consolidationPourcent;  // 100.0
    private long dernierSyncMinutes;       // 3
    private String empreinteSha256;        // "7f2b9a1...c04e"

    // 4 KPIs
    private Dhis2KpiMetricDTO kpiDepistagesMasMam;
    private Dhis2KpiMetricDTO kpiAdmissionsCrenas;
    private Dhis2KpiMetricDTO kpiHospitalisationsCreni;
    private Dhis2KpiMetricDTO kpiConsommationAtpe;

    // Histogramme mensuel 10 mois (Janv - Oct 2024)
    private List<Dhis2MonthlyDataPointDTO> historiqueMensuel;

    // Indicateurs SPHERE (3 jauges)
    private List<SphereStandardIndicatorDTO> indicateursSphere;

    // Objectifs PRN (4 cibles nationales)
    private List<PrnNationalTargetDTO> objectifsPrn;

    // Bordereaux archivés (3 derniers mois)
    private List<Dhis2BordereauArchiveDTO> archivesBordereaux;

    public Dhis2StudioOverviewDTO() {}

    public String getUuidBordereau() { return uuidBordereau; }
    public void setUuidBordereau(String uuidBordereau) { this.uuidBordereau = uuidBordereau; }

    public String getPeriodeMoisAnnee() { return periodeMoisAnnee; }
    public void setPeriodeMoisAnnee(String periodeMoisAnnee) { this.periodeMoisAnnee = periodeMoisAnnee; }

    public String getPeriodCode() { return periodCode; }
    public void setPeriodCode(String periodCode) { this.periodCode = periodCode; }

    public String getInstanceVersion() { return instanceVersion; }
    public void setInstanceVersion(String instanceVersion) { this.instanceVersion = instanceVersion; }

    public int getConsolidationTotal() { return consolidationTotal; }
    public void setConsolidationTotal(int consolidationTotal) { this.consolidationTotal = consolidationTotal; }

    public int getConsolidationRecu() { return consolidationRecu; }
    public void setConsolidationRecu(int consolidationRecu) { this.consolidationRecu = consolidationRecu; }

    public double getConsolidationPourcent() { return consolidationPourcent; }
    public void setConsolidationPourcent(double consolidationPourcent) { this.consolidationPourcent = consolidationPourcent; }

    public long getDernierSyncMinutes() { return dernierSyncMinutes; }
    public void setDernierSyncMinutes(long dernierSyncMinutes) { this.dernierSyncMinutes = dernierSyncMinutes; }

    public String getEmpreinteSha256() { return empreinteSha256; }
    public void setEmpreinteSha256(String empreinteSha256) { this.empreinteSha256 = empreinteSha256; }

    public Dhis2KpiMetricDTO getKpiDepistagesMasMam() { return kpiDepistagesMasMam; }
    public void setKpiDepistagesMasMam(Dhis2KpiMetricDTO kpiDepistagesMasMam) { this.kpiDepistagesMasMam = kpiDepistagesMasMam; }

    public Dhis2KpiMetricDTO getKpiAdmissionsCrenas() { return kpiAdmissionsCrenas; }
    public void setKpiAdmissionsCrenas(Dhis2KpiMetricDTO kpiAdmissionsCrenas) { this.kpiAdmissionsCrenas = kpiAdmissionsCrenas; }

    public Dhis2KpiMetricDTO getKpiHospitalisationsCreni() { return kpiHospitalisationsCreni; }
    public void setKpiHospitalisationsCreni(Dhis2KpiMetricDTO kpiHospitalisationsCreni) { this.kpiHospitalisationsCreni = kpiHospitalisationsCreni; }

    public Dhis2KpiMetricDTO getKpiConsommationAtpe() { return kpiConsommationAtpe; }
    public void setKpiConsommationAtpe(Dhis2KpiMetricDTO kpiConsommationAtpe) { this.kpiConsommationAtpe = kpiConsommationAtpe; }

    public List<Dhis2MonthlyDataPointDTO> getHistoriqueMensuel() { return historiqueMensuel; }
    public void setHistoriqueMensuel(List<Dhis2MonthlyDataPointDTO> historiqueMensuel) { this.historiqueMensuel = historiqueMensuel; }

    public List<SphereStandardIndicatorDTO> getIndicateursSphere() { return indicateursSphere; }
    public void setIndicateursSphere(List<SphereStandardIndicatorDTO> indicateursSphere) { this.indicateursSphere = indicateursSphere; }

    public List<PrnNationalTargetDTO> getObjectifsPrn() { return objectifsPrn; }
    public void setObjectifsPrn(List<PrnNationalTargetDTO> objectifsPrn) { this.objectifsPrn = objectifsPrn; }

    public List<Dhis2BordereauArchiveDTO> getArchivesBordereaux() { return archivesBordereaux; }
    public void setArchivesBordereaux(List<Dhis2BordereauArchiveDTO> archivesBordereaux) { this.archivesBordereaux = archivesBordereaux; }
}
