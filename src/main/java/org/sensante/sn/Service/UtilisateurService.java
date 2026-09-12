package org.sensante.sn.Service;

import org.jspecify.annotations.NonNull;
import org.sensante.sn.Model.Utilisateur;
import org.sensante.sn.Repository.UtilisateurRepository;
import org.sensante.sn.exception.RessourceNonTrouveException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public UtilisateurService(UtilisateurRepository utilisateurRepository, PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Utilisateur createUtilisateur(Utilisateur utilisateur) {
        if (utilisateur.getMotDePasse() != null && !utilisateur.getMotDePasse().isBlank()) {
            utilisateur.setMotDePasse(passwordEncoder.encode(utilisateur.getMotDePasse()));
        }
        return utilisateurRepository.save(utilisateur);
    }

    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();
    }

    public Utilisateur getUtilisateurById(Long id) {
        return utilisateurRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveException("Utilisateur non trouvé avec l'id : " + id));
    }

    public Utilisateur getUtilisateurByEmail(String email) {
        return utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RessourceNonTrouveException("Utilisateur non trouvé avec l'email : " + email));
    }

    public Utilisateur updateUtilisateur(Long id, @NonNull Utilisateur utilisateurDetails) {
        Utilisateur utilisateurExistant = getUtilisateurById(id);

        utilisateurExistant.setNom(utilisateurDetails.getNom());
        utilisateurExistant.setPrenom(utilisateurDetails.getPrenom());
        utilisateurExistant.setEmail(utilisateurDetails.getEmail());
        utilisateurExistant.setTelephone(utilisateurDetails.getTelephone());
        utilisateurExistant.setRole(utilisateurDetails.getRole());

        if (utilisateurDetails.getMotDePasse() != null && !utilisateurDetails.getMotDePasse().isBlank()) {
            utilisateurExistant.setMotDePasse(passwordEncoder.encode(utilisateurDetails.getMotDePasse()));
        }

        return utilisateurRepository.save(utilisateurExistant);
    }

    public org.sensante.sn.dto.UserProfileDTO getCurrentUserProfile(String email) {
        Utilisateur u = getUtilisateurByEmail(email);
        return mapToProfileDTO(u);
    }

    public org.sensante.sn.dto.UserProfileDTO updateCurrentUserProfile(String email, org.sensante.sn.dto.UserProfileUpdateDTO dto) {
        Utilisateur u = getUtilisateurByEmail(email);

        if (dto.getNom() != null) u.setNom(dto.getNom());
        if (dto.getPrenom() != null) u.setPrenom(dto.getPrenom());
        if (dto.getNomUtilisateur() != null) u.setNomUtilisateur(dto.getNomUtilisateur());
        if (dto.getTelephone() != null) u.setTelephone(dto.getTelephone());
        if (dto.getDateNaissance() != null) u.setDateNaissance(dto.getDateNaissance());
        if (dto.getAdresseActuelle() != null) u.setAdresseActuelle(dto.getAdresseActuelle());
        if (dto.getAdressePermanente() != null) u.setAdressePermanente(dto.getAdressePermanente());
        if (dto.getVille() != null) u.setVille(dto.getVille());
        if (dto.getCodePostal() != null) u.setCodePostal(dto.getCodePostal());
        if (dto.getPays() != null) u.setPays(dto.getPays());
        if (dto.getAvatarUrl() != null) u.setAvatarUrl(dto.getAvatarUrl());

        Utilisateur saved = utilisateurRepository.save(u);
        return mapToProfileDTO(saved);
    }

    public void changePassword(String email, org.sensante.sn.dto.ChangePasswordDTO dto) {
        Utilisateur u = getUtilisateurByEmail(email);

        if (dto.getAncienMotDePasse() == null || !passwordEncoder.matches(dto.getAncienMotDePasse(), u.getMotDePasse())) {
            throw new IllegalArgumentException("L'ancien mot de passe est incorrect.");
        }

        if (dto.getNouveauMotDePasse() == null || dto.getNouveauMotDePasse().length() < 6) {
            throw new IllegalArgumentException("Le nouveau mot de passe doit contenir au moins 6 caractères.");
        }

        if (!dto.getNouveauMotDePasse().equals(dto.getConfirmationMotDePasse())) {
            throw new IllegalArgumentException("La confirmation du mot de passe ne correspond pas.");
        }

        u.setMotDePasse(passwordEncoder.encode(dto.getNouveauMotDePasse()));
        utilisateurRepository.save(u);
    }

    public org.sensante.sn.dto.UserProfileDTO mapToProfileDTO(Utilisateur u) {
        String fullName = ((u.getPrenom() != null ? u.getPrenom() : "") + " " + (u.getNom() != null ? u.getNom() : "")).trim();
        if (fullName.isEmpty()) fullName = u.getEmail();

        return org.sensante.sn.dto.UserProfileDTO.builder()
                .idUser(u.getIdUser())
                .nom(u.getNom())
                .prenom(u.getPrenom())
                .nomComplet(fullName)
                .nomUtilisateur(u.getNomUtilisateur() != null ? u.getNomUtilisateur() : (u.getPrenom() != null ? u.getPrenom().toLowerCase() : u.getEmail().split("@")[0]))
                .email(u.getEmail())
                .telephone(u.getTelephone())
                .dateNaissance(u.getDateNaissance())
                .adresseActuelle(u.getAdresseActuelle())
                .adressePermanente(u.getAdressePermanente())
                .ville(u.getVille())
                .codePostal(u.getCodePostal())
                .pays(u.getPays() != null ? u.getPays() : "Sénégal")
                .avatarUrl(u.getAvatarUrl())
                .role(u.getRole())
                .build();
    }

    public void deleteUtilisateur(Long id) {
        Utilisateur utilisateur = getUtilisateurById(id);
        utilisateurRepository.delete(utilisateur);
    }
}