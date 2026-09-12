package org.sensante.sn.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "prise_nutritionnelle")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriseNutritionnelle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "traitement_id", nullable = false)
    private TraitementNutritionnel traitement;

    private LocalDate datePrise;
    private LocalTime heurePrevue;
    private LocalTime heureReelle;

    private String typeRation; // PLUMPY_SUP, REPAS_FORTIFIE_421
    private String titreRation; // 1 sachet Plumpy'Sup, Bouillie Enrichie 4:2:1
    private String statut; // VALIDE, A_DONNER, PROGRAMME, MANQUE
    private String instructions;
    private String notesObservation;
}
