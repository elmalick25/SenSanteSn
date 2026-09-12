package org.sensante.sn.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.sensante.sn.Model.Enfant;
import org.sensante.sn.Model.Utilisateur;
import org.sensante.sn.Repository.UtilisateurRepository;
import org.sensante.sn.Service.EnfantAccesService;
import org.sensante.sn.Service.EnfantService;
import org.sensante.sn.exception.RessourceNonTrouveeException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enfants")
@Tag(name = "Dossiers Pédiatriques", description = "Gestion des enfants, enrollement biométrique et carnet sanitaire")
public class EnfantController {

    private final EnfantService enfantService;
    private final UtilisateurRepository utilisateurRepository;
    private final EnfantAccesService enfantAccesService;

    public EnfantController(EnfantService enfantService,
                            UtilisateurRepository utilisateurRepository,
                            EnfantAccesService enfantAccesService) {
        this.enfantService = enfantService;
        this.utilisateurRepository = utilisateurRepository;
        this.enfantAccesService = enfantAccesService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PARENT', 'AGENT_SANTE', 'MEDECIN', 'ADMINISTRATEUR')")
    @Operation(summary = "Enregistrer un nouveau dossier pédiatrique")
    public ResponseEntity<Enfant> createEnfant(@RequestBody Enfant enfant) {
        // Un parent ne peut créer un dossier que pour lui-même : on force le
        // rattachement au compte connecté, quelle que soit la charge utile reçue.
        Utilisateur courant = enfantAccesService.utilisateurCourant();
        if (!enfantAccesService.estProfessionnel(courant)) {
            enfant.setParent(courant);
            if (enfant.getTelephoneParent() == null || enfant.getTelephoneParent().isBlank()) {
                enfant.setTelephoneParent(courant.getTelephone());
            }
        }
        return ResponseEntity.ok(enfantService.createEnfant(enfant));
    }

    @GetMapping("/mes-enfants")
    @PreAuthorize("hasAnyRole('PARENT', 'AGENT_SANTE', 'MEDECIN', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    @Operation(summary = "Lister les enfants associés au compte parent connecté")
    public ResponseEntity<List<Enfant>> getMesEnfants(@AuthenticationPrincipal UserDetails userDetails) {
        // Isolation stricte : uniquement les dossiers rattachés au compte connecté.
        // Aucun repli sur des données de démonstration : un nouveau compte voit
        // une liste vide, jamais les enfants d'autres familles.
        return ResponseEntity.ok(enfantAccesService.mesEnfants());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Lister tous les enfants (réservé aux administrateurs)")
    public ResponseEntity<List<Enfant>> getAllEnfants(@RequestParam(required = false) String telephoneParent) {
        if (telephoneParent != null && !telephoneParent.trim().isEmpty()) {
            return ResponseEntity.ok(enfantService.getEnfantsByTelephoneParent(telephoneParent));
        }
        return ResponseEntity.ok(enfantService.getAllEnfants());
    }

    @GetMapping("/pagines")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'SUPERVISEUR', 'MEDECIN')")
    @Operation(summary = "Obtenir la cohorte des enfants de manière paginée et triée")
    public ResponseEntity<Page<Enfant>> getEnfantsPagines(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "nom") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return ResponseEntity.ok(enfantService.getEnfantsPagine(PageRequest.of(page, size, sort)));
    }

    @GetMapping("/parent/{telephone}")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'MEDECIN', 'ADMINISTRATEUR')")
    @Operation(summary = "Rechercher les enfants par téléphone du tuteur légal")
    public ResponseEntity<List<Enfant>> getEnfantsByParentTelephone(@PathVariable String telephone) {
        return ResponseEntity.ok(enfantService.getEnfantsByTelephoneParent(telephone));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PARENT', 'AGENT_SANTE', 'MEDECIN', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    @Operation(summary = "Obtenir les détails d'un enfant par son identifiant unique")
    public ResponseEntity<Enfant> getEnfantById(@PathVariable Long id) {
        return ResponseEntity.ok(enfantAccesService.verifierAcces(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'MEDECIN', 'ADMINISTRATEUR')")
    @Operation(summary = "Mettre à jour les informations du dossier pédiatrique")
    public ResponseEntity<Enfant> updateEnfant(@PathVariable Long id, @RequestBody Enfant enfantDetails) {
        return ResponseEntity.ok(enfantService.updateEnfant(id, enfantDetails));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @Operation(summary = "Supprimer un dossier pédiatrique (administrateur uniquement)")
    public ResponseEntity<String> deleteEnfant(@PathVariable Long id) {
        enfantService.deleteEnfant(id);
        return ResponseEntity.ok("L'enfant avec l'id " + id + " a bien été supprimé.");
    }
}