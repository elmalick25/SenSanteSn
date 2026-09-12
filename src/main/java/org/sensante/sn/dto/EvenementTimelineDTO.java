package org.sensante.sn.dto;

public class EvenementTimelineDTO {

    private Long idEvenement;
    private String dateLabel;
    private String relativeTime;
    private String titre;
    private String badgeStatut;
    private String badgeType; // "DANGER", "WARNING", "SUCCESS", "NEUTRAL"
    private String acteurNom;
    private String acteurRole;
    private String description;
    private String transmissionCanal;
    private String synchronisation;
    private String validation;
    private String puceIcone; // "!", "●", "✓", "★"

    public EvenementTimelineDTO() {}

    public EvenementTimelineDTO(Long idEvenement, String dateLabel, String relativeTime, String titre,
                                String badgeStatut, String badgeType, String acteurNom, String acteurRole,
                                String description, String transmissionCanal, String synchronisation,
                                String validation, String puceIcone) {
        this.idEvenement = idEvenement;
        this.dateLabel = dateLabel;
        this.relativeTime = relativeTime;
        this.titre = titre;
        this.badgeStatut = badgeStatut;
        this.badgeType = badgeType;
        this.acteurNom = acteurNom;
        this.acteurRole = acteurRole;
        this.description = description;
        this.transmissionCanal = transmissionCanal;
        this.synchronisation = synchronisation;
        this.validation = validation;
        this.puceIcone = puceIcone;
    }

    public Long getIdEvenement() { return idEvenement; }
    public void setIdEvenement(Long idEvenement) { this.idEvenement = idEvenement; }

    public String getDateLabel() { return dateLabel; }
    public void setDateLabel(String dateLabel) { this.dateLabel = dateLabel; }

    public String getRelativeTime() { return relativeTime; }
    public void setRelativeTime(String relativeTime) { this.relativeTime = relativeTime; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getBadgeStatut() { return badgeStatut; }
    public void setBadgeStatut(String badgeStatut) { this.badgeStatut = badgeStatut; }

    public String getBadgeType() { return badgeType; }
    public void setBadgeType(String badgeType) { this.badgeType = badgeType; }

    public String getActeurNom() { return acteurNom; }
    public void setActeurNom(String acteurNom) { this.acteurNom = acteurNom; }

    public String getActeurRole() { return acteurRole; }
    public void setActeurRole(String acteurRole) { this.acteurRole = acteurRole; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTransmissionCanal() { return transmissionCanal; }
    public void setTransmissionCanal(String transmissionCanal) { this.transmissionCanal = transmissionCanal; }

    public String getSynchronisation() { return synchronisation; }
    public void setSynchronisation(String synchronisation) { this.synchronisation = synchronisation; }

    public String getValidation() { return validation; }
    public void setValidation(String validation) { this.validation = validation; }

    public String getPuceIcone() { return puceIcone; }
    public void setPuceIcone(String puceIcone) { this.puceIcone = puceIcone; }
}
