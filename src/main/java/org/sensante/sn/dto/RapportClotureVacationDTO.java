package org.sensante.sn.dto;

import java.util.List;

public class RapportClotureVacationDTO {

    private String structureNom;
    private String dateVacation;
    private String praticienNom;
    private String praticienTitre;
    private String cabinetNom;
    private String statutVacation;
    private String horaireVacation;
    private String districtNom;

    // Section 2 : KPIs
    private ClotureKpiDTO kpi;

    // Section 3 : Volet Médecin (SAMU 1515) & Volet Relais
    private List<EvacuationSamuDTO> evacuationsSamu;
    private RelaisSurveillanceDTO relaisSurveillance;

    // Section 4 : Intrants Pharmacie
    private List<StockIntrantClotureDTO> intrantsStock;
    private String pharmacieCentraleNom;
    private String reserveSecuriseeLabel;

    // Section 5 : Signature ministérielle
    private String medecinChefNom;
    private String medecinChefDistrict;
    private String certificatDhis2;
    private String signatureHorodatage;
    private boolean estCloturee;

    public RapportClotureVacationDTO() {}

    public String getStructureNom() { return structureNom; }
    public void setStructureNom(String structureNom) { this.structureNom = structureNom; }

    public String getDateVacation() { return dateVacation; }
    public void setDateVacation(String dateVacation) { this.dateVacation = dateVacation; }

    public String getPraticienNom() { return praticienNom; }
    public void setPraticienNom(String praticienNom) { this.praticienNom = praticienNom; }

    public String getPraticienTitre() { return praticienTitre; }
    public void setPraticienTitre(String praticienTitre) { this.praticienTitre = praticienTitre; }

    public String getCabinetNom() { return cabinetNom; }
    public void setCabinetNom(String cabinetNom) { this.cabinetNom = cabinetNom; }

    public String getStatutVacation() { return statutVacation; }
    public void setStatutVacation(String statutVacation) { this.statutVacation = statutVacation; }

    public String getHoraireVacation() { return horaireVacation; }
    public void setHoraireVacation(String horaireVacation) { this.horaireVacation = horaireVacation; }

    public String getDistrictNom() { return districtNom; }
    public void setDistrictNom(String districtNom) { this.districtNom = districtNom; }

    public ClotureKpiDTO getKpi() { return kpi; }
    public void setKpi(ClotureKpiDTO kpi) { this.kpi = kpi; }

    public List<EvacuationSamuDTO> getEvacuationsSamu() { return evacuationsSamu; }
    public void setEvacuationsSamu(List<EvacuationSamuDTO> evacuationsSamu) { this.evacuationsSamu = evacuationsSamu; }

    public RelaisSurveillanceDTO getRelaisSurveillance() { return relaisSurveillance; }
    public void setRelaisSurveillance(RelaisSurveillanceDTO relaisSurveillance) { this.relaisSurveillance = relaisSurveillance; }

    public List<StockIntrantClotureDTO> getIntrantsStock() { return intrantsStock; }
    public void setIntrantsStock(List<StockIntrantClotureDTO> intrantsStock) { this.intrantsStock = intrantsStock; }

    public String getPharmacieCentraleNom() { return pharmacieCentraleNom; }
    public void setPharmacieCentraleNom(String pharmacieCentraleNom) { this.pharmacieCentraleNom = pharmacieCentraleNom; }

    public String getReserveSecuriseeLabel() { return reserveSecuriseeLabel; }
    public void setReserveSecuriseeLabel(String reserveSecuriseeLabel) { this.reserveSecuriseeLabel = reserveSecuriseeLabel; }

    public String getMedecinChefNom() { return medecinChefNom; }
    public void setMedecinChefNom(String medecinChefNom) { this.medecinChefNom = medecinChefNom; }

    public String getMedecinChefDistrict() { return medecinChefDistrict; }
    public void setMedecinChefDistrict(String medecinChefDistrict) { this.medecinChefDistrict = medecinChefDistrict; }

    public String getCertificatDhis2() { return certificatDhis2; }
    public void setCertificatDhis2(String certificatDhis2) { this.certificatDhis2 = certificatDhis2; }

    public String getSignatureHorodatage() { return signatureHorodatage; }
    public void setSignatureHorodatage(String signatureHorodatage) { this.signatureHorodatage = signatureHorodatage; }

    public boolean isEstCloturee() { return estCloturee; }
    public void setEstCloturee(boolean estCloturee) { this.estCloturee = estCloturee; }
}
