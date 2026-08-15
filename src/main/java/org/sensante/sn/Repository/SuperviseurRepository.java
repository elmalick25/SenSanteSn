package org.sensante.sn.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.sensante.sn.Model.Superviseur;

@Repository
public interface SuperviseurRepository extends JpaRepository<Superviseur, Long> {
}