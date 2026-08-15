package org.sensante.sn.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.sensante.sn.Model.Rapport;

@Repository
public interface RapportRepository extends JpaRepository<Rapport, Long> {
}