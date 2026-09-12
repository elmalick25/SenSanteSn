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
public class ZoneCarteOverviewDTO {
    private String posteSante;          // "Poste Médina"
    private String secteurNom;           // "Zone Cible Prioritaire Secteur 4 (Concessions 18 à 34)"
    private String tourneeLibelle;       // "Tournée Terrain J-3"
    private String cacheStatut;          // "Données hors-ligne vérifiées (08:45 GMT)"
    private String cacheTaille;          // "142 Mo En Cache"
    private String gpsFixDetails;        // "Fix ±2.8m • 14 Satellites RTK"
    private boolean modeHorsLigneActif;  // true
    private String sosNumero;            // "1515"
    private String solaireCourant;       // "+1.4A Solaire"
    private int batteriePct;             // 98
    private String batterieAutonomie;    // "9h"
    private int fileAttenteLocaleCount;  // 8
    private List<ConcessionZoneDTO> concessions;
    private ConcessionZoneDTO concessionActive;
}
