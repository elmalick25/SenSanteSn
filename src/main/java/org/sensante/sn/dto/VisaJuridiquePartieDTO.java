package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VisaJuridiquePartieDTO {
    private String roleTitre;        // "Émettrice — Agente Communautaire de Santé", "Destinataire Officiel — Médecin Superviseur de District"
    private String nomComplet;       // "Aïssatou Diop", "Dr. Cheikh Ndiaye"
    private String initiales;        // "AD", "CN"
    private String matricule;        // "BG-DK-0428", "MS-DKC-0012"
    private String posteStructure;   // "Bajenu Gox Titulaire • Poste Médina Sud", "Médecin Chef de District • District Sanitaire Dakar Centre"
    private String certificatOuCanal;// "Certificat : PKI-SN-GOV-98442", "Canal : Liaison Sécurisée COUS / DGS Intranet"
    private String horodatage;       // "15/10/2024 • 17:30:12 GMT", "Télétransmission prête en file prioritaire"
    private String badgeStatutTexte; // "Signé numériquement", "En attente de visa district"
    private String visaPillTexte;    // "VISA AGENT OK", "CANAL ACTIF"
    private boolean estSigne;        // true
}
