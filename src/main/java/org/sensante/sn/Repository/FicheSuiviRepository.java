package org.sensante.sn.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.sensante.sn.Model.FicheSuivi;

import java.util.List;

@Repository
public interface FicheSuiviRepository extends JpaRepository<FicheSuivi, Long> {

    // Permet de récupérer l'historique des fiches de suivi d'un enfant
    List<FicheSuivi> findByEnfantEnfantId(Long enfantId);
}