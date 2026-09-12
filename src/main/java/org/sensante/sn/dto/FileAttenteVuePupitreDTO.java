package org.sensante.sn.dto;

import java.util.List;

public class FileAttenteVuePupitreDTO {

    private MedecinIdentiteDTO medecin;
    private FileAttenteKpiDTO kpis;
    private ConsultationEnCoursDTO consultationEnCours;
    private List<PatientFileAttenteDTO> patientsEnAttente;
    private List<PatientEnRouteDTO> patientsEnRoute;
    private DossierAccueilDTO dossierActif;
    private int totalPatientsFile;
    private int totalMas;
    private int totalMam;
    private int totalRoutine;

    public FileAttenteVuePupitreDTO() {}

    public FileAttenteVuePupitreDTO(MedecinIdentiteDTO medecin, FileAttenteKpiDTO kpis,
                                   ConsultationEnCoursDTO consultationEnCours,
                                   List<PatientFileAttenteDTO> patientsEnAttente,
                                   List<PatientEnRouteDTO> patientsEnRoute,
                                   DossierAccueilDTO dossierActif, int totalPatientsFile,
                                   int totalMas, int totalMam, int totalRoutine) {
        this.medecin = medecin;
        this.kpis = kpis;
        this.consultationEnCours = consultationEnCours;
        this.patientsEnAttente = patientsEnAttente;
        this.patientsEnRoute = patientsEnRoute;
        this.dossierActif = dossierActif;
        this.totalPatientsFile = totalPatientsFile;
        this.totalMas = totalMas;
        this.totalMam = totalMam;
        this.totalRoutine = totalRoutine;
    }

    public MedecinIdentiteDTO getMedecin() { return medecin; }
    public void setMedecin(MedecinIdentiteDTO medecin) { this.medecin = medecin; }

    public FileAttenteKpiDTO getKpis() { return kpis; }
    public void setKpis(FileAttenteKpiDTO kpis) { this.kpis = kpis; }

    public ConsultationEnCoursDTO getConsultationEnCours() { return consultationEnCours; }
    public void setConsultationEnCours(ConsultationEnCoursDTO consultationEnCours) { this.consultationEnCours = consultationEnCours; }

    public List<PatientFileAttenteDTO> getPatientsEnAttente() { return patientsEnAttente; }
    public void setPatientsEnAttente(List<PatientFileAttenteDTO> patientsEnAttente) { this.patientsEnAttente = patientsEnAttente; }

    public List<PatientEnRouteDTO> getPatientsEnRoute() { return patientsEnRoute; }
    public void setPatientsEnRoute(List<PatientEnRouteDTO> patientsEnRoute) { this.patientsEnRoute = patientsEnRoute; }

    public DossierAccueilDTO getDossierActif() { return dossierActif; }
    public void setDossierActif(DossierAccueilDTO dossierActif) { this.dossierActif = dossierActif; }

    public int getTotalPatientsFile() { return totalPatientsFile; }
    public void setTotalPatientsFile(int totalPatientsFile) { this.totalPatientsFile = totalPatientsFile; }

    public int getTotalMas() { return totalMas; }
    public void setTotalMas(int totalMas) { this.totalMas = totalMas; }

    public int getTotalMam() { return totalMam; }
    public void setTotalMam(int totalMam) { this.totalMam = totalMam; }

    public int getTotalRoutine() { return totalRoutine; }
    public void setTotalRoutine(int totalRoutine) { this.totalRoutine = totalRoutine; }
}
