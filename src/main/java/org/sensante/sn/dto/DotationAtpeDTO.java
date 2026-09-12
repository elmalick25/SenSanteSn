package org.sensante.sn.dto;

import java.util.List;

public class DotationAtpeDTO {

    private String produit;
    private String rationQuotidienne;
    private int dureeJours;
    private int volumeTotalSachets;
    private String apportKcalJour;
    private List<String> modalitesAdministration;

    // Routine journalière
    private String slot1Horaire;
    private String slot1Titre;
    private String slot1Description;
    private String slot1Calorie;
    private String slot1MedicamentAssocie;

    private String slot2Horaire;
    private String slot2Titre;
    private String slot2Description;
    private String slot2Calorie;
    private String slot2Boisson;

    public DotationAtpeDTO() {}

    public String getProduit() { return produit; }
    public void setProduit(String produit) { this.produit = produit; }

    public String getRationQuotidienne() { return rationQuotidienne; }
    public void setRationQuotidienne(String rationQuotidienne) { this.rationQuotidienne = rationQuotidienne; }

    public int getDureeJours() { return dureeJours; }
    public void setDureeJours(int dureeJours) { this.dureeJours = dureeJours; }

    public int getVolumeTotalSachets() { return volumeTotalSachets; }
    public void setVolumeTotalSachets(int volumeTotalSachets) { this.volumeTotalSachets = volumeTotalSachets; }

    public String getApportKcalJour() { return apportKcalJour; }
    public void setApportKcalJour(String apportKcalJour) { this.apportKcalJour = apportKcalJour; }

    public List<String> getModalitesAdministration() { return modalitesAdministration; }
    public void setModalitesAdministration(List<String> modalitesAdministration) { this.modalitesAdministration = modalitesAdministration; }

    public String getSlot1Horaire() { return slot1Horaire; }
    public void setSlot1Horaire(String slot1Horaire) { this.slot1Horaire = slot1Horaire; }

    public String getSlot1Titre() { return slot1Titre; }
    public void setSlot1Titre(String slot1Titre) { this.slot1Titre = slot1Titre; }

    public String getSlot1Description() { return slot1Description; }
    public void setSlot1Description(String slot1Description) { this.slot1Description = slot1Description; }

    public String getSlot1Calorie() { return slot1Calorie; }
    public void setSlot1Calorie(String slot1Calorie) { this.slot1Calorie = slot1Calorie; }

    public String getSlot1MedicamentAssocie() { return slot1MedicamentAssocie; }
    public void setSlot1MedicamentAssocie(String slot1MedicamentAssocie) { this.slot1MedicamentAssocie = slot1MedicamentAssocie; }

    public String getSlot2Horaire() { return slot2Horaire; }
    public void setSlot2Horaire(String slot2Horaire) { this.slot2Horaire = slot2Horaire; }

    public String getSlot2Titre() { return slot2Titre; }
    public void setSlot2Titre(String slot2Titre) { this.slot2Titre = slot2Titre; }

    public String getSlot2Description() { return slot2Description; }
    public void setSlot2Description(String slot2Description) { this.slot2Description = slot2Description; }

    public String getSlot2Calorie() { return slot2Calorie; }
    public void setSlot2Calorie(String slot2Calorie) { this.slot2Calorie = slot2Calorie; }

    public String getSlot2Boisson() { return slot2Boisson; }
    public void setSlot2Boisson(String slot2Boisson) { this.slot2Boisson = slot2Boisson; }
}
