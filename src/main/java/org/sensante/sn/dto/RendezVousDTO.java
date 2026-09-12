package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.sensante.sn.Model.StatutRendezVous;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RendezVousDTO {
    private Long id;
    private Long enfantId;
    private String enfantNomComplet;
    private Integer enfantAgeMois;
    private String codeDossierRef;
    private String titre;
    private String typeConsultation;
    private LocalDate dateRendezVous;
    private LocalTime heureRendezVous;
    private StatutRendezVous statut;
    private String priorite;
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
    private String instructionsTuteur;
    private String distanceEstimee;
    private String crenauPropose;
    private String photoJointesInfo;
    private Integer joursAvantRdv;
    private String qrPassCode;
}
