package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DistrictZoneGeoDTO {
    private String id;
    private String code;
    private String nom;
    private String statut; // "CONTROLE", "VIGILANCE", "CRITIQUE"
    private Double prevalenceMas;
    private Integer casActifsMas;
    private String tendance;
    private String crenasAssocie;
    private Double stockAtpeJours;
    private Double latitude;
    private Double longitude;
    private String descriptionStatut;
}
