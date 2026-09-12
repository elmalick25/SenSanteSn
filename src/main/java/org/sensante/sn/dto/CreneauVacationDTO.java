package org.sensante.sn.dto;

public class CreneauVacationDTO {

    private Long idCreneau;
    private int numero;
    /** Format HH:mm — ex: "08:30" */
    private String heureDebut;
    /** Format HH:mm — ex: "08:50" */
    private String heureFin;
    /**
     * MAS | MAM | ROUTINE | EN_TRIAGE | TAMPON | LIBRE
     */
    private String typeStatut;
    /** Patient affecté — null si TAMPON ou LIBRE */
    private PatientCreneauDTO patient;
    /**
     * Couleur CSS pour la barre chronologique :
     * #DC2626 (MAS) | #D97706 (MAM) | #16A34A (Routine)
     * | primary-container (Tampon) | surface-variant (Libre) | outline (En triage)
     */
    private String couleurBarre;
    /** true si MAS ou TAMPON avec animation pulsante */
    private boolean pulsant;

    public CreneauVacationDTO() {}

    public CreneauVacationDTO(Long idCreneau, int numero, String heureDebut, String heureFin,
                               String typeStatut, PatientCreneauDTO patient) {
        this.idCreneau = idCreneau;
        this.numero = numero;
        this.heureDebut = heureDebut;
        this.heureFin = heureFin;
        this.typeStatut = typeStatut;
        this.patient = patient;
        assignCouleurEtPulsation();
    }

    private void assignCouleurEtPulsation() {
        switch (this.typeStatut) {
            case "MAS"       -> { this.couleurBarre = "#DC2626"; this.pulsant = true;  }
            case "MAM"       -> { this.couleurBarre = "#D97706"; this.pulsant = false; }
            case "ROUTINE"   -> { this.couleurBarre = "#16A34A"; this.pulsant = false; }
            case "TAMPON"    -> { this.couleurBarre = "primary-container"; this.pulsant = true;  }
            case "EN_TRIAGE" -> { this.couleurBarre = "#91D4B9"; this.pulsant = false; }
            default          -> { this.couleurBarre = "#D2E8DC"; this.pulsant = false; }
        }
    }

    public Long getIdCreneau() { return idCreneau; }
    public void setIdCreneau(Long idCreneau) { this.idCreneau = idCreneau; }

    public int getNumero() { return numero; }
    public void setNumero(int numero) { this.numero = numero; }

    public String getHeureDebut() { return heureDebut; }
    public void setHeureDebut(String heureDebut) { this.heureDebut = heureDebut; }

    public String getHeureFin() { return heureFin; }
    public void setHeureFin(String heureFin) { this.heureFin = heureFin; }

    public String getTypeStatut() { return typeStatut; }
    public void setTypeStatut(String typeStatut) { this.typeStatut = typeStatut; }

    public PatientCreneauDTO getPatient() { return patient; }
    public void setPatient(PatientCreneauDTO patient) { this.patient = patient; }

    public String getCouleurBarre() { return couleurBarre; }
    public void setCouleurBarre(String couleurBarre) { this.couleurBarre = couleurBarre; }

    public boolean isPulsant() { return pulsant; }
    public void setPulsant(boolean pulsant) { this.pulsant = pulsant; }
}
