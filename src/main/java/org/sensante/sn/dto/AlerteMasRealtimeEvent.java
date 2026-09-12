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
public class AlerteMasRealtimeEvent {
    private Long alerteId;
    private String matriculeEnfant;
    private String nomEnfant;
    private Double perimetreBrachial;
    private Boolean oedemes;
    private String niveauUrgence;
    private String motif;
    private String structureNom;
    private String agentNom;
    private LocalDateTime timestamp;
    private String hashSignature;
}
