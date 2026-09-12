package org.sensante.sn.dto;

/**
 * Objectif National PRN (Programme de Récupération Nutritionnelle) avec trajectoire de performance.
 * Comparatif cumulé District vs Cibles Annuelles MSAS (YTD 2024).
 */
public class PrnNationalTargetDTO {

    private String code;
    private String libelle;
    private double tauxActuel;
    private double cibleTaux;
    private long volumeRealise;
    private long volumeCible;
    private String statut;       // "SURPERFORMÉ", "DANS_LA_CIBLE", "ÉCART"
    private String ecartTexte;   // "+2.2% vs cible", "-2.5% écart"
    private String badgeCouleur; // "emerald", "slate", "amber"
    private String noteRattrapage; // null ou "Campagne de rattrapage le 14 Nov"

    public PrnNationalTargetDTO() {}

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }

    public double getTauxActuel() { return tauxActuel; }
    public void setTauxActuel(double tauxActuel) { this.tauxActuel = tauxActuel; }

    public double getCibleTaux() { return cibleTaux; }
    public void setCibleTaux(double cibleTaux) { this.cibleTaux = cibleTaux; }

    public long getVolumeRealise() { return volumeRealise; }
    public void setVolumeRealise(long volumeRealise) { this.volumeRealise = volumeRealise; }

    public long getVolumeCible() { return volumeCible; }
    public void setVolumeCible(long volumeCible) { this.volumeCible = volumeCible; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getEcartTexte() { return ecartTexte; }
    public void setEcartTexte(String ecartTexte) { this.ecartTexte = ecartTexte; }

    public String getBadgeCouleur() { return badgeCouleur; }
    public void setBadgeCouleur(String badgeCouleur) { this.badgeCouleur = badgeCouleur; }

    public String getNoteRattrapage() { return noteRattrapage; }
    public void setNoteRattrapage(String noteRattrapage) { this.noteRattrapage = noteRattrapage; }
}
