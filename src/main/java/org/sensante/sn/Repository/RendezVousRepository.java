package org.sensante.sn.Repository;

import org.sensante.sn.Model.RendezVous;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RendezVousRepository extends JpaRepository<RendezVous, Long> {
    List<RendezVous> findByEnfantEnfantIdOrderByDateRendezVousDesc(Long enfantId);
    List<RendezVous> findByEnfantEnfantIdOrderByDateRendezVousAsc(Long enfantId);
    Optional<RendezVous> findFirstByEnfantEnfantIdOrderByDateRendezVousDesc(Long enfantId);
    List<RendezVous> findByStatut(org.sensante.sn.Model.StatutRendezVous statut);
    List<RendezVous> findByStatutIn(java.util.List<org.sensante.sn.Model.StatutRendezVous> statuts);
    List<RendezVous> findByDateRendezVous(java.time.LocalDate dateRendezVous);
    List<RendezVous> findByDateRendezVousAndStatutIn(java.time.LocalDate dateRendezVous, java.util.List<org.sensante.sn.Model.StatutRendezVous> statuts);
    List<RendezVous> findByNomPraticienContainingIgnoreCase(String nomPraticien);
    Optional<RendezVous> findFirstByStatutOrderByDateRendezVousDesc(org.sensante.sn.Model.StatutRendezVous statut);
    Optional<RendezVous> findFirstByNomPraticienContainingIgnoreCaseAndStatut(String nomPraticien, org.sensante.sn.Model.StatutRendezVous statut);
}
