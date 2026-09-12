package org.sensante.sn.Controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.sensante.sn.Repository.UtilisateurRepository;
import org.sensante.sn.Service.MedecinDossierService;
import org.sensante.sn.dto.DossierPatient360DTO;
import org.sensante.sn.dto.PatientHeaderDTO;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MedecinDossierController.class)
@AutoConfigureMockMvc(addFilters = false)
class MedecinDossierControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MedecinDossierService medecinDossierService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private JwtUtils jwtUtils;

    @MockitoBean
    private UtilisateurRepository utilisateurRepository;

    @Test
    @DisplayName("GET /api/medecin/dossier/{idPatient} -> 200 OK avec corps JSON")
    @WithMockUser(username = "dr.diallo@sensante.sn", roles = {"MEDECIN"})
    void testGetDossier360_Success() throws Exception {
        PatientHeaderDTO header = new PatientHeaderDTO();
        header.setIdPatient(1L);
        header.setNomComplet("Mamadou Ndiaye");
        header.setNip("SN-DAK-2024-001");

        DossierPatient360DTO dossier = new DossierPatient360DTO();
        dossier.setPatient(header);
        dossier.setTotalVisites(4);

        when(medecinDossierService.getDossier360(any())).thenReturn(dossier);

        mockMvc.perform(get("/api/medecin/dossier/1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.patient.idPatient").value(1))
                .andExpect(jsonPath("$.patient.nomComplet").value("Mamadou Ndiaye"))
                .andExpect(jsonPath("$.totalVisites").value(4));
    }

    @Test
    @DisplayName("GET /api/medecin/dossier/actif -> 200 OK avec corps JSON")
    @WithMockUser(username = "dr.diallo@sensante.sn", roles = {"MEDECIN"})
    void testGetDossierActif_Success() throws Exception {
        PatientHeaderDTO header = new PatientHeaderDTO();
        header.setIdPatient(1L);
        header.setNomComplet("Mamadou Ndiaye");

        DossierPatient360DTO dossier = new DossierPatient360DTO();
        dossier.setPatient(header);

        when(medecinDossierService.getDossier360(any())).thenReturn(dossier);

        mockMvc.perform(get("/api/medecin/dossier/actif")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.patient.idPatient").value(1));
    }
}
