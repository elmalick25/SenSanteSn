package org.sensante.sn.dto;

public class JalonCureAtpeDTO {

    private int jour;
    private String label;
    private String datePrevue;
    private String type; // "START", "VAD", "ROUTINE", "BILAN"
    private String description;
    private boolean actif;

    public JalonCureAtpeDTO() {}

    public JalonCureAtpeDTO(int jour, String label, String datePrevue, String type, String description, boolean actif) {
        this.jour = jour;
        this.label = label;
        this.datePrevue = datePrevue;
        this.type = type;
        this.description = description;
        this.actif = actif;
    }

    public int getJour() { return jour; }
    public void setJour(int jour) { this.jour = jour; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getDatePrevue() { return datePrevue; }
    public void setDatePrevue(String datePrevue) { this.datePrevue = datePrevue; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isActif() { return actif; }
    public void setActif(boolean actif) { this.actif = actif; }
}
