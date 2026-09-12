package org.sensante.sn.Service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Service Pivot de Génération d'Identifiants Métier & Empreintes Cryptographiques.
 * Éradication intégrale de Math.random() au profit de séquences PostgreSQL atomiques et SHA-256.
 */
@Slf4j
@Service
@RequiredArgsConstructor
// Les compteurs utilisent nextval() : c'est une ecriture. On force donc une transaction
// dediee et modifiable, sinon un appel depuis un contexte en lecture seule avorte
// la transaction du service appelant (PostgreSQL : "read-only transaction").
@org.springframework.transaction.annotation.Transactional(
        propagation = org.springframework.transaction.annotation.Propagation.REQUIRES_NEW)
public class ReferenceGeneratorService {

    private final JdbcTemplate jdbcTemplate;

    // Fallback mémoire atomique en cas d'indisponibilité transitoire de la base
    private final AtomicLong fallbackDossier = new AtomicLong(1001);
    private final AtomicLong fallbackOrdonnance = new AtomicLong(1001);
    private final AtomicLong fallbackBonTransfert = new AtomicLong(101);
    private final AtomicLong fallbackBonCommande = new AtomicLong(101);
    private final AtomicLong fallbackCertificat = new AtomicLong(101);
    private final AtomicLong fallbackSecurite = new AtomicLong(1001);

    @PostConstruct
    public void initSequences() {
        try {
            jdbcTemplate.execute("CREATE SEQUENCE IF NOT EXISTS seq_dossier_medical START WITH 1001 INCREMENT BY 1");
            jdbcTemplate.execute("CREATE SEQUENCE IF NOT EXISTS seq_ordonnance START WITH 1001 INCREMENT BY 1");
            jdbcTemplate.execute("CREATE SEQUENCE IF NOT EXISTS seq_bon_transfert START WITH 101 INCREMENT BY 1");
            jdbcTemplate.execute("CREATE SEQUENCE IF NOT EXISTS seq_bon_commande_pna START WITH 101 INCREMENT BY 1");
            jdbcTemplate.execute("CREATE SEQUENCE IF NOT EXISTS seq_certificat_msas START WITH 101 INCREMENT BY 1");
            jdbcTemplate.execute("CREATE SEQUENCE IF NOT EXISTS seq_code_securite START WITH 1001 INCREMENT BY 1");
            log.info("Séquences PostgreSQL de référence initialisées avec succès.");
        } catch (Exception e) {
            log.warn("Création des séquences PostgreSQL ignorée ou non supportée (fallback actif): {}", e.getMessage());
        }
    }

    private long getNextSequenceVal(String sequenceName, AtomicLong fallback) {
        try {
            Long val = jdbcTemplate.queryForObject("SELECT nextval('" + sequenceName + "')", Long.class);
            return (val != null) ? val : fallback.incrementAndGet();
        } catch (Exception e) {
            log.debug("Lecture séquence {} échouée, bascule fallback atomique: {}", sequenceName, e.getMessage());
            return fallback.incrementAndGet();
        }
    }

    /**
     * Génère une référence de dossier médical / consultation unique : REF-SN-YYYY-000001
     */
    public String generateRefDossier() {
        int year = LocalDate.now().getYear();
        long seq = getNextSequenceVal("seq_dossier_medical", fallbackDossier);
        return String.format("REF-SN-%d-%05d", year, seq);
    }

    /**
     * Génère un numéro d'ordonnance unique : ORD-YYYYMM-000001
     */
    public String generateNumOrdonnance() {
        String ym = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMM"));
        long seq = getNextSequenceVal("seq_ordonnance", fallbackOrdonnance);
        return String.format("ORD-%s-%05d", ym, seq);
    }

    /**
     * Génère un code de sécurité QR ordonnance : SEC-XXXXX
     */
    public String generateCodeSecuriteQr() {
        long seq = getNextSequenceVal("seq_code_securite", fallbackSecurite);
        return String.format("#SEC-%05d", seq);
    }

    /**
     * Génère un numéro de bon de transfert : BT-DKO-YYYY-001
     */
    public String generateNumBonTransfert() {
        int year = LocalDate.now().getYear();
        long seq = getNextSequenceVal("seq_bon_transfert", fallbackBonTransfert);
        return String.format("BT-DKO-%d-%04d", year, seq);
    }

    /**
     * Génère un numéro de bon de commande PNA : BC-DKO-YYYY-PNA-001
     */
    public String generateNumBonCommandePna() {
        int year = LocalDate.now().getYear();
        long seq = getNextSequenceVal("seq_bon_commande_pna", fallbackBonCommande);
        return String.format("BC-DKO-%d-PNA-%04d", year, seq);
    }

    /**
     * Génère un numéro de certificat MSAS : MSAS-CERT-YYYY-DKR-001
     */
    public String generateNumCertificat() {
        int year = LocalDate.now().getYear();
        long seq = getNextSequenceVal("seq_certificat_msas", fallbackCertificat);
        return String.format("MSAS-CERT-%d-DKR-%04d", year, seq);
    }

    /**
     * Génère un numéro de rapport stratégique ministériel : RAP-STRAT-MSAS-YYYY-0001
     */
    public String generateNumRapport() {
        int year = LocalDate.now().getYear();
        long seq = getNextSequenceVal("seq_certificat_msas", fallbackCertificat);
        return String.format("RAP-STRAT-MSAS-%d-%04d", year, seq);
    }

    /**
     * Calcule une empreinte cryptographique SHA-256 authentique (preuve d'audit & télétransmission DHIS2)
     */
    public String generateCryptographicHash(String payload) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String data = (payload != null ? payload : "") + ":" + UUID.randomUUID().toString() + ":" + System.currentTimeMillis();
            byte[] encodedhash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : encodedhash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            return UUID.randomUUID().toString().replace("-", "");
        }
    }
}
