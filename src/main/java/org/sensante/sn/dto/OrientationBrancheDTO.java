package org.sensante.sn.dto;

import java.util.List;

public class OrientationBrancheDTO {

    private String code; // "CRENI", "CRENAS"
    private String titre;
    private String statut; // "NON_ELIGIBLE", "RETENUE", "EN_ATTENTE"
    private String statutBadge;
    private String conditions;
    private String protocoleReference;
    private boolean retenue;
    private String detailsOrientation;
    private List<ProtocoleItemDTO> itemsProtocole;

    public OrientationBrancheDTO() {}

    public OrientationBrancheDTO(String code, String titre, String statut, String statutBadge,
                                 String conditions, String protocoleReference, boolean retenue,
                                 String detailsOrientation, List<ProtocoleItemDTO> itemsProtocole) {
        this.code = code;
        this.titre = titre;
        this.statut = statut;
        this.statutBadge = statutBadge;
        this.conditions = conditions;
        this.protocoleReference = protocoleReference;
        this.retenue = retenue;
        this.detailsOrientation = detailsOrientation;
        this.itemsProtocole = itemsProtocole;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getStatutBadge() { return statutBadge; }
    public void setStatutBadge(String statutBadge) { this.statutBadge = statutBadge; }

    public String getConditions() { return conditions; }
    public void setConditions(String conditions) { this.conditions = conditions; }

    public String getProtocoleReference() { return protocoleReference; }
    public void setProtocoleReference(String protocoleReference) { this.protocoleReference = protocoleReference; }

    public boolean isRetenue() { return retenue; }
    public void setRetenue(boolean retenue) { this.retenue = retenue; }

    public String getDetailsOrientation() { return detailsOrientation; }
    public void setDetailsOrientation(String detailsOrientation) { this.detailsOrientation = detailsOrientation; }

    public List<ProtocoleItemDTO> getItemsProtocole() { return itemsProtocole; }
    public void setItemsProtocole(List<ProtocoleItemDTO> itemsProtocole) { this.itemsProtocole = itemsProtocole; }
}
