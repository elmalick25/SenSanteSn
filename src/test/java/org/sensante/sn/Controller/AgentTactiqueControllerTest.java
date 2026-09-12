package org.sensante.sn.Controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.sensante.sn.Repository.UtilisateurRepository;
import org.sensante.sn.Service.AgentTactiqueService;
import org.sensante.sn.dto.ActionTactiqueResponse;
import org.sensante.sn.dto.AgentIdentiteDTO;
import org.sensante.sn.dto.AgentKpiMetricsDTO;
import org.sensante.sn.dto.AgentTactiqueOverviewDTO;
import org.sensante.sn.security.JwtAuthenticationFilter;
import org.sensante.sn.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AgentTactiqueController.class)
@AutoConfigureMockMvc(addFilters = false)
class AgentTactiqueControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AgentTactiqueService agentTactiqueService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private JwtUtils jwtUtils;

    @MockitoBean
    private UtilisateurRepository utilisateurRepository;

    @Test
    @DisplayName("GET /api/agent/tactique/overview avec ROLE_AGENT_SANTE -> 200 OK")
    @WithMockUser(username = "agent@sensante.sn", roles = {"AGENT_SANTE"})
    void testGetOverview_AuthenticatedAgent() throws Exception {
        AgentTactiqueOverviewDTO dto = AgentTactiqueOverviewDTO.builder()
                .identite(AgentIdentiteDTO.builder()
                        .nom("Diop")
                        .prenom("Aïssatou")
                        .nomComplet("Aïssatou Diop")
                        .structure("Poste de Médina")
                        .secteur("Dakar Ouest")
                        .build())
                .kpis(AgentKpiMetricsDTO.builder()
                        .enfantsActifsSuivis(50)
                        .alertesMasCritiques(3)
                        .build())
                .build();

        when(agentTactiqueService.getTactiqueOverview(any(), any(), any(), any(), any()))
                .thenReturn(dto);

        mockMvc.perform(get("/api/agent/tactique/overview")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.identite.nom").value("Diop"))
                .andExpect(jsonPath("$.kpis.enfantsActifsSuivis").value(50));
    }

    @Test
    @DisplayName("POST /api/agent/tactique/alertes/{id}/acquitter avec ROLE_AGENT_SANTE -> 200 OK")
    @WithMockUser(username = "agent@sensante.sn", roles = {"AGENT_SANTE"})
    void testAcquitterAlerte_Success() throws Exception {
        ActionTactiqueResponse response = ActionTactiqueResponse.builder()
                .statutMisAJour("ACQUITTEE")
                .message("Alerte acquittée avec succès")
                .succes(true)
                .build();

        when(agentTactiqueService.acquitterAlerte(any(), any()))
                .thenReturn(response);

        mockMvc.perform(post("/api/agent/tactique/alertes/10/acquitter")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.succes").value(true))
                .andExpect(jsonPath("$.statutMisAJour").value("ACQUITTEE"));
    }

    @Test
    @DisplayName("POST /api/agent/tactique/enfants/{id}/refer-samu avec payload -> 200 OK")
    @WithMockUser(username = "agent@sensante.sn", roles = {"AGENT_SANTE"})
    void testRefererSamu_Success() throws Exception {
        ActionTactiqueResponse response = ActionTactiqueResponse.builder()
                .statutMisAJour("REFERE_SAMU")
                .message("Enfant référé au SAMU 15")
                .succes(true)
                .build();

        when(agentTactiqueService.refererSamu(any(), any(), any()))
                .thenReturn(response);

        mockMvc.perform(post("/api/agent/tactique/enfants/1/refer-samu")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"motif\":\"Urgence\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.succes").value(true));
    }
}
