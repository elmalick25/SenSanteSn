package org.sensante.sn.Repository;

import org.sensante.sn.Model.PriseNutritionnelle;
import org.sensante.sn.Model.TraitementNutritionnel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PriseNutritionnelleRepository extends JpaRepository<PriseNutritionnelle, Long> {
    List<PriseNutritionnelle> findByTraitementAndDatePriseOrderByHeurePrevueAsc(TraitementNutritionnel traitement, LocalDate datePrise);
    List<PriseNutritionnelle> findByTraitementAndDatePriseBetweenOrderByDatePriseAscHeurePrevueAsc(
            TraitementNutritionnel traitement, LocalDate debut, LocalDate fin);
}
