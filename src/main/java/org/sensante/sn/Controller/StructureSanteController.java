package org.sensante.sn.Controller;

import jakarta.validation.Valid;
import org.sensante.sn.Model.AgrementCren;
import org.sensante.sn.Model.StatutStructure;
import org.sensante.sn.Model.TypeStructure;
import org.sensante.sn.Service.StructureSanteService;
import org.sensante.sn.dto.CreateStructureRequest;
import org.sensante.sn.dto.StructureSanteDTO;
import org.sensante.sn.dto.StructureStatsDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/structures-sante")
public class StructureSanteController {

    private final StructureSanteService structureSanteService;

    public StructureSanteController(StructureSanteService structureSanteService) {
        this.structureSanteService = structureSanteService;
    }

    @GetMapping
    public ResponseEntity<List<StructureSanteDTO>> getStructures(
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) TypeStructure type,
            @RequestParam(required = false) StatutStructure statut,
            @RequestParam(required = false) AgrementCren cren,
            @RequestParam(required = false) String q
    ) {
        if (region != null || district != null || type != null || statut != null || cren != null || q != null) {
            return ResponseEntity.ok(structureSanteService.searchStructures(region, district, type, statut, cren, q));
        }
        return ResponseEntity.ok(structureSanteService.getAllStructuresSante());
    }

    @GetMapping("/stats")
    public ResponseEntity<StructureStatsDTO> getStats() {
        return ResponseEntity.ok(structureSanteService.getStats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StructureSanteDTO> getStructureById(@PathVariable Long id) {
        return ResponseEntity.ok(structureSanteService.getStructureSanteById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<StructureSanteDTO> createStructure(@Valid @RequestBody CreateStructureRequest request) {
        StructureSanteDTO created = structureSanteService.createStructureSante(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<StructureSanteDTO> updateStructure(
            @PathVariable Long id,
            @Valid @RequestBody CreateStructureRequest request
    ) {
        return ResponseEntity.ok(structureSanteService.updateStructureSante(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<Void> deleteStructure(@PathVariable Long id) {
        structureSanteService.deleteStructureSante(id);
        return ResponseEntity.noContent().build();
    }
}