package org.sensante.sn.Service;

import org.springframework.stereotype.Service;
import org.sensante.sn.Model.BilanAntro;
import org.sensante.sn.Repository.BilanAnthroRepository;
import org.sensante.sn.exception.RessourceNonTrouveException;

import java.util.List;

@Service
public class BilanAnthroService {

    private final BilanAnthroRepository bilanRepository;

    public BilanAnthroService(BilanAnthroRepository bilanRepository) {
        this.bilanRepository = bilanRepository;
    }

    public BilanAntro createBilan(BilanAntro bilan) {
        return bilanRepository.save(bilan);
    }

    public List<BilanAntro> getAllBilans() {
        return bilanRepository.findAll();
    }

    public List<BilanAntro> getBilansByEnfantId(Long enfantId) {
        return bilanRepository.findByEnfantEnfantIdOrderByDateBilanAsc(enfantId);
    }

    public BilanAntro getBilanById(Long id) {
        return bilanRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveException("Bilan anthropométrique non trouvé avec l'id : " + id));
    }

    public BilanAntro updateBilan(Long id, BilanAntro bilanDetails) {
        BilanAntro bilanExistant = getBilanById(id);

        bilanExistant.setDateBilan(bilanDetails.getDateBilan());
        bilanExistant.setPoids(bilanDetails.getPoids());
        bilanExistant.setTaille(bilanDetails.getTaille());
        bilanExistant.setPerimetreBrachial(bilanDetails.getPerimetreBrachial());
        bilanExistant.setZScorePoidsTaille(bilanDetails.getZScorePoidsTaille());
        bilanExistant.setZScorePoidsAge(bilanDetails.getZScorePoidsAge());
        bilanExistant.setStatut(bilanDetails.getStatut());
        bilanExistant.setEnfant(bilanDetails.getEnfant());

        return bilanRepository.save(bilanExistant);
    }

    public void deleteBilan(Long id) {
        BilanAntro bilan = getBilanById(id);
        bilanRepository.delete(bilan);
    }
}