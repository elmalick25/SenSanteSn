package org.sensante.sn.dto;

import java.util.List;

public class ExamenCliniquePcimeDTO {

    private PatientHeaderDTO patient;
    private String protocoleTitre;
    private String protocoleVersion;
    private String synchronisationSource;
    private boolean zScoreOmsValide;

    // Colonne 1 : Signes de Gravité & Danger
    private List<SigneDangerItemDTO> signesDanger;
    private int alertesDangerCount;
    private OedemeHydratationDTO oedemeHydratation;

    // Colonne 2 : Test d'Appétit & Biométrie
    private TestAppetitDTO testAppetit;
    private int pbMesureMm;
    private String pbClassification; // "MAM", "MAS", "NORMAL"
    private String pbZoneLabel;
    private double zScorePoidsTaille;
    private String zScoreLabel;

    // Colonne 3 : Arbre d'Orientation & Protocole Thérapeutique
    private List<OrientationBrancheDTO> branches;
    private String brancheRetenueCode; // "CRENAS" ou "CRENI"
    private String brancheRetenueBadge;
    private String statutValidationGlobal;

    public ExamenCliniquePcimeDTO() {}

    public PatientHeaderDTO getPatient() { return patient; }
    public void setPatient(PatientHeaderDTO patient) { this.patient = patient; }

    public String getProtocoleTitre() { return protocoleTitre; }
    public void setProtocoleTitre(String protocoleTitre) { this.protocoleTitre = protocoleTitre; }

    public String getProtocoleVersion() { return protocoleVersion; }
    public void setProtocoleVersion(String protocoleVersion) { this.protocoleVersion = protocoleVersion; }

    public String getSynchronisationSource() { return synchronisationSource; }
    public void setSynchronisationSource(String synchronisationSource) { this.synchronisationSource = synchronisationSource; }

    public boolean iszScoreOmsValide() { return zScoreOmsValide; }
    public void setzScoreOmsValide(boolean zScoreOmsValide) { this.zScoreOmsValide = zScoreOmsValide; }

    public List<SigneDangerItemDTO> getSignesDanger() { return signesDanger; }
    public void setSignesDanger(List<SigneDangerItemDTO> signesDanger) { this.signesDanger = signesDanger; }

    public int getAlertesDangerCount() { return alertesDangerCount; }
    public void setAlertesDangerCount(int alertesDangerCount) { this.alertesDangerCount = alertesDangerCount; }

    public OedemeHydratationDTO getOedemeHydratation() { return oedemeHydratation; }
    public void setOedemeHydratation(OedemeHydratationDTO oedemeHydratation) { this.oedemeHydratation = oedemeHydratation; }

    public TestAppetitDTO getTestAppetit() { return testAppetit; }
    public void setTestAppetit(TestAppetitDTO testAppetit) { this.testAppetit = testAppetit; }

    public int getPbMesureMm() { return pbMesureMm; }
    public void setPbMesureMm(int pbMesureMm) { this.pbMesureMm = pbMesureMm; }

    public String getPbClassification() { return pbClassification; }
    public void setPbClassification(String pbClassification) { this.pbClassification = pbClassification; }

    public String getPbZoneLabel() { return pbZoneLabel; }
    public void setPbZoneLabel(String pbZoneLabel) { this.pbZoneLabel = pbZoneLabel; }

    public double getzScorePoidsTaille() { return zScorePoidsTaille; }
    public void setzScorePoidsTaille(double zScorePoidsTaille) { this.zScorePoidsTaille = zScorePoidsTaille; }

    public String getzScoreLabel() { return zScoreLabel; }
    public void setzScoreLabel(String zScoreLabel) { this.zScoreLabel = zScoreLabel; }

    public List<OrientationBrancheDTO> getBranches() { return branches; }
    public void setBranches(List<OrientationBrancheDTO> branches) { this.branches = branches; }

    public String getBrancheRetenueCode() { return brancheRetenueCode; }
    public void setBrancheRetenueCode(String brancheRetenueCode) { this.brancheRetenueCode = brancheRetenueCode; }

    public String getBrancheRetenueBadge() { return brancheRetenueBadge; }
    public void setBrancheRetenueBadge(String brancheRetenueBadge) { this.brancheRetenueBadge = brancheRetenueBadge; }

    public String getStatutValidationGlobal() { return statutValidationGlobal; }
    public void setStatutValidationGlobal(String statutValidationGlobal) { this.statutValidationGlobal = statutValidationGlobal; }
}
