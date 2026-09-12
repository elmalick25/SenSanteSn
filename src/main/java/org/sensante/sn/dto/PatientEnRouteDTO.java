package org.sensante.sn.dto;

public class PatientEnRouteDTO {

    private Long idPatient;
    private String nomComplet;
    private String ageLabel;
    private String avatarEnfant;
    private String transportLabel;
    private String heureEstimee;
    private String nomRelais;
    private String statutTransport;

    public PatientEnRouteDTO() {}

    public PatientEnRouteDTO(Long idPatient, String nomComplet, String ageLabel, String avatarEnfant,
                             String transportLabel, String heureEstimee, String nomRelais, String statutTransport) {
        this.idPatient = idPatient;
        this.nomComplet = nomComplet;
        this.ageLabel = ageLabel;
        this.avatarEnfant = avatarEnfant;
        this.transportLabel = transportLabel;
        this.heureEstimee = heureEstimee;
        this.nomRelais = nomRelais;
        this.statutTransport = statutTransport;
    }

    public Long getIdPatient() { return idPatient; }
    public void setIdPatient(Long idPatient) { this.idPatient = idPatient; }

    public String getNomComplet() { return nomComplet; }
    public void setNomComplet(String nomComplet) { this.nomComplet = nomComplet; }

    public String getAgeLabel() { return ageLabel; }
    public void setAgeLabel(String ageLabel) { this.ageLabel = ageLabel; }

    public String getAvatarEnfant() { return avatarEnfant; }
    public void setAvatarEnfant(String avatarEnfant) { this.avatarEnfant = avatarEnfant; }

    public String getTransportLabel() { return transportLabel; }
    public void setTransportLabel(String transportLabel) { this.transportLabel = transportLabel; }

    public String getHeureEstimee() { return heureEstimee; }
    public void setHeureEstimee(String heureEstimee) { this.heureEstimee = heureEstimee; }

    public String getNomRelais() { return nomRelais; }
    public void setNomRelais(String nomRelais) { this.nomRelais = nomRelais; }

    public String getStatutTransport() { return statutTransport; }
    public void setStatutTransport(String statutTransport) { this.statutTransport = statutTransport; }
}
