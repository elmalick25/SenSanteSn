package org.sensante.sn.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "mission_terrain")
public class MissionTerrain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 30)
    private String codeMission; // e.g. "#MS-108"

    @Column(nullable = false, length = 120)
    private String zoneCiblee; // e.g. "Médina Secteur 3"

    @Column(length = 150)
    private String posteSante; // e.g. "Poste de Santé Médina"

    @Column(nullable = false, length = 120)
    private String agentNom; // e.g. "Bajenu Gox Fatou Sow"

    @Column(length = 10)
    private String agentInitiale; // e.g. "FS"

    @Column(length = 50)
    private String agentStatut; // e.g. "Disponible", "Sur site", "Opérationnelle"

    @Column(columnDefinition = "TEXT")
    private String objectifChiffre; // e.g. "Dépistage 50 enfants (6-59m) + Test Appétit"

    @Builder.Default
    private Integer progression = 0; // 0 to 100

    @Builder.Default
    private Integer cibleAtteinte = 0;

    @Builder.Default
    private Integer cibleTotale = 50;

    private LocalDate dateLimite;

    private LocalTime heureEcheance;

    @Column(length = 60)
    private String echeanceLibelle; // e.g. "Aujourd'hui 18h"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private PrioriteMission priorite = PrioriteMission.NORMALE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private StatutMission statut = StatutMission.A_INTERVENIR;

    @Builder.Default
    private Boolean dotationMuac = true;

    @Builder.Default
    private Boolean dotationAtpe = true;

    @Builder.Default
    private Boolean dotationRegistres = true;

    @Builder.Default
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column(length = 100)
    private String creePar;
}
