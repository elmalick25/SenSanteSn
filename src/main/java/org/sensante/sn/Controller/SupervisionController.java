package org.sensante.sn.Controller;

import lombok.RequiredArgsConstructor;
import org.sensante.sn.Service.SupervisionService;
import org.sensante.sn.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/supervision")
@RequiredArgsConstructor
public class SupervisionController {

    private final SupervisionService supervisionService;

    @GetMapping("/command-center")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<SupervisionCommandCenterDTO> getCommandCenterOverview(Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(supervisionService.getCommandCenterOverview(username));
    }

    @PostMapping("/deploiement-equipe")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<DeploiementEquipeResponse> deployerEquipe(
            @RequestBody(required = false) DeploiementEquipeRequest request,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(supervisionService.deployerEquipe(request, username));
    }

    @PostMapping("/alertes/{id}/acquitter")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<Map<String, Object>> acquitterAlerte(
            @PathVariable Long id,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(supervisionService.acquitterAlerte(id, username));
    }

    @PostMapping("/export-pdf")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<Map<String, Object>> exportPdf(Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(supervisionService.exporterSynthesePdf(username));
    }

    // ==========================================
    // MODULE CARTOGRAPHIE & MISSIONS ENDPOINTS
    // ==========================================

    @GetMapping("/missions")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<java.util.List<MissionTerrainDTO>> getMissions(
            @RequestParam(required = false) String statut,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(supervisionService.getMissions(statut, search));
    }

    @GetMapping("/missions/overview")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<MissionsOverviewDTO> getMissionsOverview() {
        return ResponseEntity.ok(supervisionService.getMissionsOverview());
    }

    @PostMapping("/missions")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<MissionTerrainDTO> createMission(
            @RequestBody CreateMissionRequest request,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(supervisionService.createMission(request, username));
    }

    @PutMapping("/missions/{id}/statut")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<MissionTerrainDTO> updateMissionStatut(
            @PathVariable Long id,
            @RequestParam org.sensante.sn.Model.StatutMission statut,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(supervisionService.updateMissionStatut(id, statut, username));
    }

    @PostMapping("/missions/export-dhis2")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<Map<String, Object>> exportMissionsDhis2() {
        return ResponseEntity.ok(supervisionService.exportMissionsDhis2());
    }

    // ==========================================
    // MODULE VALIDATION DES RAPPORTS ENDPOINTS
    // ==========================================

    @GetMapping("/validation/queue")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<java.util.List<RapportValidationSummaryDTO>> getValidationQueue(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String tri) {
        return ResponseEntity.ok(supervisionService.getValidationQueue(type, search, tri));
    }

    @GetMapping("/validation/overview")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<ValidationQueueOverviewDTO> getValidationOverview() {
        return ResponseEntity.ok(supervisionService.getValidationOverview());
    }

    @GetMapping("/validation/{id}")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<RapportValidationDTO> getRapportDetail(@PathVariable Long id) {
        return ResponseEntity.ok(supervisionService.getRapportDetail(id));
    }

    @PostMapping("/validation/{id}/valider")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<RapportValidationDTO> validerRapport(
            @PathVariable Long id,
            @RequestBody(required = false) ValiderRapportRequest request) {
        return ResponseEntity.ok(supervisionService.validerRapport(id, request));
    }

    @PostMapping("/validation/{id}/complement")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<RapportValidationDTO> demanderComplement(
            @PathVariable Long id,
            @RequestBody DemanderComplementRequest request) {
        return ResponseEntity.ok(supervisionService.demanderComplement(id, request));
    }

    @PostMapping("/validation/valider-lot")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<Map<String, Object>> validerLot(@RequestBody(required = false) java.util.List<Long> ids) {
        int count = supervisionService.validerLot(ids);
        return ResponseEntity.ok(Map.of("message", "Lot validé avec succès", "rapportsValides", count));
    }

    // ==========================================
    // MODULE RAPPORTS QUOTIDIENS & TÉLÉMÉTRIE
    // ==========================================

    @GetMapping("/rapports-quotidiens/telemetrie")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<RapportJournalierTelemetrieDTO> getRapportJournalierTelemetrie(
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate date) {
        return ResponseEntity.ok(supervisionService.getRapportJournalierTelemetrie(date));
    }

    @PostMapping("/rapports-quotidiens/cloturer")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<ClotureJourneeResponse> cloturerJournee(
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate date,
            @RequestBody(required = false) ClotureJourneeRequest request,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(supervisionService.cloturerJourneeDistrict(date, request, username));
    }

    @PostMapping("/rapports-quotidiens/notifier-defaillants")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<Map<String, Object>> notifierDefaillants(
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate date) {
        return ResponseEntity.ok(supervisionService.notifierPostesDefaillants(date));
    }

    @PostMapping("/rapports-quotidiens/export")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<Map<String, Object>> exportTelemetrie(
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate date) {
        return ResponseEntity.ok(supervisionService.exportDonneesBrutesTelemetrie(date));
    }

    // ==========================================
    // MODULE STOCKS ATPE & INTRANTS NUTRITIONNELS
    // ==========================================

    @GetMapping("/stocks-atpe/overview")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<StocksAtpeOverviewDTO> getStocksAtpeOverview() {
        return ResponseEntity.ok(supervisionService.getStocksAtpeOverview());
    }

    @PostMapping("/stocks-atpe/transfert")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<TransfertPerequationResponse> executerTransfert(
            @RequestBody TransfertPerequationRequest request) {
        return ResponseEntity.ok(supervisionService.executerTransfertPerequation(request));
    }

    @PostMapping("/stocks-atpe/reappro-pna")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<OrdreReapproPnaResponse> commanderPna(
            @RequestBody(required = false) OrdreReapproPnaRequest request) {
        return ResponseEntity.ok(supervisionService.creerOrdreReapproPna(request));
    }

    @GetMapping("/stocks-atpe/export-sigl")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<Map<String, Object>> exportSigl() {
        return ResponseEntity.ok(supervisionService.exportSiglStocks());
    }

    // =========================================================================
    // VUE 6 — EXPORTS DHIS2 & REGISTRES NATIONAUX
    // =========================================================================

    /**
     * Vue d'ensemble du Studio Télémétrie DHIS2 — RMAN.
     * Consolide KPIs, historique mensuel, SPHERE, objectifs PRN et archives bordereaux.
     */
    @GetMapping("/dhis2/overview")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<Dhis2StudioOverviewDTO> getDhis2StudioOverview(
            @RequestParam(required = false) String periode) {
        return ResponseEntity.ok(supervisionService.getDhis2StudioOverview(periode));
    }

    /**
     * Télétransmission officielle du bordereau RMAN vers l'instance nationale DHIS2 MSAS v2.40.
     * Génère un accusé de réception cryptographique (SHA-256) horodaté.
     */
    @PostMapping("/dhis2/teletransmettre")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<TeletransmissionDhis2Response> teletransmettreDhis2(
            @RequestBody(required = false) TeletransmissionDhis2Request request) {
        return ResponseEntity.ok(supervisionService.teletransmettreDhis2(request));
    }

    /**
     * Export des données DHIS2 dans le format demandé (json / xml / csv).
     * Conforme au standard DHIS2 DXF2 API v2.40.
     */
    @GetMapping("/dhis2/export")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<Map<String, Object>> exportDhis2Data(
            @RequestParam(defaultValue = "csv") String format,
            @RequestParam(required = false) String periode) {
        return ResponseEntity.ok(supervisionService.exportDhis2Data(format, periode));
    }

    /**
     * Génère le bordereau RMAN au format PDF certifié (Directive MSAS/DSME-2024-018).
     */
    @GetMapping("/dhis2/bordereau-pdf")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<Map<String, Object>> genererBordereauPdf(
            @RequestParam(required = false) String uuid) {
        return ResponseEntity.ok(supervisionService.genererBordereauPdf(uuid));
    }

    // =========================================================================
    // VUE 7 — MON PROFIL SUPERVISEUR (MCD DAKAR OUEST)
    // =========================================================================

    /**
     * Récupère le profil officiel et les accréditations MSAS du Médecin Chef de District.
     */
    @GetMapping("/profil")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<SupervisorProfileDTO> getSupervisorProfile(Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(supervisionService.getSupervisorProfile(username));
    }

    /**
     * Met à jour les coordonnées et préférences du superviseur avec transmission MSAS.
     */
    @PutMapping("/profil")
    @PreAuthorize("hasAnyRole('SUPERVISEUR', 'ADMINISTRATEUR')")
    public ResponseEntity<SupervisorProfileDTO> updateSupervisorProfile(
            Principal principal,
            @RequestBody SupervisorProfileUpdateDTO dto) {
        String username = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(supervisionService.updateSupervisorProfile(username, dto));
    }
}
