package org.sensante.sn.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.sensante.sn.Model.SupleNutritionnel;

import java.util.List;

@Repository
public interface SupleNutritionnelRepository extends JpaRepository<SupleNutritionnel, Long> {

    List<SupleNutritionnel> findByEnfantEnfantId(Long enfantId);
}