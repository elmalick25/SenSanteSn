package org.sensante.sn.dto;

import java.util.List;

public class CourbeCroissanceDTO {

    private String standardReference; // Ex: "Standards de croissance infantile Garçons OMS (0-24 mois)"
    private String sousTitre;
    private String commentaireVitesse;
    private String alerteClinique;
    private List<PointCourbeCroissanceDTO> points;

    public CourbeCroissanceDTO() {}

    public CourbeCroissanceDTO(String standardReference, String sousTitre, String commentaireVitesse,
                               String alerteClinique, List<PointCourbeCroissanceDTO> points) {
        this.standardReference = standardReference;
        this.sousTitre = sousTitre;
        this.commentaireVitesse = commentaireVitesse;
        this.alerteClinique = alerteClinique;
        this.points = points;
    }

    public String getStandardReference() { return standardReference; }
    public void setStandardReference(String standardReference) { this.standardReference = standardReference; }

    public String getSousTitre() { return sousTitre; }
    public void setSousTitre(String sousTitre) { this.sousTitre = sousTitre; }

    public String getCommentaireVitesse() { return commentaireVitesse; }
    public void setCommentaireVitesse(String commentaireVitesse) { this.commentaireVitesse = commentaireVitesse; }

    public String getAlerteClinique() { return alerteClinique; }
    public void setAlerteClinique(String alerteClinique) { this.alerteClinique = alerteClinique; }

    public List<PointCourbeCroissanceDTO> getPoints() { return points; }
    public void setPoints(List<PointCourbeCroissanceDTO> points) { this.points = points; }
}
