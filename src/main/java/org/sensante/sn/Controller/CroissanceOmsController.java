package org.sensante.sn.Controller;

import org.sensante.sn.Service.CroissanceOmsService;
import org.sensante.sn.dto.CroissanceOmsDTO;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.sensante.sn.Service.EnfantAccesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/croissance")
@Tag(name = "Croissance & Standards OMS", description = "Calcul des Z-scores, percentiles OMS et export officiel des courbes de croissance")
@PreAuthorize("hasAnyRole('PARENT', 'AGENT_SANTE', 'MEDECIN', 'SUPERVISEUR', 'ADMINISTRATEUR')")
public class CroissanceOmsController {

    private final CroissanceOmsService croissanceOmsService;

    private final EnfantAccesService enfantAccesService;

    public CroissanceOmsController(CroissanceOmsService croissanceOmsService, EnfantAccesService enfantAccesService) {
        this.croissanceOmsService = croissanceOmsService;
        this.enfantAccesService = enfantAccesService;
    }

    @GetMapping("/enfant/{enfantId}")
    public ResponseEntity<CroissanceOmsDTO> getAnalyseCroissance(@PathVariable Long enfantId) {
        enfantAccesService.verifierAcces(enfantId);
        CroissanceOmsDTO dto = croissanceOmsService.getAnalyseCroissance(enfantId);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/enfant/{enfantId}/export-pdf")
    public ResponseEntity<byte[]> exportCroissancePdf(@PathVariable Long enfantId) {
        enfantAccesService.verifierAcces(enfantId);
        byte[] pdfBytes = croissanceOmsService.exportOmsPdf(enfantId);
        CroissanceOmsDTO dto = croissanceOmsService.getAnalyseCroissance(enfantId);

        String filename = "Courbes_Croissance_OMS_" + dto.getCodeNational() + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
