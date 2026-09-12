package org.sensante.sn.dto;

public class MedicamentPrescritDTO {

    private Long id;
    private String nomCommercial;
    private String dci;
    private String forme;
    private String posologiePonderale;
    private double doseCalculeeMl;
    private int doseCalculeeMg;
    private String doseAfficheeLabel;
    private String frequenceRythme;
    private String frequenceDetail;
    private int dureeJours;
    private String dureeLabel;
    private String indicationClinique;
    private boolean alerteAllergieLiee;
    private boolean substitutionAppliquee;

    public MedicamentPrescritDTO() {}

    public MedicamentPrescritDTO(Long id, String nomCommercial, String dci, String forme,
                                 String posologiePonderale, double doseCalculeeMl, int doseCalculeeMg,
                                 String doseAfficheeLabel, String frequenceRythme, String frequenceDetail,
                                 int dureeJours, String dureeLabel, String indicationClinique,
                                 boolean alerteAllergieLiee, boolean substitutionAppliquee) {
        this.id = id;
        this.nomCommercial = nomCommercial;
        this.dci = dci;
        this.forme = forme;
        this.posologiePonderale = posologiePonderale;
        this.doseCalculeeMl = doseCalculeeMl;
        this.doseCalculeeMg = doseCalculeeMg;
        this.doseAfficheeLabel = doseAfficheeLabel;
        this.frequenceRythme = frequenceRythme;
        this.frequenceDetail = frequenceDetail;
        this.dureeJours = dureeJours;
        this.dureeLabel = dureeLabel;
        this.indicationClinique = indicationClinique;
        this.alerteAllergieLiee = alerteAllergieLiee;
        this.substitutionAppliquee = substitutionAppliquee;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public String getDoseAfficheeLabel() { return doseAfficheeLabel; }
    public void setDoseAfficheeLabel(String doseAfficheeLabel) { this.doseAfficheeLabel = doseAfficheeLabel; }

    public String getFrequenceRythme() { return frequenceRythme; }
    public void setFrequenceRythme(String frequenceRythme) { this.frequenceRythme = frequenceRythme; }

    public String getFrequenceDetail() { return frequenceDetail; }
    public void setFrequenceDetail(String frequenceDetail) { this.frequenceDetail = frequenceDetail; }

    public int getDureeJours() { return dureeJours; }
    public void setDureeJours(int dureeJours) { this.dureeJours = dureeJours; }

    public String getDureeLabel() { return dureeLabel; }
    public void setDureeLabel(String dureeLabel) { this.dureeLabel = dureeLabel; }

    public String getIndicationClinique() { return indicationClinique; }
    public void setIndicationClinique(String indicationClinique) { this.indicationClinique = indicationClinique; }

    public boolean isAlerteAllergieLiee() { return alerteAllergieLiee; }
    public void setAlerteAllergieLiee(boolean alerteAllergieLiee) { this.alerteAllergieLiee = alerteAllergieLiee; }

    public boolean isSubstitutionAppliquee() { return substitutionAppliquee; }
    public void setSubstitutionAppliquee(boolean substitutionAppliquee) { this.substitutionAppliquee = substitutionAppliquee; }
}
