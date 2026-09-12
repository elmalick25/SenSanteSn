package org.sensante.sn.dto;

public class VacationOverviewDTO {

    private int totalCreneaux;
    private int assignes;
    private int urgencesMAS;
    private int casMAM;
    private int casRoutine;
    private int creneauxLibres;
    /** Ex: "10 min (11:30)" */
    private String margeTamponLibelle;
    /** Ex: 87.5 */
    private double tauxRemplissage;
    /** Ex: "87.5% (14/16 patients)" */
    private String tauxRemplissageLabel;

    public VacationOverviewDTO() {}

    public VacationOverviewDTO(int totalCreneaux, int assignes, int urgencesMAS,
                                int casMAM, int casRoutine, int creneauxLibres,
                                String margeTamponLibelle) {
        this.totalCreneaux = totalCreneaux;
        this.assignes = assignes;
        this.urgencesMAS = urgencesMAS;
        this.casMAM = casMAM;
        this.casRoutine = casRoutine;
        this.creneauxLibres = creneauxLibres;
        this.margeTamponLibelle = margeTamponLibelle;
        this.tauxRemplissage = totalCreneaux > 0
            ? Math.round((assignes * 1000.0 / totalCreneaux)) / 10.0
            : 0.0;
        this.tauxRemplissageLabel = this.tauxRemplissage + "% (" + assignes + "/" + totalCreneaux + " patients)";
    }

    public int getTotalCreneaux() { return totalCreneaux; }
    public void setTotalCreneaux(int totalCreneaux) { this.totalCreneaux = totalCreneaux; }

    public int getAssignes() { return assignes; }
    public void setAssignes(int assignes) { this.assignes = assignes; }

    public int getUrgencesMAS() { return urgencesMAS; }
    public void setUrgencesMAS(int urgencesMAS) { this.urgencesMAS = urgencesMAS; }

    public int getCasMAM() { return casMAM; }
    public void setCasMAM(int casMAM) { this.casMAM = casMAM; }

    public int getCasRoutine() { return casRoutine; }
    public void setCasRoutine(int casRoutine) { this.casRoutine = casRoutine; }

    public int getCreneauxLibres() { return creneauxLibres; }
    public void setCreneauxLibres(int creneauxLibres) { this.creneauxLibres = creneauxLibres; }

    public String getMargeTamponLibelle() { return margeTamponLibelle; }
    public void setMargeTamponLibelle(String margeTamponLibelle) { this.margeTamponLibelle = margeTamponLibelle; }

    public double getTauxRemplissage() { return tauxRemplissage; }
    public void setTauxRemplissage(double tauxRemplissage) { this.tauxRemplissage = tauxRemplissage; }

    public String getTauxRemplissageLabel() { return tauxRemplissageLabel; }
    public void setTauxRemplissageLabel(String tauxRemplissageLabel) { this.tauxRemplissageLabel = tauxRemplissageLabel; }
}
