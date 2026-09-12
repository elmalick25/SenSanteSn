package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.sensante.sn.Model.Role;
import org.sensante.sn.Model.StatutCompte;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BadgeDTO {
    private Long idUser;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private Role role;
    private String avatarUrl;
    private LocalDate dateNaissance;

    // Badges & Informations Institutionnelles MSAS
    private String cni;
    private String cniMasquee;
    private String numeroOrdre;
    private String matriculeEtat;
    private String titrePoste;
    private String codeStructure;
    private String nomStructure;
    private String regionSanitaire;
    private String districtSanitaire;
    private StatutCompte statutCompte;
    private String securiteMfa;
    private String motifSuspension;
    private String codeBadge;
    private String accreditation;
    private String idCarnet;
    private Integer enfantsAssociesCount;
}
