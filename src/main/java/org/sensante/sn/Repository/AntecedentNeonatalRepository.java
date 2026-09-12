package org.sensante.sn.Repository;

import org.sensante.sn.Model.AntecedentNeonatal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AntecedentNeonatalRepository extends JpaRepository<AntecedentNeonatal, Long> {
    Optional<AntecedentNeonatal> findByEnfantEnfantId(Long enfantId);
}
