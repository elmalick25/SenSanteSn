package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefereUrgenceLigneDTO {
    private String enfantNom;          // "Moussa Sow"
    private String enfantAgeSexe;      // "14 mois • Sexe M"
    private int muacMm;                // 108
    private String concessionOrigine;  // "Concession Tilène B (GPS: 14.6892° N)"
    private String heureAlerte;        // "10:14 GMT"
    private String medecinAssigne;     // "Dr. Babacar Diop"
    private String medecinRole;        // "Pédiatre Référent District"
    private String vecteurTransport;   // "Chariot Sanitaire Médina", "Accompagnement Bajenu Gox", "Ambulance District Sud"
    private String typeVecteur;        // "CHARIOT", "PIED", "AMBULANCE"
    private String statutPriseEnCharge; // "Reçu (Zéro attente)"
}
