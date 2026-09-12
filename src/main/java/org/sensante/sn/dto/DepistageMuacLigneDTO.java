package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepistageMuacLigneDTO {
    private String categorie;         // "Vert / Normal", "Jaune / MAM (Modérée)", "Rouge / MAS Critique"
    private String couleur;           // "VERT", "JAUNE", "ROUGE"
    private String seuilMuac;         // "PB ≥ 125 mm", "115 mm ≤ PB < 125 mm", "PB < 115 mm"
    private int effectifConstate;     // 28, 7, 3
    private double pourcentage;       // 73.7, 18.4, 7.9
    private String protocolesMesures; // "Conseils nutritionnels...", "Distribution farine...", "Transfert immédiat UREN..."
    private String statutCloture;     // "Validé", "Suivi Programmé", "Référé d'Urgence"
}
