package org.sensante.sn.Controller;

import org.sensante.sn.Service.MedecinVacationService;
import org.sensante.sn.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;

/**
 * REST Controller — Espace Médecin : Gestion de la Vacation Clinique.
 *
 * Base URL : /api/medecin/vacation
 */
@RestController
@RequestMapping("/api/medecin/vacation")
@Tag(name = "Médecin — Vacation & Chronogramme", description = "Gestion des créneaux de consultation, planning et prise de service")
@PreAuthorize("hasAnyRole('MEDECIN', 'ADMINISTRATEUR')")
public class MedecinVacationController {

    private final MedecinVacationService service;

    public MedecinVacationController(MedecinVacationService service) {
        this.service = service;
    }

    /**
     * GET /api/medecin/vacation/prise-de-service
     * Charge le chronogramme opérationnel complet pour la vacation en cours.
     * Identité médecin extraite du token JWT (email).
     */
    @GetMapping("/prise-de-service")
    public ResponseEntity<VacationPriseDeServiceDTO> getPriseDeService(
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        return ResponseEntity.ok(service.getPriseDeService(email));
    }

    /**
     * POST /api/medecin/vacation/creneaux/{id}/appeler-box
     * Convoque le patient du créneau au box médical (Box 04 Pédiatrie).
     */
    @PostMapping("/creneaux/{id}/appeler-box")
    public ResponseEntity<AppelerBoxResponse> appelerBox(
            @PathVariable("id") Long idCreneau,
            @RequestBody(required = false) AppelerBoxRequest request) {
        return ResponseEntity.ok(service.appelerBox(idCreneau));
    }

    /**
     * POST /api/medecin/vacation/creneaux/{id}/allouer-urgence
     * Alloue le créneau tampon à un cas aigu entrant.
     */
    @PostMapping("/creneaux/{id}/allouer-urgence")
    public ResponseEntity<AppelerBoxResponse> allouerCreneauUrgence(
            @PathVariable("id") Long idCreneau) {
        return ResponseEntity.ok(service.allouerCreneauUrgence(idCreneau));
    }

    /**
     * PUT /api/medecin/vacation/config
     * Reconfigure la plage horaire et le nombre de créneaux de la vacation.
     */
    @PutMapping("/config")
    public ResponseEntity<VacationPriseDeServiceDTO> reconfigurerVacation(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ReconfigurerVacationRequest request) {
        String email = userDetails.getUsername();
        return ResponseEntity.ok(service.reconfigurerVacation(email, request));
    }
}
