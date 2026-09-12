package org.sensante.sn.dto;

import java.util.List;

public class ValiderExamenRequest {

    private String nip;
    private String brancheChoisie; // "CRENAS" ou "CRENI"
    private boolean avisReferentDemande;
    private String avisReferentNotes;
    private List<String> codesSignesDangerPresents;
    private String observationMedecin;

    public ValiderExamenRequest() {}

    public String getNip() { return nip; }
    public void setNip(String nip) { this.nip = nip; }

    public String getBrancheChoisie() { return brancheChoisie; }
    public void setBrancheChoisie(String brancheChoisie) { this.brancheChoisie = brancheChoisie; }

    public boolean isAvisReferentDemande() { return avisReferentDemande; }
    public void setAvisReferentDemande(boolean avisReferentDemande) { this.avisReferentDemande = avisReferentDemande; }

    public String getAvisReferentNotes() { return avisReferentNotes; }
    public void setAvisReferentNotes(String avisReferentNotes) { this.avisReferentNotes = avisReferentNotes; }

    public List<String> getCodesSignesDangerPresents() { return codesSignesDangerPresents; }
    public void setCodesSignesDangerPresents(List<String> codesSignesDangerPresents) { this.codesSignesDangerPresents = codesSignesDangerPresents; }

    public String getObservationMedecin() { return observationMedecin; }
    public void setObservationMedecin(String observationMedecin) { this.observationMedecin = observationMedecin; }
}
