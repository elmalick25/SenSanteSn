package org.sensante.sn.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.sensante.sn.Model.Superviseur;
import org.sensante.sn.Service.SuperviseurService;

import java.util.List;

@RestController
@RequestMapping("/api/superviseurs")
public class SuperviseurController {

    private final SuperviseurService superviseurService;

    public SuperviseurController(SuperviseurService superviseurService) {
        this.superviseurService = superviseurService;
    }

    @PostMapping
    public ResponseEntity<Superviseur> createSuperviseur(@RequestBody Superviseur superviseur) {
        return ResponseEntity.ok(superviseurService.createSuperviseur(superviseur));
    }

    @GetMapping
    public ResponseEntity<List<Superviseur>> getAllSuperviseurs() {
        return ResponseEntity.ok(superviseurService.getAllSuperviseurs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Superviseur> getSuperviseurById(@PathVariable Long id) {
        return ResponseEntity.ok(superviseurService.getSuperviseurById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Superviseur> updateSuperviseur(@PathVariable Long id, @RequestBody Superviseur superviseurDetails) {
        return ResponseEntity.ok(superviseurService.updateSuperviseur(id, superviseurDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSuperviseur(@PathVariable Long id) {
        superviseurService.deleteSuperviseur(id);
        return ResponseEntity.ok("Le superviseur avec l'id " + id + " a bien été supprimé.");
    }
}