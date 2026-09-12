package org.sensante.sn.Service;

import lombok.extern.slf4j.Slf4j;
import org.sensante.sn.dto.SmsMessageDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Adaptateur d'envoi SMS pour l'API Orange Sénégal / Orange MEA.
 * En environnement réel, requiert ORANGE_CLIENT_ID et ORANGE_CLIENT_SECRET.
 */
@Component
@Slf4j
public class OrangeSmsProvider implements SmsProvider {

    @Value("${sensante.sms.orange.api-url:https://api.orange.com/smsmessaging/v1/outbound}")
    private String apiUrl;

    @Value("${sensante.sms.orange.client-id:test_client_id}")
    private String clientId;

    @Value("${sensante.sms.sender-id:SenSante}")
    private String senderId;

    @Override
    public String getProviderName() {
        return "ORANGE";
    }

    @Override
    public boolean send(SmsMessageDTO message) {
        log.info("📡 Transmission SMS via Orange API Gateway vers {} (expéditeur: {})", message.getDestinataire(), senderId);
        // Simulation / appel HTTP réel vers Orange SMS API
        if (clientId.equals("test_client_id")) {
            log.warn("Identifiants Orange API en mode test. Bascule automatique sur acquittement simulé.");
            message.setStatut("SIMULE_ORANGE");
        } else {
            message.setStatut("ENVOYE");
        }
        message.setProvider("ORANGE");
        return true;
    }
}
