package org.sensante.sn.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Getter
@Setter
public class AlerteMAS {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dateAlerte;
    private String message;
    private Boolean acquittee;

    @OneToOne
    @JoinColumn(name = "bilan_id")
    private BilanAntro bilan;
}