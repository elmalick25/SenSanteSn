package org.sensante.sn.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.sensante.sn.Model.Utilisateur;
import org.sensante.sn.Service.UtilisateurService;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/utilisateurs")
@Tag(name = "Gestion des Utilisateurs & Comptes", description = "Administration des identités, profils utilisateurs et sécurité des accès")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Créer un nouvel utilisateur (administrateur uniquement)")
    public ResponseEntity<Utilisateur> createUtilisateur(@RequestBody Utilisateur utilisateur) {
        return ResponseEntity.ok(utilisateurService.createUtilisateur(utilisateur));
    }

    @GetMapping({"", "/users"})
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Lister l'ensemble des comptes utilisateurs")
    public ResponseEntity<List<Utilisateur>> getAllUtilisateurs() {
        return ResponseEntity.ok(utilisateurService.getAllUtilisateurs());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Obtenir les détails d'un utilisateur par son ID")
    public ResponseEntity<Utilisateur> getUtilisateurById(@PathVariable Long id) {
        return ResponseEntity.ok(utilisateurService.getUtilisateurById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Mettre à jour un compte utilisateur")
    public ResponseEntity<Utilisateur> updateUtilisateur(@PathVariable Long id, @RequestBody Utilisateur utilisateurDetails) {
        return ResponseEntity.ok(utilisateurService.updateUtilisateur(id, utilisateurDetails));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Obtenir le profil de l'utilisateur actuellement authentifié")
    public ResponseEntity<org.sensante.sn.dto.UserProfileDTO> getCurrentUserProfile(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(utilisateurService.getCurrentUserProfile(principal.getName()));
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Mettre à jour son propre profil")
    public ResponseEntity<org.sensante.sn.dto.UserProfileDTO> updateCurrentUserProfile(
            Principal principal,
            @RequestBody org.sensante.sn.dto.UserProfileUpdateDTO dto) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(utilisateurService.updateCurrentUserProfile(principal.getName(), dto));
    }

    @PutMapping("/me/password")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Changer son propre mot de passe")
    public ResponseEntity<Map<String, String>> changePassword(
            Principal principal,
            @RequestBody org.sensante.sn.dto.ChangePasswordDTO dto) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        utilisateurService.changePassword(principal.getName(), dto);
        return ResponseEntity.ok(Map.of("message", "Mot de passe mis à jour avec succès."));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Supprimer un compte utilisateur (administrateur uniquement)")
    public ResponseEntity<String> deleteUtilisateur(@PathVariable Long id) {
        utilisateurService.deleteUtilisateur(id);
        return ResponseEntity.ok("L'utilisateur avec l'id " + id + " a bien été supprimé.");
    }
}