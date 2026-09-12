package org.sensante.sn.dto;

public class PointCourbeCroissanceDTO {

    private String ageMoisLabel;
    private int ageMois;
    private Double poidsReelKg;
    private double z0MedianeKg;
    private double zMoins2MamKg;
    private double zMoins3MasKg;
    private String statutPoint; // "NORMAL", "ALERTE_MAM", "CRITIQUE_MAS"
    private boolean isPointActuel;

    public PointCourbeCroissanceDTO() {}

    public PointCourbeCroissanceDTO(String ageMoisLabel, int ageMois, Double poidsReelKg,
                                    double z0MedianeKg, double zMoins2MamKg, double zMoins3MasKg,
                                    String statutPoint, boolean isPointActuel) {
        this.ageMoisLabel = ageMoisLabel;
        this.ageMois = ageMois;
        this.poidsReelKg = poidsReelKg;
        this.z0MedianeKg = z0MedianeKg;
        this.zMoins2MamKg = zMoins2MamKg;
        this.zMoins3MasKg = zMoins3MasKg;
        this.statutPoint = statutPoint;
        this.isPointActuel = isPointActuel;
    }

    public String getAgeMoisLabel() { return ageMoisLabel; }
    public void setAgeMoisLabel(String ageMoisLabel) { this.ageMoisLabel = ageMoisLabel; }

    public int getAgeMois() { return ageMois; }
    public void setAgeMois(int ageMois) { this.ageMois = ageMois; }

    public Double getPoidsReelKg() { return poidsReelKg; }
    public void setPoidsReelKg(Double poidsReelKg) { this.poidsReelKg = poidsReelKg; }

    public double getZ0MedianeKg() { return z0MedianeKg; }
    public void setZ0MedianeKg(double z0MedianeKg) { this.z0MedianeKg = z0MedianeKg; }

    public double getZMoins2MamKg() { return zMoins2MamKg; }
    public void setZMoins2MamKg(double zMoins2MamKg) { this.zMoins2MamKg = zMoins2MamKg; }

    public double getZMoins3MasKg() { return zMoins3MasKg; }
    public void setZMoins3MasKg(double zMoins3MasKg) { this.zMoins3MasKg = zMoins3MasKg; }

    public String getStatutPoint() { return statutPoint; }
    public void setStatutPoint(String statutPoint) { this.statutPoint = statutPoint; }

    public boolean isPointActuel() { return isPointActuel; }
    public void setPointActuel(boolean pointActuel) { isPointActuel = pointActuel; }
}
