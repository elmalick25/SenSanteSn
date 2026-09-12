package org.sensante.sn.dto;

public class PatientHeaderDTO {

    private Long idPatient;
    private String nomComplet;
    private String ageLabel;
    private String sexe;
    private String nip;
    private String statutNutritionnel;
    private String statutNutritionnelBadge;
    private String boxAssignation;
    private String avatarUrl;

    // Tutrice & Contact
    private String tutriceNom;
    private String tutriceLien;
    private String adresse;
    private String telephone;
    private String cni;

    // Drapeaux cliniques du sous-ruban
    private String groupeSanguin;
    private int pbMm;
    private String statutPbLabel;
    private double poidsActuelKg;
    private String zScorePoids;
    private String regimeAlimentaire;
    private double poidsNaissanceKg;
    private String mentionNaissance;

    // Allergie
    private boolean hasAllergie;
    private String allergieTitre;
    private String allergieDetail;

    // Vitals étendus consultation
    private double temperatureC;
    private String temperatureLabel;
    private int frequenceRespiratoire;
    private String frequenceRespiratoireLabel;

    public PatientHeaderDTO() {}

    public Long getIdPatient() { return idPatient; }
    public void setIdPatient(Long idPatient) { this.idPatient = idPatient; }

    public String getNomComplet() { return nomComplet; }
    public void setNomComplet(String nomComplet) { this.nomComplet = nomComplet; }

    public String getAgeLabel() { return ageLabel; }
    public void setAgeLabel(String ageLabel) { this.ageLabel = ageLabel; }

    public String getSexe() { return sexe; }
    public void setSexe(String sexe) { this.sexe = sexe; }

    public String getNip() { return nip; }
    public void setNip(String nip) { this.nip = nip; }

    public String getStatutNutritionnel() { return statutNutritionnel; }
    public void setStatutNutritionnel(String statutNutritionnel) { this.statutNutritionnel = statutNutritionnel; }

    public String getStatutNutritionnelBadge() { return statutNutritionnelBadge; }
    public void setStatutNutritionnelBadge(String statutNutritionnelBadge) { this.statutNutritionnelBadge = statutNutritionnelBadge; }

    public String getBoxAssignation() { return boxAssignation; }
    public void setBoxAssignation(String boxAssignation) { this.boxAssignation = boxAssignation; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getTutriceNom() { return tutriceNom; }
    public void setTutriceNom(String tutriceNom) { this.tutriceNom = tutriceNom; }

    public String getTutriceLien() { return tutriceLien; }
    public void setTutriceLien(String tutriceLien) { this.tutriceLien = tutriceLien; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getCni() { return cni; }
    public void setCni(String cni) { this.cni = cni; }

    public String getGroupeSanguin() { return groupeSanguin; }
    public void setGroupeSanguin(String groupeSanguin) { this.groupeSanguin = groupeSanguin; }

    public int getPbMm() { return pbMm; }
    public void setPbMm(int pbMm) { this.pbMm = pbMm; }

    public String getStatutPbLabel() { return statutPbLabel; }
    public void setStatutPbLabel(String statutPbLabel) { this.statutPbLabel = statutPbLabel; }

    public double getPoidsActuelKg() { return poidsActuelKg; }
    public void setPoidsActuelKg(double poidsActuelKg) { this.poidsActuelKg = poidsActuelKg; }

    public String getZScorePoids() { return zScorePoids; }
    public void setZScorePoids(String zScorePoids) { this.zScorePoids = zScorePoids; }

    public String getRegimeAlimentaire() { return regimeAlimentaire; }
    public void setRegimeAlimentaire(String regimeAlimentaire) { this.regimeAlimentaire = regimeAlimentaire; }

    public double getPoidsNaissanceKg() { return poidsNaissanceKg; }
    public void setPoidsNaissanceKg(double poidsNaissanceKg) { this.poidsNaissanceKg = poidsNaissanceKg; }

    public String getMentionNaissance() { return mentionNaissance; }
    public void setMentionNaissance(String mentionNaissance) { this.mentionNaissance = mentionNaissance; }

    public boolean isHasAllergie() { return hasAllergie; }
    public void setHasAllergie(boolean hasAllergie) { this.hasAllergie = hasAllergie; }

    public String getAllergieTitre() { return allergieTitre; }
    public void setAllergieTitre(String allergieTitre) { this.allergieTitre = allergieTitre; }

    public String getAllergieDetail() { return allergieDetail; }
    public void setAllergieDetail(String allergieDetail) { this.allergieDetail = allergieDetail; }

    public double getTemperatureC() { return temperatureC; }
    public void setTemperatureC(double temperatureC) { this.temperatureC = temperatureC; }

    public String getTemperatureLabel() { return temperatureLabel; }
    public void setTemperatureLabel(String temperatureLabel) { this.temperatureLabel = temperatureLabel; }

    public int getFrequenceRespiratoire() { return frequenceRespiratoire; }
    public void setFrequenceRespiratoire(int frequenceRespiratoire) { this.frequenceRespiratoire = frequenceRespiratoire; }

    public String getFrequenceRespiratoireLabel() { return frequenceRespiratoireLabel; }
    public void setFrequenceRespiratoireLabel(String frequenceRespiratoireLabel) { this.frequenceRespiratoireLabel = frequenceRespiratoireLabel; }
}
