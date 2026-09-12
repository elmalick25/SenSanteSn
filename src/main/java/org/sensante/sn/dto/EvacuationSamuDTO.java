package org.sensante.sn.dto;

public class EvacuationSamuDTO {

    private Long id;
    private String numeroAmbulance;
    private String motif;
    private String patientNom;
    private String patientAge;
    private String soinsEntrepris;
    private String heureReception;
    private String destinationHopital;
    private boolean litChaudConfirme;

    public EvacuationSamuDTO() {}

    public EvacuationSamuDTO(Long id, String numeroAmbulance, String motif, String patientNom,
                             String patientAge, String soinsEntrepris, String heureReception,
                             String destinationHopital, boolean litChaudConfirme) {
        this.id = id;
        this.numeroAmbulance = numeroAmbulance;
        this.motif = motif;
        this.patientNom = patientNom;
        this.patientAge = patientAge;
        this.soinsEntrepris = soinsEntrepris;
        this.heureReception = heureReception;
        this.destinationHopital = destinationHopital;
        this.litChaudConfirme = litChaudConfirme;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumeroAmbulance() { return numeroAmbulance; }
    public void setNumeroAmbulance(String numeroAmbulance) { this.numeroAmbulance = numeroAmbulance; }

    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }

    public String getPatientNom() { return patientNom; }
    public void setPatientNom(String patientNom) { this.patientNom = patientNom; }

    public String getPatientAge() { return patientAge; }
    public void setPatientAge(String patientAge) { this.patientAge = patientAge; }

    public String getSoinsEntrepris() { return soinsEntrepris; }
    public void setSoinsEntrepris(String soinsEntrepris) { this.soinsEntrepris = soinsEntrepris; }

    public String getHeureReception() { return heureReception; }
    public void setHeureReception(String heureReception) { this.heureReception = heureReception; }

    public String getDestinationHopital() { return destinationHopital; }
    public void setDestinationHopital(String destinationHopital) { this.destinationHopital = destinationHopital; }

    public boolean isLitChaudConfirme() { return litChaudConfirme; }
    public void setLitChaudConfirme(boolean litChaudConfirme) { this.litChaudConfirme = litChaudConfirme; }
}
