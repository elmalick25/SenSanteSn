package org.sensante.sn.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Getter
@Setter
public class BilanAntro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dateBilan;
    private Double poids;
    private Double taille;
    private Double perimetreBrachial;
    private Double zScorePoidsTaille;
    private Double zScorePoidsAge;

    @Enumerated(EnumType.STRING)
    private StatutNutritionnel statut;

    @ManyToOne
    @JoinColumn(name = "enfant_id")
    private Enfant enfant;

    @OneToOne(mappedBy = "bilan")
    private AlerteMAS alerte;
}