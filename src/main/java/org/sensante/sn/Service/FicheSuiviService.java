package org.sensante.sn.Service;

import org.springframework.stereotype.Service;
import org.sensante.sn.Model.FicheSuivi;
import org.sensante.sn.Repository.FicheSuiviRepository;
import org.sensante.sn.exception.RessourceNonTrouveException;

import java.util.List;

@Service
public class FicheSuiviService {

    private final FicheSuiviRepository ficheSuiviRepository;

    public FicheSuiviService(FicheSuiviRepository ficheSuiviRepository) {
        this.ficheSuiviRepository = ficheSuiviRepository;
    }

    public FicheSuivi createFicheSuivi(FicheSuivi ficheSuivi) {
        return ficheSuiviRepository.save(ficheSuivi);
    }

    public List<FicheSuivi> getAllFichesSuivi() {
        return ficheSuiviRepository.findAll();
    }

    public FicheSuivi getFicheSuiviById(Long id) {
        return ficheSuiviRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveException("Fiche de suivi non trouvée avec l'id : " + id));
    }

    public List<FicheSuivi> getFichesByEnfantId(Long enfantId) {
        return ficheSuiviRepository.findByEnfantEnfantId(enfantId);
    }

    public FicheSuivi updateFicheSuivi(Long id, FicheSuivi ficheDetails) {
        FicheSuivi ficheExistante = getFicheSuiviById(id);

        ficheExistante.setDateGeneration(ficheDetails.getDateGeneration());
        ficheExistante.setContenu(ficheDetails.getContenu());
        ficheExistante.setEnfant(ficheDetails.getEnfant());

        return ficheSuiviRepository.save(ficheExistante);
    }

    public void deleteFicheSuivi(Long id) {
        FicheSuivi ficheSuivi = getFicheSuiviById(id);
        ficheSuiviRepository.delete(ficheSuivi);
    }
}