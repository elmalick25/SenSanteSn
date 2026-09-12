package org.sensante.sn.dto;

public class VacationConfigDTO {

    /** Format HH:mm — ex: "08:30" */
    private String heureDebut;
    /** Format HH:mm — ex: "14:00" */
    private String heureFin;
    private int nombreCreneaux;
    /** Durée en minutes par créneau — ex: 20 */
    private int dureeCreneau;
    /** MATIN | APRES_MIDI | GARDE */
    private String plageType;
    /** Durée totale lisible — ex: "5h30" */
    private String dureeTotaleLabel;
    /** Marge tampon en minutes */
    private int margeTamponMinutes;
    private int maxPatients;

    public VacationConfigDTO() {}

    public VacationConfigDTO(String heureDebut, String heureFin, int nombreCreneaux,
                              int dureeCreneau, String plageType, int margeTamponMinutes, int maxPatients) {
        this.heureDebut = heureDebut;
        this.heureFin = heureFin;
        this.nombreCreneaux = nombreCreneaux;
        this.dureeCreneau = dureeCreneau;
        this.plageType = plageType;
        this.margeTamponMinutes = margeTamponMinutes;
        this.maxPatients = maxPatients;
        // Calcul durée totale
        int totalMin = nombreCreneaux * dureeCreneau + margeTamponMinutes;
        this.dureeTotaleLabel = (totalMin / 60) + "h" + String.format("%02d", totalMin % 60);
    }

    public String getHeureDebut() { return heureDebut; }
    public void setHeureDebut(String heureDebut) { this.heureDebut = heureDebut; }

    public String getHeureFin() { return heureFin; }
    public void setHeureFin(String heureFin) { this.heureFin = heureFin; }

    public int getNombreCreneaux() { return nombreCreneaux; }
    public void setNombreCreneaux(int nombreCreneaux) { this.nombreCreneaux = nombreCreneaux; }

    public int getDureeCreneau() { return dureeCreneau; }
    public void setDureeCreneau(int dureeCreneau) { this.dureeCreneau = dureeCreneau; }

    public String getPlageType() { return plageType; }
    public void setPlageType(String plageType) { this.plageType = plageType; }

    public String getDureeTotaleLabel() { return dureeTotaleLabel; }
    public void setDureeTotaleLabel(String dureeTotaleLabel) { this.dureeTotaleLabel = dureeTotaleLabel; }

    public int getMargeTamponMinutes() { return margeTamponMinutes; }
    public void setMargeTamponMinutes(int margeTamponMinutes) { this.margeTamponMinutes = margeTamponMinutes; }

    public int getMaxPatients() { return maxPatients; }
    public void setMaxPatients(int maxPatients) { this.maxPatients = maxPatients; }
}
