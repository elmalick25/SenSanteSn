package org.sensante.sn.Service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.sensante.sn.dto.SmsMessageDTO;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class SmsNotificationServiceTest {

    private SmsNotificationService smsService;
    private DevLoggingSmsProvider devProvider;
    private OrangeSmsProvider orangeProvider;
    private TwilioSmsProvider twilioProvider;

    @BeforeEach
    void setUp() {
        devProvider = new DevLoggingSmsProvider();
        orangeProvider = new OrangeSmsProvider();
        twilioProvider = new TwilioSmsProvider();

        smsService = new SmsNotificationService(devProvider, orangeProvider, twilioProvider);
        ReflectionTestUtils.setField(smsService, "configuredProvider", "dev");
    }

    @Test
    @DisplayName("Envoi d'un SMS d'urgence MAS avec contenu clair et enregistrement dans l'historique")
    void shouldSendAlerteMasSmsInDevMode() {
        SmsMessageDTO result = smsService.sendAlerteMasSms(
                "+221775551234",
                "Mamadou Ndiaye",
                "SEN-MED-2489",
                "Poste de Santé Médina"
        );

        assertThat(result).isNotNull();
        assertThat(result.getDestinataire()).isEqualTo("+221775551234");
        assertThat(result.getMessage()).contains("Mamadou Ndiaye");
        assertThat(result.getMessage()).contains("SEN-MED-2489");
        assertThat(result.getType()).isEqualTo("ALERTE_MAS");

        List<SmsMessageDTO> historique = smsService.getHistorique();
        assertThat(historique).isNotEmpty();
        assertThat(historique.get(0).getDestinataire()).isEqualTo("+221775551234");
    }

    @Test
    @DisplayName("Envoi d'une confirmation de rendez-vous avec référence au pass QR")
    void shouldSendRdvConfirmationSms() {
        SmsMessageDTO result = smsService.sendRdvConfirmationSms(
                "+221771112233",
                "Aminata Seck",
                "23 Octobre à 09h30",
                "Cabinet 02"
        );

        assertThat(result).isNotNull();
        assertThat(result.getMessage()).contains("Aminata Seck");
        assertThat(result.getMessage()).contains("Cabinet 02");
        assertThat(result.getMessage()).contains("QR code");
    }
}
