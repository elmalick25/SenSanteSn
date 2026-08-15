package org.sensante.sn.Service;

import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;
import org.sensante.sn.Model.Utilisateur;
import org.sensante.sn.Repository.UtilisateurRepository;
import org.sensante.sn.exception.RessourceNonTrouveException;

import java.util.List;

@Service
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;

    public UtilisateurService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    public Utilisateur createUtilisateur(Utilisateur utilisateur) {
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
        utilisateurExistant.setMotDePasse(utilisateurDetails.getMotDePasse());
        utilisateurExistant.setRole(utilisateurDetails.getRole());

        return utilisateurRepository.save(utilisateurExistant);
    }

    public void deleteUtilisateur(Long id) {
        Utilisateur utilisateur = getUtilisateurById(id);
        utilisateurRepository.delete(utilisateur);
    }
}