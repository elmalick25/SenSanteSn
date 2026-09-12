package org.sensante.sn.dto;

/**
 * Requête de télétransmission officielle vers l'instance nationale DHIS2 MSAS v2.40.
 */
public class TeletransmissionDhis2Request {

    private String periode;       // "202410"
    private String codeDistrict;  // "DKR-OUEST"
    private String observations;
    private String signataire;    // "Dr. Aminata Diallo"

    public TeletransmissionDhis2Request() {}

    public String getPeriode() { return periode; }
    public void setPeriode(String periode) { this.periode = periode; }

    public String getCodeDistrict() { return codeDistrict; }
    public void setCodeDistrict(String codeDistrict) { this.codeDistrict = codeDistrict; }

    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }

    public String getSignataire() { return signataire; }
    public void setSignataire(String signataire) { this.signataire = signataire; }
}
