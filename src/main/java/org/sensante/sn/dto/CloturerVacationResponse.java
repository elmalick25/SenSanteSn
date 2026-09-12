package org.sensante.sn.dto;

public class CloturerVacationResponse {

    private boolean success;
    private String message;
    private String statut;
    private String certificatDhis2;
    private String horodatage;
    private String rapportPdfUrl;
    private String exportCsvUrl;

    public CloturerVacationResponse() {}

    public CloturerVacationResponse(boolean success, String message, String statut,
                                    String certificatDhis2, String horodatage,
                                    String rapportPdfUrl, String exportCsvUrl) {
        this.success = success;
        this.message = message;
        this.statut = statut;
        this.certificatDhis2 = certificatDhis2;
        this.horodatage = horodatage;
        this.rapportPdfUrl = rapportPdfUrl;
        this.exportCsvUrl = exportCsvUrl;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getCertificatDhis2() { return certificatDhis2; }
    public void setCertificatDhis2(String certificatDhis2) { this.certificatDhis2 = certificatDhis2; }

    public String getHorodatage() { return horodatage; }
    public void setHorodatage(String horodatage) { this.horodatage = horodatage; }

    public String getRapportPdfUrl() { return rapportPdfUrl; }
    public void setRapportPdfUrl(String rapportPdfUrl) { this.rapportPdfUrl = rapportPdfUrl; }

    public String getExportCsvUrl() { return exportCsvUrl; }
    public void setExportCsvUrl(String exportCsvUrl) { this.exportCsvUrl = exportCsvUrl; }
}
