package org.sensante.sn.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.sensante.sn.Model.AuditLog;
import org.sensante.sn.Service.AuditLoggingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@Tag(name = "Audit & Conformité MSAS", description = "Endpoints de consultation des pistes d'audit légales et scellés SHA-256")
@PreAuthorize("hasRole('ADMINISTRATEUR')")
public class AuditController {

    private final AuditLoggingService auditLoggingService;

    public AuditController(AuditLoggingService auditLoggingService) {
        this.auditLoggingService = auditLoggingService;
    }

    @GetMapping
    @Operation(summary = "Lister les journaux d'audit de manière paginée")
    public ResponseEntity<Page<AuditLog>> getLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Page<AuditLog> result = auditLoggingService.getLogsPagine(PageRequest.of(page, size, sort));
        return ResponseEntity.ok(result);
    }

    @GetMapping("/recents")
    @Operation(summary = "Obtenir les 50 derniers événements d'audit scellés")
    public ResponseEntity<List<AuditLog>> getDerniersLogs() {
        return ResponseEntity.ok(auditLoggingService.getDerniersLogs());
    }
}
