package org.sensante.sn.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.sensante.sn.Model.Parent;

@Repository
public interface ParentRepository extends JpaRepository<Parent, Long> {
}