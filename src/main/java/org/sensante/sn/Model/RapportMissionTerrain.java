package org.sensante.sn.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rapports_mission_terrain")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RapportMissionTerrain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String numeroRapport; // ex: #RAP-2024-108

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private TypeMissionValidation typeMission;

    @Column(nullable = false, length = 120)
    private String titreMission;

    @Column(nullable = false, length = 100)
    private String agentNom;

    @Column(length = 100)
    private String agentRole;

    @Column(length = 10)
    private String agentInitiales;

    @Column(nullable = false, length = 150)
    private String zoneCiblee;

    @Column(length = 150)
    private String posteSante;

    private Integer distanceFoyerMetres;

    private Double latitude;
    private Double longitude;

    private Boolean geofenceConforme;

    @Column(length = 20)
    private String heureCheckIn;

    @Column(length = 20)
    private String heureCheckOut;

    @Column(length = 50)
    private String dureeTerrain;

    private Integer enfantsDepistes;
    private Integer cibleInitiale;
    private Integer tauxCiblePourcent;

    private Integer masDetectes;
    private Integer mamDetectes;
    private Integer atpeDelivresCartons;

    @Column(length = 50)
    private String lotAtpe;

    @Column(columnDefinition = "TEXT")
    private String observationsTerrain;

    @Column(length = 30)
    private String prioriteClinique; // HAUTE, CRITIQUE, NORMALE

    private LocalDateTime dateSoumission;

    @Column(length = 50)
    private String tempsRelatif; // ex: "Il y a 18 min"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private StatutValidationRapport statutValidation;

    @Column(columnDefinition = "TEXT")
    private String motifComplement;

    @Column(columnDefinition = "TEXT")
    private String commentaireMedecinChef;

    @ElementCollection
    @CollectionTable(name = "rapport_preuves_photos", joinColumns = @JoinColumn(name = "rapport_id"))
    @Builder.Default
    private List<PreuvePhotoRapport> preuvesPhotos = new ArrayList<>();
}
