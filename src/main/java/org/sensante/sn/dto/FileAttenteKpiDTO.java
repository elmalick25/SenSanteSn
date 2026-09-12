package org.sensante.sn.dto;

public class FileAttenteKpiDTO {

    private int enRoute;
    private String labelEnRoute;
    private int enSalleAttente;
    private int masEnSalle;
    private int enConsultation;
    private String cabinetEnConsultation;
    private String chronoConsultation;
    private int tempsAttenteMoyenMin;
    private String diffQuotaAttente;

    public FileAttenteKpiDTO() {}

    public FileAttenteKpiDTO(int enRoute, String labelEnRoute, int enSalleAttente, int masEnSalle,
                             int enConsultation, String cabinetEnConsultation, String chronoConsultation,
                             int tempsAttenteMoyenMin, String diffQuotaAttente) {
        this.enRoute = enRoute;
        this.labelEnRoute = labelEnRoute;
        this.enSalleAttente = enSalleAttente;
        this.masEnSalle = masEnSalle;
        this.enConsultation = enConsultation;
        this.cabinetEnConsultation = cabinetEnConsultation;
        this.chronoConsultation = chronoConsultation;
        this.tempsAttenteMoyenMin = tempsAttenteMoyenMin;
        this.diffQuotaAttente = diffQuotaAttente;
    }

    public int getEnRoute() { return enRoute; }
    public void setEnRoute(int enRoute) { this.enRoute = enRoute; }

    public String getLabelEnRoute() { return labelEnRoute; }
    public void setLabelEnRoute(String labelEnRoute) { this.labelEnRoute = labelEnRoute; }

    public int getEnSalleAttente() { return enSalleAttente; }
    public void setEnSalleAttente(int enSalleAttente) { this.enSalleAttente = enSalleAttente; }

    public int getMasEnSalle() { return masEnSalle; }
    public void setMasEnSalle(int masEnSalle) { this.masEnSalle = masEnSalle; }

    public int getEnConsultation() { return enConsultation; }
    public void setEnConsultation(int enConsultation) { this.enConsultation = enConsultation; }

    public String getCabinetEnConsultation() { return cabinetEnConsultation; }
    public void setCabinetEnConsultation(String cabinetEnConsultation) { this.cabinetEnConsultation = cabinetEnConsultation; }

    public String getChronoConsultation() { return chronoConsultation; }
    public void setChronoConsultation(String chronoConsultation) { this.chronoConsultation = chronoConsultation; }

    public int getTempsAttenteMoyenMin() { return tempsAttenteMoyenMin; }
    public void setTempsAttenteMoyenMin(int tempsAttenteMoyenMin) { this.tempsAttenteMoyenMin = tempsAttenteMoyenMin; }

    public String getDiffQuotaAttente() { return diffQuotaAttente; }
    public void setDiffQuotaAttente(String diffQuotaAttente) { this.diffQuotaAttente = diffQuotaAttente; }
}
