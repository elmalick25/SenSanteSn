package org.sensante.sn.dto;

public class AntecedentsNeonatalsDTO {

    private String materniteOrigine;
    private String termeGestationnel;
    private double poidsNaissanceG;
    private double tailleNaissanceCm;
    private double pcNaissanceCm;
    private String scoreApgar1min;
    private String scoreApgar5min;
    private String modeAccouchement;
    private String complicationsPerinatales;
    private String histoireAlimentaire;
    private String serologieVih;
    private String serologieSyphilis;
    private String serologieHbsAg;
    private String certifiePar;
    private boolean isRegistreValide;

    public AntecedentsNeonatalsDTO() {}

    public AntecedentsNeonatalsDTO(String materniteOrigine, String termeGestationnel, double poidsNaissanceG,
                                  double tailleNaissanceCm, double pcNaissanceCm, String scoreApgar1min,
                                  String scoreApgar5min, String modeAccouchement, String complicationsPerinatales,
                                  String histoireAlimentaire, String serologieVih, String serologieSyphilis,
                                  String serologieHbsAg, String certifiePar, boolean isRegistreValide) {
        this.materniteOrigine = materniteOrigine;
        this.termeGestationnel = termeGestationnel;
        this.poidsNaissanceG = poidsNaissanceG;
        this.tailleNaissanceCm = tailleNaissanceCm;
        this.pcNaissanceCm = pcNaissanceCm;
        this.scoreApgar1min = scoreApgar1min;
        this.scoreApgar5min = scoreApgar5min;
        this.modeAccouchement = modeAccouchement;
        this.complicationsPerinatales = complicationsPerinatales;
        this.histoireAlimentaire = histoireAlimentaire;
        this.serologieVih = serologieVih;
        this.serologieSyphilis = serologieSyphilis;
        this.serologieHbsAg = serologieHbsAg;
        this.certifiePar = certifiePar;
        this.isRegistreValide = isRegistreValide;
    }

    public String getMaterniteOrigine() { return materniteOrigine; }
    public void setMaterniteOrigine(String materniteOrigine) { this.materniteOrigine = materniteOrigine; }

    public String getTermeGestationnel() { return termeGestationnel; }
    public void setTermeGestationnel(String termeGestationnel) { this.termeGestationnel = termeGestationnel; }

    public double getPoidsNaissanceG() { return poidsNaissanceG; }
    public void setPoidsNaissanceG(double poidsNaissanceG) { this.poidsNaissanceG = poidsNaissanceG; }

    public double getTailleNaissanceCm() { return tailleNaissanceCm; }
    public void setTailleNaissanceCm(double tailleNaissanceCm) { this.tailleNaissanceCm = tailleNaissanceCm; }

    public double getPcNaissanceCm() { return pcNaissanceCm; }
    public void setPcNaissanceCm(double pcNaissanceCm) { this.pcNaissanceCm = pcNaissanceCm; }

    public String getScoreApgar1min() { return scoreApgar1min; }
    public void setScoreApgar1min(String scoreApgar1min) { this.scoreApgar1min = scoreApgar1min; }

    public String getScoreApgar5min() { return scoreApgar5min; }
    public void setScoreApgar5min(String scoreApgar5min) { this.scoreApgar5min = scoreApgar5min; }

    public String getModeAccouchement() { return modeAccouchement; }
    public void setModeAccouchement(String modeAccouchement) { this.modeAccouchement = modeAccouchement; }

    public String getComplicationsPerinatales() { return complicationsPerinatales; }
    public void setComplicationsPerinatales(String complicationsPerinatales) { this.complicationsPerinatales = complicationsPerinatales; }

    public String getHistoireAlimentaire() { return histoireAlimentaire; }
    public void setHistoireAlimentaire(String histoireAlimentaire) { this.histoireAlimentaire = histoireAlimentaire; }

    public String getSerologieVih() { return serologieVih; }
    public void setSerologieVih(String serologieVih) { this.serologieVih = serologieVih; }

    public String getSerologieSyphilis() { return serologieSyphilis; }
    public void setSerologieSyphilis(String serologieSyphilis) { this.serologieSyphilis = serologieSyphilis; }

    public String getSerologieHbsAg() { return serologieHbsAg; }
    public void setSerologieHbsAg(String serologieHbsAg) { this.serologieHbsAg = serologieHbsAg; }

    public String getCertifiePar() { return certifiePar; }
    public void setCertifiePar(String certifiePar) { this.certifiePar = certifiePar; }

    public boolean isRegistreValide() { return isRegistreValide; }
    public void setRegistreValide(boolean registreValide) { isRegistreValide = registreValide; }
}
