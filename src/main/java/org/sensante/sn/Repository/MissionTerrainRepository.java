package org.sensante.sn.Repository;

import org.sensante.sn.Model.MissionTerrain;
import org.sensante.sn.Model.StatutMission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MissionTerrainRepository extends JpaRepository<MissionTerrain, Long> {

    List<MissionTerrain> findByStatut(StatutMission statut);

    long countByStatut(StatutMission statut);
}
