package org.sensante.sn.Service;

import org.sensante.sn.Model.Enfant;
import org.sensante.sn.Model.Role;
import org.sensante.sn.Model.Utilisateur;
import org.sensante.sn.Repository.EnfantRepository;
import org.sensante.sn.Repository.UtilisateurRepository;
import org.sensante.sn.exception.AccesRefuseMetierException;
import org.sensante.sn.exception.RessourceNonTrouveeException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Point unique de contrôle de l'isolation des données pédiatriques.
 *
 * Règle : un compte PARENT ne voit QUE les dossiers rattachés à son propre
 * identifiant utilisateur. Aucun repli sur des données de démonstration
 * n'est autorisé : un nouveau compte voit une liste vide, jamais les enfants
 * d'autres familles.
 */
@Service
public class EnfantAccesService {

    private final EnfantRepository enfantRepository;
    private final UtilisateurRepository utilisateurRepository;

    public EnfantAccesService(EnfantRepository enfantRepository, UtilisateurRepository utilisateurRepository) {
        this.enfantRepository = enfantRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    /** Utilisateur authentifié courant, ou exception si la session est absente. */
    @Transactional(readOnly = true)
    public Utilisateur utilisateurCourant() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null) {
            throw new AccesRefuseMetierException("Aucune session authentifiée : accès refusé.");
        }
        String email;
        Object principal = auth.getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            email = userDetails.getUsername();
        } else {
            email = String.valueOf(principal);
        }
        if (email == null || email.isBlank() || "anonymousUser".equals(email)) {
            throw new AccesRefuseMetierException("Aucune session authentifiée : accès refusé.");
        }
        return utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RessourceNonTrouveeException("Utilisateur", email));
    }

    /** Utilisateur authentifié, ou null si aucune session (usage tolérant). */
    @Transactional(readOnly = true)
    public Utilisateur utilisateurCourantOuNull() {
        try {
            return utilisateurCourant();
        } catch (RuntimeException e) {
            return null;
        }
    }

    /** true si l'utilisateur est un professionnel/administrateur habilité au périmètre global. */
    public boolean estProfessionnel(Utilisateur user) {
        if (user == null || user.getRole() == null) {
            return false;
        }
        Role role = user.getRole();
        return role == Role.AGENT_SANTE
                || role == Role.MEDECIN
                || role == Role.SUPERVISEUR
                || role == Role.ADMINISTRATEUR;
    }

    /** Liste des dossiers du parent connecté — strictement rattachés à son compte. */
    @Transactional(readOnly = true)
    public List<Enfant> mesEnfants() {
        Utilisateur user = utilisateurCourant();
        return enfantRepository.findByParentIdUser(user.getIdUser());
    }

    /**
     * Vérifie que l'utilisateur connecté a le droit de consulter ce dossier enfant.
     * Les professionnels de santé conservent leur périmètre métier ; un parent est
     * limité à ses propres enfants.
     */
    @Transactional(readOnly = true)
    public Enfant verifierAcces(Long enfantId) {
        if (enfantId == null) {
            throw new AccesRefuseMetierException("Identifiant enfant manquant : accès refusé.");
        }
        Enfant enfant = enfantRepository.findById(enfantId)
                .orElseThrow(() -> new RessourceNonTrouveeException("Enfant", enfantId));

        Utilisateur user = utilisateurCourant();
        if (estProfessionnel(user)) {
            return enfant;
        }
        Long proprietaire = enfant.getParent() != null ? enfant.getParent().getIdUser() : null;
        if (proprietaire == null || !proprietaire.equals(user.getIdUser())) {
            throw new AccesRefuseMetierException(
                    "Ce dossier pédiatrique n'est pas rattaché à votre compte.");
        }
        return enfant;
    }

    /** Variante booléenne (sans exception). */
    @Transactional(readOnly = true)
    public boolean peutAcceder(Long enfantId) {
        try {
            verifierAcces(enfantId);
            return true;
        } catch (RuntimeException e) {
            return false;
        }
    }
}
