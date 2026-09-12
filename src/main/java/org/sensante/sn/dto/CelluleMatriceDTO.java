package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CelluleMatriceDTO {
    private String slotId;             // "slot-1", "slot-2"
    private Integer boxId;             // 1, 2, 3
    private String statut;             // "OCCUPE", "LIBRE", "AFFECTE", "RESERVE_MAS"
    private String patientNom;         // "Fatou N. (11m)", "Mamadou Ndiaye"
    private String motifOuSousTitre;   // "En cours d'examen", "Protocole Zéro Attente MAS", "Pédiatrie Générale"
    private String badgeTexte;         // "Affecté", "Dispo", "Choisir"
    private Boolean isLocked;          // true si cadenas
    private Boolean isEnCours;         // true si sablier
    private Boolean isAffecte;         // true si cellule sélectionnée/affectée
}
