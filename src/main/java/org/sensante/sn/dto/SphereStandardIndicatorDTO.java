package org.sensante.sn.dto;

/**
 * Indicateur de conformité aux Standards Humanitaires SPHERE (OMS).
 * Exemple : Taux de guérison > 75%, abandon < 15%, létalité < 3%.
 */
public class SphereStandardIndicatorDTO {

    private String code;          // "REC", "DEF", "DTH"
    private String libelle;       // "Guérison", "Abandon", "Létalité"
    private double valeurPourcent;
    private double seuilPourcent;
    private boolean seuilEstMinimum; // true => valeur doit être > seuil ; false => valeur doit être < seuil
    private boolean respecteNorme;
    private String libelleSeuil;  // "Seuil > 75%", "Seuil < 15%", "Seuil < 3%"
    private String couleur;       // "emerald", "teal", "amber", "red"
    // Pour le tracé SVG circular (stroke-dasharray)
    private double dashArrayValeur; // ex: 92.4 pour guérison, 18.6 pour abandon (proportion affichée 2.8/15*100)

    public SphereStandardIndicatorDTO() {}

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }

    public double getValeurPourcent() { return valeurPourcent; }
    public void setValeurPourcent(double valeurPourcent) { this.valeurPourcent = valeurPourcent; }

    public double getSeuilPourcent() { return seuilPourcent; }
    public void setSeuilPourcent(double seuilPourcent) { this.seuilPourcent = seuilPourcent; }

    public boolean isSeuilEstMinimum() { return seuilEstMinimum; }
    public void setSeuilEstMinimum(boolean seuilEstMinimum) { this.seuilEstMinimum = seuilEstMinimum; }

    public boolean isRespectedNorme() { return respecteNorme; }
    public void setRespectedNorme(boolean respecteNorme) { this.respecteNorme = respecteNorme; }

    public String getLibelleSeuil() { return libelleSeuil; }
    public void setLibelleSeuil(String libelleSeuil) { this.libelleSeuil = libelleSeuil; }

    public String getCouleur() { return couleur; }
    public void setCouleur(String couleur) { this.couleur = couleur; }

    public double getDashArrayValeur() { return dashArrayValeur; }
    public void setDashArrayValeur(double dashArrayValeur) { this.dashArrayValeur = dashArrayValeur; }
}
