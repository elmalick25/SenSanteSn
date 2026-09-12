package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentIdentiteDTO {
    private Long idUser;
    private String nom;
    private String prenom;
    private String nomComplet;
    private String email;
    private String telephone;
    private String avatarUrl;
    private String role;
    private String titrePoste; // "Agent Terrain — Bajenu Gox"
    private String structure;  // "Poste Médina"
    private String secteur;    // "Secteur 4"
    private String localisationDescription; // "Poste Médina — Secteur 4"
    private String statutConnexion; // "Connecté — Synchro: 08:42"
    private String heureDerniereSynchro; // "08:42"
    private String statutReseau; // "Réseau 4G Local OK"
}
