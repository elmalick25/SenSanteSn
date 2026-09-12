package org.sensante.sn.Service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.sensante.sn.Model.*;
import org.sensante.sn.Repository.*;
import org.sensante.sn.dto.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MedecinFileAttenteServiceTest {

    @Mock private RendezVousRepository rendezVousRepository;
    @Mock private EnfantRepository enfantRepository;
    @Mock private BilanAnthroRepository bilanAnthroRepository;
    @Mock private AntecedentNeonatalRepository antecedentNeonatalRepository;
    @Mock private CliniqueWorkflowBridgeService cliniqueWorkflowBridgeService;
    @Mock private UtilisateurRepository utilisateurRepository;

    private MedecinFileAttenteService service;

    @BeforeEach
    void setUp() {
        service = new MedecinFileAttenteService(
                utilisateurRepository,
                cliniqueWorkflowBridgeService,
                rendezVousRepository,
                enfantRepository,
                bilanAnthroRepository,
                antecedentNeonatalRepository
        );
    }

    @Test
    @DisplayName("File d'attente : Chargement de la vue pupitre dynamique")
    void shouldLoadFileAttenteVuePupitre() {
        Utilisateur medecin = new Utilisateur();
        medecin.setNom("Fall");
        medecin.setPrenom("Babacar");
        medecin.setEmail("medecin@sensante.sn");
        medecin.setNomStructure("Centre Gaspard Kamara");
        medecin.setRole(Role.MEDECIN);

        when(utilisateurRepository.findByEmail("medecin@sensante.sn")).thenReturn(Optional.of(medecin));

        Enfant enfant = new Enfant();
        enfant.setEnfantId(1L);
        enfant.setNom("Diop");
        enfant.setPrenom("Moussa");
        enfant.setDateNaissance(LocalDate.now().minusMonths(8));

        RendezVous rdv = new RendezVous();
        rdv.setId(101L);
        rdv.setEnfant(enfant);
        rdv.setDateRendezVous(LocalDate.now());
        rdv.setHeureRendezVous(LocalTime.of(9, 0));
        rdv.setStatut(StatutRendezVous.EN_TRIAGE);

        when(rendezVousRepository.findByStatutIn(any())).thenReturn(List.of(rdv));

        FileAttenteVuePupitreDTO pupitre = service.getVuePupitre("medecin@sensante.sn");

        assertThat(pupitre).isNotNull();
        assertThat(pupitre.getMedecin().getNom()).isEqualTo("Fall");
        assertThat(pupitre.getPatientsEnAttente()).hasSize(1);
        assertThat(pupitre.getPatientsEnAttente().get(0).getNomComplet()).contains("Moussa Diop");
    }

    @Test
    @DisplayName("Admission patient : Passage du patient au Cabinet 04")
    void shouldAdmitPatientInConsultation() {
        Enfant enfant = new Enfant();
        enfant.setEnfantId(1L);
        enfant.setNom("Diop");
        enfant.setPrenom("Moussa");

        when(enfantRepository.findById(1L)).thenReturn(Optional.of(enfant));

        FaireEntrerResponse resp = service.faireEntrer(new FaireEntrerRequest(1L, "Cabinet 04"));

        assertThat(resp).isNotNull();
        assertThat(resp.isSuccess()).isTrue();
        assertThat(resp.getNomPatient()).isEqualTo("Moussa Diop");
        assertThat(resp.getCabinet()).isEqualTo("Cabinet 04");
        assertThat(resp.getConsultationActive()).isNotNull();
        assertThat(resp.getConsultationActive().getNomComplet()).isEqualTo("Moussa Diop");
    }
}
