package org.sensante.sn.Repository;

import org.sensante.sn.Model.AgrementCren;
import org.sensante.sn.Model.StatutStructure;
import org.sensante.sn.Model.StructureSante;
import org.sensante.sn.Model.TypeStructure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StructureSanteRepository extends JpaRepository<StructureSante, Long>, JpaSpecificationExecutor<StructureSante> {

    Optional<StructureSante> findByCodeNational(String codeNational);

    boolean existsByCodeNational(String codeNational);

    List<StructureSante> findByRegionIgnoreCase(String region);

    List<StructureSante> findByType(TypeStructure type);

    @Query("SELECT s FROM StructureSante s WHERE " +
            "(:region IS NULL OR LOWER(s.region) = LOWER(:region)) AND " +
            "(:district IS NULL OR LOWER(s.district) = LOWER(:district)) AND " +
            "(:type IS NULL OR s.type = :type) AND " +
            "(:statut IS NULL OR s.statut = :statut) AND " +
            "(:cren IS NULL OR s.agrementCren = :cren) AND " +
            "(:query IS NULL OR LOWER(s.nom) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.codeNational) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.district) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<StructureSante> searchStructures(
            @Param("region") String region,
            @Param("district") String district,
            @Param("type") TypeStructure type,
            @Param("statut") StatutStructure statut,
            @Param("cren") AgrementCren cren,
            @Param("query") String query
    );

    long countByType(TypeStructure type);

    long countByStatut(StatutStructure statut);

    long countByGpsValideTrue();

    long countBySecteurRuralTrue();

    long countBySecteurRuralFalse();

    long countByUrgences247True();

    long countByBlocOperatoireTrue();
}