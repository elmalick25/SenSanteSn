package org.sensante.sn.Controller;

import org.sensante.sn.Service.MedecinFileAttenteService;
import org.sensante.sn.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;

/**
 * REST Controller — Espace Médecin : Pupitre de Consultation & File d'Attente.
 *
 * Base URL : /api/medecin/file-attente
 */
@RestController
@RequestMapping("/api/medecin/file-attente")
@Tag(name = "Médecin — File d'Attente & Pupitre", description = "Gestion des patients en attente, admission au cabinet et triage")
@PreAuthorize("hasAnyRole('MEDECIN', 'ADMINISTRATEUR')")
public class MedecinFileAttenteController {

    private final MedecinFileAttenteService service;

    public MedecinFileAttenteController(MedecinFileAttenteService service) {
        this.service = service;
    }

    /**
     * GET /api/medecin/file-attente/vue-pupitre
     * Charge l'état global du pupitre : KPIs, patient en cours, listes d'attente et dossier actif.
     * Identité médecin extraite du token JWT.
     */
    @GetMapping("/vue-pupitre")
    public ResponseEntity<FileAttenteVuePupitreDTO> getVuePupitre(
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        return ResponseEntity.ok(service.getVuePupitre(email));
    }

    /**
     * GET /api/medecin/file-attente/dossier/{idPatient}
     * Charge le dossier d'accueil et double-identité d'un patient sélectionné dans la file.
     */
    @GetMapping("/dossier/{idPatient}")
    public ResponseEntity<DossierAccueilDTO> getDossierAccueil(
            @PathVariable("idPatient") Long idPatient) {
        return ResponseEntity.ok(service.getDossierAccueil(idPatient));
    }

    /**
     * POST /api/medecin/file-attente/faire-entrer
     * Fait entrer le patient dans le Cabinet de consultation (lance la consultation).
     */
    @PostMapping("/faire-entrer")
    public ResponseEntity<FaireEntrerResponse> faireEntrer(
            @RequestBody FaireEntrerRequest request) {
        return ResponseEntity.ok(service.faireEntrer(request));
    }

    /**
     * POST /api/medecin/file-attente/prioriser/{idPatient}
     * Priorise immédiatement un cas grave MAS et déclenche l'appel d'entrée en cabinet.
     */
    @PostMapping("/prioriser/{idPatient}")
    public ResponseEntity<FaireEntrerResponse> prioriserEtAppeler(
            @PathVariable("idPatient") Long idPatient) {
        return ResponseEntity.ok(service.prioriserEtAppeler(idPatient));
    }

    /**
     * POST /api/medecin/file-attente/cloturer
     * Clôture la consultation courante pour libérer le cabinet médical.
     */
    @PostMapping("/cloturer")
    public ResponseEntity<FaireEntrerResponse> cloturerConsultation() {
        return ResponseEntity.ok(service.cloturerConsultation());
    }
}
