package org.sensante.sn.dto;

public class FaireEntrerResponse {

    private boolean success;
    private String message;
    private Long idPatient;
    private String nomPatient;
    private String cabinet;
    private String heureEntree;
    private ConsultationEnCoursDTO consultationActive;

    public FaireEntrerResponse() {}

    public FaireEntrerResponse(boolean success, String message, Long idPatient, String nomPatient,
                               String cabinet, String heureEntree, ConsultationEnCoursDTO consultationActive) {
        this.success = success;
        this.message = message;
        this.idPatient = idPatient;
        this.nomPatient = nomPatient;
        this.cabinet = cabinet;
        this.heureEntree = heureEntree;
        this.consultationActive = consultationActive;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Long getIdPatient() { return idPatient; }
    public void setIdPatient(Long idPatient) { this.idPatient = idPatient; }

    public String getNomPatient() { return nomPatient; }
    public void setNomPatient(String nomPatient) { this.nomPatient = nomPatient; }

    public String getCabinet() { return cabinet; }
    public void setCabinet(String cabinet) { this.cabinet = cabinet; }

    public String getHeureEntree() { return heureEntree; }
    public void setHeureEntree(String heureEntree) { this.heureEntree = heureEntree; }

    public ConsultationEnCoursDTO getConsultationActive() { return consultationActive; }
    public void setConsultationActive(ConsultationEnCoursDTO consultationActive) { this.consultationActive = consultationActive; }
}
