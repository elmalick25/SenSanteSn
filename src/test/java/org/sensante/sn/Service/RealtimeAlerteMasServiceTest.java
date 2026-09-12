package org.sensante.sn.Service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.sensante.sn.dto.AlerteMasRealtimeEvent;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class RealtimeAlerteMasServiceTest {

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    private RealtimeAlerteMasService realtimeService;

    @BeforeEach
    void setUp() {
        realtimeService = new RealtimeAlerteMasService(messagingTemplate);
    }

    @Test
    @DisplayName("Diffusion d'une alerte MAS via WebSocket STOMP topic")
    void shouldBroadcastAlerteViaWebSocket() {
        AlerteMasRealtimeEvent event = AlerteMasRealtimeEvent.builder()
                .alerteId(101L)
                .matriculeEnfant("SEN-MED-2489")
                .nomEnfant("Mamadou Ndiaye")
                .perimetreBrachial(110.0)
                .oedemes(true)
                .niveauUrgence("CRITIQUE")
                .motif("MAS sévère")
                .structureNom("Poste Médina")
                .timestamp(LocalDateTime.now())
                .build();

        realtimeService.broadcastAlerte(event);

        verify(messagingTemplate).convertAndSend(eq("/topic/alertes-mas"), any(AlerteMasRealtimeEvent.class));
    }

    @Test
    @DisplayName("Souscription SSE pour streaming en direct sans rafraîchissement")
    void shouldSubscribeSse() {
        SseEmitter emitter = realtimeService.subscribeSse();
        assertThat(emitter).isNotNull();
        assertThat(realtimeService.getActiveSubscriberCount()).isGreaterThanOrEqualTo(1);
    }
}
