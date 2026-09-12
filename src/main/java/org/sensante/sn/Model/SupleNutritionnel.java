package org.sensante.sn.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "suple_nutritionnel")
@Getter
@Setter
public class SupleNutritionnel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private Integer quantiteStock;
    private LocalDate dateDistribution;

    @ManyToOne
    @JoinColumn(name = "enfant_id")
    private Enfant enfant;
}