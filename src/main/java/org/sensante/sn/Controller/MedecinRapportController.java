package org.sensante.sn.Controller;

import org.sensante.sn.Service.MedecinRapportService;
import org.sensante.sn.dto.CloturerVacationRequest;
import org.sensante.sn.dto.CloturerVacationResponse;
import org.sensante.sn.dto.RapportClotureVacationDTO;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;

/**
 * REST Controller — Espace Médecin : Rapport du Jour & Clôture Décisionnelle.
 *
 * Base URL : /api/medecin/rapport
 */
@RestController
@RequestMapping("/api/medecin/rapport")
@Tag(name = "Médecin — Clôture & Rapports SNIS", description = "Rapports de vacation, télétransmission DHIS2 et export SNIS")
@PreAuthorize("hasAnyRole('MEDECIN', 'ADMINISTRATEUR')")
public class MedecinRapportController {

    private final MedecinRapportService service;

    public MedecinRapportController(MedecinRapportService service) {
        this.service = service;
    }

    /**
     * GET /api/medecin/rapport/cloture
     * Récupère le rapport de clôture consolidé de la vacation du jour.
     */
    @GetMapping("/cloture")
    public ResponseEntity<RapportClotureVacationDTO> getRapportCloture() {
        return ResponseEntity.ok(service.getRapportCloture());
    }

    /**
     * POST /api/medecin/rapport/cloturer
     * Clôture formellement la vacation et télétransmet au DHIS2 Sénégal.
     */
    @PostMapping("/cloturer")
    public ResponseEntity<CloturerVacationResponse> cloturerVacation(@RequestBody(required = false) CloturerVacationRequest request) {
        return ResponseEntity.ok(service.cloturerVacation(request));
    }

    /**
     * GET /api/medecin/rapport/export-csv
     * Télécharge l'export CSV officiel SNIS Sénégal des consultations de la journée.
     */
    @GetMapping(value = "/export-csv", produces = "text/csv")
    public ResponseEntity<String> exportCsvSnis() {
        String csv = service.genererCsvSnis();
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=SNIS_Gaspard_Kamara_24102024.csv")
            .contentType(MediaType.parseMediaType("text/csv"))
            .body(csv);
    }
}
