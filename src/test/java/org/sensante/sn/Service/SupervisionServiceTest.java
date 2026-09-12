package org.sensante.sn.Service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.sensante.sn.Model.*;
import org.sensante.sn.Repository.*;
import org.sensante.sn.dto.RapportJournalierTelemetrieDTO;
import org.sensante.sn.dto.SupervisionCommandCenterDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SupervisionServiceTest {

    @Mock private EnfantRepository enfantRepository;
    @Mock private BilanAnthroRepository bilanAnthroRepository;
    @Mock private AlerteMASRepository alerteMASRepository;
    @Mock private StructureSanteRepository structureSanteRepository;
    @Mock private UtilisateurRepository utilisateurRepository;
    @Mock private MissionTerrainRepository missionTerrainRepository;
    @Mock private RapportMissionTerrainRepository rapportMissionTerrainRepository;
    @Mock private ReferenceGeneratorService referenceGeneratorService;
    @Mock private TraitementNutritionnelRepository traitementNutritionnelRepository;

    private SupervisionService service;

    @BeforeEach
    void setUp() {
        service = new SupervisionService(
                enfantRepository,
                bilanAnthroRepository,
                alerteMASRepository,
                structureSanteRepository,
                utilisateurRepository,
                missionTerrainRepository,
                rapportMissionTerrainRepository,
                referenceGeneratorService,
                traitementNutritionnelRepository
        );
    }

    @Test
    @DisplayName("Command Center : Résolution dynamique du superviseur et calcul des taux")
    void shouldResolveSupervisorAndComputeRatesDynamically() {
        Utilisateur sup = new Utilisateur();
        sup.setNom("Diallo");
        sup.setPrenom("Aminata");
        sup.setDistrictSanitaire("District Dakar Ouest");
        sup.setRole(Role.SUPERVISEUR);

        when(utilisateurRepository.findByEmail("aminata.diallo@sensante.sn")).thenReturn(Optional.of(sup));
        when(enfantRepository.count()).thenReturn(100L);
        when(bilanAnthroRepository.count()).thenReturn(200L);
        when(bilanAnthroRepository.countByStatut(StatutNutritionnel.MAS)).thenReturn(6L);
        when(bilanAnthroRepository.countByStatut(StatutNutritionnel.NORMAL)).thenReturn(160L);
        when(structureSanteRepository.count()).thenReturn(5L);

        SupervisionCommandCenterDTO dto = service.getCommandCenterOverview("aminata.diallo@sensante.sn");

        assertThat(dto).isNotNull();
        assertThat(dto.getSuperviseurNom()).contains("Aminata Diallo");
        assertThat(dto.getPrevalenceMas()).isEqualTo(6.0); // 6 / 100 * 100
        assertThat(dto.getTauxGuerisonCrenas()).isEqualTo(80.0);  // 160 / 200 * 100
    }

    @Test
    @DisplayName("Télémétrie Journalière : Rendu dynamique des structures et points de contrôle")
    void shouldGenerateDailyTelemetryReportFromDatabase() {
        StructureSante s1 = new StructureSante();
        s1.setId(1L);
        s1.setNom("Centre Médina");
        s1.setType(TypeStructure.CENTRE_DE_SANTE);

        when(structureSanteRepository.findAll()).thenReturn(List.of(s1));
        when(bilanAnthroRepository.countByStructureSante(s1)).thenReturn(12L);
        when(bilanAnthroRepository.count()).thenReturn(50L);
        when(bilanAnthroRepository.countByStatut(StatutNutritionnel.MAS)).thenReturn(2L);
        when(referenceGeneratorService.generateNumCertificat()).thenReturn("MSAS-CERT-2024-DKR-0042");
        when(referenceGeneratorService.generateCryptographicHash(any())).thenReturn("1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef");

        RapportJournalierTelemetrieDTO rep = service.getRapportJournalierTelemetrie(LocalDate.now());

        assertThat(rep).isNotNull();
        assertThat(rep.getStructuresPromptitude()).hasSize(1);
        assertThat(rep.getStructuresPromptitude().get(0).getStructureNom()).isEqualTo("Centre Médina");
        assertThat(rep.getStructuresPromptitude().get(0).getStatutBadge()).isEqualTo("OK");
        assertThat(rep.getNumeroCertificat()).isEqualTo("MSAS-CERT-2024-DKR-0042");
        assertThat(rep.getHorodatageSha256()).hasSize(64);
    }
}
