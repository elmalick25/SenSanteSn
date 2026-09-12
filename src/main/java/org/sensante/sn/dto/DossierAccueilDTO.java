package org.sensante.sn.dto;

public class DossierAccueilDTO {

    private Long idPatient;
    private EnfantIdentite enfant;
    private TuteurIdentite tuteur;
    private ConstantesPointage constantes;
    private TransmissionRelais transmission;
    private AlerteClinique alerte;

    public DossierAccueilDTO() {}

    public DossierAccueilDTO(Long idPatient, EnfantIdentite enfant, TuteurIdentite tuteur,
                             ConstantesPointage constantes, TransmissionRelais transmission,
                             AlerteClinique alerte) {
        this.idPatient = idPatient;
        this.enfant = enfant;
        this.tuteur = tuteur;
        this.constantes = constantes;
        this.transmission = transmission;
        this.alerte = alerte;
    }

    public Long getIdPatient() { return idPatient; }
    public void setIdPatient(Long idPatient) { this.idPatient = idPatient; }

    public EnfantIdentite getEnfant() { return enfant; }
    public void setEnfant(EnfantIdentite enfant) { this.enfant = enfant; }

    public TuteurIdentite getTuteur() { return tuteur; }
    public void setTuteur(TuteurIdentite tuteur) { this.tuteur = tuteur; }

    public ConstantesPointage getConstantes() { return constantes; }
    public void setConstantes(ConstantesPointage constantes) { this.constantes = constantes; }

    public TransmissionRelais getTransmission() { return transmission; }
    public void setTransmission(TransmissionRelais transmission) { this.transmission = transmission; }

    public AlerteClinique getAlerte() { return alerte; }
    public void setAlerte(AlerteClinique alerte) { this.alerte = alerte; }

    // =========================================================================
    // Inner Value Objects
    // =========================================================================

    public static class EnfantIdentite {
        private String nomComplet;
        private String dateNaissance;
        private String ageLabel;
        private String sexe;
        private String nip;
        private String avatarUrl;
        private String groupeSanguin;
        private String rangFratrie;
        private String couvertureVaccinale;
        private boolean vaccinsAjour;

        public EnfantIdentite() {}

        public EnfantIdentite(String nomComplet, String dateNaissance, String ageLabel, String sexe,
                              String nip, String avatarUrl, String groupeSanguin, String rangFratrie,
                              String couvertureVaccinale, boolean vaccinsAjour) {
            this.nomComplet = nomComplet;
            this.dateNaissance = dateNaissance;
            this.ageLabel = ageLabel;
            this.sexe = sexe;
            this.nip = nip;
            this.avatarUrl = avatarUrl;
            this.groupeSanguin = groupeSanguin;
            this.rangFratrie = rangFratrie;
            this.couvertureVaccinale = couvertureVaccinale;
            this.vaccinsAjour = vaccinsAjour;
        }

        public String getNomComplet() { return nomComplet; }
        public void setNomComplet(String nomComplet) { this.nomComplet = nomComplet; }

        public String getDateNaissance() { return dateNaissance; }
        public void setDateNaissance(String dateNaissance) { this.dateNaissance = dateNaissance; }

        public String getAgeLabel() { return ageLabel; }
        public void setAgeLabel(String ageLabel) { this.ageLabel = ageLabel; }

        public String getSexe() { return sexe; }
        public void setSexe(String sexe) { this.sexe = sexe; }

        public String getNip() { return nip; }
        public void setNip(String nip) { this.nip = nip; }

        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

        public String getGroupeSanguin() { return groupeSanguin; }
        public void setGroupeSanguin(String groupeSanguin) { this.groupeSanguin = groupeSanguin; }

        public String getRangFratrie() { return rangFratrie; }
        public void setRangFratrie(String rangFratrie) { this.rangFratrie = rangFratrie; }

        public String getCouvertureVaccinale() { return couvertureVaccinale; }
        public void setCouvertureVaccinale(String couvertureVaccinale) { this.couvertureVaccinale = couvertureVaccinale; }

        public boolean isVaccinsAjour() { return vaccinsAjour; }
        public void setVaccinsAjour(boolean vaccinsAjour) { this.vaccinsAjour = vaccinsAjour; }
    }

    public static class TuteurIdentite {
        private String nomComplet;
        private String lienParente;
        private String adresse;
        private String cni;
        private String telephone;
        private String priseEnCharge;
        private String delegationParentale;
        private String avatarUrl;

        public TuteurIdentite() {}

        public TuteurIdentite(String nomComplet, String lienParente, String adresse, String cni,
                              String telephone, String priseEnCharge, String delegationParentale,
                              String avatarUrl) {
            this.nomComplet = nomComplet;
            this.lienParente = lienParente;
            this.adresse = adresse;
            this.cni = cni;
            this.telephone = telephone;
            this.priseEnCharge = priseEnCharge;
            this.delegationParentale = delegationParentale;
            this.avatarUrl = avatarUrl;
        }

        public String getNomComplet() { return nomComplet; }
        public void setNomComplet(String nomComplet) { this.nomComplet = nomComplet; }

        public String getLienParente() { return lienParente; }
        public void setLienParente(String lienParente) { this.lienParente = lienParente; }

        public String getAdresse() { return adresse; }
        public void setAdresse(String adresse) { this.adresse = adresse; }

        public String getCNI() { return cni; }
        public void setCNI(String cni) { this.cni = cni; }

        public String getTelephone() { return telephone; }
        public void setTelephone(String telephone) { this.telephone = telephone; }

        public String getPriseEnCharge() { return priseEnCharge; }
        public void setPriseEnCharge(String priseEnCharge) { this.priseEnCharge = priseEnCharge; }

        public String getDelegationParentale() { return delegationParentale; }
        public void setDelegationParentale(String delegationParentale) { this.delegationParentale = delegationParentale; }

        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    }

    public static class ConstantesPointage {
        private double poidsKg;
        private String variationPoids;
        private int pbMm;
        private String statutPb;
        private double temperatureC;
        private String statutTemperature;
        private String testAppetit;
        private String detailAppetit;
        private String heurePointage;
        private String agentPointage;
        private String materielPointage;

        public ConstantesPointage() {}

        public ConstantesPointage(double poidsKg, String variationPoids, int pbMm, String statutPb,
                                  double temperatureC, String statutTemperature, String testAppetit,
                                  String detailAppetit, String heurePointage, String agentPointage,
                                  String materielPointage) {
            this.poidsKg = poidsKg;
            this.variationPoids = variationPoids;
            this.pbMm = pbMm;
            this.statutPb = statutPb;
            this.temperatureC = temperatureC;
            this.statutTemperature = statutTemperature;
            this.testAppetit = testAppetit;
            this.detailAppetit = detailAppetit;
            this.heurePointage = heurePointage;
            this.agentPointage = agentPointage;
            this.materielPointage = materielPointage;
        }

        public double getPoidsKg() { return poidsKg; }
        public void setPoidsKg(double poidsKg) { this.poidsKg = poidsKg; }

        public String getVariationPoids() { return variationPoids; }
        public void setVariationPoids(String variationPoids) { this.variationPoids = variationPoids; }

        public int getPbMm() { return pbMm; }
        public void setPbMm(int pbMm) { this.pbMm = pbMm; }

        public String getStatutPb() { return statutPb; }
        public void setStatutPb(String statutPb) { this.statutPb = statutPb; }

        public double getTemperatureC() { return temperatureC; }
        public void setTemperatureC(double temperatureC) { this.temperatureC = temperatureC; }

        public String getStatutTemperature() { return statutTemperature; }
        public void setStatutTemperature(String statutTemperature) { this.statutTemperature = statutTemperature; }

        public String getTestAppetit() { return testAppetit; }
        public void setTestAppetit(String testAppetit) { this.testAppetit = testAppetit; }

        public String getDetailAppetit() { return detailAppetit; }
        public void setDetailAppetit(String detailAppetit) { this.detailAppetit = detailAppetit; }

        public String getHeurePointage() { return heurePointage; }
        public void setHeurePointage(String heurePointage) { this.heurePointage = heurePointage; }

        public String getAgentPointage() { return agentPointage; }
        public void setAgentPointage(String agentPointage) { this.agentPointage = agentPointage; }

        public String getMaterielPointage() { return materielPointage; }
        public void setMaterielPointage(String materielPointage) { this.materielPointage = materielPointage; }
    }

    public static class TransmissionRelais {
        private String relaisNom;
        private String relaisQuartier;
        private String motifComplet;
        private String heureAdmission;
        private String infirmiereAdmission;
        private String protocoleNom;
        private String creneauGaranti;

        public TransmissionRelais() {}

        public TransmissionRelais(String relaisNom, String relaisQuartier, String motifComplet,
                                  String heureAdmission, String infirmiereAdmission,
                                  String protocoleNom, String creneauGaranti) {
            this.relaisNom = relaisNom;
            this.relaisQuartier = relaisQuartier;
            this.motifComplet = motifComplet;
            this.heureAdmission = heureAdmission;
            this.infirmiereAdmission = infirmiereAdmission;
            this.protocoleNom = protocoleNom;
            this.creneauGaranti = creneauGaranti;
        }

        public String getRelaisNom() { return relaisNom; }
        public void setRelaisNom(String relaisNom) { this.relaisNom = relaisNom; }

        public String getRelaisQuartier() { return relaisQuartier; }
        public void setRelaisQuartier(String relaisQuartier) { this.relaisQuartier = relaisQuartier; }

        public String getMotifComplet() { return motifComplet; }
        public void setMotifComplet(String motifComplet) { this.motifComplet = motifComplet; }

        public String getHeureAdmission() { return heureAdmission; }
        public void setHeureAdmission(String heureAdmission) { this.heureAdmission = heureAdmission; }

        public String getInfirmiereAdmission() { return infirmiereAdmission; }
        public void setInfirmiereAdmission(String infirmiereAdmission) { this.infirmiereAdmission = infirmiereAdmission; }

        public String getProtocoleNom() { return protocoleNom; }
        public void setProtocoleNom(String protocoleNom) { this.protocoleNom = protocoleNom; }

        public String getCreneauGaranti() { return creneauGaranti; }
        public void setCreneauGaranti(String creneauGaranti) { this.creneauGaranti = creneauGaranti; }
    }

    public static class AlerteClinique {
        private boolean hasAlerte;
        private String titre;
        private String protocoleDocLabel;

        public AlerteClinique() {}

        public AlerteClinique(boolean hasAlerte, String titre, String protocoleDocLabel) {
            this.hasAlerte = hasAlerte;
            this.titre = titre;
            this.protocoleDocLabel = protocoleDocLabel;
        }

        public boolean isHasAlerte() { return hasAlerte; }
        public void setHasAlerte(boolean hasAlerte) { this.hasAlerte = hasAlerte; }

        public String getTitre() { return titre; }
        public void setTitre(String titre) { this.titre = titre; }

        public String getProtocoleDocLabel() { return protocoleDocLabel; }
        public void setProtocoleDocLabel(String protocoleDocLabel) { this.protocoleDocLabel = protocoleDocLabel; }
    }
}
