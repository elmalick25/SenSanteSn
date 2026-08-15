package org.sensante.sn.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.sensante.sn.Model.StructureSante;

@Repository
public interface StructureSanteRepository extends JpaRepository<StructureSante, Long> {
}