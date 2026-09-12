package org.sensante.sn.dto;

public class ConsultationEnCoursDTO {

    private Long idPatient;
    private String nomComplet;
    private String ageLabel;
    private String nomAccompagnant;
    private String avatarEnfant;
    private int pbMm;
    private double temperatureC;
    private double poidsKg;
    private String cabinet;
    private String medecinResponsable;
    private String chronoActuel;
    private int dureeEstimeeMin;
    private int progressionPourcent;

    public ConsultationEnCoursDTO() {}

    public ConsultationEnCoursDTO(Long idPatient, String nomComplet, String ageLabel, String nomAccompagnant,
                                  String avatarEnfant, int pbMm, double temperatureC, double poidsKg,
                                  String cabinet, String medecinResponsable, String chronoActuel,
                                  int dureeEstimeeMin, int progressionPourcent) {
        this.idPatient = idPatient;
        this.nomComplet = nomComplet;
        this.ageLabel = ageLabel;
        this.nomAccompagnant = nomAccompagnant;
        this.avatarEnfant = avatarEnfant;
        this.pbMm = pbMm;
        this.temperatureC = temperatureC;
        this.poidsKg = poidsKg;
        this.cabinet = cabinet;
        this.medecinResponsable = medecinResponsable;
        this.chronoActuel = chronoActuel;
        this.dureeEstimeeMin = dureeEstimeeMin;
        this.progressionPourcent = progressionPourcent;
    }

    public Long getIdPatient() { return idPatient; }
    public void setIdPatient(Long idPatient) { this.idPatient = idPatient; }

    public String getNomComplet() { return nomComplet; }
    public void setNomComplet(String nomComplet) { this.nomComplet = nomComplet; }

    public String getAgeLabel() { return ageLabel; }
    public void setAgeLabel(String ageLabel) { this.ageLabel = ageLabel; }

    public String getNomAccompagnant() { return nomAccompagnant; }
    public void setNomAccompagnant(String nomAccompagnant) { this.nomAccompagnant = nomAccompagnant; }

    public String getAvatarEnfant() { return avatarEnfant; }
    public void setAvatarEnfant(String avatarEnfant) { this.avatarEnfant = avatarEnfant; }

    public int getPbMm() { return pbMm; }
    public void setPbMm(int pbMm) { this.pbMm = pbMm; }

    public double getTemperatureC() { return temperatureC; }
    public void setTemperatureC(double temperatureC) { this.temperatureC = temperatureC; }

    public double getPoidsKg() { return poidsKg; }
    public void setPoidsKg(double poidsKg) { this.poidsKg = poidsKg; }

    public String getCabinet() { return cabinet; }
    public void setCabinet(String cabinet) { this.cabinet = cabinet; }

    public String getMedecinResponsable() { return medecinResponsable; }
    public void setMedecinResponsable(String medecinResponsable) { this.medecinResponsable = medecinResponsable; }

    public String getChronoActuel() { return chronoActuel; }
    public void setChronoActuel(String chronoActuel) { this.chronoActuel = chronoActuel; }

    public int getDureeEstimeeMin() { return dureeEstimeeMin; }
    public void setDureeEstimeeMin(int dureeEstimeeMin) { this.dureeEstimeeMin = dureeEstimeeMin; }

    public int getProgressionPourcent() { return progressionPourcent; }
    public void setProgressionPourcent(int progressionPourcent) { this.progressionPourcent = progressionPourcent; }
}
