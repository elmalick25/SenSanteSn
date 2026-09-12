package org.sensante.sn.dto;

import java.util.List;

public class DossierPatient360DTO {

    private PatientHeaderDTO patient;
    private CourbeCroissanceDTO croissance;
    private BiometrieJourDTO biometrie;
    private AntecedentsNeonatalsDTO antecedents;
    private VaccinationPevDTO vaccination;
    private List<EvenementTimelineDTO> timeline;
    private int totalVisites;

    public DossierPatient360DTO() {}

    public DossierPatient360DTO(PatientHeaderDTO patient, CourbeCroissanceDTO croissance,
                               BiometrieJourDTO biometrie, AntecedentsNeonatalsDTO antecedents,
                               VaccinationPevDTO vaccination, List<EvenementTimelineDTO> timeline,
                               int totalVisites) {
        this.patient = patient;
        this.croissance = croissance;
        this.biometrie = biometrie;
        this.antecedents = antecedents;
        this.vaccination = vaccination;
        this.timeline = timeline;
        this.totalVisites = totalVisites;
    }

    public PatientHeaderDTO getPatient() { return patient; }
    public void setPatient(PatientHeaderDTO patient) { this.patient = patient; }

    public CourbeCroissanceDTO getCroissance() { return croissance; }
    public void setCroissance(CourbeCroissanceDTO croissance) { this.croissance = croissance; }

    public BiometrieJourDTO getBiometrie() { return biometrie; }
    public void setBiometrie(BiometrieJourDTO biometrie) { this.biometrie = biometrie; }

    public AntecedentsNeonatalsDTO getAntecedents() { return antecedents; }
    public void setAntecedents(AntecedentsNeonatalsDTO antecedents) { this.antecedents = antecedents; }

    public VaccinationPevDTO getVaccination() { return vaccination; }
    public void setVaccination(VaccinationPevDTO vaccination) { this.vaccination = vaccination; }

    public List<EvenementTimelineDTO> getTimeline() { return timeline; }
    public void setTimeline(List<EvenementTimelineDTO> timeline) { this.timeline = timeline; }

    public int getTotalVisites() { return totalVisites; }
    public void setTotalVisites(int totalVisites) { this.totalVisites = totalVisites; }
}
