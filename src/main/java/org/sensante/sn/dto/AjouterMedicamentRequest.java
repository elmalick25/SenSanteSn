package org.sensante.sn.dto;

public class AjouterMedicamentRequest {

    private String nip;
    private String nomCommercial;
    private String dci;
    private String forme;
    private String posologiePonderale;
    private double doseCalculeeMl;
    private int doseCalculeeMg;
    private String frequenceRythme;
    private int dureeJours;
    private String indicationClinique;

    public AjouterMedicamentRequest() {}

    public String getNip() { return nip; }
    public void setNip(String nip) { this.nip = nip; }

    public String getNomCommercial() { return nomCommercial; }
    public void setNomCommercial(String nomCommercial) { this.nomCommercial = nomCommercial; }

    public String getDci() { return dci; }
    public void setDci(String dci) { this.dci = dci; }

    public String getForme() { return forme; }
    public void setForme(String forme) { this.forme = forme; }

    public String getPosologiePonderale() { return posologiePonderale; }
    public void setPosologiePonderale(String posologiePonderale) { this.posologiePonderale = posologiePonderale; }

    public double getDoseCalculeeMl() { return doseCalculeeMl; }
    public void setDoseCalculeeMl(double doseCalculeeMl) { this.doseCalculeeMl = doseCalculeeMl; }

    public int getDoseCalculeeMg() { return doseCalculeeMg; }
    public void setDoseCalculeeMg(int doseCalculeeMg) { this.doseCalculeeMg = doseCalculeeMg; }

    public String getFrequenceRythme() { return frequenceRythme; }
    public void setFrequenceRythme(String frequenceRythme) { this.frequenceRythme = frequenceRythme; }

    public int getDureeJours() { return dureeJours; }
    public void setDureeJours(int dureeJours) { this.dureeJours = dureeJours; }

    public String getIndicationClinique() { return indicationClinique; }
    public void setIndicationClinique(String indicationClinique) { this.indicationClinique = indicationClinique; }
}
