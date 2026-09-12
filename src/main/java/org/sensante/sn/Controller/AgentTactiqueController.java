package org.sensante.sn.Controller;

import lombok.RequiredArgsConstructor;
import org.sensante.sn.Service.AgentTactiqueService;
import org.sensante.sn.dto.ActionTactiqueRequest;
import org.sensante.sn.dto.ActionTactiqueResponse;
import org.sensante.sn.dto.AgentTactiqueOverviewDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/agent/tactique")
@RequiredArgsConstructor
public class AgentTactiqueController {

    private final AgentTactiqueService agentTactiqueService;

    @GetMapping("/overview")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<AgentTactiqueOverviewDTO> getOverview(
            @RequestParam(name = "filtreStatut", required = false) String filtreStatut,
            @RequestParam(name = "secteur", required = false) String secteur,
            @RequestParam(name = "trancheAge", required = false) String trancheAge,
            @RequestParam(name = "query", required = false) String query,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(agentTactiqueService.getTactiqueOverview(username, filtreStatut, secteur, trancheAge, query));
    }

    @PostMapping("/nouveau-triage")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<ActionTactiqueResponse> enregistrerNouveauTriage(
            @RequestBody org.sensante.sn.dto.NouveauTriageRequest request,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(agentTactiqueService.enregistrerNouveauTriage(request, username));
    }

    @PostMapping("/alertes/{id}/acquitter")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<ActionTactiqueResponse> acquitterAlerte(
            @PathVariable("id") Long id,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(agentTactiqueService.acquitterAlerte(id, username));
    }

    @PostMapping("/enfants/{id}/refer-samu")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<ActionTactiqueResponse> refererSamu(
            @PathVariable("id") Long id,
            @RequestBody(required = false) ActionTactiqueRequest request,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        String motif = (request != null && request.getMotif() != null) ? request.getMotif() : "Urgence MAS sévère";
        return ResponseEntity.ok(agentTactiqueService.refererSamu(id, motif, username));
    }

    @PostMapping("/enfants/{id}/dispenser-atpe")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<ActionTactiqueResponse> dispenserAtpe(
            @PathVariable("id") Long id,
            @RequestBody(required = false) ActionTactiqueRequest request,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        Integer rations = (request != null && request.getNombreRations() != null) ? request.getNombreRations() : 14;
        return ResponseEntity.ok(agentTactiqueService.dispenserAtpe(id, rations, username));
    }

    @PostMapping("/enfants/{id}/planifier-visite")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<ActionTactiqueResponse> planifierVisite(
            @PathVariable Long id,
            @RequestBody(required = false) ActionTactiqueRequest request,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        String dateVisite = (request != null && request.getDateVisite() != null) ? request.getDateVisite() : "Demain 10h00";
        String notes = (request != null && request.getNotes() != null) ? request.getNotes() : "Visite de suivi nutritionnel";
        return ResponseEntity.ok(agentTactiqueService.planifierVisite(id, dateVisite, notes, username));
    }

    @PostMapping("/sync")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<ActionTactiqueResponse> synchroniserDonnees(Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(agentTactiqueService.synchroniserDonnees(username));
    }

    // ==========================================
    // MODULE SCANNER QR & FICHE EXPRESS
    // ==========================================

    @GetMapping("/scanner/fiche/{matricule}")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<org.sensante.sn.dto.FicheExpressDTO> getFicheExpress(
            @PathVariable String matricule) {
        return ResponseEntity.ok(agentTactiqueService.getFicheExpress(matricule));
    }

    @GetMapping("/scanner/recents")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<java.util.List<org.sensante.sn.dto.ScanRecentDTO>> getScansRecents() {
        return ResponseEntity.ok(agentTactiqueService.getScansRecents());
    }

    @PostMapping("/scanner/bilan")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<ActionTactiqueResponse> enregistrerNouveauBilan(
            @RequestBody org.sensante.sn.dto.NouveauBilanRequest request,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(agentTactiqueService.enregistrerNouveauBilan(request, username));
    }

    @PostMapping("/scanner/atpe")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<ActionTactiqueResponse> delivrerAtpeExpress(
            @RequestBody org.sensante.sn.dto.DelivranceAtpeRequest request,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(agentTactiqueService.delivrerAtpeExpress(request, username));
    }

    @PostMapping("/scanner/alerte-samu")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<ActionTactiqueResponse> declencherAlerteSamu(
            @RequestParam String matricule,
            @RequestParam(required = false, defaultValue = "Détresse respiratoire / Urgence vitale") String motif,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(agentTactiqueService.declencherAlerteSamu(matricule, motif, username));
    }

    // ==========================================
    // MODULE TRIAGE RDV & MATRICE MULTI-BOX
    // ==========================================

    @GetMapping("/triage/file")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<java.util.List<org.sensante.sn.dto.PatientTriageDTO>> getFileAttenteClinique(
            @RequestParam(required = false) String filtre) {
        return ResponseEntity.ok(agentTactiqueService.getFileAttenteClinique(filtre));
    }

    @GetMapping("/triage/matrice")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<org.sensante.sn.dto.MatriceTriageDTO> getMatriceAttribution(
            @RequestParam(required = false) String date) {
        return ResponseEntity.ok(agentTactiqueService.getMatriceAttribution(date));
    }

    @GetMapping("/triage/ticket/{patientId}")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<org.sensante.sn.dto.TicketAdmissionDTO> getTicketAdmission(
            @PathVariable Long patientId) {
        return ResponseEntity.ok(agentTactiqueService.getTicketAdmission(patientId));
    }

    @PostMapping("/triage/assigner")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<ActionTactiqueResponse> assignerSlotPatient(
            @RequestBody org.sensante.sn.dto.AssignationSlotRequest request,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(agentTactiqueService.assignerSlotPatient(request, username));
    }

    // ==========================================
    // MODULE CARTE DES ZONES & RADAR CONCESSIONS
    // ==========================================

    @GetMapping("/carte/overview")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<org.sensante.sn.dto.ZoneCarteOverviewDTO> getZoneCarteOverview(
            @RequestParam(required = false, defaultValue = "Secteur 4") String secteur,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(agentTactiqueService.getZoneCarteOverview(secteur, username));
    }

    @GetMapping("/carte/concessions/{id}")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<org.sensante.sn.dto.ConcessionZoneDTO> getConcessionDetails(
            @PathVariable String id) {
        return ResponseEntity.ok(agentTactiqueService.getConcessionDetails(id));
    }

    @PostMapping("/carte/releve")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<ActionTactiqueResponse> enregistrerReleveTerrain(
            @RequestBody org.sensante.sn.dto.ReleveTerrainRequest request,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(agentTactiqueService.enregistrerReleveTerrain(request, username));
    }

    // ==========================================
    // MODULE CLÔTURE DU JOUR & TRANSMISSION DISTRICT
    // ==========================================

    @GetMapping("/cloture/overview")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<org.sensante.sn.dto.ClotureRegistreOverviewDTO> getClotureRegistreOverview(
            @RequestParam(required = false) String date,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(agentTactiqueService.getClotureRegistreOverview(date, username));
    }

    @PostMapping("/cloture/transmettre")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<ActionTactiqueResponse> transmettreClotureDistrict(
            @RequestBody org.sensante.sn.dto.TransmissionDistrictRequest request,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(agentTactiqueService.transmettreClotureDistrict(request, username));
    }

    @PostMapping("/cloture/generer-pdf")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<ActionTactiqueResponse> genererBordereauPdf(
            @RequestParam(required = false) String date,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(agentTactiqueService.genererBordereauPdf(date, username));
    }

    // ==========================================
    // MODULE MON PROFIL & RÉGLAGES AGENT
    // ==========================================

    @GetMapping("/profil")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<org.sensante.sn.dto.AgentProfilDTO> getAgentProfil(Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(agentTactiqueService.getAgentProfil(username));
    }

    @PutMapping("/profil")
    @PreAuthorize("hasAnyRole('AGENT_SANTE', 'SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<ActionTactiqueResponse> updateAgentProfil(
            @RequestBody org.sensante.sn.dto.UpdateAgentProfilRequest request,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(agentTactiqueService.updateAgentProfil(request, username));
    }
}

