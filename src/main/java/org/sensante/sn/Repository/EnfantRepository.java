package org.sensante.sn.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.sensante.sn.Model.Enfant;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnfantRepository extends JpaRepository<Enfant, Long> {
    List<Enfant> findByTelephoneParent(String telephoneParent);

    /** Dossiers réellement rattachés au compte parent (isolation stricte). */
    @Query("SELECT e FROM Enfant e WHERE e.parent.idUser = :parentId")
    List<Enfant> findByParentIdUser(@Param("parentId") Long parentId);

    @Query("SELECT e FROM Enfant e WHERE e.parent.idUser = :parentId")
    Page<Enfant> findByParentIdUser(@Param("parentId") Long parentId, Pageable pageable);

    @Query("SELECT COUNT(e) > 0 FROM Enfant e WHERE e.enfantId = :enfantId AND e.parent.idUser = :parentId")
    boolean existsByEnfantIdAndParentIdUser(@Param("enfantId") Long enfantId, @Param("parentId") Long parentId);
    Page<Enfant> findByTelephoneParent(String telephoneParent, Pageable pageable);
    Optional<Enfant> findByQrCode(String qrCode);
    Optional<Enfant> findByQrCodeIgnoreCase(String qrCode);
    List<Enfant> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom);
    Page<Enfant> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom, Pageable pageable);
}
