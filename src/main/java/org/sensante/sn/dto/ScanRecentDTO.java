package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScanRecentDTO {
    private Long id;
    private String matricule;     // "SEN-MED-2489"
    private String nomComplet;    // "Mamadou Ndiaye"
    private String libelleChip;   // "Mamadou Ndiaye #2489"
    private String statut;        // "MAS", "MAM", "NORMAL"
    private String heureScan;     // "08:44"
}
