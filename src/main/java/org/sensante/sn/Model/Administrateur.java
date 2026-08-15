package org.sensante.sn.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.DiscriminatorValue;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@DiscriminatorValue("ADMINISTRATEUR")
public class Administrateur extends Utilisateur {

}