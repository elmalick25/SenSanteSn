package org.sensante.sn.Service;

import org.sensante.sn.Model.AuditLog;
import org.sensante.sn.Repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.HexFormat;
import java.util.List;

@Service
public class AuditLoggingService {

    private static final Logger log = LoggerFactory.getLogger(AuditLoggingService.class);
    private final AuditLogRepository auditLogRepository;

    public AuditLoggingService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public AuditLog logAction(String action, String entite, Long entiteId, String details) {
        String email = "SYSTEM";
        String role = "SYSTEM";

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            email = auth.getName();
            role = auth.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .reduce((a, b) -> a + "," + b)
                    .orElse("UNKNOWN");
        }

        return logAction(action, entite, entiteId, email, role, details, "127.0.0.1");
    }

    @Transactional
    public AuditLog logAction(String action, String entite, Long entiteId, String utilisateurEmail,
                              String role, String details, String ipClient) {
        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        String sha256 = calculateHash(action, entite, entiteId, utilisateurEmail, now.toString(), details);

        AuditLog auditLog = AuditLog.builder()
                .action(action)
                .entite(entite)
                .entiteId(entiteId)
                .utilisateurEmail(utilisateurEmail)
                .role(role)
                .details(details)
                .ipClient(ipClient != null ? ipClient : "0.0.0.0")
                .timestamp(now)
                .hashSha256(sha256)
                .build();

        AuditLog saved = auditLogRepository.save(auditLog);
        log.info("[AUDIT-MSAS] Action={} Entite={}:{} User={} Hash={}",
                action, entite, entiteId, utilisateurEmail, sha256);
        return saved;
    }

    @Transactional(readOnly = true)
    public Page<AuditLog> getLogsPagine(Pageable pageable) {
        return auditLogRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public List<AuditLog> getDerniersLogs() {
        return auditLogRepository.findTop50ByOrderByTimestampDesc();
    }

    private String calculateHash(String action, String entite, Long entiteId, String email, String timestamp, String details) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String payload = String.format("%s|%s|%s|%s|%s|%s",
                    action, entite, entiteId != null ? entiteId : "0", email, timestamp, details != null ? details : "");
            byte[] hashBytes = digest.digest(payload.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Algorithme SHA-256 indisponible pour l'audit trail", e);
        }
    }
}
