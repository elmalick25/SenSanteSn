package org.sensante.sn.dto;

public class ProtocoleItemDTO {

    private int numero;
    private String titre;
    private String description;
    private String posologie;
    private boolean alerte;
    private String badgeType; // "DEFAULT", "ALERTE", "SUIVI"

    public ProtocoleItemDTO() {}

    public ProtocoleItemDTO(int numero, String titre, String description, String posologie, boolean alerte, String badgeType) {
        this.numero = numero;
        this.titre = titre;
        this.description = description;
        this.posologie = posologie;
        this.alerte = alerte;
        this.badgeType = badgeType;
    }

    public int getNumero() { return numero; }
    public void setNumero(int numero) { this.numero = numero; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPosologie() { return posologie; }
    public void setPosologie(String posologie) { this.posologie = posologie; }

    public boolean isAlerte() { return alerte; }
    public void setAlerte(boolean alerte) { this.alerte = alerte; }

    public String getBadgeType() { return badgeType; }
    public void setBadgeType(String badgeType) { this.badgeType = badgeType; }
}
