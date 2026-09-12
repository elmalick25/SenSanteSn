package org.sensante.sn.dto;

public class GenererOrdonnanceResponse {

    private boolean success;
    private String message;
    private String numeroOrdonnance;
    private String nip;
    private String codeQrVerification;
    private String signatureCertificat;
    private String urlTelechargementPdf;
    private boolean smsNotifie;

    public GenererOrdonnanceResponse() {}

    public GenererOrdonnanceResponse(boolean success, String message, String numeroOrdonnance,
                                    String nip, String codeQrVerification, String signatureCertificat,
                                    String urlTelechargementPdf, boolean smsNotifie) {
        this.success = success;
        this.message = message;
        this.numeroOrdonnance = numeroOrdonnance;
        this.nip = nip;
        this.codeQrVerification = codeQrVerification;
        this.signatureCertificat = signatureCertificat;
        this.urlTelechargementPdf = urlTelechargementPdf;
        this.smsNotifie = smsNotifie;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getNumeroOrdonnance() { return numeroOrdonnance; }
    public void setNumeroOrdonnance(String numeroOrdonnance) { this.numeroOrdonnance = numeroOrdonnance; }

    public String getNip() { return nip; }
    public void setNip(String nip) { this.nip = nip; }

    public String getCodeQrVerification() { return codeQrVerification; }
    public void setCodeQrVerification(String codeQrVerification) { this.codeQrVerification = codeQrVerification; }

    public String getSignatureCertificat() { return signatureCertificat; }
    public void setSignatureCertificat(String signatureCertificat) { this.signatureCertificat = signatureCertificat; }

    public String getUrlTelechargementPdf() { return urlTelechargementPdf; }
    public void setUrlTelechargementPdf(String urlTelechargementPdf) { this.urlTelechargementPdf = urlTelechargementPdf; }

    public boolean isSmsNotifie() { return smsNotifie; }
    public void setSmsNotifie(boolean smsNotifie) { this.smsNotifie = smsNotifie; }
}
