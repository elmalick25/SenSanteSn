package org.sensante.sn.dto;

/**
 * Réponse après télétransmission officielle vers l'instance nationale DHIS2 MSAS v2.40.
 * Contient l'accusé de réception, l'empreinte SHA-256 et l'horodatage officiel.
 */
public class TeletransmissionDhis2Response {

    private boolean success;
    private String uuidTransmission;   // UUID unique de la transmission
    private String numeroAccuse;       // "ACK-202410-DKR02"
    private String empreinteSha256;    // Fingerprint cryptographique de la transmission
    private String message;
    private String dateHorodatage;     // ISO 8601 avec timezone Dakar

    public TeletransmissionDhis2Response() {}

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getUuidTransmission() { return uuidTransmission; }
    public void setUuidTransmission(String uuidTransmission) { this.uuidTransmission = uuidTransmission; }

    public String getNumeroAccuse() { return numeroAccuse; }
    public void setNumeroAccuse(String numeroAccuse) { this.numeroAccuse = numeroAccuse; }

    public String getEmpreinteSha256() { return empreinteSha256; }
    public void setEmpreinteSha256(String empreinteSha256) { this.empreinteSha256 = empreinteSha256; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getDateHorodatage() { return dateHorodatage; }
    public void setDateHorodatage(String dateHorodatage) { this.dateHorodatage = dateHorodatage; }
}
