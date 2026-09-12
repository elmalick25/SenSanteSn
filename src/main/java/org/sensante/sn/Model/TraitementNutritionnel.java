package org.sensante.sn.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "traitement_nutritionnel")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TraitementNutritionnel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enfant_id", nullable = false)
    private Enfant enfant;

    private String protocole; // ex: Protocole National MAM • MSAS
    private String nomTraitement; // Suivi du Traitement Plumpy'Sup & Prévention MAM
    private String produit; // Plumpy'Sup
    private String typeProduit; // Pâte lipidique prête à l'emploi
    private String numeroLot; // Lot #PLU-2024-DK-890
    private String description;

    private Integer stockTotal; // 28
    private Integer stockRestant; // 12
    private Integer joursAutonomieEstimee; // 6
    private Integer jourCureCourant; // 18
    private Integer totalJoursCure; // 28
    private Integer semaineCourante; // 3
    private Integer totalSemaines; // 4
    private Integer rationsParJourPrescrit; // 2

    private String centreDotation; // Poste de Santé Yoff
    private String prescripteur; // Dr. Babacar Fall • Médecin-Chef DS Dakar Ouest
    private String conseillereNom; // Badien Fatou Ndoye
    private String conseillereTelephone; // +221770000000
    private String conseillereLieu; // Poste de Santé Yoff Tonghor

    private LocalDate dateDebut;
    private LocalDate dateFinPrevue;
    private Boolean actif;
}
