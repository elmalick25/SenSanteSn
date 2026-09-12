package org.sensante.sn.Controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.sensante.sn.dto.SmsMessageDTO;
import org.sensante.sn.Service.SmsNotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/sms")
@Tag(name = "Passerelle SMS & Alertes Mobiles", description = "Envoi de SMS multicanaux (Orange/Twilio) et historique d'audit")
@PreAuthorize("hasAnyRole('AGENT_SANTE', 'MEDECIN', 'SUPERVISEUR', 'ADMINISTRATEUR')")
@RequiredArgsConstructor
public class SmsController {

    private final SmsNotificationService smsService;

    @GetMapping("/historique")
    public ResponseEntity<List<SmsMessageDTO>> getHistorique() {
        return ResponseEntity.ok(smsService.getHistorique());
    }

    @PostMapping("/envoyer")
    public ResponseEntity<SmsMessageDTO> envoyerSms(@RequestBody SendSmsRequest request) {
        SmsMessageDTO sent = smsService.sendCustomSms(
                request.getTelephone(),
                request.getMessage(),
                request.getType(),
                request.getReference()
        );
        return ResponseEntity.ok(sent);
    }

    @Data
    public static class SendSmsRequest {
        private String telephone;
        private String message;
        private String type;
        private String reference;
    }
}
