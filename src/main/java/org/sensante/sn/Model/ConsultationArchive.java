package org.sensante.sn.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "consultation_archive")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultationArchive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enfant_id", nullable = false)
    private Enfant enfant;

    private LocalDate dateConsultation;

    private String titre;

    private String categorie; // NUTRITION, VACCINATION, GENERALE

    private String statutBadge;

    private String nomStructure;

    private String nomPraticien;

    @Column(columnDefinition = "TEXT")
    private String notesCliniques;

    private Double poidsKg;

    private Double perimetreBrachialCm;

    private String prescription;

    private String referenceDocument; // ex: Fiche F-04, Ordonnance, Certificat PEV

    private String typeDocument; // FICHE_F04, ORDONNANCE, CERTIFICAT_PEV
}
