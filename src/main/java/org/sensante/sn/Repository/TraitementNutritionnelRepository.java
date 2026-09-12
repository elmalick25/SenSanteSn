package org.sensante.sn.Repository;

import org.sensante.sn.Model.Enfant;
import org.sensante.sn.Model.TraitementNutritionnel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TraitementNutritionnelRepository extends JpaRepository<TraitementNutritionnel, Long> {
    Optional<TraitementNutritionnel> findFirstByEnfantAndActifTrueOrderByIdDesc(Enfant enfant);
    List<TraitementNutritionnel> findByEnfantOrderByDateDebutDesc(Enfant enfant);
}
