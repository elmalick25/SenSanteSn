package org.sensante.sn.dto;

import java.util.List;

public class PatientCreneauDTO {

    private Long idEnfant;
    private String nom;
    private String prenom;
    private String nomComplet;
    private String nip;
    /** Ex: "14 mois • F" */
    private String ageLabel;
    private String sexe;
    /**
     * Type de statut clinique :
     * MAS | MAM | ROUTINE | EN_TRIAGE | TAMPON | LIBRE
     */
    private String typeStatut;
    /** Libellé affiché — ex: "MAS complications", "MAM réfractaire" */
    private String typeStatutLabel;
    /** Indicateurs cliniques : PB, poids, température, SpO2… */
    private List<IndicateurClinique> indicateurs;
    /** Note transmise par l'infirmier de triage */
    private String noteInfirmier;
    /** Icône Material Symbols pour la note (assignment_late, report, check_circle…) */
    private String iconeNote;
    /** Couleur CSS de l'icône note */
    private String couleurNote;

    public PatientCreneauDTO() {}

    // ── Inner record ────────────────────────────────────────────────────────
    public static class IndicateurClinique {
        private String label;
        private String valeur;
        /** normal | warning | danger | info */
        private String niveau;

        public IndicateurClinique() {}

        public IndicateurClinique(String label, String valeur, String niveau) {
            this.label = label;
            this.valeur = valeur;
            this.niveau = niveau;
        }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public String getValeur() { return valeur; }
        public void setValeur(String valeur) { this.valeur = valeur; }
        public String getNiveau() { return niveau; }
        public void setNiveau(String niveau) { this.niveau = niveau; }
    }

    // ── Getters / Setters ───────────────────────────────────────────────────
    public Long getIdEnfant() { return idEnfant; }
    public void setIdEnfant(Long idEnfant) { this.idEnfant = idEnfant; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getNomComplet() { return nomComplet; }
    public void setNomComplet(String nomComplet) { this.nomComplet = nomComplet; }

    public String getNip() { return nip; }
    public void setNip(String nip) { this.nip = nip; }

    public String getAgeLabel() { return ageLabel; }
    public void setAgeLabel(String ageLabel) { this.ageLabel = ageLabel; }

    public String getSexe() { return sexe; }
    public void setSexe(String sexe) { this.sexe = sexe; }

    public String getTypeStatut() { return typeStatut; }
    public void setTypeStatut(String typeStatut) { this.typeStatut = typeStatut; }

    public String getTypeStatutLabel() { return typeStatutLabel; }
    public void setTypeStatutLabel(String typeStatutLabel) { this.typeStatutLabel = typeStatutLabel; }

    public List<IndicateurClinique> getIndicateurs() { return indicateurs; }
    public void setIndicateurs(List<IndicateurClinique> indicateurs) { this.indicateurs = indicateurs; }

    public String getNoteInfirmier() { return noteInfirmier; }
    public void setNoteInfirmier(String noteInfirmier) { this.noteInfirmier = noteInfirmier; }

    public String getIconeNote() { return iconeNote; }
    public void setIconeNote(String iconeNote) { this.iconeNote = iconeNote; }

    public String getCouleurNote() { return couleurNote; }
    public void setCouleurNote(String couleurNote) { this.couleurNote = couleurNote; }
}
