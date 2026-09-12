package org.sensante.sn.Controller;

import org.sensante.sn.Service.MedecinDossierService;
import org.sensante.sn.dto.DossierPatient360DTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;

/**
 * REST Controller — Espace Médecin : Dossier Patient (Vue 360°).
 *
 * Base URL : /api/medecin/dossier
 */
@RestController
@RequestMapping("/api/medecin/dossier")
@Tag(name = "Médecin — Dossier Patient 360°", description = "Consultation du dossier pédiatrique complet, biométrie et PEV")
@PreAuthorize("hasAnyRole('MEDECIN', 'ADMINISTRATEUR')")
public class MedecinDossierController {

    private final MedecinDossierService service;

    public MedecinDossierController(MedecinDossierService service) {
        this.service = service;
    }

    /**
     * GET /api/medecin/dossier/{idPatient}
     * Charge la vue 360° complète du dossier patient (biométrie, courbes OMS, néonatalogie, PEV, timeline).
     */
    @GetMapping("/{idPatient}")
    public ResponseEntity<DossierPatient360DTO> getDossier360(
            @PathVariable("idPatient") Long idPatient) {
        return ResponseEntity.ok(service.getDossier360(idPatient));
    }

    /**
     * GET /api/medecin/dossier/actif
     * Charge le dossier 360° du patient actuellement pris en charge par défaut (Moussa Diop).
     */
    @GetMapping("/actif")
    public ResponseEntity<DossierPatient360DTO> getDossierActif() {
        return ResponseEntity.ok(service.getDossier360(1L));
    }
}
