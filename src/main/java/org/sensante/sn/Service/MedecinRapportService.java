package org.sensante.sn.Service;

import org.sensante.sn.dto.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Service métier pour l'Espace Médecin — Rapport du Jour & Dashboard de Clôture Décisionnelle.
 * Clôture de vacation, traçabilité SAMU 1515, rapprochement des intrants et télétransmission DHIS2.
 */
@Service
public class MedecinRapportService {

    public RapportClotureVacationDTO getRapportCloture() {
        RapportClotureVacationDTO dto = new RapportClotureVacationDTO();

        // En-tête & Praticien
        dto.setStructureNom("Centre de Santé Gaspard Kamara");
        dto.setDateVacation("Mardi 24 Octobre 2024");
        dto.setPraticienNom("Dr. Babacar Fall");
        dto.setPraticienTitre("Pédiatre • Cabinet 04");
        dto.setCabinetNom("Cabinet 04 Pédiatrie");
        dto.setStatutVacation("Vacation Clôturée");
        dto.setHoraireVacation("Vacation Matin (08h00 - 15h30)");
        dto.setDistrictNom("District Dakar Centre");

        // Section 2 : KPIs compacts
        ClotureKpiDTO kpi = new ClotureKpiDTO();
        kpi.setConsultationsTerminees(18);
        kpi.setConsultationsTotal(18);
        kpi.setRatioConsultationsClos("100% clos");
        kpi.setTempsMoyenMinutes(19.4);

        kpi.setCreniCount(3);
        kpi.setCreniPourcentage(16.7);
        kpi.setCrenasCount(11);
        kpi.setCrenasPourcentage(61.1);
        kpi.setRoutineCount(4);
        kpi.setRoutinePourcentage(22.2);

        kpi.setDeriveHoraireMinutes(12);
        kpi.setDeriveAbsorbeeHeure("14h15");
        kpi.setPicInitialHeure("11h20");
        kpi.setPicInitialMinutes(18);

        kpi.setFichesTeletransmises(18);
        kpi.setFichesTotal(18);
        kpi.setTauxTeletransmission("100% fiches PCIME au DHIS2");
        dto.setKpi(kpi);

        // Section 3 : Volet Médecin — SAMU 1515
        List<EvacuationSamuDTO> samus = new ArrayList<>();
        samus.add(new EvacuationSamuDTO(
            1L,
            "SAMU National #1024-01",
            "Pneumopathie + MAS",
            "M. Diallo",
            "7 mois",
            "Nourrisson 7 mois (M. Diallo) • Oxygénothérapie sous lunettes",
            "09h40",
            "Urgences Albert Royer (Fann)",
            true
        ));
        samus.add(new EvacuationSamuDTO(
            2L,
            "Ambulance District #1024-02",
            "Œdèmes bilatéraux +++",
            "A. Ba",
            "18 mois",
            "Enfant 18 mois (A. Ba) • Apathie majeure, test ATPE négatif",
            "12h15",
            "Urgences Albert Royer (Fann)",
            true
        ));
        samus.add(new EvacuationSamuDTO(
            3L,
            "SAMU Médicalisé #1024-03",
            "Déshydratation Sévère",
            "S. Faye",
            "11 mois",
            "Nourrisson 11 mois (S. Faye) • Voie veineuse posée au Cabinet 04",
            "14h50",
            "Urgences Albert Royer (Fann)",
            true
        ));
        dto.setEvacuationsSamu(samus);

        // Volet Relais Terrain ASC
        RelaisSurveillanceDTO relais = new RelaisSurveillanceDTO(
            46,
            "Médina Rue 22, Tilène et abords",
            19,
            "DTP-HepB-Hib 3 & Rougeole-Rubéole",
            4,
            "2 adressées au Cab 04 • 2 en cours de visite",
            88,
            "Les dossiers transmis au Cabinet 04 sont directement associés au registre du relais de quartier pour assurer la continuité nutritionnelle post-consultation."
        );
        dto.setRelaisSurveillance(relais);

        // Section 4 : Intrants Pharmacie Centrale
        dto.setPharmacieCentraleNom("Pharmacie Centrale Gaspard Kamara");
        dto.setReserveSecuriseeLabel("Réserve Sécurisée (5 jours)");

        List<StockIntrantClotureDTO> intrants = new ArrayList<>();
        intrants.add(new StockIntrantClotureDTO(
            "Plumpy'Nut (ATPE)",
            "Nutrition MAS/MAM",
            56,
            "sachets délivrés",
            "8.4 kg total",
            56,
            424,
            78,
            "Dotation semaine assurée"
        ));
        intrants.add(new StockIntrantClotureDTO(
            "Amoxicilline 125mg",
            "Suspension Pédiatrique",
            11,
            "flacons prescrits",
            "100% CRENAS dotés",
            11,
            148,
            65,
            "Réapprovisionnement vendredi"
        ));
        intrants.add(new StockIntrantClotureDTO(
            "Paracétamol Sirop",
            "Antipyrétique",
            3,
            "flacons administrés",
            "Urgences fébriles",
            3,
            86,
            82,
            "Seuil nominal optimal"
        ));
        dto.setIntrantsStock(intrants);

        // Section 5 : Clôture & Signature ministérielle
        dto.setMedecinChefNom("Dr. A. Ndiaye");
        dto.setMedecinChefDistrict("Médecin-Chef du District Dakar Centre");
        dto.setCertificatDhis2("DHIS2-SN-CERT-2410-0482");
        dto.setSignatureHorodatage("24 Octobre 2024 • 15h35 GMT");
        dto.setEstCloturee(true);

        return dto;
    }

    public CloturerVacationResponse cloturerVacation(CloturerVacationRequest request) {
        boolean brouillon = request != null && request.isBrouillonSeulement();
        String cert = "CERT-DHIS2-SNIS-" + Long.toHexString(System.currentTimeMillis()).toUpperCase();
        String message = brouillon
            ? "Brouillon de la vacation enregistré localement sur le poste Cabinet 04."
            : "Vacation du 24/10/2024 clôturée et télétransmise avec succès au DHIS2 Sénégal (District Dakar Centre).";

        return new CloturerVacationResponse(
            true,
            message,
            brouillon ? "BROUILLON_LOCAL" : "TELETRANSMIS_DHIS2",
            cert,
            "24/10/2024 15:35:12 GMT",
            "/api/medecin/rapport/feuille-de-garde.pdf",
            "/api/medecin/rapport/export-csv"
        );
    }

    public String genererCsvSnis() {
        return "NIP,Nom,Age,Sexe,Diagnostic,Orientation,Poids_kg,PB_mm,SAMU,Date\n" +
            "SN-DKR-2024-0114,Moussa Diop,8m,M,MAM,CRENAS,6.300,119,NON,24/10/2024\n" +
            "SN-DKR-2024-0115,M. Diallo,7m,M,MAS+Pneumopathie,CRENI,5.800,110,OUI,24/10/2024\n" +
            "SN-DKR-2024-0116,A. Ba,18m,F,MAS+Oedemes,CRENI,7.900,112,OUI,24/10/2024\n" +
            "SN-DKR-2024-0117,S. Faye,11m,M,Deshydratation,CRENI,6.900,114,OUI,24/10/2024\n";
    }
}
