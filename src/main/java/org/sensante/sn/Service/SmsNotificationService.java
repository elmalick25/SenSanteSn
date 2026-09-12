package org.sensante.sn.Service;

import lombok.extern.slf4j.Slf4j;
import org.sensante.sn.dto.SmsMessageDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class SmsNotificationService {

    private final DevLoggingSmsProvider devProvider;
    private final OrangeSmsProvider orangeProvider;
    private final TwilioSmsProvider twilioProvider;

    @Value("${sensante.sms.provider:dev}")
    private String configuredProvider;

    public SmsNotificationService(
            DevLoggingSmsProvider devProvider,
            OrangeSmsProvider orangeProvider,
            TwilioSmsProvider twilioProvider) {
        this.devProvider = devProvider;
        this.orangeProvider = orangeProvider;
        this.twilioProvider = twilioProvider;
    }

    private SmsProvider getActiveProvider() {
        if ("orange".equalsIgnoreCase(configuredProvider)) {
            return orangeProvider;
        } else if ("twilio".equalsIgnoreCase(configuredProvider)) {
            return twilioProvider;
        }
        return devProvider;
    }

    public SmsMessageDTO sendAlerteMasSms(String telephoneTuteur, String nomEnfant, String matricule, String structure) {
        String msg = String.format(
                "URGENCE SENSANTÉ : Votre enfant %s (%s) nécessite une prise en charge immédiate au %s. Présentez-vous sans délai avec votre carnet de santé.",
                nomEnfant, matricule, structure
        );

        SmsMessageDTO dto = SmsMessageDTO.builder()
                .id(UUID.randomUUID().toString())
                .destinataire(telephoneTuteur)
                .message(msg)
                .type("ALERTE_MAS")
                .dateEnvoi(LocalDateTime.now())
                .referenceMetier(matricule)
                .build();

        getActiveProvider().send(dto);
        // Toujours enregistrer dans le journal dev pour traçabilité
        if (getActiveProvider() != devProvider) {
            devProvider.send(dto);
        }
        return dto;
    }

    public SmsMessageDTO sendRdvConfirmationSms(String telephoneTuteur, String nomEnfant, String dateHeure, String box) {
        String msg = String.format(
                "SenSanté RDV : Consultation confirmée pour %s le %s (%s). Présentez le QR code de votre pass à l'accueil du dispensaire.",
                nomEnfant, dateHeure, box
        );

        SmsMessageDTO dto = SmsMessageDTO.builder()
                .id(UUID.randomUUID().toString())
                .destinataire(telephoneTuteur)
                .message(msg)
                .type("CONVOCATION_RDV")
                .dateEnvoi(LocalDateTime.now())
                .referenceMetier(nomEnfant)
                .build();

        getActiveProvider().send(dto);
        if (getActiveProvider() != devProvider) {
            devProvider.send(dto);
        }
        return dto;
    }

    public SmsMessageDTO sendRappelPeseeSms(String telephoneTuteur, String nomEnfant, String dateRappel) {
        String msg = String.format(
                "Rappel SenSanté / MSAS : Le contrôle mensuel de croissance et supplémentation de %s est prévu pour le %s. Rendez-vous auprès de votre Bajenu Gox.",
                nomEnfant, dateRappel
        );

        SmsMessageDTO dto = SmsMessageDTO.builder()
                .id(UUID.randomUUID().toString())
                .destinataire(telephoneTuteur)
                .message(msg)
                .type("RAPPEL_PESEE")
                .dateEnvoi(LocalDateTime.now())
                .referenceMetier(nomEnfant)
                .build();

        getActiveProvider().send(dto);
        if (getActiveProvider() != devProvider) {
            devProvider.send(dto);
        }
        return dto;
    }

    public SmsMessageDTO sendCustomSms(String telephone, String message, String type, String reference) {
        SmsMessageDTO dto = SmsMessageDTO.builder()
                .id(UUID.randomUUID().toString())
                .destinataire(telephone)
                .message(message)
                .type(type != null ? type : "MESSAGE_LIBRE")
                .dateEnvoi(LocalDateTime.now())
                .referenceMetier(reference)
                .build();

        getActiveProvider().send(dto);
        if (getActiveProvider() != devProvider) {
            devProvider.send(dto);
        }
        return dto;
    }

    public List<SmsMessageDTO> getHistorique() {
        return devProvider.getSentMessages();
    }
}
