package org.sensante.sn.dto;

public class TestAppetitDTO {

    private String statut; // "POSITIF", "NEGATIF", "NON_EVALUE"
    private String statutBadge;
    private String rationConsommeeLabel;
    private int observationDureeMinutes;
    private boolean observationValidee;
    private String observationDetails;
    private String substanceTestee;
    private String portionIngeree;
    private String observationClinique;

    public TestAppetitDTO() {}

    public TestAppetitDTO(String statut, String statutBadge, String rationConsommeeLabel,
                          int observationDureeMinutes, boolean observationValidee,
                          String observationDetails, String substanceTestee,
                          String portionIngeree, String observationClinique) {
        this.statut = statut;
        this.statutBadge = statutBadge;
        this.rationConsommeeLabel = rationConsommeeLabel;
        this.observationDureeMinutes = observationDureeMinutes;
        this.observationValidee = observationValidee;
        this.observationDetails = observationDetails;
        this.substanceTestee = substanceTestee;
        this.portionIngeree = portionIngeree;
        this.observationClinique = observationClinique;
    }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getStatutBadge() { return statutBadge; }
    public void setStatutBadge(String statutBadge) { this.statutBadge = statutBadge; }

    public String getRationConsommeeLabel() { return rationConsommeeLabel; }
    public void setRationConsommeeLabel(String rationConsommeeLabel) { this.rationConsommeeLabel = rationConsommeeLabel; }

    public int getObservationDureeMinutes() { return observationDureeMinutes; }
    public void setObservationDureeMinutes(int observationDureeMinutes) { this.observationDureeMinutes = observationDureeMinutes; }

    public boolean isObservationValidee() { return observationValidee; }
    public void setObservationValidee(boolean observationValidee) { this.observationValidee = observationValidee; }

    public String getObservationDetails() { return observationDetails; }
    public void setObservationDetails(String observationDetails) { this.observationDetails = observationDetails; }

    public String getSubstanceTestee() { return substanceTestee; }
    public void setSubstanceTestee(String substanceTestee) { this.substanceTestee = substanceTestee; }

    public String getPortionIngeree() { return portionIngeree; }
    public void setPortionIngeree(String portionIngeree) { this.portionIngeree = portionIngeree; }

    public String getObservationClinique() { return observationClinique; }
    public void setObservationClinique(String observationClinique) { this.observationClinique = observationClinique; }
}
