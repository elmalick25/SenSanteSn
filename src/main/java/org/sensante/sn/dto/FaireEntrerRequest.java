package org.sensante.sn.dto;

public class FaireEntrerRequest {

    private Long idPatient;
    private String cabinet;

    public FaireEntrerRequest() {}

    public FaireEntrerRequest(Long idPatient, String cabinet) {
        this.idPatient = idPatient;
        this.cabinet = cabinet;
    }

    public Long getIdPatient() { return idPatient; }
    public void setIdPatient(Long idPatient) { this.idPatient = idPatient; }

    public String getCabinet() { return cabinet; }
    public void setCabinet(String cabinet) { this.cabinet = cabinet; }
}
