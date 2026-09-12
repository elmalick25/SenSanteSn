package org.sensante.sn.dto;

public class BiometrieJourDTO {

    private double poidsKg;
    private String zScorePoids;
    private double tailleCm;
    private String zScoreTaille;
    private int pbMm;
    private String statutRubanShakir;
    private double perimetreCranienCm;
    private String percentilePc;
    private String interpretationPediatrique;
    private String actionProtocoleRecommandee;

    public BiometrieJourDTO() {}

    public BiometrieJourDTO(double poidsKg, String zScorePoids, double tailleCm, String zScoreTaille,
                            int pbMm, String statutRubanShakir, double perimetreCranienCm,
                            String percentilePc, String interpretationPediatrique,
                            String actionProtocoleRecommandee) {
        this.poidsKg = poidsKg;
        this.zScorePoids = zScorePoids;
        this.tailleCm = tailleCm;
        this.zScoreTaille = zScoreTaille;
        this.pbMm = pbMm;
        this.statutRubanShakir = statutRubanShakir;
        this.perimetreCranienCm = perimetreCranienCm;
        this.percentilePc = percentilePc;
        this.interpretationPediatrique = interpretationPediatrique;
        this.actionProtocoleRecommandee = actionProtocoleRecommandee;
    }

    public double getPoidsKg() { return poidsKg; }
    public void setPoidsKg(double poidsKg) { this.poidsKg = poidsKg; }

    public String getZScorePoids() { return zScorePoids; }
    public void setZScorePoids(String zScorePoids) { this.zScorePoids = zScorePoids; }

    public double getTailleCm() { return tailleCm; }
    public void setTailleCm(double tailleCm) { this.tailleCm = tailleCm; }

    public String getZScoreTaille() { return zScoreTaille; }
    public void setZScoreTaille(String zScoreTaille) { this.zScoreTaille = zScoreTaille; }

    public int getPbMm() { return pbMm; }
    public void setPbMm(int pbMm) { this.pbMm = pbMm; }

    public String getStatutRubanShakir() { return statutRubanShakir; }
    public void setStatutRubanShakir(String statutRubanShakir) { this.statutRubanShakir = statutRubanShakir; }

    public double getPerimetreCranienCm() { return perimetreCranienCm; }
    public void setPerimetreCranienCm(double perimetreCranienCm) { this.perimetreCranienCm = perimetreCranienCm; }

    public String getPercentilePc() { return percentilePc; }
    public void setPercentilePc(String percentilePc) { this.percentilePc = percentilePc; }

    public String getInterpretationPediatrique() { return interpretationPediatrique; }
    public void setInterpretationPediatrique(String interpretationPediatrique) { this.interpretationPediatrique = interpretationPediatrique; }

    public String getActionProtocoleRecommandee() { return actionProtocoleRecommandee; }
    public void setActionProtocoleRecommandee(String actionProtocoleRecommandee) { this.actionProtocoleRecommandee = actionProtocoleRecommandee; }
}
