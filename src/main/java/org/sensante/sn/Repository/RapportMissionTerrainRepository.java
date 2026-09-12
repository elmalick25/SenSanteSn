package org.sensante.sn.Repository;

import org.sensante.sn.Model.RapportMissionTerrain;
import org.sensante.sn.Model.StatutValidationRapport;
import org.sensante.sn.Model.TypeMissionValidation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RapportMissionTerrainRepository extends JpaRepository<RapportMissionTerrain, Long> {

    List<RapportMissionTerrain> findByStatutValidationOrderByDateSoumissionDesc(StatutValidationRapport statut);

    List<RapportMissionTerrain> findByTypeMissionAndStatutValidationOrderByDateSoumissionDesc(
            TypeMissionValidation type, StatutValidationRapport statut);

    Optional<RapportMissionTerrain> findByNumeroRapport(String numeroRapport);

    long countByStatutValidation(StatutValidationRapport statut);

    long countByTypeMissionAndStatutValidation(TypeMissionValidation type, StatutValidationRapport statut);
}
