package org.sensante.sn.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "antecedent_neonatal")
@Getter
@Setter
public class AntecedentNeonatal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double poidsNaissance;
    private Double tailleNaissance;
    private Double perimetreCranien;
    private String scoreApgar;
    private String statutDrepanocytose;
    private String modeAccouchement;
    private Boolean allaitementMaternelExclusif;
    private String materniteOrigine;

    @OneToOne
    @JoinColumn(name = "enfant_id", unique = true)
    private Enfant enfant;
}
