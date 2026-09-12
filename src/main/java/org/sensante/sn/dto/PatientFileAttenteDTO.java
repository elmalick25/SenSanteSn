package org.sensante.sn.dto;

public class PatientFileAttenteDTO {

    private Long idPatient;
    private String nomComplet;
    private String ageLabel;
    private String nomAccompagnant;
    private String lienAccompagnant;
    private String avatarEnfant;
    private String avatarAccompagnant;
    private String nip;
    private String heureArrivee;
    private int tempsAttenteMin;
    private String prioriteGravite; // "MAS", "MAM", "ROUTINE"
    private String badgeLabel;
    private int pbMm;
    private String statutAttente;
    private boolean isFicheActive;
    private boolean isPrioritaire;
    private String actionLabel;

    public PatientFileAttenteDTO() {}

    public PatientFileAttenteDTO(Long idPatient, String nomComplet, String ageLabel, String nomAccompagnant,
                                 String lienAccompagnant, String avatarEnfant, String avatarAccompagnant,
                                 String nip, String heureArrivee, int tempsAttenteMin, String prioriteGravite,
                                 String badgeLabel, int pbMm, String statutAttente, boolean isFicheActive,
                                 boolean isPrioritaire, String actionLabel) {
        this.idPatient = idPatient;
        this.nomComplet = nomComplet;
        this.ageLabel = ageLabel;
        this.nomAccompagnant = nomAccompagnant;
        this.lienAccompagnant = lienAccompagnant;
        this.avatarEnfant = avatarEnfant;
        this.avatarAccompagnant = avatarAccompagnant;
        this.nip = nip;
        this.heureArrivee = heureArrivee;
        this.tempsAttenteMin = tempsAttenteMin;
        this.prioriteGravite = prioriteGravite;
        this.badgeLabel = badgeLabel;
        this.pbMm = pbMm;
        this.statutAttente = statutAttente;
        this.isFicheActive = isFicheActive;
        this.isPrioritaire = isPrioritaire;
        this.actionLabel = actionLabel;
    }

    public Long getIdPatient() { return idPatient; }
    public void setIdPatient(Long idPatient) { this.idPatient = idPatient; }

    public String getNomComplet() { return nomComplet; }
    public void setNomComplet(String nomComplet) { this.nomComplet = nomComplet; }

    public String getAgeLabel() { return ageLabel; }
    public void setAgeLabel(String ageLabel) { this.ageLabel = ageLabel; }

    public String getNomAccompagnant() { return nomAccompagnant; }
    public void setNomAccompagnant(String nomAccompagnant) { this.nomAccompagnant = nomAccompagnant; }

    public String getLienAccompagnant() { return lienAccompagnant; }
    public void setLienAccompagnant(String lienAccompagnant) { this.lienAccompagnant = lienAccompagnant; }

    public String getAvatarEnfant() { return avatarEnfant; }
    public void setAvatarEnfant(String avatarEnfant) { this.avatarEnfant = avatarEnfant; }

    public String getAvatarAccompagnant() { return avatarAccompagnant; }
    public void setAvatarAccompagnant(String avatarAccompagnant) { this.avatarAccompagnant = avatarAccompagnant; }

    public String getNip() { return nip; }
    public void setNip(String nip) { this.nip = nip; }

    public String getHeureArrivee() { return heureArrivee; }
    public void setHeureArrivee(String heureArrivee) { this.heureArrivee = heureArrivee; }

    public int getTempsAttenteMin() { return tempsAttenteMin; }
    public void setTempsAttenteMin(int tempsAttenteMin) { this.tempsAttenteMin = tempsAttenteMin; }

    public String getPrioriteGravite() { return prioriteGravite; }
    public void setPrioriteGravite(String prioriteGravite) { this.prioriteGravite = prioriteGravite; }

    public String getBadgeLabel() { return badgeLabel; }
    public void setBadgeLabel(String badgeLabel) { this.badgeLabel = badgeLabel; }

    public int getPbMm() { return pbMm; }
    public void setPbMm(int pbMm) { this.pbMm = pbMm; }

    public String getStatutAttente() { return statutAttente; }
    public void setStatutAttente(String statutAttente) { this.statutAttente = statutAttente; }

    public boolean isFicheActive() { return isFicheActive; }
    public void setFicheActive(boolean ficheActive) { isFicheActive = ficheActive; }

    public boolean isPrioritaire() { return isPrioritaire; }
    public void setPrioritaire(boolean prioritaire) { isPrioritaire = prioritaire; }

    public String getActionLabel() { return actionLabel; }
    public void setActionLabel(String actionLabel) { this.actionLabel = actionLabel; }
}
