package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClotureRegistreOverviewDTO {
    private String titreBordereau;         // "Bordereau Récapitulatif Quotidien"
    private String juridictionAdministrative; // "Région Médicale de Dakar / District Centre / Poste Médina"
    private String sousTitreLegal;          // "Journal légal des actes communautaires de santé publique — Conforme aux directives DGS/MSAS Sénégal."
    private String visaStampTexte;          // "VISA MSAS DK"
    private String posteNom;                // "Poste de Santé Médina"
    private String secteurNom;              // "Secteur : Médina Sud & Tilène"
    private String referenceNumero;         // "REF: REG-DKC-20241015-0428"
    private String decretReference;         // "N° Décret MSAS: 2023-R-884-SN"
    private String empreinteSha256;         // "8f3a9e4b7c12d50e8841a02fb1935dc74e629bc5018f2a637d95e01ca7d84291"
    private String scelleHorodatage;        // "15/10/2024 • 17:30:12 GMT"
    private String dateFinServiceTexte;     // "Mardi 15 Octobre 2024 — Fin de Service (17:30 GMT)"
    private int totalEnfantsExamines;       // 38
    private int totalRefereUren;            // 3
    private List<DepistageMuacLigneDTO> depistagesMuac;
    private List<RefereUrgenceLigneDTO> referesUrgence;
    private MouvementStockAtpeDTO mouvementStockAtpe;
    private VisiteConcessionResumeDTO visiteConcessionResume;
    private VisaJuridiquePartieDTO visaAgente;
    private VisaJuridiquePartieDTO visaDistrict;
    private boolean transmisDistrict;
}
