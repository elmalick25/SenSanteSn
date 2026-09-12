package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SmsMessageDTO {
    private String id;
    private String destinataire; // e.g. +221771234567
    private String message;
    private String type; // CONVOCATION_RDV, ALERTE_MAS, RAPPEL_VACCIN, PROTOCOLE_ATPE
    private String provider; // DEV, ORANGE, TWILIO
    private String statut; // ENVOYE, SIMULE, EN_ATTENTE, ERREUR
    private LocalDateTime dateEnvoi;
    private String referenceMetier;
}
