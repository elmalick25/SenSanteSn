package org.sensante.sn.Repository;

import org.sensante.sn.Model.Role;
import org.sensante.sn.Model.StatutCompte;
import org.sensante.sn.Model.Utilisateur;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByEmail(String email);

    Optional<Utilisateur> findByNomUtilisateur(String nomUtilisateur);

    boolean existsByEmail(String email);

    long countByRole(Role role);
    java.util.List<Utilisateur> findByRole(Role role);

    long countByStatutCompte(StatutCompte statutCompte);

    @Query("SELECT u FROM Utilisateur u WHERE " +
            "(:role IS NULL OR u.role = :role) AND " +
            "(:statut IS NULL OR u.statutCompte = :statut) AND " +
            "(CAST(:region AS string) IS NULL OR LOWER(u.regionSanitaire) LIKE LOWER(CONCAT('%', CAST(:region AS string), '%'))) AND " +
            "(CAST(:search AS string) IS NULL OR " +
            "LOWER(u.nom) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR " +
            "LOWER(u.prenom) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR " +
            "LOWER(u.cni) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR " +
            "LOWER(u.numeroOrdre) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR " +
            "LOWER(u.matriculeEtat) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR " +
            "LOWER(u.nomStructure) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))")
    Page<Utilisateur> findBadgesWithFilters(
            @Param("role") Role role,
            @Param("statut") StatutCompte statut,
            @Param("region") String region,
            @Param("search") String search,
            Pageable pageable
    );
}