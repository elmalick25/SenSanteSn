package org.sensante.sn.dto;

/**
 * Bordereau archivé DHIS2 avec accusé de réception cryptographique MSAS.
 * Archivé sur 10 ans conformément à la directive MSAS / ANSD.
 */
public class Dhis2BordereauArchiveDTO {

    private Long id;
    private String moisAnnee;      // "Septembre 2024"
    private String moisAnneeCode;  // "202409"
    private String numeroAccuse;   // "ACK-202409-DKR02"
    private String dateClotureFormatee; // "04/10/2024"
    private String signataire;     // "Dr. A. Diallo"
    private String statut;         // "VALIDE", "EN_ATTENTE", "REJETÉ"
    private String hashSha256;     // Empreinte cryptographique de l'envoi
    private String telechargementUrl;

    public Dhis2BordereauArchiveDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMoisAnnee() { return moisAnnee; }
    public void setMoisAnnee(String moisAnnee) { this.moisAnnee = moisAnnee; }

    public String getMoisAnneeCode() { return moisAnneeCode; }
    public void setMoisAnneeCode(String moisAnneeCode) { this.moisAnneeCode = moisAnneeCode; }

    public String getNumeroAccuse() { return numeroAccuse; }
    public void setNumeroAccuse(String numeroAccuse) { this.numeroAccuse = numeroAccuse; }

    public String getDateClotureFormatee() { return dateClotureFormatee; }
    public void setDateClotureFormatee(String dateClotureFormatee) { this.dateClotureFormatee = dateClotureFormatee; }

    public String getSignataire() { return signataire; }
    public void setSignataire(String signataire) { this.signataire = signataire; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getHashSha256() { return hashSha256; }
    public void setHashSha256(String hashSha256) { this.hashSha256 = hashSha256; }

    public String getTelechargementUrl() { return telechargementUrl; }
    public void setTelechargementUrl(String telechargementUrl) { this.telechargementUrl = telechargementUrl; }
}
