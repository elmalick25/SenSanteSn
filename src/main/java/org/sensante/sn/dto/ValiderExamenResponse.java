package org.sensante.sn.dto;

public class ValiderExamenResponse {

    private boolean success;
    private String message;
    private String nip;
    private String brancheRetenue;
    private String codeConsultation;
    private String prochaineEtapeUrl;

    public ValiderExamenResponse() {}

    public ValiderExamenResponse(boolean success, String message, String nip, String brancheRetenue, String codeConsultation, String prochaineEtapeUrl) {
        this.success = success;
        this.message = message;
        this.nip = nip;
        this.brancheRetenue = brancheRetenue;
        this.codeConsultation = codeConsultation;
        this.prochaineEtapeUrl = prochaineEtapeUrl;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getNip() { return nip; }
    public void setNip(String nip) { this.nip = nip; }

    public String getBrancheRetenue() { return brancheRetenue; }
    public void setBrancheRetenue(String brancheRetenue) { this.brancheRetenue = brancheRetenue; }

    public String getCodeConsultation() { return codeConsultation; }
    public void setCodeConsultation(String codeConsultation) { this.codeConsultation = codeConsultation; }

    public String getProchaineEtapeUrl() { return prochaineEtapeUrl; }
    public void setProchaineEtapeUrl(String prochaineEtapeUrl) { this.prochaineEtapeUrl = prochaineEtapeUrl; }
}
