package org.sensante.sn.Service;

import org.springframework.stereotype.Service;
import org.sensante.sn.Model.SupleNutritionnel;
import org.sensante.sn.Repository.SupleNutritionnelRepository;
import org.sensante.sn.exception.RessourceNonTrouveException;

import java.util.List;

@Service
public class SupleNutritionnelService {

    private final SupleNutritionnelRepository supleNutritionnelRepository;

    public SupleNutritionnelService(SupleNutritionnelRepository supleNutritionnelRepository) {
        this.supleNutritionnelRepository = supleNutritionnelRepository;
    }

    public SupleNutritionnel createSupleNutritionnel(SupleNutritionnel supleNutritionnel) {
        return supleNutritionnelRepository.save(supleNutritionnel);
    }

    public List<SupleNutritionnel> getAllSupleNutritionnels() {
        return supleNutritionnelRepository.findAll();
    }

    public SupleNutritionnel getSupleNutritionnelById(Long id) {
        return supleNutritionnelRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveException("Supplément nutritionnel non trouvé avec l'id : " + id));
    }

    public List<SupleNutritionnel> getSuplesByEnfantId(Long enfantId) {
        return supleNutritionnelRepository.findByEnfantEnfantId(enfantId);
    }

    public SupleNutritionnel updateSupleNutritionnel(Long id, SupleNutritionnel supleDetails) {
        SupleNutritionnel supleExistant = getSupleNutritionnelById(id);

        supleExistant.setType(supleDetails.getType());
        supleExistant.setQuantiteStock(supleDetails.getQuantiteStock());
        supleExistant.setDateDistribution(supleDetails.getDateDistribution());
        supleExistant.setEnfant(supleDetails.getEnfant());

        return supleNutritionnelRepository.save(supleExistant);
    }

    public void deleteSupleNutritionnel(Long id) {
        SupleNutritionnel suple = getSupleNutritionnelById(id);
        supleNutritionnelRepository.delete(suple);
    }
}