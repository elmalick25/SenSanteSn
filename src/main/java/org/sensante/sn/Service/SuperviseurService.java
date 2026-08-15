package org.sensante.sn.Service;

import org.springframework.stereotype.Service;
import org.sensante.sn.Model.Superviseur;
import org.sensante.sn.Repository.SuperviseurRepository;
import org.sensante.sn.exception.RessourceNonTrouveException;

import java.util.List;

@Service
public class SuperviseurService {

    private final SuperviseurRepository superviseurRepository;

    public SuperviseurService(SuperviseurRepository superviseurRepository) {
        this.superviseurRepository = superviseurRepository;
    }

    public Superviseur createSuperviseur(Superviseur superviseur) {
        return superviseurRepository.save(superviseur);
    }

    public List<Superviseur> getAllSuperviseurs() {
        return superviseurRepository.findAll();
    }

    public Superviseur getSuperviseurById(Long id) {
        return superviseurRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveException("Superviseur non trouvé avec l'id : " + id));
    }

    public Superviseur updateSuperviseur(Long id, Superviseur superviseurDetails) {
        Superviseur superviseurExistant = getSuperviseurById(id);

        superviseurExistant.setNom(superviseurDetails.getNom());
        superviseurExistant.setPrenom(superviseurDetails.getPrenom());
        superviseurExistant.setEmail(superviseurDetails.getEmail());
        superviseurExistant.setTelephone(superviseurDetails.getTelephone());

        return superviseurRepository.save(superviseurExistant);
    }

    public void deleteSuperviseur(Long id) {
        Superviseur superviseur = getSuperviseurById(id);
        superviseurRepository.delete(superviseur);
    }
}