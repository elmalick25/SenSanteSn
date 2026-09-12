package org.sensante.sn.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.sensante.sn.Model.Enfant;
import org.sensante.sn.Repository.EnfantRepository;
import org.sensante.sn.exception.RessourceNonTrouveeException;

import java.util.List;

@Service
public class EnfantService {

    private final EnfantRepository enfantRepository;
    private final AuditLoggingService auditLoggingService;

    public EnfantService(EnfantRepository enfantRepository, AuditLoggingService auditLoggingService) {
        this.enfantRepository = enfantRepository;
        this.auditLoggingService = auditLoggingService;
    }

    public Enfant createEnfant(Enfant enfant) {
        if (enfant.getQrCode() == null || enfant.getQrCode().isBlank()) {
            long suffix = (System.currentTimeMillis() % 900) + 100;
            enfant.setQrCode("SN-DKR-2025-" + suffix);
        }
        Enfant saved = enfantRepository.save(enfant);
        auditLoggingService.logAction("CREATION_DOSSIER_PEDIATRIQUE", "ENFANT", saved.getEnfantId(),
                String.format("Création dossier pédiatrique pour %s %s (NIP: %s)", saved.getPrenom(), saved.getNom(), saved.getQrCode()));
        return saved;
    }

    public List<Enfant> getAllEnfants() {
        return enfantRepository.findAll();
    }

    public Page<Enfant> getEnfantsPagine(Pageable pageable) {
        return enfantRepository.findAll(pageable);
    }

    public List<Enfant> getEnfantsByTelephoneParent(String telephone) {
        return enfantRepository.findByTelephoneParent(telephone);
    }

    public Page<Enfant> getEnfantsByTelephoneParentPagine(String telephone, Pageable pageable) {
        return enfantRepository.findByTelephoneParent(telephone, pageable);
    }

    public Enfant getEnfantById(Long id) {
        return enfantRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveeException("Enfant", id));
    }

    public Enfant updateEnfant(Long id, Enfant enfantDetails) {
        Enfant enfantExistant = getEnfantById(id);

        enfantExistant.setNom(enfantDetails.getNom());
        enfantExistant.setPrenom(enfantDetails.getPrenom());
        enfantExistant.setGenre(enfantDetails.getGenre());
        enfantExistant.setDateNaissance(enfantDetails.getDateNaissance());
        enfantExistant.setTelephoneParent(enfantDetails.getTelephoneParent());
        enfantExistant.setQrCode(enfantDetails.getQrCode());

        Enfant updated = enfantRepository.save(enfantExistant);
        auditLoggingService.logAction("MODIFICATION_DOSSIER_PEDIATRIQUE", "ENFANT", updated.getEnfantId(),
                String.format("Mise à jour état civil pour %s %s", updated.getPrenom(), updated.getNom()));
        return updated;
    }

    public void deleteEnfant(Long id) {
        Enfant enfant = getEnfantById(id);
        auditLoggingService.logAction("SUPPRESSION_DOSSIER_PEDIATRIQUE", "ENFANT", id,
                String.format("Suppression dossier pédiatrique %s %s (NIP: %s)", enfant.getPrenom(), enfant.getNom(), enfant.getQrCode()));
        enfantRepository.delete(enfant);
    }
}