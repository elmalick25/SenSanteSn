package org.sensante.sn.dto;

import java.util.List;

public class VaccinationPevDTO {

    private int pourcentageCouverture;
    private String statutCouvertureLabel;
    private List<DoseVaccinPevDTO> doses;
    private String supplementationVitA;
    private String mebendazoleStatut;
    private String derniereVerification;

    public VaccinationPevDTO() {}

    public VaccinationPevDTO(int pourcentageCouverture, String statutCouvertureLabel,
                             List<DoseVaccinPevDTO> doses, String supplementationVitA,
                             String mebendazoleStatut, String derniereVerification) {
        this.pourcentageCouverture = pourcentageCouverture;
        this.statutCouvertureLabel = statutCouvertureLabel;
        this.doses = doses;
        this.supplementationVitA = supplementationVitA;
        this.mebendazoleStatut = mebendazoleStatut;
        this.derniereVerification = derniereVerification;
    }

    public int getPourcentageCouverture() { return pourcentageCouverture; }
    public void setPourcentageCouverture(int pourcentageCouverture) { this.pourcentageCouverture = pourcentageCouverture; }

    public String getStatutCouvertureLabel() { return statutCouvertureLabel; }
    public void setStatutCouvertureLabel(String statutCouvertureLabel) { this.statutCouvertureLabel = statutCouvertureLabel; }

    public List<DoseVaccinPevDTO> getDoses() { return doses; }
    public void setDoses(List<DoseVaccinPevDTO> doses) { this.doses = doses; }

    public String getSupplementationVitA() { return supplementationVitA; }
    public void setSupplementationVitA(String supplementationVitA) { this.supplementationVitA = supplementationVitA; }

    public String getMebendazoleStatut() { return mebendazoleStatut; }
    public void setMebendazoleStatut(String mebendazoleStatut) { this.mebendazoleStatut = mebendazoleStatut; }

    public String getDerniereVerification() { return derniereVerification; }
    public void setDerniereVerification(String derniereVerification) { this.derniereVerification = derniereVerification; }
}
