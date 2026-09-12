package org.sensante.sn.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.sensante.sn.dto.AlerteMasRealtimeEvent;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Service de diffusion en temps réel des urgences MAS.
 * Combine WebSocket STOMP (/topic/alertes-mas) et Server-Sent Events (SSE)
 * pour garantir une réception instantanée sans rafraîchissement de page.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class RealtimeAlerteMasService {

    private final SimpMessagingTemplate messagingTemplate;
    private final List<SseEmitter> sseEmitters = new CopyOnWriteArrayList<>();

    /**
     * Diffuse un événement d'alerte MAS en direct à tous les abonnés connectés.
     */
    public void broadcastAlerte(AlerteMasRealtimeEvent event) {
        log.info("⚡ Diffusion en direct de l'alerte MAS #{} pour l'enfant {} ({})",
                event.getAlerteId(), event.getNomEnfant(), event.getNiveauUrgence());

        // 1. Diffusion WebSocket STOMP
        try {
            messagingTemplate.convertAndSend("/topic/alertes-mas", event);
        } catch (Exception e) {
            log.error("Erreur lors de la diffusion WebSocket de l'alerte MAS : {}", e.getMessage());
        }

        // 2. Diffusion Server-Sent Events (SSE)
        List<SseEmitter> deadEmitters = new CopyOnWriteArrayList<>();
        for (SseEmitter emitter : sseEmitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name("alerte-mas")
                        .data(event));
            } catch (IOException | IllegalStateException e) {
                deadEmitters.add(emitter);
            }
        }
        sseEmitters.removeAll(deadEmitters);
    }

    /**
     * Enregistre un nouvel abonné au flux SSE.
     */
    public SseEmitter subscribeSse() {
        // Durée de vie de la connexion : 30 minutes
        SseEmitter emitter = new SseEmitter(30 * 60 * 1000L);

        emitter.onCompletion(() -> sseEmitters.remove(emitter));
        emitter.onTimeout(() -> sseEmitters.remove(emitter));
        emitter.onError(e -> sseEmitters.remove(emitter));

        sseEmitters.add(emitter);

        // Message de bienvenue pour valider la connexion
        try {
            emitter.send(SseEmitter.event()
                    .name("INIT")
                    .data("Connecté au flux d'alertes MAS SenSanté temps réel"));
        } catch (IOException e) {
            sseEmitters.remove(emitter);
        }

        return emitter;
    }

    public int getActiveSubscriberCount() {
        return sseEmitters.size();
    }
}
