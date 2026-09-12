package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TraitementNutritionnelDTO {
    private Long id;
    private String protocole;
    private String nomTraitement;
    private String produit;
    private String typeProduit;
    private String numeroLot;
    private String description;

    private Integer stockTotal;
    private Integer stockRestant;
    private Double pourcentageStock; // ex: 42.8
    private Integer joursAutonomieEstimee; // ex: 6
    private Integer jourCureCourant; // ex: 18
    private Integer totalJoursCure; // ex: 28
    private Integer semaineCourante; // ex: 3
    private Integer totalSemaines; // ex: 4
    private Integer rationsParJourPrescrit; // ex: 2

    private String centreDotation;
    private String prescripteur;
    private String conseillereNom;
    private String conseillereTelephone;
    private String conseillereLieu;

    private LocalDate dateDebut;
    private LocalDate dateFinPrevue;
    private Boolean actif;
}
