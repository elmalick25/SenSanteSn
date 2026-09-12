package org.sensante.sn.Service;

import org.sensante.sn.dto.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Service métier pour l'Espace Médecin — Examen Clinique & Arbre Décisionnel PCIME.
 * Conforme au Protocole National Nutritionnel Pédiatrique Sénégal (v2024-MSAS).
 */
@Service
public class MedecinExamenCliniqueService {

    public ExamenCliniquePcimeDTO getExamenClinique(String nip) {
        ExamenCliniquePcimeDTO dto = new ExamenCliniquePcimeDTO();

        // 1. En-tête Patient et Live Vitals
        PatientHeaderDTO patient = buildPatientHeader(nip);
        dto.setPatient(patient);

        dto.setProtocoleTitre("Algorithme Clinique Décisionnel PCIME");
        dto.setProtocoleVersion("Protocole National Nutritionnel Pédiatrique Sénégal (v2024-MSAS)");
        dto.setSynchronisationSource("Données biométriques synchronisées avec Relais Fatou");
        dto.setzScoreOmsValide(true);

        // 2. Colonne 1 : Signes de Gravité & Danger (PCIME OMS)
        List<SigneDangerItemDTO> signes = new ArrayList<>();
        signes.add(new SigneDangerItemDTO(
            "BOIRE_TETER",
            "Incapacité de boire / téter",
            "Tétée préservée à la cuillère",
            false,
            false,
            "Alimentation orale possible sans fausse route"
        ));
        signes.add(new SigneDangerItemDTO(
            "VOMISSEMENTS",
            "Vomissements répétés",
            "Rejet bouillies artisanales; tolère le lait maternel fractionné",
            true,
            true,
            "Présence de vomissements post-prandiaux sur alimentation solide"
        ));
        signes.add(new SigneDangerItemDTO(
            "CONVULSIONS",
            "Convulsions récentes / myoclonies",
            "Aucune convulsion rapportée",
            false,
            false,
            "Examen neurologique calme, pas de raideur de nuque"
        ));
        signes.add(new SigneDangerItemDTO(
            "LETHARGIE",
            "Léthargie / Inconscience",
            "Enfant éveillé et réactif",
            false,
            false,
            "Réactif aux stimuli sonores et visuels"
        ));
        signes.add(new SigneDangerItemDTO(
            "TIRAGE",
            "Tirage sous-costal / Détresse",
            "FR: 38/min, murmures libres",
            false,
            false,
            "Eupnéique au repos, pas de battement des ailes du nez"
        ));
        dto.setSignesDanger(signes);
        dto.setAlertesDangerCount((int) signes.stream().filter(SigneDangerItemDTO::isAlerte).count());

        // Œdèmes & Hydratation
        OedemeHydratationDTO oedeme = new OedemeHydratationDTO(
            "Grade 0 Négatif",
            0,
            "Test des chevilles (3 sec)",
            "Effacement direct",
            "Pincement cutané sous-ombilical",
            true,
            8,
            "Non fébrile",
            "3 selles molles/jour sans trace de rectorragie. Muqueuses bien humides."
        );
        dto.setOedemeHydratation(oedeme);

        // 3. Colonne 2 : Test d'Appétit aux ATPE & Corrélation Biométrique
        TestAppetitDTO appetit = new TestAppetitDTO(
            "POSITIF",
            "TEST D'APPÉTIT POSITIF",
            "Ration consommée > 1/3 de sachet sous surveillance directe",
            30,
            true,
            "Observation 30 min validée sans vomissement",
            "Plumpy'Nut® (Pâte 92g)",
            "45g (~1/2 sachet)",
            "« L'enfant a consommé le produit sans répugnance, pris sur les genoux de sa mère. Pas de régurgitation immédiate. Réflexe de succion et déglutition efficaces. »"
        );
        dto.setTestAppetit(appetit);

        dto.setPbMesureMm(119);
        dto.setPbClassification("MAM");
        dto.setPbZoneLabel("Actuel : 119 mm (MAM 115-124mm)");
        dto.setzScorePoidsTaille(-2.1);
        dto.setzScoreLabel("Z = -2.1 SD (Modérée)");

        // 4. Colonne 3 : Arbre d'Orientation & Protocole Thérapeutique
        List<OrientationBrancheDTO> branches = new ArrayList<>();

        // Branche A : CRENI
        OrientationBrancheDTO brancheA = new OrientationBrancheDTO();
        brancheA.setCode("CRENI");
        brancheA.setTitre("Branche A : Transfert Hospitalier CRENI");
        brancheA.setStatut("NON_ELIGIBLE");
        brancheA.setStatutBadge("Non Éligible");
        brancheA.setConditions("Condition : Signe de gravité (+) OU Test Appétit (-) OU Œdèmes bilatéraux (++)");
        brancheA.setProtocoleReference("Protocole réf. : Lait F-75 (100 kcal/kg/j) + Réhydratation ReSoMal + Antibiothérapie IV (Ampicilline + Gentamicine).");
        brancheA.setRetenue(false);
        brancheA.setDetailsOrientation("Critères non remplis pour hospitalisation d'urgence en CRENI.");
        brancheA.setItemsProtocole(new ArrayList<>());
        branches.add(brancheA);

        // Branche B : CRENAS (Validée)
        OrientationBrancheDTO brancheB = new OrientationBrancheDTO();
        brancheB.setCode("CRENAS");
        brancheB.setTitre("Branche B : Orientation CRENAS (Ambulatoire)");
        brancheB.setStatut("RETENUE");
        brancheB.setStatutBadge("Branche Retenue & Conforme PCIME");
        brancheB.setConditions("Critères satisfaits : Absence de complication létale • Test appétit (+) • PB 115-124 mm • Mère coopérante.");
        brancheB.setProtocoleReference("MSAS-CRENAS-2024");
        brancheB.setRetenue(true);
        brancheB.setDetailsOrientation("Prise en charge ambulatoire validée avec dotation ATPE et suivi communautaire.");

        List<ProtocoleItemDTO> itemsProtocole = new ArrayList<>();
        itemsProtocole.add(new ProtocoleItemDTO(
            1,
            "Ration Thérapeutique ATPE (Plumpy'Nut®)",
            "2 sachets par jour pendant 14 jours (Apport calorique ~1000 kcal/j). Consommation fractionnée sans dilution aqueuse.",
            "2 sachets / jour x 14 jours",
            false,
            "DEFAULT"
        ));
        itemsProtocole.add(new ProtocoleItemDTO(
            2,
            "Antibiothérapie de Couverture Systématique",
            "Amoxicilline suspension buvable 250mg/5ml : 50 mg/kg/j = 125 mg (2.5 ml) matin et soir pendant 7 jours continus.",
            "125 mg (2.5 ml) 2x/jour pendant 7 jours",
            false,
            "DEFAULT"
        ));
        itemsProtocole.add(new ProtocoleItemDTO(
            3,
            "Micronutriments & Déparasitage",
            "Vitamine A : 1 dose unique de 100 000 UI sous capsule rouge au cabinet. Albendazole / Mébendazole : Différé à M12 (nourrisson < 1 an).",
            "100 000 UI dose unique",
            false,
            "DEFAULT"
        ));
        itemsProtocole.add(new ProtocoleItemDTO(
            4,
            "Suivi & Convocation Terrain (J+14)",
            "Convocation formelle au cabinet le Mardi 07 Novembre 2024 (J+14) pour pesée de contrôle et mesure PB. Notification envoyée au Relais Fatou Diop pour visite à domicile à J+3.",
            "Rendez-vous J+14 (07/11/2024) + VAD J+3",
            true,
            "SUIVI"
        ));
        brancheB.setItemsProtocole(itemsProtocole);
        branches.add(brancheB);

        dto.setBranches(branches);
        dto.setBrancheRetenueCode("CRENAS");
        dto.setBrancheRetenueBadge("Branche B Validée");
        dto.setStatutValidationGlobal("Arbre clinique complet : Branche CRENAS prête pour validation thérapeutique");

        return dto;
    }

    public ValiderExamenResponse validerExamenEtOrienter(ValiderExamenRequest request) {
        String nip = (request != null && request.getNip() != null && !request.getNip().isBlank())
            ? request.getNip()
            : "SN-DKR-2024-0114";
        String branche = (request != null && request.getBrancheChoisie() != null)
            ? request.getBrancheChoisie()
            : "CRENAS";

        String codeConsultation = "CS-DKR-" + System.currentTimeMillis() % 100000;
        String prochaineEtape = "/medecin/prescription?nip=" + nip + "&code=" + codeConsultation;

        return new ValiderExamenResponse(
            true,
            "Examen clinique PCIME validé avec succès. Orientation " + branche + " actée.",
            nip,
            branche,
            codeConsultation,
            prochaineEtape
        );
    }

    private PatientHeaderDTO buildPatientHeader(String nip) {
        PatientHeaderDTO h = new PatientHeaderDTO();
        h.setIdPatient(1L);
        h.setNomComplet("Moussa Diop");
        h.setAgeLabel("8 mois • Garçon");
        h.setSexe("Garçon");
        h.setNip((nip != null && !nip.isBlank()) ? nip : "SN-DKR-2024-0114");
        h.setStatutNutritionnel("MAM");
        h.setStatutNutritionnelBadge("MAM (115-124mm)");
        h.setBoxAssignation("Cabinet 04");
        h.setAvatarUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuAiKzjFHnZu20KSUDXBVBK49KEVlwpvGLZZbkItKOYPgBCFlqcKXxUD82TgKR9HOdP2wArQco0Bihan2yqvFr49q2uoppNFVkw7pN9NQJIZwIVR8V1qvJg51FLXA7qJqHarT37-46i-6B9NOU1kE0juP90n6zq7QxUKjfIaMV6WW8upc1HkCLbjuWYHi5WCTP0qUTJjX461ROQiyoQxXuCjV0ogvRRbDHzbTgSKUwASzaPFoQONk-zU");

        h.setTutriceNom("Coumba Diop");
        h.setTutriceLien("Mère");
        h.setAdresse("Médina, Rue 22 x Corniche");
        h.setTelephone("+221 77 543 21 98");
        h.setCni("1 254 1988 00412");

        h.setGroupeSanguin("O RHD+ (Positif)");
        h.setPbMm(119);
        h.setStatutPbLabel("MAM (115-124mm)");
        h.setPoidsActuelKg(6.300);
        h.setZScorePoids("Z: -2.1 SD");
        h.setRegimeAlimentaire("Mixte précoce");
        h.setPoidsNaissanceKg(2.900);
        h.setMentionNaissance("Né à terme (38 SA)");

        h.setTemperatureC(37.1);
        h.setTemperatureLabel("Apyrétique");
        h.setFrequenceRespiratoire(38);
        h.setFrequenceRespiratoireLabel("< 50/m OK");

        return h;
    }
}
