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
public class PatientTriageDTO {
    private Long id;
    private String matricule;            // "SEN-MED-2489"
    private String nomComplet;           // "Mamadou Ndiaye"
    private Integer ageMois;             // 14
    private Double poidsKg;              // 6.4
    private Integer niveauGravite;       // 1, 2, 3
    private String niveauLibelle;        // "NIVEAU 1 • MAS AVEC COMPLICATION"
    private String photoUrl;
    private String photoAlt;
    private String tuteurNom;            // "Fatou Fall"
    private String tuteurTelephone;      // "+221 77 412 89 20"
    private String adresse;              // "Médina Secteur 4 (Rue 22)"
    private String heureArrivee;         // "Arrivée 09:05" ou "Hier 18:20"
    private Double muacMm;               // 112.0
    private String muacLibelle;          // "MUAC 112 mm (Zone Rouge)"
    private Boolean oedemes;             // true
    private String oedemesLibelle;       // "Œdèmes ++"
    private String temperature;          // "T° 38.6°C"
    private String observationClinique;  // "Diarrhée aqueuse >48h"
    private String delaiPreconise;       // "Requis: Box Pédiatrie Immédiat (<15 min)"
    private String orientationBox;       // "Matinée (Box 2)"
    private String statutOrientation;    // "Patient Sélectionné", "Non assigné", "À planifier", "Non urgent"
    private Boolean isUrgent;            // true
    private Boolean isSelectionne;       // true
    private List<String> metricChips;    // ["MUAC 112 mm (Zone Rouge)", "Œdèmes ++", "T° 38.6°C", "Diarrhée aqueuse >48h"]
}
