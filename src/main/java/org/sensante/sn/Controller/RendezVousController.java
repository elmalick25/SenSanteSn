package org.sensante.sn.Controller;

import org.sensante.sn.Service.RendezVousService;
import org.sensante.sn.dto.DemandeRdvRequestDTO;
import org.sensante.sn.dto.RdvPageDataDTO;
import org.sensante.sn.dto.RendezVousDTO;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.sensante.sn.Service.EnfantAccesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/rendez-vous")
@Tag(name = "Rendez-vous Cliniques & Zéro Attente", description = "Planification de consultations pédiatriques, boarding pass et rappels SMS")
@PreAuthorize("hasAnyRole('PARENT', 'AGENT_SANTE', 'MEDECIN', 'SUPERVISEUR', 'ADMINISTRATEUR')")
public class RendezVousController {

    private final RendezVousService rendezVousService;

    private final EnfantAccesService enfantAccesService;

    public RendezVousController(RendezVousService rendezVousService, EnfantAccesService enfantAccesService) {
        this.rendezVousService = rendezVousService;
        this.enfantAccesService = enfantAccesService;
    }

    @GetMapping("/enfant/{enfantId}")
    public ResponseEntity<RdvPageDataDTO> getRdvPageData(@PathVariable Long enfantId) {
        enfantAccesService.verifierAcces(enfantId);
        RdvPageDataDTO dto = rendezVousService.getRdvPageData(enfantId);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/demande")
    public ResponseEntity<RendezVousDTO> creerDemandeRdv(@RequestBody DemandeRdvRequestDTO request) {
        enfantAccesService.verifierAcces(request.getEnfantId());
        RendezVousDTO rdv = rendezVousService.creerDemandeRdv(request);
        return ResponseEntity.ok(rdv);
    }

    @GetMapping({"/enfant/{enfantId}/export-bilan-pdf", "/export-bilan-pdf"})
    public ResponseEntity<byte[]> exportBilanRdvPdf(@PathVariable(required = false) Long enfantId,
                                                    @RequestParam(name = "enfantId", required = false) Long paramEnfantId) {
        Long id = enfantId != null ? enfantId : paramEnfantId;
        enfantAccesService.verifierAcces(id);
        byte[] pdfBytes = rendezVousService.exportBilanRdvPdf(id);
        RdvPageDataDTO data = rendezVousService.getRdvPageData(id);

        String codeNational = (data != null && data.getCodeNational() != null) ? data.getCodeNational() : "SN-2025";
        String filename = "Bilan_Consultations_" + codeNational + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/consultations/{consultationId}/telecharger-fiche")
    public ResponseEntity<byte[]> telechargerFicheConsultation(@PathVariable Long consultationId) {
        byte[] pdfBytes = rendezVousService.exportFicheConsultationPdf(consultationId);

        String filename = "Document_Medical_Ref_" + consultationId + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
