package org.sensante.sn.Repository;

import org.sensante.sn.Model.ConsultationArchive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultationArchiveRepository extends JpaRepository<ConsultationArchive, Long> {
    List<ConsultationArchive> findByEnfantEnfantIdOrderByDateConsultationDesc(Long enfantId);
    long countByDateConsultation(java.time.LocalDate dateConsultation);
    java.util.List<ConsultationArchive> findByDateConsultation(java.time.LocalDate dateConsultation);
}
