package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StructureStatsDTO {
    // Total global
    private long totalStructures;
    private double pourcentageGeolocalisees;

    // Bento Card 1: Hôpitaux
    private long totalHopitaux;
    private long hopitauxNiveau1;
    private long hopitauxNiveau2;
    private long hopitauxNiveau3;

    // Bento Card 2: Centres de Santé
    private long totalCentresSante;
    private long centresUrgences247;
    private long centresBlocOperatoire;

    // Bento Card 3: Postes de Santé & Dispensaires
    private long totalPostesSante;
    private long postesRural;
    private long postesUrbain;
    private long postesSousSurveillance;

    // Bento Card 4: Répartition Typologique pour Donut Chart.js
    private double pctPostes;
    private double pctCentres;
    private double pctHopitaux;
    private double pctAutres;

    // Totaux lits
    private long capaciteTotaleLits;
}
