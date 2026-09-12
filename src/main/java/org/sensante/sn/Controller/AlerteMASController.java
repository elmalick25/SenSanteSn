package org.sensante.sn.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.sensante.sn.Model.AlerteMAS;
import org.sensante.sn.Service.AlerteMASService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertes-mas")
@Tag(name = "Alertes MAS & Dépistage d'Urgence", description = "Gestion des alertes de malnutrition aiguë sévère et circuits de référence d'urgence")
@PreAuthorize("hasAnyRole('AGENT_SANTE', 'MEDECIN', 'SUPERVISEUR', 'ADMINISTRATEUR')")
public class AlerteMASController {

    private final AlerteMASService alerteMASService;

    public AlerteMASController(AlerteMASService alerteMASService) {
        this.alerteMASService = alerteMASService;
    }

    @PostMapping
    @Operation(summary = "Déclencher une nouvelle alerte de malnutrition aiguë sévère (MAS)")
    public ResponseEntity<AlerteMAS> createAlerte(@RequestBody AlerteMAS alerte) {
        return ResponseEntity.ok(alerteMASService.createAlerte(alerte));
    }

    @GetMapping
    @Operation(summary = "Lister l'ensemble des alertes MAS")
    public ResponseEntity<List<AlerteMAS>> getAllAlertes() {
        return ResponseEntity.ok(alerteMASService.getAllAlertes());
    }

    @GetMapping("/paginees")
    @Operation(summary = "Obtenir les alertes MAS non acquittées de manière paginée")
    public ResponseEntity<Page<AlerteMAS>> getAlertesPaginees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        return ResponseEntity.ok(alerteMASService.getAlertesNonAcquitteesPaginees(
                PageRequest.of(page, size, Sort.by("dateAlerte").descending())));
    }

    @GetMapping("/non-acquittees")
    @Operation(summary = "Lister les alertes MAS en cours non encore acquittées")
    public ResponseEntity<List<AlerteMAS>> getAlertesNonAcquittees() {
        return ResponseEntity.ok(alerteMASService.getAlertesNonAcquittees());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consulter le détail d'une alerte MAS")
    public ResponseEntity<AlerteMAS> getAlerteById(@PathVariable Long id) {
        return ResponseEntity.ok(alerteMASService.getAlerteById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour le statut ou acquitter une alerte MAS")
    public ResponseEntity<AlerteMAS> updateAlerte(@PathVariable Long id, @RequestBody AlerteMAS alerteDetails) {
        return ResponseEntity.ok(alerteMASService.updateAlerte(id, alerteDetails));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Supprimer une alerte MAS (réservé aux administrateurs)")
    public ResponseEntity<String> deleteAlerte(@PathVariable Long id) {
        alerteMASService.deleteAlerte(id);
        return ResponseEntity.ok("L'alerte MAS avec l'id " + id + " a bien été supprimée.");
    }
}