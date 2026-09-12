package org.sensante.sn.dto;

public class FicheContreReferenceDTO {

    private String relaisNom;
    private String relaisSecteur;
    private String relaisPoste;
    private String relaisTelephone;
    private String frequenceVad;
    private String prochainControleDate;
    private String prochainControleHeure;
    private String prochainControleLieu;
    private String statutRdv;
    private String directivesAlerteAggravation;

    public FicheContreReferenceDTO() {}

    public FicheContreReferenceDTO(String relaisNom, String relaisSecteur, String relaisPoste,
                                   String relaisTelephone, String frequenceVad, String prochainControleDate,
                                   String prochainControleHeure, String prochainControleLieu,
                                   String statutRdv, String directivesAlerteAggravation) {
        this.relaisNom = relaisNom;
        this.relaisSecteur = relaisSecteur;
        this.relaisPoste = relaisPoste;
        this.relaisTelephone = relaisTelephone;
        this.frequenceVad = frequenceVad;
        this.prochainControleDate = prochainControleDate;
        this.prochainControleHeure = prochainControleHeure;
        this.prochainControleLieu = prochainControleLieu;
        this.statutRdv = statutRdv;
        this.directivesAlerteAggravation = directivesAlerteAggravation;
    }

    public String getRelaisNom() { return relaisNom; }
    public void setRelaisNom(String relaisNom) { this.relaisNom = relaisNom; }

    public String getRelaisSecteur() { return relaisSecteur; }
    public void setRelaisSecteur(String relaisSecteur) { this.relaisSecteur = relaisSecteur; }

    public String getRelaisPoste() { return relaisPoste; }
    public void setRelaisPoste(String relaisPoste) { this.relaisPoste = relaisPoste; }

    public String getRelaisTelephone() { return relaisTelephone; }
    public void setRelaisTelephone(String relaisTelephone) { this.relaisTelephone = relaisTelephone; }

    public String getFrequenceVad() { return frequenceVad; }
    public void setFrequenceVad(String frequenceVad) { this.frequenceVad = frequenceVad; }

    public String getProchainControleDate() { return prochainControleDate; }
    public void setProchainControleDate(String prochainControleDate) { this.prochainControleDate = prochainControleDate; }

    public String getProchainControleHeure() { return prochainControleHeure; }
    public void setProchainControleHeure(String prochainControleHeure) { this.prochainControleHeure = prochainControleHeure; }

    public String getProchainControleLieu() { return prochainControleLieu; }
    public void setProchainControleLieu(String prochainControleLieu) { this.prochainControleLieu = prochainControleLieu; }

    public String getStatutRdv() { return statutRdv; }
    public void setStatutRdv(String statutRdv) { this.statutRdv = statutRdv; }

    public String getDirectivesAlerteAggravation() { return directivesAlerteAggravation; }
    public void setDirectivesAlerteAggravation(String directivesAlerteAggravation) { this.directivesAlerteAggravation = directivesAlerteAggravation; }
}
