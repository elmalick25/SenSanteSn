package org.sensante.sn.Service;

import lombok.extern.slf4j.Slf4j;
import org.sensante.sn.dto.SmsMessageDTO;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
@Slf4j
public class DevLoggingSmsProvider implements SmsProvider {

    private final List<SmsMessageDTO> sentMessages = new CopyOnWriteArrayList<>();

    @Override
    public String getProviderName() {
        return "DEV";
    }

    @Override
    public boolean send(SmsMessageDTO message) {
        log.info("================================================================================");
        log.info("📱 [SMS GATEWAY SIMULATION - DEV]");
        log.info("Destinataire : {}", message.getDestinataire());
        log.info("Type         : {}", message.getType());
        log.info("Référence    : {}", message.getReferenceMetier());
        log.info("Message      : {}", message.getMessage());
        log.info("================================================================================");

        message.setStatut("SIMULE");
        message.setProvider("DEV");
        sentMessages.add(message);
        return true;
    }

    public List<SmsMessageDTO> getSentMessages() {
        return Collections.unmodifiableList(sentMessages);
    }

    public void clearHistory() {
        sentMessages.clear();
    }
}
