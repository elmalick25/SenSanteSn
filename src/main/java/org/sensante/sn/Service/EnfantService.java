package org.sensante.sn.Service;

import org.springframework.stereotype.Service;
import org.sensante.sn.Model.Enfant;
import org.sensante.sn.Repository.EnfantRepository;
import org.sensante.sn.exception.RessourceNonTrouveException;

import java.util.List;

@Service
public class EnfantService {

    private final EnfantRepository enfantRepository;

    public EnfantService(EnfantRepository enfantRepository) {
        this.enfantRepository = enfantRepository;
    }

    public Enfant createEnfant(Enfant enfant) {
        return enfantRepository.save(enfant);
    }

    public List<Enfant> getAllEnfants() {
        return enfantRepository.findAll();
    }

    public Enfant getEnfantById(Long id) {
        return enfantRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveException("Enfant non trouvé avec l'id : " + id));
    }

    public Enfant updateEnfant(Long id, Enfant enfantDetails) {
        Enfant enfantExistant = getEnfantById(id);

        enfantExistant.setNom(enfantDetails.getNom());
        enfantExistant.setPrenom(enfantDetails.getPrenom());
        enfantExistant.setGenre(enfantDetails.getGenre());
        enfantExistant.setDateNaissance(enfantDetails.getDateNaissance());
        enfantExistant.setTelephoneParent(enfantDetails.getTelephoneParent());
        enfantExistant.setQrCode(enfantDetails.getQrCode());

        return enfantRepository.save(enfantExistant);
    }

    public void deleteEnfant(Long id) {
        Enfant enfant = getEnfantById(id);
        enfantRepository.delete(enfant);
    }
}