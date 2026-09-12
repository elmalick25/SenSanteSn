package org.sensante.sn.dto;

public class SigneDangerItemDTO {

    private String code;
    private String libelle;
    private String sousTitre;
    private boolean present;
    private boolean alerte;
    private String detailClinique;

    public SigneDangerItemDTO() {}

    public SigneDangerItemDTO(String code, String libelle, String sousTitre, boolean present, boolean alerte, String detailClinique) {
        this.code = code;
        this.libelle = libelle;
        this.sousTitre = sousTitre;
        this.present = present;
        this.alerte = alerte;
        this.detailClinique = detailClinique;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }

    public String getSousTitre() { return sousTitre; }
    public void setSousTitre(String sousTitre) { this.sousTitre = sousTitre; }

    public boolean isPresent() { return present; }
    public void setPresent(boolean present) { this.present = present; }

    public boolean isAlerte() { return alerte; }
    public void setAlerte(boolean alerte) { this.alerte = alerte; }

    public String getDetailClinique() { return detailClinique; }
    public void setDetailClinique(String detailClinique) { this.detailClinique = detailClinique; }
}
