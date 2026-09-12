package org.sensante.sn.dto;

public class ClotureKpiDTO {

    private int consultationsTerminees;
    private int consultationsTotal;
    private String ratioConsultationsClos;
    private double tempsMoyenMinutes;

    // Triage nutritionnel
    private int creniCount;
    private double creniPourcentage;
    private int crenasCount;
    private double crenasPourcentage;
    private int routineCount;
    private double routinePourcentage;

    // Dérive horaire
    private int deriveHoraireMinutes;
    private String deriveAbsorbeeHeure;
    private String picInitialHeure;
    private int picInitialMinutes;

    // Zéro paperasse
    private int fichesTeletransmises;
    private int fichesTotal;
    private String tauxTeletransmission;

    public ClotureKpiDTO() {}

    public int getConsultationsTerminees() { return consultationsTerminees; }
    public void setConsultationsTerminees(int consultationsTerminees) { this.consultationsTerminees = consultationsTerminees; }

    public int getConsultationsTotal() { return consultationsTotal; }
    public void setConsultationsTotal(int consultationsTotal) { this.consultationsTotal = consultationsTotal; }

    public String getRatioConsultationsClos() { return ratioConsultationsClos; }
    public void setRatioConsultationsClos(String ratioConsultationsClos) { this.ratioConsultationsClos = ratioConsultationsClos; }

    public double getTempsMoyenMinutes() { return tempsMoyenMinutes; }
    public void setTempsMoyenMinutes(double tempsMoyenMinutes) { this.tempsMoyenMinutes = tempsMoyenMinutes; }

    public int getCreniCount() { return creniCount; }
    public void setCreniCount(int creniCount) { this.creniCount = creniCount; }

    public double getCreniPourcentage() { return creniPourcentage; }
    public void setCreniPourcentage(double creniPourcentage) { this.creniPourcentage = creniPourcentage; }

    public int getCrenasCount() { return crenasCount; }
    public void setCrenasCount(int crenasCount) { this.crenasCount = crenasCount; }

    public double getCrenasPourcentage() { return crenasPourcentage; }
    public void setCrenasPourcentage(double crenasPourcentage) { this.crenasPourcentage = crenasPourcentage; }

    public int getRoutineCount() { return routineCount; }
    public void setRoutineCount(int routineCount) { this.routineCount = routineCount; }

    public double getRoutinePourcentage() { return routinePourcentage; }
    public void setRoutinePourcentage(double routinePourcentage) { this.routinePourcentage = routinePourcentage; }

    public int getDeriveHoraireMinutes() { return deriveHoraireMinutes; }
    public void setDeriveHoraireMinutes(int deriveHoraireMinutes) { this.deriveHoraireMinutes = deriveHoraireMinutes; }

    public String getDeriveAbsorbeeHeure() { return deriveAbsorbeeHeure; }
    public void setDeriveAbsorbeeHeure(String deriveAbsorbeeHeure) { this.deriveAbsorbeeHeure = deriveAbsorbeeHeure; }

    public String getPicInitialHeure() { return picInitialHeure; }
    public void setPicInitialHeure(String picInitialHeure) { this.picInitialHeure = picInitialHeure; }

    public int getPicInitialMinutes() { return picInitialMinutes; }
    public void setPicInitialMinutes(int picInitialMinutes) { this.picInitialMinutes = picInitialMinutes; }

    public int getFichesTeletransmises() { return fichesTeletransmises; }
    public void setFichesTeletransmises(int fichesTeletransmises) { this.fichesTeletransmises = fichesTeletransmises; }

    public int getFichesTotal() { return fichesTotal; }
    public void setFichesTotal(int fichesTotal) { this.fichesTotal = fichesTotal; }

    public String getTauxTeletransmission() { return tauxTeletransmission; }
    public void setTauxTeletransmission(String tauxTeletransmission) { this.tauxTeletransmission = tauxTeletransmission; }
}
