package org.sensante.sn.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.sensante.sn.Model.AgentSante;

@Repository
public interface AgentSanteRepository extends JpaRepository<AgentSante, Long> {
}