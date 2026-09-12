package org.sensante.sn.Service;

import org.sensante.sn.dto.SmsMessageDTO;

public interface SmsProvider {
    String getProviderName();
    boolean send(SmsMessageDTO message);
}
