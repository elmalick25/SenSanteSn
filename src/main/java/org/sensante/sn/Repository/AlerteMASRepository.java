package org.sensante.sn.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.sensante.sn.Model.AlerteMAS;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlerteMASRepository extends JpaRepository<AlerteMAS, Long> {

    List<AlerteMAS> findByAcquitteeFalse();
    List<AlerteMAS> findByAcquitteeFalseOrderByDateAlerteDesc();
    Page<AlerteMAS> findByAcquitteeFalseOrderByDateAlerteDesc(Pageable pageable);
    Optional<AlerteMAS> findFirstByAcquitteeFalseOrderByDateAlerteDesc();
    long countByAcquitteeFalse();
}