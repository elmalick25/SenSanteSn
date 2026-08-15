package org.sensante.sn.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.sensante.sn.Model.SupleNutritionnel;
import org.sensante.sn.Service.SupleNutritionnelService;

import java.util.List;

@RestController
@RequestMapping("/api/suples-nutritionnels")
public class SupleNutritionnelController {

    private final SupleNutritionnelService supleNutritionnelService;

    public SupleNutritionnelController(SupleNutritionnelService supleNutritionnelService) {
        this.supleNutritionnelService = supleNutritionnelService;
    }

    @PostMapping
    public ResponseEntity<SupleNutritionnel> createSupleNutritionnel(@RequestBody SupleNutritionnel supleNutritionnel) {
        return ResponseEntity.ok(supleNutritionnelService.createSupleNutritionnel(supleNutritionnel));
    }

    @GetMapping
    public ResponseEntity<List<SupleNutritionnel>> getAllSupleNutritionnels() {
        return ResponseEntity.ok(supleNutritionnelService.getAllSupleNutritionnels());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupleNutritionnel> getSupleNutritionnelById(@PathVariable Long id) {
        return ResponseEntity.ok(supleNutritionnelService.getSupleNutritionnelById(id));
    }

    @GetMapping("/enfant/{enfantId}")
    public ResponseEntity<List<SupleNutritionnel>> getSuplesByEnfantId(@PathVariable Long enfantId) {
        return ResponseEntity.ok(supleNutritionnelService.getSuplesByEnfantId(enfantId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupleNutritionnel> updateSupleNutritionnel(@PathVariable Long id, @RequestBody SupleNutritionnel supleDetails) {
        return ResponseEntity.ok(supleNutritionnelService.updateSupleNutritionnel(id, supleDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSupleNutritionnel(@PathVariable Long id) {
        supleNutritionnelService.deleteSupleNutritionnel(id);
        return ResponseEntity.ok("Le supplément nutritionnel avec l'id " + id + " a bien été supprimé.");
    }
}