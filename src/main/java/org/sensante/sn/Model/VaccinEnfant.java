package org.sensante.sn.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "vaccin_enfant")
@Getter
@Setter
public class VaccinEnfant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codeVaccin;
    private String nomVaccin;
    private LocalDate dateAdministration;
    private Boolean effectue;
    private String agentSanteNom;

    @ManyToOne
    @JoinColumn(name = "enfant_id")
    private Enfant enfant;
}
