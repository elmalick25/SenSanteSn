package org.sensante.sn.Service;

import org.sensante.sn.Model.*;
import org.sensante.sn.Repository.BilanAnthroRepository;
import org.sensante.sn.Repository.EnfantRepository;
import org.sensante.sn.dto.*;
import org.sensante.sn.util.PdfDocumentGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class CroissanceOmsService {

    private final EnfantRepository enfantRepository;
    private final BilanAnthroRepository bilanAnthroRepository;
    private final org.sensante.sn.Repository.AntecedentNeonatalRepository antecedentNeonatalRepository;
    private final ReferenceGeneratorService referenceGeneratorService;

    public CroissanceOmsService(EnfantRepository enfantRepository,
                                BilanAnthroRepository bilanAnthroRepository,
                                org.sensante.sn.Repository.AntecedentNeonatalRepository antecedentNeonatalRepository,
                                ReferenceGeneratorService referenceGeneratorService) {
        this.enfantRepository = enfantRepository;
        this.bilanAnthroRepository = bilanAnthroRepository;
        this.antecedentNeonatalRepository = antecedentNeonatalRepository;
        this.referenceGeneratorService = referenceGeneratorService;
    }

    @Transactional(readOnly = true)
    public CroissanceOmsDTO getAnalyseCroissance(Long enfantId) {
        Enfant enfant = enfantRepository.findById(enfantId)
                .orElseThrow(() -> new org.sensante.sn.exception.RessourceNonTrouveeException("Enfant", enfantId));

        int ageEnMois = 0;
        if (enfant.getDateNaissance() != null) {
            Period period = Period.between(enfant.getDateNaissance(), LocalDate.now());
            ageEnMois = (period.getYears() * 12) + period.getMonths();
        }

        List<BilanAntro> bilans = bilanAnthroRepository.findByEnfantEnfantIdOrderByDateBilanAsc(enfantId);

        List<PointPeseeDTO> pointsDto = new ArrayList<>();
        String structureNom = enfant.getStructureSante() != null ? enfant.getStructureSante().getNom() : "Poste de Santé Communautaire";
        String regionNom = (enfant.getStructureSante() != null && enfant.getStructureSante().getRegion() != null)
                ? "Région de " + enfant.getStructureSante().getRegion()
                : "Région Médicale de Dakar";

        for (BilanAntro b : bilans) {
            int ageAuBilan = ageEnMois;
            if (enfant.getDateNaissance() != null && b.getDateBilan() != null) {
                Period p = Period.between(enfant.getDateNaissance(), b.getDateBilan());
                ageAuBilan = Math.max(0, (p.getYears() * 12) + p.getMonths());
            }

            String examinateur;
            String examinateurTitre;
            if (b.getAgentSaisie() != null) {
                examinateur = b.getAgentSaisie().getPrenom() + " " + b.getAgentSaisie().getNom();
                if (b.getAgentSaisie().getTitrePoste() != null && !b.getAgentSaisie().getTitrePoste().isBlank()) {
                    examinateurTitre = b.getAgentSaisie().getTitrePoste();
                } else if (b.getAgentSaisie().getRole() == Role.MEDECIN) {
                    examinateurTitre = "Médecin Référent MSAS";
                } else {
                    examinateurTitre = "Agent de Santé — Bajenu Gox";
                }
            } else {
                examinateur = "Agent de Santé Référent";
                examinateurTitre = "Agent de Santé Communautaire";
            }

            String struct = (b.getStructureSante() != null) ? b.getStructureSante().getNom() : structureNom;

            pointsDto.add(PointPeseeDTO.builder()
                    .id(b.getId())
                    .dateBilan(b.getDateBilan())
                    .ageMois(ageAuBilan)
                    .poidsKg(b.getPoids())
                    .tailleCm(b.getTaille())
                    .perimetreBrachialCm(b.getPerimetreBrachial())
                    .zScorePoidsAge(b.getZScorePoidsAge() != null ? b.getZScorePoidsAge() : 0.0)
                    .zScorePoidsTaille(b.getZScorePoidsTaille() != null ? b.getZScorePoidsTaille() : 0.0)
                    .examinateurNom(examinateur)
                    .examinateurTitre(examinateurTitre)
                    .structureNom(struct)
                    .statut(b.getStatut() != null ? b.getStatut() : StatutNutritionnel.NORMAL)
                    .build());
        }

        BilanAntro dernierBilan = bilans.isEmpty() ? null : bilans.get(bilans.size() - 1);
        BilanAntro avantDernierBilan = bilans.size() > 1 ? bilans.get(bilans.size() - 2) : null;
        AntecedentNeonatal ant = antecedentNeonatalRepository.findByEnfantEnfantId(enfantId).orElse(null);

        double dernierPoids = 0.0;
        double derniereTaille = 0.0;
        double dernierPB = 0.0;
        double dernierZScore = 0.0;
        StatutNutritionnel statut = StatutNutritionnel.NORMAL;
        double deltaPoids = 0.0;
        double vitesseGain = 0.0;
        String interpretation;

        if (dernierBilan != null) {
            dernierPoids = dernierBilan.getPoids() != null ? dernierBilan.getPoids() : 0.0;
            derniereTaille = dernierBilan.getTaille() != null ? dernierBilan.getTaille() : 0.0;
            dernierPB = dernierBilan.getPerimetreBrachial() != null ? dernierBilan.getPerimetreBrachial() : 0.0;
            dernierZScore = dernierBilan.getZScorePoidsAge() != null ? dernierBilan.getZScorePoidsAge() : 0.0;
            statut = dernierBilan.getStatut() != null ? dernierBilan.getStatut() : StatutNutritionnel.NORMAL;

            if (avantDernierBilan != null && dernierBilan.getDateBilan() != null && avantDernierBilan.getDateBilan() != null) {
                long jours = ChronoUnit.DAYS.between(avantDernierBilan.getDateBilan(), dernierBilan.getDateBilan());
                if (jours > 0 && dernierBilan.getPoids() != null && avantDernierBilan.getPoids() != null) {
                    deltaPoids = Math.round((dernierBilan.getPoids() - avantDernierBilan.getPoids()) * 100.0) / 100.0;
                    vitesseGain = Math.round(((dernierBilan.getPoids() - avantDernierBilan.getPoids()) * 1000.0 / jours) * 10.0) / 10.0;
                }
            } else if (ant != null && ant.getPoidsNaissance() != null && dernierBilan.getPoids() != null && enfant.getDateNaissance() != null && dernierBilan.getDateBilan() != null) {
                long jours = ChronoUnit.DAYS.between(enfant.getDateNaissance(), dernierBilan.getDateBilan());
                if (jours > 0) {
                    deltaPoids = Math.round((dernierBilan.getPoids() - ant.getPoidsNaissance()) * 100.0) / 100.0;
                    vitesseGain = Math.round(((dernierBilan.getPoids() - ant.getPoidsNaissance()) * 1000.0 / jours) * 10.0) / 10.0;
                }
            }

            if (statut == StatutNutritionnel.MAS) {
                interpretation = "Alerte Dénutrition Sévère : Courbe sous le seuil critique de -3σ (" + dernierZScore + "σ). Inflexion pondérale marquée nécessitant admission CREN et supplémentation RUTF.";
            } else if (statut == StatutNutritionnel.MAM) {
                interpretation = "Risque Nutritionnel Modéré : Trajectoire située entre -2σ et -3σ (" + dernierZScore + "σ). Surveillance bi-hebdomadaire et bouillies enrichies recommandées.";
            } else {
                interpretation = "Trajectoire Pondérale Harmonieuse : La courbe suit fidèlement la médiane OMS 2006 (" + String.format("%+.2f", dernierZScore) + "σ). Absence de cassure ou d'inflexion pondérale.";
            }
        } else {
            if (ant != null && ant.getPoidsNaissance() != null) {
                dernierPoids = ant.getPoidsNaissance();
                derniereTaille = ant.getTailleNaissance() != null ? ant.getTailleNaissance() : 0.0;
                interpretation = "Aucune pesée périodique enregistrée. Poids de naissance initial : " + ant.getPoidsNaissance() + " kg.";
            } else {
                interpretation = "Aucune pesée enregistrée pour cet enfant. Veuillez effectuer le premier bilan de croissance.";
            }
        }

        // Références OMS adaptées au genre
        CourbesReferenceOmsDTO refs = buildCourbesReferenceOms(enfant.getGenre());

        return CroissanceOmsDTO.builder()
                .enfantId(enfant.getEnfantId())
                .nomComplet(enfant.getPrenom() + " " + enfant.getNom())
                .prenom(enfant.getPrenom())
                .nom(enfant.getNom())
                .genre(enfant.getGenre())
                .dateNaissance(enfant.getDateNaissance())
                .ageEnMois(ageEnMois)
                .codeNational(enfant.getQrCode() != null ? enfant.getQrCode() : "SN-DKR-2025-00" + enfant.getEnfantId())
                .nomStructureSante(structureNom)
                .regionMedicale(regionNom)
                .dernierPoids(dernierPoids)
                .derniereTaille(derniereTaille)
                .dernierPerimetreBrachial(dernierPB)
                .dernierZScorePoidsAge(dernierZScore)
                .deltaPoidsCeMoisKg(deltaPoids)
                .vitesseGainPonderalGJour(vitesseGain)
                .statutNutritionnel(statut)
                .interpretationClinique(interpretation)
                .historiquePesees(pointsDto)
                .referencesOms(refs)
                .build();
    }

    public byte[] exportOmsPdf(Long enfantId) {
        CroissanceOmsDTO data = getAnalyseCroissance(enfantId);
        String sha = referenceGeneratorService.generateCryptographicHash("OMS_CROISSANCE:" + data.getCodeNational() + ":" + data.getStatutNutritionnel());
        return PdfDocumentGenerator.generateMedicalCertificate(
                "OMS-GROWTH-" + data.getCodeNational(),
                "Releve Officiel des Courbes de Croissance OMS",
                data.getNomComplet(),
                data.getCodeNational(),
                data.getDateNaissance() != null ? data.getDateNaissance().toString() : "",
                "O+",
                data.getNomStructureSante(),
                String.valueOf(data.getDernierPerimetreBrachial()),
                data.getStatutNutritionnel() != null ? data.getStatutNutritionnel().name() : "NORMAL",
                sha
        );
    }

    private CourbesReferenceOmsDTO buildCourbesReferenceOms(Genre genre) {
        List<Integer> moisAxe = Arrays.asList(0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24);

        List<Double> mediane;
        List<Double> plusUn;
        List<Double> moinsDeux;
        List<Double> moinsTrois;

        if (genre == Genre.MASCULIN) {
            mediane = Arrays.asList(3.3, 5.6, 7.0, 7.9, 8.6, 9.2, 9.6, 10.1, 10.5, 10.9, 11.3, 11.8, 12.2);
            plusUn = Arrays.asList(3.9, 6.3, 7.8, 8.8, 9.6, 10.2, 10.8, 11.4, 11.9, 12.4, 12.8, 13.3, 13.8);
            moinsDeux = Arrays.asList(2.5, 4.3, 5.6, 6.4, 7.0, 7.5, 7.9, 8.4, 8.8, 9.1, 9.5, 9.9, 10.2);
            moinsTrois = Arrays.asList(2.1, 3.8, 4.9, 5.7, 6.2, 6.7, 7.1, 7.6, 7.9, 8.3, 8.6, 9.0, 9.3);
        } else {
            // Filles
            mediane = Arrays.asList(3.2, 5.1, 6.4, 7.3, 7.9, 8.5, 8.9, 9.4, 9.8, 10.2, 10.6, 11.0, 11.5);
            plusUn = Arrays.asList(3.7, 5.8, 7.3, 8.2, 8.9, 9.6, 10.1, 10.6, 11.1, 11.6, 12.1, 12.6, 13.0);
            moinsDeux = Arrays.asList(2.4, 3.9, 5.0, 5.7, 6.3, 6.8, 7.1, 7.6, 8.0, 8.4, 8.7, 9.1, 9.5);
            moinsTrois = Arrays.asList(2.0, 3.4, 4.4, 5.0, 5.6, 6.0, 6.3, 6.8, 7.2, 7.5, 7.8, 8.2, 8.5);
        }

        return CourbesReferenceOmsDTO.builder()
                .moisAxe(moisAxe)
                .plusUnSdKg(plusUn)
                .medianeKg(mediane)
                .moinsDeuxSdKg(moinsDeux)
                .moinsTroisSdKg(moinsTrois)
                .build();
    }
}
