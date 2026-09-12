package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SlotTempsDTO {
    private String slotId;             // "slot-1", "slot-2", etc.
    private String heureDebut;         // "09:15"
    private String heureFin;           // "09:45"
    private String plageHoraireTexte;  // "09:15 — 09:45"
    private Boolean isUrgence;         // true si créneau d'urgence
}
