package org.sensante.sn.Controller;

import org.sensante.sn.Service.EnfantAccesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.sensante.sn.Model.SupleNutritionnel;
import org.sensante.sn.Service.SupleNutritionnelService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/suples-nutritionnels")
@Tag(name = "Suppléments Nutritionnels & ATPE", description = "Administration et suivi des intrants nutritionnels et suppléments pédiatriques")
@PreAuthorize("hasAnyRole('PARENT', 'AGENT_SANTE', 'MEDECIN', 'SUPERVISEUR', 'ADMINISTRATEUR')")
public class SupleNutritionnelController {

    private final SupleNutritionnelService supleNutritionnelService;

    private final EnfantAccesService enfantAccesService;

    public SupleNutritionnelController(SupleNutritionnelService supleNutritionnelService, EnfantAccesService enfantAccesService) {
        this.supleNutritionnelService = supleNutritionnelService;
        this.enfantAccesService = enfantAccesService;
    }

    @PostMapping
    public ResponseEntity<SupleNutritionnel> createSupleNutritionnel(@RequestBody SupleNutritionnel supleNutritionnel) {
        if (supleNutritionnel == null || supleNutritionnel.getEnfant() == null || supleNutritionnel.getEnfant().getEnfantId() == null) {
            throw new org.sensante.sn.exception.AccesRefuseMetierException("Un supplément nutritionnel doit être rattaché à un enfant identifié.");
        }
        enfantAccesService.verifierAcces(supleNutritionnel.getEnfant().getEnfantId());
        return ResponseEntity.ok(supleNutritionnelService.createSupleNutritionnel(supleNutritionnel));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'MEDECIN', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<List<SupleNutritionnel>> getAllSupleNutritionnels() {
        return ResponseEntity.ok(supleNutritionnelService.getAllSupleNutritionnels());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'MEDECIN', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<SupleNutritionnel> getSupleNutritionnelById(@PathVariable Long id) {
        return ResponseEntity.ok(supleNutritionnelService.getSupleNutritionnelById(id));
    }

    @GetMapping("/enfant/{enfantId}")
    public ResponseEntity<List<SupleNutritionnel>> getSuplesByEnfantId(@PathVariable Long enfantId) {
        enfantAccesService.verifierAcces(enfantId);
        return ResponseEntity.ok(supleNutritionnelService.getSuplesByEnfantId(enfantId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupleNutritionnel> updateSupleNutritionnel(@PathVariable Long id, @RequestBody SupleNutritionnel supleDetails) {
        SupleNutritionnel existant = supleNutritionnelService.getSupleNutritionnelById(id);
        if (existant.getEnfant() != null && existant.getEnfant().getEnfantId() != null) {
            enfantAccesService.verifierAcces(existant.getEnfant().getEnfantId());
        }
        if (supleDetails != null && supleDetails.getEnfant() != null && supleDetails.getEnfant().getEnfantId() != null) {
            enfantAccesService.verifierAcces(supleDetails.getEnfant().getEnfantId());
        }
        return ResponseEntity.ok(supleNutritionnelService.updateSupleNutritionnel(id, supleDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSupleNutritionnel(@PathVariable Long id) {
        SupleNutritionnel existant = supleNutritionnelService.getSupleNutritionnelById(id);
        if (existant.getEnfant() != null && existant.getEnfant().getEnfantId() != null) {
            enfantAccesService.verifierAcces(existant.getEnfant().getEnfantId());
        }
        supleNutritionnelService.deleteSupleNutritionnel(id);
        return ResponseEntity.ok("Le supplément nutritionnel avec l'id " + id + " a bien été supprimé.");
    }
}