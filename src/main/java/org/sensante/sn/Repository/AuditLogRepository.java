package org.sensante.sn.Repository;

import org.sensante.sn.Model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    Page<AuditLog> findByUtilisateurEmailOrderByTimestampDesc(String utilisateurEmail, Pageable pageable);

    Page<AuditLog> findByEntiteAndEntiteIdOrderByTimestampDesc(String entite, Long entiteId, Pageable pageable);

    List<AuditLog> findTop50ByOrderByTimestampDesc();
}
