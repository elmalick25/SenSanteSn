package org.sensante.sn.dto;

public class DoseVaccinPevDTO {

    private String agePrevu;
    private String nomAntigenes;
    private String descriptionMaladies;
    private String dateReelle;
    private String statut; // "VALIDE", "A_VENIR", "EN_RETARD"
    private String badgeLabel;

    public DoseVaccinPevDTO() {}

    public DoseVaccinPevDTO(String agePrevu, String nomAntigenes, String descriptionMaladies,
                            String dateReelle, String statut, String badgeLabel) {
        this.agePrevu = agePrevu;
        this.nomAntigenes = nomAntigenes;
        this.descriptionMaladies = descriptionMaladies;
        this.dateReelle = dateReelle;
        this.statut = statut;
        this.badgeLabel = badgeLabel;
    }

    public String getAgePrevu() { return agePrevu; }
    public void setAgePrevu(String agePrevu) { this.agePrevu = agePrevu; }

    public String getNomAntigenes() { return nomAntigenes; }
    public void setNomAntigenes(String nomAntigenes) { this.nomAntigenes = nomAntigenes; }

    public String getDescriptionMaladies() { return descriptionMaladies; }
    public void setDescriptionMaladies(String descriptionMaladies) { this.descriptionMaladies = descriptionMaladies; }

    public String getDateReelle() { return dateReelle; }
    public void setDateReelle(String dateReelle) { this.dateReelle = dateReelle; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getBadgeLabel() { return badgeLabel; }
    public void setBadgeLabel(String badgeLabel) { this.badgeLabel = badgeLabel; }
}
