package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RapportJournalierTelemetrieDTO {
    private LocalDate dateJournee;
    private String dateLibelle; // ex: "Journée du 22 Octobre 2024"
    private String fluxDhis2Statut; // ex: "Flux Télémétrique DHIS2 (18h30)"
    private Double tauxPromptitude; // 96.4
    private Double evolutionPromptitude; // +1.8
    private Integer rapportsATemps; // 51
    private Integer rapportsAttendus; // 53
    private List<StructurePromptitudeDTO> structuresPromptitude;
    private List<PointControleMasDTO> pointsControleMas;
    private String alertePicGraphique;
    private List<IssueCliniqueStructureDTO> issuesCliniques;
    private Integer totalConsultationsOrientees; // 376
    private StockAtpeFluxDTO stockAtpe;
    private List<AnomalieJournaliereDTO> anomalies;
    private String numeroCertificat; // MSAS-CERT-2024-DKR-042
    private String autoriteNom; // Dr. Aminata Diallo
    private String autoriteTitre; // Médecin Chef de District Sanitaire Dakar Ouest
    private String horodatageSha256;
    private Boolean estCloture;
    private String dateCloture;
}
