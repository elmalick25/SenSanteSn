package org.sensante.sn.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.sensante.sn.Model.Medecin;

@Repository
public interface MedecinRepository extends JpaRepository<Medecin, Long> {
}