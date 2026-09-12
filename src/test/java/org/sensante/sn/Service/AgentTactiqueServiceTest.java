package org.sensante.sn.Service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.sensante.sn.Model.*;
import org.sensante.sn.Repository.*;
import org.sensante.sn.dto.ActionTactiqueResponse;
import org.sensante.sn.dto.AgentTactiqueOverviewDTO;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AgentTactiqueServiceTest {

    @Mock private UtilisateurRepository utilisateurRepository;
    @Mock private EnfantRepository enfantRepository;
    @Mock private BilanAnthroRepository bilanAnthroRepository;
    @Mock private AlerteMASRepository alerteMASRepository;
    @Mock private TraitementNutritionnelRepository traitementNutritionnelRepository;
    @Mock private FicheSuiviRepository ficheSuiviRepository;
    @Mock private CliniqueWorkflowBridgeService cliniqueWorkflowBridgeService;
    @Mock private RendezVousRepository rendezVousRepository;
    @Mock private ReferenceGeneratorService referenceGeneratorService;
    @Mock private RealtimeAlerteMasService realtimeAlerteMasService;
    @Mock private SmsNotificationService smsNotificationService;

    private AgentTactiqueService service;

    @BeforeEach
    void setUp() {
        service = new AgentTactiqueService(
                utilisateurRepository,
                enfantRepository,
                bilanAnthroRepository,
                alerteMASRepository,
                traitementNutritionnelRepository,
                ficheSuiviRepository,
                cliniqueWorkflowBridgeService,
                rendezVousRepository,
                referenceGeneratorService,
                realtimeAlerteMasService,
                smsNotificationService
        );
    }

    @Test
    @DisplayName("Génération de l'overview tactique agent depuis la base sans mock 'Aïssatou Diop'")
    void shouldGenerateOverviewFromDatabaseUser() {
        Utilisateur agent = new Utilisateur();
        agent.setIdUser(5L);
        agent.setNom("Diop");
        agent.setPrenom("Fatou");
        agent.setEmail("fatou.diop@sensante.sn");
        agent.setRole(Role.AGENT_SANTE);
        agent.setNomStructure("Poste de Santé Fass");
        agent.setDistrictSanitaire("Dakar Ouest");

        when(utilisateurRepository.findByEmail("fatou.diop@sensante.sn")).thenReturn(Optional.of(agent));
        when(enfantRepository.count()).thenReturn(25L);
        when(alerteMASRepository.countByAcquitteeFalse()).thenReturn(2L);

        AgentTactiqueOverviewDTO dto = service.getTactiqueOverview("fatou.diop@sensante.sn", null, null, null, null);

        assertThat(dto).isNotNull();
        assertThat(dto.getIdentite().getNomComplet()).contains("Fatou Diop");
        assertThat(dto.getKpis()).isNotNull();
        assertThat(dto.getKpis().getEnfantsActifsSuivis()).isEqualTo(25);
        assertThat(dto.getKpis().getAlertesMasCritiques()).isEqualTo(2);
    }

    @Test
    @DisplayName("Acquittement d'une alerte MAS et mise à jour de son statut")
    void shouldAcquitterAlerteMas() {
        AlerteMAS alerte = new AlerteMAS();
        alerte.setId(10L);
        alerte.setAcquittee(false);
        alerte.setMessage("Dépistage MAS sévère PB 110mm");

        when(alerteMASRepository.findById(10L)).thenReturn(Optional.of(alerte));
        when(alerteMASRepository.save(any(AlerteMAS.class))).thenAnswer(i -> i.getArgument(0));

        ActionTactiqueResponse resp = service.acquitterAlerte(10L, "fatou.diop@sensante.sn");

        assertThat(resp).isNotNull();
        assertThat(resp.getSucces()).isTrue();
        assertThat(resp.getStatutMisAJour()).isEqualTo("ACQUITTEE");
        assertThat(alerte.getAcquittee()).isTrue();
        verify(alerteMASRepository, times(1)).save(alerte);
    }
}
