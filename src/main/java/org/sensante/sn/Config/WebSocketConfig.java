package org.sensante.sn.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Configuration du broker WebSocket STOMP pour la diffusion en temps réel des alertes MAS,
 * des flux de file d'attente et des notifications cliniques.
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Préfixe pour les topics de diffusion (pub/sub)
        config.enableSimpleBroker("/topic", "/queue");
        // Préfixe pour les messages entrants adressés à l'application
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint STOMP standard avec fallback SockJS pour les navigateurs restreints
        registry.addEndpoint("/ws/sensante")
                .setAllowedOriginPatterns("*")
                .withSockJS();

        // Endpoint WebSocket brut
        registry.addEndpoint("/ws/sensante-raw")
                .setAllowedOriginPatterns("*");
    }
}
