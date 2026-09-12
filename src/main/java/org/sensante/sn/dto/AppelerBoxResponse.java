package org.sensante.sn.dto;

public class AppelerBoxResponse {
    /** EN_COURS | PATIENT_EN_ROUTE | CONFIRME | ERREUR */
    private String statut;
    private String message;
    private Long idCreneau;
    private String nomPatient;
    private String heurePrevue;

    public AppelerBoxResponse() {}

    public AppelerBoxResponse(String statut, String message, Long idCreneau,
                               String nomPatient, String heurePrevue) {
        this.statut = statut;
        this.message = message;
        this.idCreneau = idCreneau;
        this.nomPatient = nomPatient;
        this.heurePrevue = heurePrevue;
    }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Long getIdCreneau() { return idCreneau; }
    public void setIdCreneau(Long idCreneau) { this.idCreneau = idCreneau; }
    public String getNomPatient() { return nomPatient; }
    public void setNomPatient(String nomPatient) { this.nomPatient = nomPatient; }
    public String getHeurePrevue() { return heurePrevue; }
    public void setHeurePrevue(String heurePrevue) { this.heurePrevue = heurePrevue; }
}
