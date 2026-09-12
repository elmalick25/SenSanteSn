package org.sensante.sn.dto;

public class DocumentOfficielDTO {

    private String numeroOrdonnance;
    private String dateEmission;
    private String republiqueEnTete;
    private String ministereEnTete;
    private String structureEnTete;
    private String cabinetEnTete;
    private String praticienNom;
    private String praticienNumeroOrdre;
    private String praticienSpecialite;
    private String mentionAllergie;
    private String codeQrVerification;
    private String signatureCertificat;
    private String signatureHorodatage;

    public DocumentOfficielDTO() {}

    public DocumentOfficielDTO(String numeroOrdonnance, String dateEmission, String republiqueEnTete,
                               String ministereEnTete, String structureEnTete, String cabinetEnTete,
                               String praticienNom, String praticienNumeroOrdre, String praticienSpecialite,
                               String mentionAllergie, String codeQrVerification,
                               String signatureCertificat, String signatureHorodatage) {
        this.numeroOrdonnance = numeroOrdonnance;
        this.dateEmission = dateEmission;
        this.republiqueEnTete = republiqueEnTete;
        this.ministereEnTete = ministereEnTete;
        this.structureEnTete = structureEnTete;
        this.cabinetEnTete = cabinetEnTete;
        this.praticienNom = praticienNom;
        this.praticienNumeroOrdre = praticienNumeroOrdre;
        this.praticienSpecialite = praticienSpecialite;
        this.mentionAllergie = mentionAllergie;
        this.codeQrVerification = codeQrVerification;
        this.signatureCertificat = signatureCertificat;
        this.signatureHorodatage = signatureHorodatage;
    }

    public String getNumeroOrdonnance() { return numeroOrdonnance; }
    public void setNumeroOrdonnance(String numeroOrdonnance) { this.numeroOrdonnance = numeroOrdonnance; }

    public String getDateEmission() { return dateEmission; }
    public void setDateEmission(String dateEmission) { this.dateEmission = dateEmission; }

    public String getRepubliqueEnTete() { return republiqueEnTete; }
    public void setRepubliqueEnTete(String republiqueEnTete) { this.republiqueEnTete = republiqueEnTete; }

    public String getMinistereEnTete() { return ministereEnTete; }
    public void setMinistereEnTete(String ministereEnTete) { this.ministereEnTete = ministereEnTete; }

    public String getStructureEnTete() { return structureEnTete; }
    public void setStructureEnTete(String structureEnTete) { this.structureEnTete = structureEnTete; }

    public String getCabinetEnTete() { return cabinetEnTete; }
    public void setCabinetEnTete(String cabinetEnTete) { this.cabinetEnTete = cabinetEnTete; }

    public String getPraticienNom() { return praticienNom; }
    public void setPraticienNom(String praticienNom) { this.praticienNom = praticienNom; }

    public String getPraticienNumeroOrdre() { return praticienNumeroOrdre; }
    public void setPraticienNumeroOrdre(String praticienNumeroOrdre) { this.praticienNumeroOrdre = praticienNumeroOrdre; }

    public String getPraticienSpecialite() { return praticienSpecialite; }
    public void setPraticienSpecialite(String praticienSpecialite) { this.praticienSpecialite = praticienSpecialite; }

    public String getMentionAllergie() { return mentionAllergie; }
    public void setMentionAllergie(String mentionAllergie) { this.mentionAllergie = mentionAllergie; }

    public String getCodeQrVerification() { return codeQrVerification; }
    public void setCodeQrVerification(String codeQrVerification) { this.codeQrVerification = codeQrVerification; }

    public String getSignatureCertificat() { return signatureCertificat; }
    public void setSignatureCertificat(String signatureCertificat) { this.signatureCertificat = signatureCertificat; }

    public String getSignatureHorodatage() { return signatureHorodatage; }
    public void setSignatureHorodatage(String signatureHorodatage) { this.signatureHorodatage = signatureHorodatage; }
}
