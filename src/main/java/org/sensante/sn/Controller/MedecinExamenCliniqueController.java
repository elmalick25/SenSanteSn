package org.sensante.sn.Controller;

import org.sensante.sn.Service.MedecinExamenCliniqueService;
import org.sensante.sn.dto.ExamenCliniquePcimeDTO;
import org.sensante.sn.dto.ValiderExamenRequest;
import org.sensante.sn.dto.ValiderExamenResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;

/**
 * REST Controller — Espace Médecin : Examen Clinique & Arbre Décisionnel PCIME.
 *
 * Base URL : /api/medecin/examen
 */
@RestController
@RequestMapping("/api/medecin/examen")
@Tag(name = "Médecin — Examen Clinique PCIME", description = "Conduite d'examen clinique pédiatrique selon l'arbre décisionnel OMS/PCIME")
@PreAuthorize("hasAnyRole('MEDECIN', 'ADMINISTRATEUR')")
public class MedecinExamenCliniqueController {

    private final MedecinExamenCliniqueService service;

    public MedecinExamenCliniqueController(MedecinExamenCliniqueService service) {
        this.service = service;
    }

    /**
     * GET /api/medecin/examen/en-cours
     * Charge l'examen clinique et l'arbre décisionnel du patient actuellement en consultation active (Cabinet 04).
     */
    @GetMapping("/en-cours")
    public ResponseEntity<ExamenCliniquePcimeDTO> getExamenEnCours() {
        return ResponseEntity.ok(service.getExamenClinique("SN-DKR-2024-0114"));
    }

    /**
     * GET /api/medecin/examen/dossier/{nip}
     * Charge l'arbre décisionnel PCIME pour un patient donné via son NIP.
     */
    @GetMapping("/dossier/{nip}")
    public ResponseEntity<ExamenCliniquePcimeDTO> getExamenParNip(@PathVariable("nip") String nip) {
        return ResponseEntity.ok(service.getExamenClinique(nip));
    }

    /**
     * POST /api/medecin/examen/valider
     * Valide l'arbre décisionnel, persiste l'orientation thérapeutique et génère la redirection vers l'ordonnance.
     */
    @PostMapping("/valider")
    public ResponseEntity<ValiderExamenResponse> validerExamen(@RequestBody ValiderExamenRequest request) {
        return ResponseEntity.ok(service.validerExamenEtOrienter(request));
    }
}
