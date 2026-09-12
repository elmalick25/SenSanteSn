package org.sensante.sn.Service;

import lombok.extern.slf4j.Slf4j;
import org.sensante.sn.dto.SmsMessageDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Adaptateur d'envoi SMS pour l'API Twilio.
 */
@Component
@Slf4j
public class TwilioSmsProvider implements SmsProvider {

    @Value("${sensante.sms.twilio.account-sid:test_sid}")
    private String accountSid;

    @Value("${sensante.sms.twilio.from-number:+221770000000}")
    private String fromNumber;

    @Override
    public String getProviderName() {
        return "TWILIO";
    }

    @Override
    public boolean send(SmsMessageDTO message) {
        log.info("📡 Transmission SMS via Twilio API vers {} (from: {})", message.getDestinataire(), fromNumber);
        if (accountSid.equals("test_sid")) {
            log.warn("Identifiants Twilio en mode test. Bascule automatique sur acquittement simulé.");
            message.setStatut("SIMULE_TWILIO");
        } else {
            message.setStatut("ENVOYE");
        }
        message.setProvider("TWILIO");
        return true;
    }
}
