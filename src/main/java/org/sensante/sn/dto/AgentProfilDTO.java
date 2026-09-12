package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentProfilDTO {
    private Long idUser;
    private String nomComplet;           // "Aïssatou Diop"
    private String prenom;               // "Aïssatou"
    private String nom;                  // "Diop"
    private String email;                // "aissatou.diop@sensante.sn"
    private String telephone;            // "77 543 12 89"
    private String indicatifPays;        // "+221"
    private String dateNaissance;        // "14/08/1984"
    private String residence;            // "Médina, Rue 22 × Angle 15, Dakar"
    private String matricule;            // "BG-DK-0428"
    private String structureSante;       // "Poste de Santé Médina — District Sud"
    private String zonesIntervention;    // "Secteur 4 (Médina Sud & Tilène), Secteur 2 (Rue 11)"
    private String langueService;        // "FR" ou "WO"
    private String statutService;        // "EN_SERVICE_ACTIF"
    private String titrePoste;           // "Agente Communautaire Titulaire (Bajenu Gox)"
    private String districtRattachement; // "District Sanitaire Dakar Sud"
    private String agrementMinistere;    // "MSAS/DGS/2024/09-A"
    private String avatarUrl;            // URL photo
    private String dateDerniereMiseAJour;// "12 Octobre 2024"
    private boolean liaisonCousActive;   // true
}
