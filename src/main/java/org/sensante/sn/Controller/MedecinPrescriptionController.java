package org.sensante.sn.Controller;

import org.sensante.sn.Service.MedecinPrescriptionService;
import org.sensante.sn.dto.GenererOrdonnanceResponse;
import org.sensante.sn.dto.PrescriptionMedicaleDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Map;

/**
 * REST Controller — Espace Médecin : Prescription Médicamenteuse & Ordonnance Sécurisée.
 *
 * Base URL : /api/medecin/prescription
 */
@RestController
@RequestMapping("/api/medecin/prescription")
@Tag(name = "Médecin — Prescriptions & Ordonnances", description = "Émission d'ordonnances sécurisées, protocoles ATPE et antibiotiques")
@PreAuthorize("hasAnyRole('MEDECIN', 'ADMINISTRATEUR')")
public class MedecinPrescriptionController {

    private final MedecinPrescriptionService service;

    public MedecinPrescriptionController(MedecinPrescriptionService service) {
        this.service = service;
    }

    /**
     * GET /api/medecin/prescription/en-cours
     * Charge les données de prescription et protocole CRENAS du patient en consultation active.
     */
    @GetMapping("/en-cours")
    public ResponseEntity<PrescriptionMedicaleDTO> getPrescriptionEnCours() {
        return ResponseEntity.ok(service.getPrescription("SN-DKR-2024-0114"));
    }

    /**
     * GET /api/medecin/prescription/dossier/{nip}
     * Charge les données de prescription pour un patient via son NIP.
     */
    @GetMapping("/dossier/{nip}")
    public ResponseEntity<PrescriptionMedicaleDTO> getPrescriptionParNip(@PathVariable("nip") String nip) {
        return ResponseEntity.ok(service.getPrescription(nip));
    }

    /**
     * POST /api/medecin/prescription/generer
     * Valide et scelle numériquement l'ordonnance avec certificat ANSSI-SN.
     */
    @PostMapping("/generer")
    public ResponseEntity<GenererOrdonnanceResponse> genererOrdonnance(@RequestBody Map<String, String> payload) {
        String nip = payload != null ? payload.get("nip") : "SN-DKR-2024-0114";
        return ResponseEntity.ok(service.genererOrdonnance(nip));
    }

    /**
     * POST /api/medecin/prescription/notifier-sms
     * Transmet le récapitulatif du traitement et RDV par SMS à la tutrice.
     */
    @PostMapping("/notifier-sms")
    public ResponseEntity<Map<String, Object>> notifierSms(@RequestBody Map<String, String> payload) {
        String nip = payload != null ? payload.get("nip") : "SN-DKR-2024-0114";
        boolean success = service.envoyerSmsTutrice(nip);
        return ResponseEntity.ok(Map.of(
            "success", success,
            "message", "SMS de notification de traitement transmis avec succès à Coumba Diop."
        ));
    }
}
