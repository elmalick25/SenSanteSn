package org.sensante.sn.dto;

/**
 * Représente un point de données mensuel pour l'histogramme Chart.js DHIS2 (10 mois).
 */
public class Dhis2MonthlyDataPointDTO {

    private String moisLibelle;  // "Janvier", "Février", …
    private String moisCourt;    // "J", "F", …, "OCT"
    private int volumeDepistages;
    private boolean estMoisActif;

    public Dhis2MonthlyDataPointDTO() {}

    public Dhis2MonthlyDataPointDTO(String moisLibelle, String moisCourt, int volumeDepistages, boolean estMoisActif) {
        this.moisLibelle = moisLibelle;
        this.moisCourt = moisCourt;
        this.volumeDepistages = volumeDepistages;
        this.estMoisActif = estMoisActif;
    }

    public String getMoisLibelle() { return moisLibelle; }
    public void setMoisLibelle(String moisLibelle) { this.moisLibelle = moisLibelle; }

    public String getMoisCourt() { return moisCourt; }
    public void setMoisCourt(String moisCourt) { this.moisCourt = moisCourt; }

    public int getVolumeDepistages() { return volumeDepistages; }
    public void setVolumeDepistages(int volumeDepistages) { this.volumeDepistages = volumeDepistages; }

    public boolean isEstMoisActif() { return estMoisActif; }
    public void setEstMoisActif(boolean estMoisActif) { this.estMoisActif = estMoisActif; }
}
