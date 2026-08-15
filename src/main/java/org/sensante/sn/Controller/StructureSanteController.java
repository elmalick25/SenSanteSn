package org.sensante.sn.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.sensante.sn.Model.StructureSante;
import org.sensante.sn.Service.StructureSanteService;

import java.util.List;

@RestController
@RequestMapping("/api/structures-sante")
public class StructureSanteController {

    private final StructureSanteService structureSanteService;

    public StructureSanteController(StructureSanteService structureSanteService) {
        this.structureSanteService = structureSanteService;
    }

    @PostMapping
    public ResponseEntity<StructureSante> createStructureSante(@RequestBody StructureSante structureSante) {
        return ResponseEntity.ok(structureSanteService.createStructureSante(structureSante));
    }

    @GetMapping
    public ResponseEntity<List<StructureSante>> getAllStructuresSante() {
        return ResponseEntity.ok(structureSanteService.getAllStructuresSante());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StructureSante> getStructureSanteById(@PathVariable Long id) {
        return ResponseEntity.ok(structureSanteService.getStructureSanteById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StructureSante> updateStructureSante(@PathVariable Long id, @RequestBody StructureSante structureDetails) {
        return ResponseEntity.ok(structureSanteService.updateStructureSante(id, structureDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStructureSante(@PathVariable Long id) {
        structureSanteService.deleteStructureSante(id);
        return ResponseEntity.ok("La structure de santé avec l'id " + id + " a bien été supprimée.");
    }
}