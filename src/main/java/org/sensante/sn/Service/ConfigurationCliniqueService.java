package org.sensante.sn.Service;

import lombok.extern.slf4j.Slf4j;
import org.sensante.sn.dto.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

@Service
@Slf4j
public class ConfigurationCliniqueService {

    private final AtomicReference<ConfigurationCliniqueDTO> currentConfig = new AtomicReference<>();

    public ConfigurationCliniqueService() {
        initDefaultConfiguration();
    }

    public ConfigurationCliniqueDTO getConfiguration() {
        return currentConfig.get();
    }

    public ConfigurationCliniqueDTO updateConfiguration(ConfigurationCliniqueDTO updated) {
        log.info("Mise à jour de la configuration clinique nationale par {}", updated.getModifiePar());

        // Recalcul des métriques de consistance
        if (updated.getAtpeTiers() != null) {
            for (AtpeTierDTO tier : updated.getAtpeTiers()) {
                if (!tier.isTriageSpecialise()) {
                    tier.setRationHebdoTotale(tier.getSachetsParJour() * 7);
                    tier.setEquivKcalJour(tier.getSachetsParJour() * 500);
                }
            }
        }

        // Métadonnées de révision
        updated.setDerniereRevisionDate(LocalDate.now());
        updated.setDerniereRevisionTexte("Aujourd'hui (Mis à jour)");
        if (updated.getModifiePar() == null || updated.getModifiePar().isBlank()) {
            updated.setModifiePar("Dr. Ibrahima Sow");
        }
        updated.setModificationsEnAttenteCount(0); // paramètres enregistrés

        currentConfig.set(updated);
        return updated;
    }

    public Map<String, Object> diffuserDirectives() {
        ConfigurationCliniqueDTO config = currentConfig.get();
        config.setPostesSynchronisesCount(1428);
        config.setModificationsEnAttenteCount(0);
        log.info("Diffusion des directives cliniques vers {} postes de santé", config.getPostesSynchronisesCount());

        return Map.of(
                "statut", "DIFFUSION_REUSSIE",
                "postesSynchronises", config.getPostesSynchronisesCount(),
                "versionProtocole", config.getVersionProtocole(),
                "timestampGmt", "Dakar 11:42 GMT",
                "message", "Directives nationales diffusées avec succès aux 1 428 postes et centres de santé du Sénégal."
        );
    }

    public ConfigurationCliniqueDTO resetOmsDefaults() {
        log.info("Restauration des valeurs OMS / MSAS par défaut");
        initDefaultConfiguration();
        return currentConfig.get();
    }

    private void initDefaultConfiguration() {
        MuacThresholdsDTO muac = MuacThresholdsDTO.builder()
                .masMaxMm(115)
                .mamMaxMm(124)
                .normalMinMm(125)
                .build();

        QueueBufferConfigDTO queue = QueueBufferConfigDTO.builder()
                .bufferInterConsultationMinutes(15)
                .toleranceRetardMinutes(10)
                .plafondUrgencesParVacation(4)
                .tauxOccupationCalibrePct(78)
                .reductionAttenteEstimeePct(42)
                .build();

        List<ZScoreReferenceRowDTO> zscores = new ArrayList<>();
        zscores.add(ZScoreReferenceRowDTO.builder()
                .id("z-6m-f")
                .ageMois(6)
                .sexe("F")
                .indicateur("POIDS_AGE")
                .masMoins3ET(5.7)
                .mamMoins2ET(6.5)
                .medianeOms(7.3)
                .plus2ET(9.0)
                .unite("kg")
                .statutValidation("CONFORME_OMS")
                .build());

        zscores.add(ZScoreReferenceRowDTO.builder()
                .id("z-12m-f")
                .ageMois(12)
                .sexe("F")
                .indicateur("POIDS_AGE")
                .masMoins3ET(7.0)
                .mamMoins2ET(7.9)
                .medianeOms(8.9)
                .plus2ET(10.8)
                .unite("kg")
                .statutValidation("CONFORME_OMS")
                .build());

        zscores.add(ZScoreReferenceRowDTO.builder()
                .id("z-24m-f")
                .ageMois(24)
                .sexe("F")
                .indicateur("POIDS_AGE")
                .masMoins3ET(9.0)
                .mamMoins2ET(10.2)
                .medianeOms(11.5)
                .plus2ET(14.2)
                .unite("kg")
                .statutValidation("CONFORME_OMS")
                .build());

        zscores.add(ZScoreReferenceRowDTO.builder()
                .id("z-36m-f")
                .ageMois(36)
                .sexe("F")
                .indicateur("POIDS_AGE")
                .masMoins3ET(10.8)
                .mamMoins2ET(12.2)
                .medianeOms(13.9)
                .plus2ET(17.3)
                .unite("kg")
                .statutValidation("CONFORME_OMS")
                .build());

        zscores.add(ZScoreReferenceRowDTO.builder()
                .id("z-48m-f")
                .ageMois(48)
                .sexe("F")
                .indicateur("POIDS_AGE")
                .masMoins3ET(12.3)
                .mamMoins2ET(14.1)
                .medianeOms(16.1)
                .plus2ET(20.2)
                .unite("kg")
                .statutValidation("CONFORME_OMS")
                .build());

        // Lignes Garçons pour le filtrage
        zscores.add(ZScoreReferenceRowDTO.builder()
                .id("z-6m-m")
                .ageMois(6)
                .sexe("M")
                .indicateur("POIDS_AGE")
                .masMoins3ET(6.4)
                .mamMoins2ET(7.1)
                .medianeOms(7.9)
                .plus2ET(9.7)
                .unite("kg")
                .statutValidation("CONFORME_OMS")
                .build());

        zscores.add(ZScoreReferenceRowDTO.builder()
                .id("z-12m-m")
                .ageMois(12)
                .sexe("M")
                .indicateur("POIDS_AGE")
                .masMoins3ET(7.7)
                .mamMoins2ET(8.6)
                .medianeOms(9.6)
                .plus2ET(11.5)
                .unite("kg")
                .statutValidation("CONFORME_OMS")
                .build());

        zscores.add(ZScoreReferenceRowDTO.builder()
                .id("z-24m-m")
                .ageMois(24)
                .sexe("M")
                .indicateur("POIDS_AGE")
                .masMoins3ET(9.7)
                .mamMoins2ET(10.8)
                .medianeOms(12.2)
                .plus2ET(14.8)
                .unite("kg")
                .statutValidation("CONFORME_OMS")
                .build());

        List<AtpeTierDTO> atpeTiers = new ArrayList<>();
        atpeTiers.add(AtpeTierDTO.builder()
                .id("atpe-1")
                .tranchePoids("3.5 - 4.9 kg")
                .poidsMin(3.5)
                .poidsMax(4.9)
                .sachetsParJour(2)
                .equivKcalJour(1000)
                .dureePrescription("7 jours (phase 1)")
                .uniteConditionnement("Sachet 92g (500 kcal)")
                .rationHebdoTotale(14)
                .triageSpecialise(false)
                .build());

        atpeTiers.add(AtpeTierDTO.builder()
                .id("atpe-2")
                .tranchePoids("5.0 - 6.9 kg")
                .poidsMin(5.0)
                .poidsMax(6.9)
                .sachetsParJour(3)
                .equivKcalJour(1500)
                .dureePrescription("7 jours (phase 1)")
                .uniteConditionnement("Sachet 92g (500 kcal)")
                .rationHebdoTotale(21)
                .triageSpecialise(false)
                .build());

        atpeTiers.add(AtpeTierDTO.builder()
                .id("atpe-3")
                .tranchePoids("7.0 - 9.9 kg")
                .poidsMin(7.0)
                .poidsMax(9.9)
                .sachetsParJour(4)
                .equivKcalJour(2000)
                .dureePrescription("7 jours (phase 1)")
                .uniteConditionnement("Sachet 92g (500 kcal)")
                .rationHebdoTotale(28)
                .triageSpecialise(false)
                .build());

        atpeTiers.add(AtpeTierDTO.builder()
                .id("atpe-4")
                .tranchePoids("10.0 - 14.9 kg")
                .poidsMin(10.0)
                .poidsMax(14.9)
                .sachetsParJour(5)
                .equivKcalJour(2500)
                .dureePrescription("7 jours (phase 1)")
                .uniteConditionnement("Sachet 92g (500 kcal)")
                .rationHebdoTotale(35)
                .triageSpecialise(false)
                .build());

        atpeTiers.add(AtpeTierDTO.builder()
                .id("atpe-5")
                .tranchePoids("≥ 15.0 kg")
                .poidsMin(15.0)
                .poidsMax(99.0)
                .sachetsParJour(0)
                .equivKcalJour(0)
                .dureePrescription("Triage Médical")
                .uniteConditionnement("Orientation Hospitalière")
                .rationHebdoTotale(0)
                .triageSpecialise(true)
                .recommandationSpeciale("Référer Consultation Spécialisée Pédiatrie (CREN / Pédiatre Référent Hospitalier)")
                .build());

        ConfigurationCliniqueDTO config = ConfigurationCliniqueDTO.builder()
                .versionProtocole("Directives Cliniques Actives (OMS / MSAS 2024)")
                .derniereRevisionDate(LocalDate.of(2024, 2, 2))
                .derniereRevisionTexte("02 Fév 2024")
                .modifiePar("Dr. Ibrahima Sow")
                .titreAuteur("Super-Admin National MSAS")
                .postesSynchronisesCount(1428)
                .modificationsEnAttenteCount(4)
                .coefficientTamponPna(1.25)
                .muac(muac)
                .queueBuffer(queue)
                .zscoreRows(zscores)
                .atpeTiers(atpeTiers)
                .build();

        currentConfig.set(config);
    }
}
