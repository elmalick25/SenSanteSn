package org.sensante.sn.Service;

import lombok.RequiredArgsConstructor;
import org.sensante.sn.Model.*;
import org.sensante.sn.Repository.UtilisateurRepository;
import org.sensante.sn.dto.BadgeDTO;
import org.sensante.sn.dto.BadgeStatsDTO;
import org.sensante.sn.dto.CreateBadgeRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BadgeService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public Page<BadgeDTO> getBadges(
            Role role,
            StatutCompte statut,
            String region,
            String search,
            String sortField,
            String sortDir,
            int page,
            int size
    ) {
        String safeSort = "nom";
        if ("derniereActivite".equalsIgnoreCase(sortField) || "id".equalsIgnoreCase(sortField)) {
            safeSort = "idUser";
        } else if ("structure".equalsIgnoreCase(sortField) || "nomStructure".equalsIgnoreCase(sortField)) {
            safeSort = "nomStructure";
        }

        Sort sort = "desc".equalsIgnoreCase(sortDir)
                ? Sort.by(safeSort).descending()
                : Sort.by(safeSort).ascending();

        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), sort);
        return utilisateurRepository.findBadgesWithFilters(role, statut, region, search, pageable)
                .map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public BadgeStatsDTO getBadgeStats() {
        long total = utilisateurRepository.count();
        long valides = utilisateurRepository.countByStatutCompte(StatutCompte.ACTIF);
        long enAttente = utilisateurRepository.countByStatutCompte(StatutCompte.EN_ATTENTE);
        long suspendus = utilisateurRepository.countByStatutCompte(StatutCompte.SUSPENDU);

        long medecins = utilisateurRepository.countByRole(Role.MEDECIN);
        long agents = utilisateurRepository.countByRole(Role.AGENT_SANTE);
        long superviseurs = utilisateurRepository.countByRole(Role.SUPERVISEUR);
        long admins = utilisateurRepository.countByRole(Role.ADMINISTRATEUR);
        long parents = utilisateurRepository.countByRole(Role.PARENT);

        return BadgeStatsDTO.builder()
                .totalBadges(total)
                .totalValides(valides)
                .totalEnAttente(enAttente)
                .totalSuspendus(suspendus)
                .medecinsChefsCount(medecins)
                .agentsSanteCount(agents)
                .superviseursCount(superviseurs)
                .administrateursCount(admins)
                .parentsCount(parents)
                .build();
    }

    @Transactional
    public BadgeDTO createBadge(CreateBadgeRequest req) {
        if (utilisateurRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Un utilisateur avec cet email existe déjà : " + req.getEmail());
        }

        Utilisateur u;
        switch (req.getRole()) {
            case MEDECIN -> u = new Medecin();
            case AGENT_SANTE -> u = new AgentSante();
            case SUPERVISEUR -> u = new Superviseur();
            case ADMINISTRATEUR -> u = new Administrateur();
            case PARENT -> u = new Parent();
            default -> u = new Utilisateur();
        }

        u.setNom(req.getNom());
        u.setPrenom(req.getPrenom() != null ? req.getPrenom() : "");
        u.setEmail(req.getEmail());
        u.setTelephone(req.getTelephone());
        u.setRole(req.getRole());
        u.setDateNaissance(req.getDateNaissance());
        u.setAvatarUrl(req.getAvatarUrl());
        u.setCni(req.getCni());
        u.setNumeroOrdre(req.getNumeroOrdre());
        u.setMatriculeEtat(req.getMatriculeEtat());
        u.setRegionSanitaire(req.getRegionSanitaire());
        u.setDistrictSanitaire(req.getDistrictSanitaire());
        u.setNomStructure(req.getNomStructure());
        u.setCodeStructure(req.getCodeStructure());
        u.setTitrePoste(req.getTitrePoste());
        u.setStatutCompte(StatutCompte.ACTIF);

        // Attribuer sécurité MFA par défaut selon rôle
        if (req.getRole() == Role.ADMINISTRATEUR) {
            u.setSecuriteMfa("Clé Matérielle PKI");
            u.setAccreditation("Décret MSAS National");
        } else if (req.getRole() == Role.MEDECIN) {
            u.setSecuriteMfa("FIDO2 / Biométrie");
            u.setAccreditation(req.getNumeroOrdre() != null ? req.getNumeroOrdre() : "ONMS Enregistré");
        } else if (req.getRole() == Role.SUPERVISEUR) {
            u.setSecuriteMfa("App Authenticator");
            u.setAccreditation("Arrêté Régional");
        } else if (req.getRole() == Role.AGENT_SANTE) {
            u.setSecuriteMfa("OTP SMS Actif");
        } else {
            u.setSecuriteMfa("OTP SMS / WhatsApp");
            u.setIdCarnet("CARNET-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }

        // Code Badge Unique
        String prefix = req.getCodeStructure() != null ? req.getCodeStructure() : "MSAS-SN";
        u.setCodeBadge(prefix + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());

        String rawPassword = req.getMotDePasse() != null && !req.getMotDePasse().isBlank()
                ? req.getMotDePasse()
                : "Passer@2025!";
        u.setMotDePasse(passwordEncoder.encode(rawPassword));

        Utilisateur saved = utilisateurRepository.save(u);
        return toDTO(saved);
    }

    @Transactional
    public BadgeDTO updateStatut(Long idUser, StatutCompte newStatut, String motif) {
        Utilisateur u = utilisateurRepository.findById(idUser)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé avec l'id : " + idUser));
        u.setStatutCompte(newStatut);
        if (motif != null) {
            u.setMotifSuspension(motif);
        }
        return toDTO(utilisateurRepository.save(u));
    }

    @Transactional
    public BadgeDTO resetMfa(Long idUser) {
        Utilisateur u = utilisateurRepository.findById(idUser)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé avec l'id : " + idUser));
        u.setSecuriteMfa("OTP SMS Réinitialisé");
        return toDTO(utilisateurRepository.save(u));
    }

    public BadgeDTO toDTO(Utilisateur u) {
        return BadgeDTO.builder()
                .idUser(u.getIdUser())
                .nom(u.getNom())
                .prenom(u.getPrenom())
                .email(u.getEmail())
                .telephone(u.getTelephone())
                .role(u.getRole())
                .avatarUrl(u.getAvatarUrl())
                .dateNaissance(u.getDateNaissance())
                .cni(u.getCni())
                .cniMasquee(maskCni(u.getCni()))
                .numeroOrdre(u.getNumeroOrdre())
                .matriculeEtat(u.getMatriculeEtat())
                .titrePoste(u.getTitrePoste())
                .codeStructure(u.getCodeStructure())
                .nomStructure(u.getNomStructure())
                .regionSanitaire(u.getRegionSanitaire())
                .districtSanitaire(u.getDistrictSanitaire())
                .statutCompte(u.getStatutCompte())
                .securiteMfa(u.getSecuriteMfa())
                .motifSuspension(u.getMotifSuspension())
                .codeBadge(u.getCodeBadge())
                .accreditation(u.getAccreditation())
                .idCarnet(u.getIdCarnet())
                .enfantsAssociesCount(u.getEnfantsAssociesCount())
                .build();
    }

    private String maskCni(String cni) {
        if (cni == null || cni.isBlank()) {
            return "Non renseigné";
        }
        String clean = cni.replaceAll("\\s+", "");
        if (clean.length() >= 6) {
            String start = clean.substring(0, Math.min(4, clean.length()));
            String end = clean.substring(clean.length() - 2);
            return start + " •••• •••• " + end;
        }
        return cni;
    }
}
