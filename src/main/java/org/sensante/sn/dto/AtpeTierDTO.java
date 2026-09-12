package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AtpeTierDTO {
    private String id;
    private String tranchePoids; // e.g. "3.5 - 4.9 kg"
    private double poidsMin;
    private double poidsMax;
    private int sachetsParJour; // e.g. 2
    private int equivKcalJour;   // e.g. 1000
    private String dureePrescription; // "7 jours (phase 1)"
    private String uniteConditionnement; // "Sachet 92g (500 kcal)"
    private int rationHebdoTotale; // e.g. 14 sachets (sachetsParJour * 7)
    private boolean triageSpecialise; // true for >= 15 kg
    private String recommandationSpeciale; // e.g. "Référer Consultation Spécialisée Pédiatrie"
}
