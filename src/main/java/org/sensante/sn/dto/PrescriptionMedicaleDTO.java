package org.sensante.sn.dto;

import java.util.List;

public class PrescriptionMedicaleDTO {

    private PatientHeaderDTO patient;
    private String centreDeSante;
    private String datePrescription;
    private boolean syncEnDirect;
    private double poidsCalculeKg;

    // Alerte Sécurisation Thérapeutique
    private boolean alerteAllergieActive;
    private String alerteAllergieTitre;
    private String alerteAllergieMessage;

    // 1. Médicaments Prescrits
    private List<MedicamentPrescritDTO> medicaments;
    private int historiqueOrdonnancesCount;

    // 2. Protocole Nutritionnel CRENAS
    private DotationAtpeDTO dotationAtpe;
    private List<JalonCureAtpeDTO> jalonsCure;

    // 3. Fiche Contre-Référence Relais
    private FicheContreReferenceDTO contreReference;

    // 4. Document Officiel Scellé
    private DocumentOfficielDTO documentOfficiel;

    public PrescriptionMedicaleDTO() {}

    public PatientHeaderDTO getPatient() { return patient; }
    public void setPatient(PatientHeaderDTO patient) { this.patient = patient; }

    public String getCentreDeSante() { return centreDeSante; }
    public void setCentreDeSante(String centreDeSante) { this.centreDeSante = centreDeSante; }

    public String getDatePrescription() { return datePrescription; }
    public void setDatePrescription(String datePrescription) { this.datePrescription = datePrescription; }

    public boolean isSyncEnDirect() { return syncEnDirect; }
    public void setSyncEnDirect(boolean syncEnDirect) { this.syncEnDirect = syncEnDirect; }

    public double getPoidsCalculeKg() { return poidsCalculeKg; }
    public void setPoidsCalculeKg(double poidsCalculeKg) { this.poidsCalculeKg = poidsCalculeKg; }

    public boolean isAlerteAllergieActive() { return alerteAllergieActive; }
    public void setAlerteAllergieActive(boolean alerteAllergieActive) { this.alerteAllergieActive = alerteAllergieActive; }

    public String getAlerteAllergieTitre() { return alerteAllergieTitre; }
    public void setAlerteAllergieTitre(String alerteAllergieTitre) { this.alerteAllergieTitre = alerteAllergieTitre; }

    public String getAlerteAllergieMessage() { return alerteAllergieMessage; }
    public void setAlerteAllergieMessage(String alerteAllergieMessage) { this.alerteAllergieMessage = alerteAllergieMessage; }

    public List<MedicamentPrescritDTO> getMedicaments() { return medicaments; }
    public void setMedicaments(List<MedicamentPrescritDTO> medicaments) { this.medicaments = medicaments; }

    public int getHistoriqueOrdonnancesCount() { return historiqueOrdonnancesCount; }
    public void setHistoriqueOrdonnancesCount(int historiqueOrdonnancesCount) { this.historiqueOrdonnancesCount = historiqueOrdonnancesCount; }

    public DotationAtpeDTO getDotationAtpe() { return dotationAtpe; }
    public void setDotationAtpe(DotationAtpeDTO dotationAtpe) { this.dotationAtpe = dotationAtpe; }

    public List<JalonCureAtpeDTO> getJalonsCure() { return jalonsCure; }
    public void setJalonsCure(List<JalonCureAtpeDTO> jalonsCure) { this.jalonsCure = jalonsCure; }

    public FicheContreReferenceDTO getContreReference() { return contreReference; }
    public void setContreReference(FicheContreReferenceDTO contreReference) { this.contreReference = contreReference; }

    public DocumentOfficielDTO getDocumentOfficiel() { return documentOfficiel; }
    public void setDocumentOfficiel(DocumentOfficielDTO documentOfficiel) { this.documentOfficiel = documentOfficiel; }
}
