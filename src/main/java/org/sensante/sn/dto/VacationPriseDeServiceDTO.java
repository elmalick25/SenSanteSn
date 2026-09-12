package org.sensante.sn.dto;

import java.util.List;

public class VacationPriseDeServiceDTO {

    private MedecinIdentiteDTO identiteMedecin;
    private VacationConfigDTO config;
    private VacationOverviewDTO overview;
    private List<CreneauVacationDTO> creneaux;
    /** Légende chrono : infos de la bannière d'alerte bas de page */
    private String consigneVacation;
    private String dateVacation;
    private String structureLabel;

    public VacationPriseDeServiceDTO() {}

    public VacationPriseDeServiceDTO(MedecinIdentiteDTO identiteMedecin,
                                      VacationConfigDTO config,
                                      VacationOverviewDTO overview,
                                      List<CreneauVacationDTO> creneaux,
                                      String consigneVacation,
                                      String dateVacation,
                                      String structureLabel) {
        this.identiteMedecin = identiteMedecin;
        this.config = config;
        this.overview = overview;
        this.creneaux = creneaux;
        this.consigneVacation = consigneVacation;
        this.dateVacation = dateVacation;
        this.structureLabel = structureLabel;
    }

    public MedecinIdentiteDTO getIdentiteMedecin() { return identiteMedecin; }
    public void setIdentiteMedecin(MedecinIdentiteDTO identiteMedecin) { this.identiteMedecin = identiteMedecin; }

    public VacationConfigDTO getConfig() { return config; }
    public void setConfig(VacationConfigDTO config) { this.config = config; }

    public VacationOverviewDTO getOverview() { return overview; }
    public void setOverview(VacationOverviewDTO overview) { this.overview = overview; }

    public List<CreneauVacationDTO> getCreneaux() { return creneaux; }
    public void setCreneaux(List<CreneauVacationDTO> creneaux) { this.creneaux = creneaux; }

    public String getConsigneVacation() { return consigneVacation; }
    public void setConsigneVacation(String consigneVacation) { this.consigneVacation = consigneVacation; }

    public String getDateVacation() { return dateVacation; }
    public void setDateVacation(String dateVacation) { this.dateVacation = dateVacation; }

    public String getStructureLabel() { return structureLabel; }
    public void setStructureLabel(String structureLabel) { this.structureLabel = structureLabel; }
}
