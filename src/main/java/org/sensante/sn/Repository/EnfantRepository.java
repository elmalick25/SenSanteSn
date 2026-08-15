package org.sensante.sn.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.sensante.sn.Model.Enfant;

@Repository
public interface EnfantRepository extends JpaRepository<Enfant, Long> {
}