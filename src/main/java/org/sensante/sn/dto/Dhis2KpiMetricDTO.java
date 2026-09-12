package org.sensante.sn.dto;

import java.util.List;

/**
 * Représente une métrique KPI de la page Studio DHIS2 avec sparkline.
 */
public class Dhis2KpiMetricDTO {

    private String code;
    private String libelle;
    private String valeurFormatee;
    private double valeur;
    private String variationPourcent;
    private boolean variationPositive;
    private String sousTitre;
    private String couleurTheme; // "emerald", "teal", "amber", "blue"
    private String icone;
    private List<Double> sparklinePoints; // Points relatifs [0..100] pour SVG

    public Dhis2KpiMetricDTO() {}

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }

    public String getValeurFormatee() { return valeurFormatee; }
    public void setValeurFormatee(String valeurFormatee) { this.valeurFormatee = valeurFormatee; }

    public double getValeur() { return valeur; }
    public void setValeur(double valeur) { this.valeur = valeur; }

    public String getVariationPourcent() { return variationPourcent; }
    public void setVariationPourcent(String variationPourcent) { this.variationPourcent = variationPourcent; }

    public boolean isVariationPositive() { return variationPositive; }
    public void setVariationPositive(boolean variationPositive) { this.variationPositive = variationPositive; }

    public String getSousTitre() { return sousTitre; }
    public void setSousTitre(String sousTitre) { this.sousTitre = sousTitre; }

    public String getCouleurTheme() { return couleurTheme; }
    public void setCouleurTheme(String couleurTheme) { this.couleurTheme = couleurTheme; }

    public String getIcone() { return icone; }
    public void setIcone(String icone) { this.icone = icone; }

    public List<Double> getSparklinePoints() { return sparklinePoints; }
    public void setSparklinePoints(List<Double> sparklinePoints) { this.sparklinePoints = sparklinePoints; }
}
