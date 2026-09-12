package org.sensante.sn.dto;

public class CloturerVacationRequest {

    private String cabinet;
    private String dateVacation;
    private boolean brouillonSeulement;
    private String commentairePraticien;

    public CloturerVacationRequest() {}

    public String getCabinet() { return cabinet; }
    public void setCabinet(String cabinet) { this.cabinet = cabinet; }

    public String getDateVacation() { return dateVacation; }
    public void setDateVacation(String dateVacation) { this.dateVacation = dateVacation; }

    public boolean isBrouillonSeulement() { return brouillonSeulement; }
    public void setBrouillonSeulement(boolean brouillonSeulement) { this.brouillonSeulement = brouillonSeulement; }

    public String getCommentairePraticien() { return commentairePraticien; }
    public void setCommentairePraticien(String commentairePraticien) { this.commentairePraticien = commentairePraticien; }
}
