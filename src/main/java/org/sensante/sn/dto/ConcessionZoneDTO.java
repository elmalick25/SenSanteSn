package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConcessionZoneDTO {
    private String id;
    private String codeConcession; // ex: MED-C21-2024
    private String nomFamille;      // ex: Famille Diop
    private String chefFamille;     // ex: Mamadou Diop
    private String adresse;         // ex: Médina Rue 22 x Angle 15
    private String statut;          // "MAS", "MAM", "NORMAL", "VISITE"
    private int distanceMetres;     // ex: 12
    private String distanceTexte;   // ex: "12m", "À 45m au Sud"
    private String alerteTexte;     // ex: "1 Urgence Immédiate", "1 Enfant MAM"
    private int ordrePriorite;      // 1, 2, 3...
    private int nbEnfants;          // ex: 3
    private int casMas;             // ex: 1
    private int casMam;             // ex: 1
    private int atpeDelivres;       // ex: 7
    private double coordX;          // SVG X (ex: 730)
    private double coordY;          // SVG Y (ex: 420)
    private String noteVocaleDuree; // ex: "0:42s"
    private String noteVocaleTranscription; // ex: "Débriefing mère Fatou Diop..."
    private boolean noteVocaleEnregistree;
    private String signatureAuteur; // ex: "Mamadou Diop (Chef de concession)"
    private String signatureHorodatage; // ex: "09:42:15 GMT"
    private boolean signatureValidee;
    private boolean eauPurifieeRemise;
    private boolean ficheLiaisonTamponnee;
    private int numeroVisite;       // ex: 1
    private int totalVisites;       // ex: 3
    private String gpsPrecision;    // ex: "±2m"
}
