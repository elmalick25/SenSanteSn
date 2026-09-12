package org.sensante.sn.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.sensante.sn.Model.BilanAntro;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BilanAnthroRepository extends JpaRepository<BilanAntro, Long> {
    List<BilanAntro> findByEnfantEnfantIdOrderByDateBilanAsc(Long enfantId);
    Optional<BilanAntro> findFirstByEnfantEnfantIdOrderByDateBilanDesc(Long enfantId);
    long countByStatut(org.sensante.sn.Model.StatutNutritionnel statut);
    List<BilanAntro> findByStatut(org.sensante.sn.Model.StatutNutritionnel statut);
    List<BilanAntro> findTop5ByOrderByDateBilanDesc();
    List<BilanAntro> findByDateBilan(LocalDate dateBilan);
    List<BilanAntro> findByDateBilanBetween(LocalDate debut, LocalDate fin);
    long countByStructureSante(org.sensante.sn.Model.StructureSante structureSante);
}