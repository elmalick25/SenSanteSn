package org.sensante.sn.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "structure_sante")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StructureSante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String codeNational;

    @Column(nullable = false)
    private String nom;

    @Enumerated(EnumType.STRING)
    private TypeStructure type;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatutStructure statut = StatutStructure.OPERATIONNEL;

    private String localisation;
    private String region;
    private String district;
    private String commune;

    private Double latitude;
    private Double longitude;

    @Builder.Default
    private Boolean gpsValide = false;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AgrementCren agrementCren = AgrementCren.AUCUN;

    @Builder.Default
    private Integer capaciteLits = 0;

    @Builder.Default
    private Integer litsReanimation = 0;

    @Builder.Default
    private Boolean urgences247 = false;

    @Builder.Default
    private Boolean blocOperatoire = false;

    @Builder.Default
    private Boolean secteurRural = false;

    private String responsable;
    private String telephone;
}
