package org.sensante.sn.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "rendez_vous")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RendezVous {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enfant_id", nullable = false)
    private Enfant enfant;

    private String codeDossierRef;

    private String titre;

    private String typeConsultation; // PEDIATRIE, NUTRITION, VACCINATION, URGENCE

    private LocalDate dateRendezVous;

    private LocalTime heureRendezVous;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutRendezVous statut;

    private String priorite; // MODEREE, URGENTE, STANDARD

    @Column(columnDefinition = "TEXT")
    private String motifParent;

    private String nomPraticien;

    private String specialitePraticien;

    private String ordreMedecin;

    private String nomStructure;

    private String localisationSalle;

    private String nomRelais;

    private String roleRelais;

    private String telephoneRelais;

    private String telephoneStructure;

    @Column(columnDefinition = "TEXT")
    private String instructionsTuteur;

    private String distanceEstimee;

    private String crenauPropose;

    private String photoJointesInfo;
}
