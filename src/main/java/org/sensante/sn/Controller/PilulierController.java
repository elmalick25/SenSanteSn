package org.sensante.sn.Controller;

import org.sensante.sn.Service.PilulierService;
import org.sensante.sn.dto.PilulierPageDataDTO;
import org.sensante.sn.dto.ValiderPriseResponseDTO;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.sensante.sn.Service.EnfantAccesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/pilulier")
@Tag(name = "Pilulier & Compléments Nutritionnels", description = "Suivi des cures de micronutriments (MNP), prises quotidiennes et guides")
@PreAuthorize("hasAnyRole('PARENT', 'AGENT_SANTE', 'MEDECIN', 'ADMINISTRATEUR')")
public class PilulierController {

    private final PilulierService pilulierService;

    private final EnfantAccesService enfantAccesService;

    public PilulierController(PilulierService pilulierService, EnfantAccesService enfantAccesService) {
        this.pilulierService = pilulierService;
        this.enfantAccesService = enfantAccesService;
    }

    @GetMapping("/enfant/{enfantId}")
    public ResponseEntity<PilulierPageDataDTO> getPilulierData(@PathVariable Long enfantId) {
        enfantAccesService.verifierAcces(enfantId);
        PilulierPageDataDTO data = pilulierService.getPilulierPageData(enfantId);
        return ResponseEntity.ok(data);
    }

    @PostMapping("/valider-prise/{priseId}")
    public ResponseEntity<ValiderPriseResponseDTO> validerPrise(@PathVariable Long priseId) {
        ValiderPriseResponseDTO response = pilulierService.validerPrise(priseId);
        return ResponseEntity.ok(response);
    }

    @GetMapping({"/enfant/{enfantId}/export-fiche-pdf", "/export-fiche-pdf"})
    public ResponseEntity<byte[]> exportFicheNutritionnellePdf(@PathVariable(required = false) Long enfantId,
                                                               @RequestParam(name = "enfantId", required = false) Long paramEnfantId) {
        Long id = enfantId != null ? enfantId : paramEnfantId;
        enfantAccesService.verifierAcces(id);
        byte[] pdfBytes = pilulierService.exportFicheNutritionnellePdf(id);

        String filename = "Fiche_Suivi_Nutritionnel_PlumpySup_Enfant_" + id + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
