package org.sensante.sn.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.sensante.sn.Model.Enfant;
import org.sensante.sn.Service.EnfantService;

import java.util.List;

@RestController
@RequestMapping("/api/enfants")
public class EnfantController {

    private final EnfantService enfantService;

    public EnfantController(EnfantService enfantService) {
        this.enfantService = enfantService;
    }

    @PostMapping
    public ResponseEntity<Enfant> createEnfant(@RequestBody Enfant enfant) {
        return ResponseEntity.ok(enfantService.createEnfant(enfant));
    }

    @GetMapping
    public ResponseEntity<List<Enfant>> getAllEnfants() {
        return ResponseEntity.ok(enfantService.getAllEnfants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Enfant> getEnfantById(@PathVariable Long id) {
        return ResponseEntity.ok(enfantService.getEnfantById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Enfant> updateEnfant(@PathVariable Long id, @RequestBody Enfant enfantDetails) {
        return ResponseEntity.ok(enfantService.updateEnfant(id, enfantDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEnfant(@PathVariable Long id) {
        enfantService.deleteEnfant(id);
        return ResponseEntity.ok("L'enfant avec l'id " + id + " a bien été supprimé.");
    }
}