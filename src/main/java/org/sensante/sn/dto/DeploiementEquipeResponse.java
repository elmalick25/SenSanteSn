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
public class DeploiementEquipeResponse {
    private String numeroMission;
    private String statut;
    private String zoneCible;
    private String superviseurAstreinte;
    private LocalDateTime dateDeploiement;
    private String message;
}
