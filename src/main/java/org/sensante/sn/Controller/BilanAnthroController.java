package org.sensante.sn.Controller;

import org.sensante.sn.Service.EnfantAccesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.sensante.sn.Model.BilanAntro;
import org.sensante.sn.Service.BilanAnthroService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/bilan-anthro")
@Tag(name = "Bilans Anthropométriques", description = "Relevés de poids, taille, périmètre brachial (MUAC) et détection œdèmes")
@PreAuthorize("hasAnyRole('PARENT', 'AGENT_SANTE', 'MEDECIN', 'SUPERVISEUR', 'ADMINISTRATEUR')")
public class BilanAnthroController {

    private final BilanAnthroService bilanAnthroService;

    private final EnfantAccesService enfantAccesService;

    public BilanAnthroController(BilanAnthroService bilanAnthroService, EnfantAccesService enfantAccesService) {
        this.bilanAnthroService = bilanAnthroService;
        this.enfantAccesService = enfantAccesService;
    }

    @PostMapping
    public ResponseEntity<BilanAntro> createBilan(@RequestBody BilanAntro bilan) {
        if (bilan == null || bilan.getEnfant() == null || bilan.getEnfant().getEnfantId() == null) {
            throw new org.sensante.sn.exception.AccesRefuseMetierException("Un bilan anthropométrique doit être rattaché à un enfant identifié.");
        }
        enfantAccesService.verifierAcces(bilan.getEnfant().getEnfantId());
        return ResponseEntity.ok(bilanAnthroService.createBilan(bilan));
    }

    @GetMapping
    public ResponseEntity<List<BilanAntro>> getAllBilans(@RequestParam(required = false) Long enfantId) {
        if (enfantId != null) {
            enfantAccesService.verifierAcces(enfantId);
            return ResponseEntity.ok(bilanAnthroService.getBilansByEnfantId(enfantId));
        }
        // Sans filtre enfant, la cohorte complète est réservée aux professionnels.
        if (!enfantAccesService.estProfessionnel(enfantAccesService.utilisateurCourant())) {
            throw new org.sensante.sn.exception.AccesRefuseMetierException(
                    "Vous ne pouvez consulter que les bilans de vos propres enfants.");
        }
        return ResponseEntity.ok(bilanAnthroService.getAllBilans());
    }

    @GetMapping("/enfant/{enfantId}")
    public ResponseEntity<List<BilanAntro>> getBilansByEnfantId(@PathVariable Long enfantId) {
        enfantAccesService.verifierAcces(enfantId);
        return ResponseEntity.ok(bilanAnthroService.getBilansByEnfantId(enfantId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'MEDECIN', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<BilanAntro> getBilanById(@PathVariable Long id) {
        return ResponseEntity.ok(bilanAnthroService.getBilanById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BilanAntro> updateBilan(@PathVariable Long id, @RequestBody BilanAntro bilanDetails) {
        BilanAntro existant = bilanAnthroService.getBilanById(id);
        if (existant.getEnfant() != null && existant.getEnfant().getEnfantId() != null) {
            enfantAccesService.verifierAcces(existant.getEnfant().getEnfantId());
        }
        if (bilanDetails != null && bilanDetails.getEnfant() != null && bilanDetails.getEnfant().getEnfantId() != null) {
            enfantAccesService.verifierAcces(bilanDetails.getEnfant().getEnfantId());
        }
        return ResponseEntity.ok(bilanAnthroService.updateBilan(id, bilanDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBilan(@PathVariable Long id) {
        BilanAntro existant = bilanAnthroService.getBilanById(id);
        if (existant.getEnfant() != null && existant.getEnfant().getEnfantId() != null) {
            enfantAccesService.verifierAcces(existant.getEnfant().getEnfantId());
        }
        bilanAnthroService.deleteBilan(id);
        return ResponseEntity.ok("Le bilan anthropométrique avec l'id " + id + " a bien été supprimé.");
    }
}