package org.sensante.sn.dto;

public class OedemeHydratationDTO {

    private String oedemesBilaterauxLabel;
    private int oedemesGrade; // 0, 1, 2, 3
    private String godetTestDetails;
    private String pliCutaneAbdominal;
    private String pliCutaneTestDetails;
    private boolean diarrheePersistante;
    private int diarrheeJours;
    private String diarrheeType;
    private String diarrheeDetails;

    public OedemeHydratationDTO() {}

    public OedemeHydratationDTO(String oedemesBilaterauxLabel, int oedemesGrade, String godetTestDetails,
                                String pliCutaneAbdominal, String pliCutaneTestDetails,
                                boolean diarrheePersistante, int diarrheeJours,
                                String diarrheeType, String diarrheeDetails) {
        this.oedemesBilaterauxLabel = oedemesBilaterauxLabel;
        this.oedemesGrade = oedemesGrade;
        this.godetTestDetails = godetTestDetails;
        this.pliCutaneAbdominal = pliCutaneAbdominal;
        this.pliCutaneTestDetails = pliCutaneTestDetails;
        this.diarrheePersistante = diarrheePersistante;
        this.diarrheeJours = diarrheeJours;
        this.diarrheeType = diarrheeType;
        this.diarrheeDetails = diarrheeDetails;
    }

    public String getOedemesBilaterauxLabel() { return oedemesBilaterauxLabel; }
    public void setOedemesBilaterauxLabel(String oedemesBilaterauxLabel) { this.oedemesBilaterauxLabel = oedemesBilaterauxLabel; }

    public int getOedemesGrade() { return oedemesGrade; }
    public void setOedemesGrade(int oedemesGrade) { this.oedemesGrade = oedemesGrade; }

    public String getGodetTestDetails() { return godetTestDetails; }
    public void setGodetTestDetails(String godetTestDetails) { this.godetTestDetails = godetTestDetails; }

    public String getPliCutaneAbdominal() { return pliCutaneAbdominal; }
    public void setPliCutaneAbdominal(String pliCutaneAbdominal) { this.pliCutaneAbdominal = pliCutaneAbdominal; }

    public String getPliCutaneTestDetails() { return pliCutaneTestDetails; }
    public void setPliCutaneTestDetails(String pliCutaneTestDetails) { this.pliCutaneTestDetails = pliCutaneTestDetails; }

    public boolean isDiarrheePersistante() { return diarrheePersistante; }
    public void setDiarrheePersistante(boolean diarrheePersistante) { this.diarrheePersistante = diarrheePersistante; }

    public int getDiarrheeJours() { return diarrheeJours; }
    public void setDiarrheeJours(int diarrheeJours) { this.diarrheeJours = diarrheeJours; }

    public String getDiarrheeType() { return diarrheeType; }
    public void setDiarrheeType(String diarrheeType) { this.diarrheeType = diarrheeType; }

    public String getDiarrheeDetails() { return diarrheeDetails; }
    public void setDiarrheeDetails(String diarrheeDetails) { this.diarrheeDetails = diarrheeDetails; }
}
