package org.sensante.sn.dto;

public class ReconfigurerVacationRequest {
    private String heureDebut;
    private String heureFin;
    private int nombreCreneaux;
    /** MATIN | APRES_MIDI | GARDE */
    private String plageType;

    public ReconfigurerVacationRequest() {}

    public String getHeureDebut() { return heureDebut; }
    public void setHeureDebut(String heureDebut) { this.heureDebut = heureDebut; }
    public String getHeureFin() { return heureFin; }
    public void setHeureFin(String heureFin) { this.heureFin = heureFin; }
    public int getNombreCreneaux() { return nombreCreneaux; }
    public void setNombreCreneaux(int nombreCreneaux) { this.nombreCreneaux = nombreCreneaux; }
    public String getPlageType() { return plageType; }
    public void setPlageType(String plageType) { this.plageType = plageType; }
}
