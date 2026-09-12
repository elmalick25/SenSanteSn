package org.sensante.sn.Controller;

import lombok.RequiredArgsConstructor;
import org.sensante.sn.Service.RealtimeAlerteMasService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * Contrôleur HTTP pour le streaming d'alertes en temps réel via Server-Sent Events (SSE).
 */
@RestController
@RequestMapping("/api/stream")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class RealtimeStreamController {

    private final RealtimeAlerteMasService realtimeService;

    @GetMapping(value = "/alertes-mas", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamAlertesMas() {
        return realtimeService.subscribeSse();
    }
}
