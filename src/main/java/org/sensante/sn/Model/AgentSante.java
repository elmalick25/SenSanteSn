package org.sensante.sn.Model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@DiscriminatorValue("AGENT_SANTE")
public class AgentSante extends Utilisateur {
    // Hérite automatiquement des champs d'Utilisateur (id, nom, prenom, email, telephone, etc.)
}