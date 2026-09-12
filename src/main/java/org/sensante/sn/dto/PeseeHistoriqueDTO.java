package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PeseeHistoriqueDTO {
    private String date;             // "15 Sep 2024", "01 Oct 2024", "Hier 14 Oct 2024"
    private Double poidsKg;          // 6.8, 6.5, 6.2
    private String variationTexte;   // "-300g (Pente descendante)", "-300g / Chute continue"
    private String typePesee;        // "REFERENCE", "ALERTE_BAISSE", "CHUTE_CRITIQUE"
    private String sousTitre;        // "Référence d'admission"
    private Boolean critique;        // true si chute critique
}
