package org.sensante.sn.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.sensante.sn.Model.AlerteMAS;

import java.util.List;

@Repository
public interface AlerteMASRepository extends JpaRepository<AlerteMAS, Long> {

    // Recherche optionnelle : récupérer toutes les alertes non acquittées
    List<AlerteMAS> findByAcquitteeFalse();
}