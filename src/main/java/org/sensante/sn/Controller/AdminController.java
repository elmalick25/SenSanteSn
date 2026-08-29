package org.sensante.sn.Controller;

import jakarta.validation.Valid;
import org.sensante.sn.Service.AuthService;
import org.sensante.sn.dto.RegisterRequest;
import org.sensante.sn.dto.UtilisateurResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AuthService authService;

    public AdminController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/utilisateurs")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<UtilisateurResponseDTO> creerUtilisateur(
            @Valid @RequestBody RegisterRequest request) {
        UtilisateurResponseDTO created = authService.registerProfessionnel(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
