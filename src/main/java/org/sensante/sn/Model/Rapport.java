package org.sensante.sn.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "rapport")
@Getter
@Setter
public class Rapport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dateGeneration;
    private String typeRapport;
    private Double tauxGuerison;
    private Double tauxAbandon;
    private String zonePrevalence;

    @ManyToOne
    @JoinColumn(name = "superviseur_id")
    private Superviseur superviseur;
}