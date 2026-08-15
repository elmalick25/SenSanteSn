package org.sensante.sn.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.sensante.sn.Model.BilanAntro;
import org.sensante.sn.Service.BilanAnthroService;

import java.util.List;

@RestController
@RequestMapping("/api/bilan-anthro")
public class BilanAnthroController {

    private final BilanAnthroService bilanAnthroService;

    public BilanAnthroController(BilanAnthroService bilanAnthroService) {
        this.bilanAnthroService = bilanAnthroService;
    }

    @PostMapping
    public ResponseEntity<BilanAntro> createBilan(@RequestBody BilanAntro bilan) {
        return ResponseEntity.ok(bilanAnthroService.createBilan(bilan));
    }

    @GetMapping
    public ResponseEntity<List<BilanAntro>> getAllBilans() {
        return ResponseEntity.ok(bilanAnthroService.getAllBilans());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BilanAntro> getBilanById(@PathVariable Long id) {
        return ResponseEntity.ok(bilanAnthroService.getBilanById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BilanAntro> updateBilan(@PathVariable Long id, @RequestBody BilanAntro bilanDetails) {
        return ResponseEntity.ok(bilanAnthroService.updateBilan(id, bilanDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBilan(@PathVariable Long id) {
        bilanAnthroService.deleteBilan(id);
        return ResponseEntity.ok("Le bilan anthropométrique avec l'id " + id + " a bien été supprimé.");
    }
}