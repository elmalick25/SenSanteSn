package org.sensante.sn.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.sensante.sn.Model.Rapport;
import org.sensante.sn.Service.RapportService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/rapports")
@Tag(name = "Rapports d'Activité Sanitaire", description = "Consolidation et archivage des rapports de district et structures")
@PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
public class RapportController {

    private final RapportService rapportService;

    public RapportController(RapportService rapportService) {
        this.rapportService = rapportService;
    }

    @PostMapping
    public ResponseEntity<Rapport> createRapport(@RequestBody Rapport rapport) {
        return ResponseEntity.ok(rapportService.createRapport(rapport));
    }

    @GetMapping
    public ResponseEntity<List<Rapport>> getAllRapports() {
        return ResponseEntity.ok(rapportService.getAllRapports());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rapport> getRapportById(@PathVariable Long id) {
        return ResponseEntity.ok(rapportService.getRapportById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Rapport> updateRapport(@PathVariable Long id, @RequestBody Rapport rapportDetails) {
        return ResponseEntity.ok(rapportService.updateRapport(id, rapportDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRapport(@PathVariable Long id) {
        rapportService.deleteRapport(id);
        return ResponseEntity.ok("Le rapport avec l'id " + id + " a bien été supprimé.");
    }
}