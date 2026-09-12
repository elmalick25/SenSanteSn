package org.sensante.sn.Integration;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.sensante.sn.Model.*;
import org.sensante.sn.Repository.*;
import org.sensante.sn.Service.*;
import org.sensante.sn.dto.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Test d'Intégration Châiné du Parcours Clinique Complet :
 * PARENT -> AGENT TACTIQUE -> MÉDECIN -> SUPERVISEUR -> ADMIN (DHIS2/Audit)
 */
@ExtendWith(MockitoExtension.class)
class ClinicalJourneyChainedIntegrationTest {

    @Mock private EnfantRepository enfantRepository;
    @Mock private BilanAnthroRepository bilanAnthroRepository;
    @Mock private AlerteMASRepository alerteMASRepository;
    @Mock private RendezVousRepository rendezVousRepository;
    @Mock private StructureSanteRepository structureSanteRepository;
    @Mock private UtilisateurRepository utilisateurRepository;
    @Mock private TraitementNutritionnelRepository traitementNutritionnelRepository;
    @Mock private FicheSuiviRepository ficheSuiviRepository;
    @Mock private CliniqueWorkflowBridgeService cliniqueWorkflowBridgeService;
    @Mock private AntecedentNeonatalRepository antecedentNeonatalRepository;
    @Mock private VaccinEnfantRepository vaccinEnfantRepository;
    @Mock private ConsultationArchiveRepository consultationArchiveRepository;
    @Mock private MissionTerrainRepository missionTerrainRepository;
    @Mock private RapportMissionTerrainRepository rapportMissionTerrainRepository;
    @Mock private JdbcTemplate jdbcTemplate;
    @Mock private RealtimeAlerteMasService realtimeAlerteMasService;
    @Mock private SmsNotificationService smsNotificationService;

    private ReferenceGeneratorService referenceGenerator;
    private AgentTactiqueService agentTactiqueService;
    private MedecinDossierService medecinDossierService;
    private SupervisionService supervisionService;

    private Enfant enfantTest;
    private Utilisateur agentUser;
    private Utilisateur medecinUser;
    private StructureSante structureTest;

    @BeforeEach
    void setUp() {
        referenceGenerator = new ReferenceGeneratorService(jdbcTemplate);

        agentTactiqueService = new AgentTactiqueService(
                utilisateurRepository,
                enfantRepository,
                bilanAnthroRepository,
                alerteMASRepository,
                traitementNutritionnelRepository,
                ficheSuiviRepository,
                cliniqueWorkflowBridgeService,
                rendezVousRepository,
                referenceGenerator,
                realtimeAlerteMasService,
                smsNotificationService
        );

        medecinDossierService = new MedecinDossierService(
                enfantRepository,
                bilanAnthroRepository,
                antecedentNeonatalRepository,
                vaccinEnfantRepository,
                consultationArchiveRepository
        );

        supervisionService = new SupervisionService(
                enfantRepository,
                bilanAnthroRepository,
                alerteMASRepository,
                structureSanteRepository,
                utilisateurRepository,
                missionTerrainRepository,
                rapportMissionTerrainRepository,
                referenceGenerator,
                traitementNutritionnelRepository
        );

        // 1. Setup Données Métier Réelles
        structureTest = new StructureSante();
        structureTest.setId(10L);
        structureTest.setNom("Poste de Santé Médina");
        structureTest.setDistrict("Dakar Ouest");
        structureTest.setRegion("Dakar");

        agentUser = new Utilisateur();
        agentUser.setIdUser(1L);
        agentUser.setNom("Diop");
        agentUser.setPrenom("Aïssatou");
        agentUser.setEmail("aissatou.diop@sensante.sn");
        agentUser.setRole(Role.AGENT_SANTE);
        agentUser.setNomStructure("Poste de Santé Médina");
        agentUser.setDistrictSanitaire("Dakar Ouest");

        medecinUser = new Utilisateur();
        medecinUser.setIdUser(2L);
        medecinUser.setNom("Diallo");
        medecinUser.setPrenom("Aminata");
        medecinUser.setEmail("dr.diallo@sensante.sn");
        medecinUser.setRole(Role.MEDECIN);
        medecinUser.setNomStructure("Poste de Santé Médina");
        medecinUser.setDistrictSanitaire("Dakar Ouest");

        enfantTest = new Enfant();
        enfantTest.setEnfantId(100L);
        enfantTest.setNom("Ndiaye");
        enfantTest.setPrenom("Mamadou");
        enfantTest.setGenre(Genre.MASCULIN);
        enfantTest.setDateNaissance(LocalDate.now().minusMonths(14));
        enfantTest.setStructureSante(structureTest);
    }

    @Test
    @DisplayName("Parcours Intégré : Parent Enrôlement -> Dépistage MAS -> SAMU/ATPE -> Dossier 360° Médecin -> Supervision & Audit")
    void testFullClinicalJourney() {
        // === ÉTAPE 1 : ENRÔLEMENT PARENT & ENFANT ===
        assertThat(enfantTest.getNom()).isEqualTo("Ndiaye");
        assertThat(enfantTest.getPrenom()).isEqualTo("Mamadou");

        // === ÉTAPE 2 : AGENT TACTIQUE (Dépistage MUAC 110mm < 115mm -> MAS Sévère) ===
        BilanAntro bilanMas = new BilanAntro();
        bilanMas.setId(500L);
        bilanMas.setEnfant(enfantTest);
        bilanMas.setPoids(7.2);
        bilanMas.setTaille(74.0);
        bilanMas.setPerimetreBrachial(11.0); // 11.0 cm = 110 mm (MAS < 11.5 cm)
        bilanMas.setOedemes(false);
        bilanMas.setStatut(StatutNutritionnel.MAS);
        bilanMas.setDateBilan(LocalDate.now());

        when(enfantRepository.findById(100L)).thenReturn(Optional.of(enfantTest));
        when(bilanAnthroRepository.findFirstByEnfantEnfantIdOrderByDateBilanDesc(100L)).thenReturn(Optional.of(bilanMas));
        when(alerteMASRepository.save(any(AlerteMAS.class))).thenAnswer(invocation -> {
            AlerteMAS a = invocation.getArgument(0);
            a.setId(10L);
            return a;
        });

        // Action Tactique : Dispensation ATPE
        ActionTactiqueResponse atpeResponse = agentTactiqueService.dispenserAtpe(100L, 14, agentUser.getEmail());
        assertThat(atpeResponse.getSucces()).isTrue();
        assertThat(atpeResponse.getMessage()).contains("sachets");

        // Action Tactique : Référencement SAMU National 15
        ActionTactiqueResponse samuResponse = agentTactiqueService.refererSamu(100L, "Détresse respiratoire + MAS", agentUser.getEmail());
        assertThat(samuResponse.getSucces()).isTrue();
        assertThat(samuResponse.getMessage()).contains("SAMU");

        // === ÉTAPE 3 : MÉDECIN CONSULTATION & VUE 360° ===
        when(bilanAnthroRepository.findByEnfantEnfantIdOrderByDateBilanAsc(100L)).thenReturn(List.of(bilanMas));
        when(antecedentNeonatalRepository.findByEnfantEnfantId(100L)).thenReturn(Optional.empty());
        when(vaccinEnfantRepository.findByEnfantEnfantIdOrderByDateAdministrationAsc(100L)).thenReturn(Collections.emptyList());
        when(consultationArchiveRepository.findByEnfantEnfantIdOrderByDateConsultationDesc(100L)).thenReturn(Collections.emptyList());

        DossierPatient360DTO dossier = medecinDossierService.getDossier360(100L);
        assertThat(dossier).isNotNull();
        assertThat(dossier.getPatient().getNomComplet()).contains("Mamadou Ndiaye");
        assertThat(dossier.getPatient().getStatutNutritionnel()).isEqualTo("MAS");
        assertThat(dossier.getPatient().getPbMm()).isEqualTo(110);
        assertThat(dossier.getBiometrie().getPoidsKg()).isEqualTo(7.2);

        // === ÉTAPE 4 : GÉNÉRATION DES RÉFÉRENCES MÉTIER & SÉCURITÉ ===
        String numOrdonnance = referenceGenerator.generateNumOrdonnance();
        String codeSecurite = referenceGenerator.generateCodeSecuriteQr();
        String bonTransfert = referenceGenerator.generateNumBonTransfert();
        String hashAudit = referenceGenerator.generateCryptographicHash("CONSULTATION-100-" + numOrdonnance);

        assertThat(numOrdonnance).startsWith("ORD-");
        assertThat(codeSecurite).startsWith("#SEC-");
        assertThat(bonTransfert).startsWith("BT-DKO-");
        assertThat(hashAudit).hasSize(64); // SHA-256 standard 64 caractères hexadécimaux

        // === ÉTAPE 5 : SUPERVISION RÉGIONALE (Vérification Zéro Hardcoding) ===
        Utilisateur superviseur = new Utilisateur();
        superviseur.setIdUser(3L);
        superviseur.setNom("Diallo");
        superviseur.setPrenom("Aminata");
        superviseur.setEmail("superviseur@sensante.sn");
        superviseur.setRole(Role.SUPERVISEUR);
        superviseur.setDistrictSanitaire("Dakar Ouest");

        when(utilisateurRepository.findByEmail("superviseur@sensante.sn")).thenReturn(Optional.of(superviseur));
        when(enfantRepository.count()).thenReturn(150L);
        when(bilanAnthroRepository.count()).thenReturn(150L);
        when(structureSanteRepository.findAll()).thenReturn(List.of(structureTest));

        SupervisionCommandCenterDTO commandCenter = supervisionService.getCommandCenterOverview("superviseur@sensante.sn");
        assertThat(commandCenter).isNotNull();
        assertThat(commandCenter.getDistrict()).isEqualTo("Dakar Ouest");
        assertThat(commandCenter.getEnfantsSuivis()).isEqualTo(150L);
    }
}
