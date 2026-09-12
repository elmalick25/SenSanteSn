package org.sensante.sn.Controller;

import org.sensante.sn.Service.MedecinProfilService;
import org.sensante.sn.dto.MedecinProfilDTO;
import org.sensante.sn.dto.UpdateMedecinProfilRequest;
import org.sensante.sn.dto.UpdateMedecinProfilResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;

/**
 * REST Controller — Espace Médecin : Mon Profil & Réglages Praticien.
 *
 * Base URL : /api/medecin/profil
 */
@RestController
@RequestMapping("/api/medecin/profil")
@Tag(name = "Médecin — Profil & Paramètres", description = "Gestion du profil praticien, ordonnerie et signatures")
@PreAuthorize("hasAnyRole('MEDECIN', 'ADMINISTRATEUR')")
public class MedecinProfilController {

    private final MedecinProfilService service;

    public MedecinProfilController(MedecinProfilService service) {
        this.service = service;
    }

    /**
     * GET /api/medecin/profil
     * Récupère le profil certifié du Dr. Babacar Fall.
     */
    @GetMapping
    public ResponseEntity<MedecinProfilDTO> getProfil() {
        return ResponseEntity.ok(service.getProfil());
    }

    /**
     * PUT /api/medecin/profil
     * Met à jour les coordonnées et préférences du médecin.
     */
    @PutMapping
    public ResponseEntity<UpdateMedecinProfilResponse> updateProfil(@RequestBody UpdateMedecinProfilRequest request) {
        return ResponseEntity.ok(service.updateProfil(request));
    }
}
