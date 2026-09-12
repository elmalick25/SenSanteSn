package org.sensante.sn.dto;

public class AppelerBoxRequest {
    private Long idCreneau;
    private String motif;

    public AppelerBoxRequest() {}

    public Long getIdCreneau() { return idCreneau; }
    public void setIdCreneau(Long idCreneau) { this.idCreneau = idCreneau; }
    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }
}
