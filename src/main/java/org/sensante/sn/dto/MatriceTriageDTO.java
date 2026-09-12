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
public class MatriceTriageDTO {
    private String dateTexte;              // "Mardi 15 Octobre 2024 — 09:15"
    private Integer nbBoxActifs;           // 3
    private List<BoxPraticienDTO> boxes;
    private List<SlotTempsDTO> slots;
    private List<CelluleMatriceDTO> cellules;
    private String creneauAffecteResume;   // "Box 1 (Dr Diop) à 09:45"
}
