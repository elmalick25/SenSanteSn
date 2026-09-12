package org.sensante.sn.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.sensante.sn.Model.FicheSuivi;
import org.sensante.sn.Service.FicheSuiviService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/fiches-suivi")
@Tag(name = "Fiches de Suivi Nutritionnel", description = "Gestion des fiches de suivi terrain, visites à domicile et évolution clinique")
@PreAuthorize("hasAnyRole('AGENT_SANTE', 'MEDECIN', 'SUPERVISEUR', 'ADMINISTRATEUR')")
public class FicheSuiviController {

    private final FicheSuiviService ficheSuiviService;

    public FicheSuiviController(FicheSuiviService ficheSuiviService) {
        this.ficheSuiviService = ficheSuiviService;
    }

    @PostMapping
    public ResponseEntity<FicheSuivi> createFicheSuivi(@RequestBody FicheSuivi ficheSuivi) {
        return ResponseEntity.ok(ficheSuiviService.createFicheSuivi(ficheSuivi));
    }

    @GetMapping
    public ResponseEntity<List<FicheSuivi>> getAllFichesSuivi() {
        return ResponseEntity.ok(ficheSuiviService.getAllFichesSuivi());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FicheSuivi> getFicheSuiviById(@PathVariable Long id) {
        return ResponseEntity.ok(ficheSuiviService.getFicheSuiviById(id));
    }

    @GetMapping("/enfant/{enfantId}")
    public ResponseEntity<List<FicheSuivi>> getFichesByEnfantId(@PathVariable Long enfantId) {
        return ResponseEntity.ok(ficheSuiviService.getFichesByEnfantId(enfantId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FicheSuivi> updateFicheSuivi(@PathVariable Long id, @RequestBody FicheSuivi ficheDetails) {
        return ResponseEntity.ok(ficheSuiviService.updateFicheSuivi(id, ficheDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFicheSuivi(@PathVariable Long id) {
        ficheSuiviService.deleteFicheSuivi(id);
        return ResponseEntity.ok("La fiche de suivi avec l'id " + id + " a bien été supprimée.");
    }
}