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

    public void deleteUtilisateur(Long id) {
        Utilisateur utilisateur = getUtilisateurById(id);
        utilisateurRepository.delete(utilisateur);
    }
}