package org.sensante.sn.Repository;

import org.sensante.sn.Model.VaccinEnfant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VaccinEnfantRepository extends JpaRepository<VaccinEnfant, Long> {
    List<VaccinEnfant> findByEnfantEnfantIdOrderByDateAdministrationAsc(Long enfantId);
}
