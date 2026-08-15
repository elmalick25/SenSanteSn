package org.sensante.sn.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.sensante.sn.Model.AlerteMAS;
import org.sensante.sn.Service.AlerteMASService;

import java.util.List;

@RestController
@RequestMapping("/api/alertes-mas")
public class AlerteMASController {

    private final AlerteMASService alerteMASService;

    public AlerteMASController(AlerteMASService alerteMASService) {
        this.alerteMASService = alerteMASService;
    }

    @PostMapping
    public ResponseEntity<AlerteMAS> createAlerte(@RequestBody AlerteMAS alerte) {
        return ResponseEntity.ok(alerteMASService.createAlerte(alerte));
    }

    @GetMapping
    public ResponseEntity<List<AlerteMAS>> getAllAlertes() {
        return ResponseEntity.ok(alerteMASService.getAllAlertes());
    }

    @GetMapping("/non-acquittees")
    public ResponseEntity<List<AlerteMAS>> getAlertesNonAcquittees() {
        return ResponseEntity.ok(alerteMASService.getAlertesNonAcquittees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlerteMAS> getAlerteById(@PathVariable Long id) {
        return ResponseEntity.ok(alerteMASService.getAlerteById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlerteMAS> updateAlerte(@PathVariable Long id, @RequestBody AlerteMAS alerteDetails) {
        return ResponseEntity.ok(alerteMASService.updateAlerte(id, alerteDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAlerte(@PathVariable Long id) {
        alerteMASService.deleteAlerte(id);
        return ResponseEntity.ok("L'alerte MAS avec l'id " + id + " a bien été supprimée.");
    }
}