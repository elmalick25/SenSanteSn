package org.sensante.sn.dto;

public class RelaisSurveillanceDTO {

    private int peseesCommunautaires;
    private String peseesZone;
    private int rattrapagesVaccinaux;
    private String rattrapagesDetail;
    private int alertesMasIdentifiees;
    private String alertesMasDetail;
    private int couvertureMuacPourcentage;
    private String noteLiaisonAsc;

    public RelaisSurveillanceDTO() {}

    public RelaisSurveillanceDTO(int peseesCommunautaires, String peseesZone, int rattrapagesVaccinaux,
                                 String rattrapagesDetail, int alertesMasIdentifiees,
                                 String alertesMasDetail, int couvertureMuacPourcentage, String noteLiaisonAsc) {
        this.peseesCommunautaires = peseesCommunautaires;
        this.peseesZone = peseesZone;
        this.rattrapagesVaccinaux = rattrapagesVaccinaux;
        this.rattrapagesDetail = rattrapagesDetail;
        this.alertesMasIdentifiees = alertesMasIdentifiees;
        this.alertesMasDetail = alertesMasDetail;
        this.couvertureMuacPourcentage = couvertureMuacPourcentage;
        this.noteLiaisonAsc = noteLiaisonAsc;
    }

    public int getPeseesCommunautaires() { return peseesCommunautaires; }
    public void setPeseesCommunautaires(int peseesCommunautaires) { this.peseesCommunautaires = peseesCommunautaires; }

    public String getPeseesZone() { return peseesZone; }
    public void setPeseesZone(String peseesZone) { this.peseesZone = peseesZone; }

    public int getRattrapagesVaccinaux() { return rattrapagesVaccinaux; }
    public void setRattrapagesVaccinaux(int rattrapagesVaccinaux) { this.rattrapagesVaccinaux = rattrapagesVaccinaux; }

    public String getRattrapagesDetail() { return rattrapagesDetail; }
    public void setRattrapagesDetail(String rattrapagesDetail) { this.rattrapagesDetail = rattrapagesDetail; }

    public int getAlertesMasIdentifiees() { return alertesMasIdentifiees; }
    public void setAlertesMasIdentifiees(int alertesMasIdentifiees) { this.alertesMasIdentifiees = alertesMasIdentifiees; }

    public String getAlertesMasDetail() { return alertesMasDetail; }
    public void setAlertesMasDetail(String alertesMasDetail) { this.alertesMasDetail = alertesMasDetail; }

    public int getCouvertureMuacPourcentage() { return couvertureMuacPourcentage; }
    public void setCouvertureMuacPourcentage(int couvertureMuacPourcentage) { this.couvertureMuacPourcentage = couvertureMuacPourcentage; }

    public String getNoteLiaisonAsc() { return noteLiaisonAsc; }
    public void setNoteLiaisonAsc(String noteLiaisonAsc) { this.noteLiaisonAsc = noteLiaisonAsc; }
}
