package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupervisionCommandCenterDTO {
    // Geographic & session context
    private String pays;
    private String region;
    private String district;
    private String semaineEpidemiologique;
    private String datesSemaine;
    private Double latitude;
    private Double longitude;
    private String superviseurNom;
    private String superviseurTitre;
    private String superviseurEmail;
    private String superviseurPhoto;

    // 6 KPIs
    private Long enfantsSuivis;
    private String tendanceEnfantsSuivis;
    private String cohorteDepisteePourcentage;

    private Double prevalenceMas;
    private String tendancePrevalence;
    private Integer nouveauxCasSemaine;
    private Boolean alerteSeuilOmsDepasse;

    private Double tauxGuerisonCrenas;
    private String cibleGuerison;
    private String ecartCibleGuerison;

    private Integer postesCouverts;
    private Integer totalPostes;
    private String transmissionRetard;

    private Integer relaisActifs;
    private Integer totalRelais;
    private Integer tauxRelaisActifs;
    private Integer superviseursZone;

    private Double tauxPerdusDeVue;
    private String ciblePerdusDeVue;
    private String alertePerdusDeVueZone;

    // Focal zone (default critical epicenter)
    private String zoneFocaleInitiale;

    // Datasets
    private List<DistrictZoneGeoDTO> zones;
    private List<PatrouilleGpsDTO> patrouilles;
    private List<AlerteTriageDTO> alertes;
}
