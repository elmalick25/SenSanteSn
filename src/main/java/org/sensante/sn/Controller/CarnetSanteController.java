package org.sensante.sn.Controller;

import org.sensante.sn.Service.CarnetSanteService;
import org.sensante.sn.dto.CarnetSanteDTO;
import org.sensante.sn.util.PdfDocumentGenerator;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.sensante.sn.Service.EnfantAccesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;

import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/carnet-sante")
@Tag(name = "Carnet de Santé Numérique", description = "Consultation du carnet de vaccination, passeport sanitaire et export PDF")
@PreAuthorize("hasAnyRole('PARENT', 'AGENT_SANTE', 'MEDECIN', 'ADMINISTRATEUR')")
public class CarnetSanteController {

    private final CarnetSanteService carnetSanteService;

    private final EnfantAccesService enfantAccesService;

    public CarnetSanteController(CarnetSanteService carnetSanteService, EnfantAccesService enfantAccesService) {
        this.carnetSanteService = carnetSanteService;
        this.enfantAccesService = enfantAccesService;
    }

    @GetMapping("/enfant/{enfantId}")
    public ResponseEntity<CarnetSanteDTO> getCarnetSante(@PathVariable Long enfantId) {
        enfantAccesService.verifierAcces(enfantId);
        CarnetSanteDTO carnet = carnetSanteService.getCarnetSanteByEnfantId(enfantId);
        return ResponseEntity.ok(carnet);
    }

    @GetMapping("/enfant/{enfantId}/export-pdf")
    public ResponseEntity<byte[]> exportPasseportPdf(@PathVariable Long enfantId) {
        enfantAccesService.verifierAcces(enfantId);
        CarnetSanteDTO carnet = carnetSanteService.getCarnetSanteByEnfantId(enfantId);

        String birthDateStr = carnet.getDateNaissance() != null
                ? carnet.getDateNaissance().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                : "Non renseignee";

        byte[] pdfBytes = PdfDocumentGenerator.generateMedicalCertificate(
                "PASS-" + carnet.getCodeNational(),
                "Passeport Sanitaire & Carnet Pediatrique Officiel",
                carnet.getNomComplet(),
                carnet.getCodeNational(),
                birthDateStr + " (" + carnet.getAgeEnMois() + " mois)",
                carnet.getGroupeSanguin(),
                carnet.getNomStructureSante() + " - " + carnet.getRegionMedicale(),
                String.valueOf(carnet.getDernierPerimetreBrachial()),
                carnet.getStatutNutritionnel() != null ? carnet.getStatutNutritionnel().name() : "NORMAL",
                "SHA256:" + carnet.getHashCryptographiqueSHA256()
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Passeport_Sanitaire_" + carnet.getCodeNational() + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/documents/{docId}/telecharger")
    public ResponseEntity<byte[]> telechargerDocument(@PathVariable String docId,
                                                      @RequestParam(name = "enfantId", required = true) Long enfantId) {
        if (enfantId == null) {
            throw new org.sensante.sn.exception.AccesRefuseMetierException("L'identifiant de l'enfant est requis pour télécharger ce document médical.");
        }
        // Vérification de sécurité parent-enfant
        enfantAccesService.verifierAcces(enfantId);
        CarnetSanteDTO carnet = carnetSanteService.getCarnetSanteByEnfantId(enfantId);

        String childName = carnet.getNomComplet();
        String nationalId = carnet.getCodeNational();
        String birthDate = carnet.getDateNaissance() != null
                ? carnet.getDateNaissance().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                : "Non renseignee";
        String bloodGroup = carnet.getGroupeSanguin();
        String facility = carnet.getNomStructureSante();
        String muac = String.valueOf(carnet.getDernierPerimetreBrachial());
        String status = carnet.getStatutNutritionnel() != null ? carnet.getStatutNutritionnel().name() : "NORMAL";
        String pki = "SHA256:" + carnet.getHashCryptographiqueSHA256();
        String titre = "Document Médical Numérisé (" + docId + ")";

        byte[] pdfBytes = PdfDocumentGenerator.generateMedicalCertificate(
                docId,
                titre,
                childName,
                nationalId,
                birthDate,
                bloodGroup,
                facility,
                muac,
                status,
                pki
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + docId + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
