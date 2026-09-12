package org.sensante.sn.Service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReferenceGeneratorServiceTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    private ReferenceGeneratorService service;

    @BeforeEach
    void setUp() {
        service = new ReferenceGeneratorService(jdbcTemplate);
    }

    @Test
    @DisplayName("Génération référence dossier médical avec séquence PostgreSQL")
    void shouldGenerateRefDossierFromDatabaseSequence() {
        when(jdbcTemplate.queryForObject(eq("SELECT nextval('seq_dossier_medical')"), eq(Long.class)))
                .thenReturn(1042L);

        String ref = service.generateRefDossier();

        assertThat(ref).startsWith("REF-SN-");
        assertThat(ref).endsWith("-01042");
    }

    @Test
    @DisplayName("Fallback atomique mémoire si la séquence PostgreSQL est indisponible")
    void shouldFallbackGracefullyWhenDatabaseUnavailable() {
        when(jdbcTemplate.queryForObject(anyString(), eq(Long.class)))
                .thenThrow(new RuntimeException("DB down"));

        String ord = service.generateNumOrdonnance();

        assertThat(ord).startsWith("ORD-");
        assertThat(ord).contains("01002");
    }

    @Test
    @DisplayName("Génération empreinte cryptographique SHA-256 authentique (64 hex)")
    void shouldGenerateValidSha256Hash() {
        String hash = service.generateCryptographicHash("PATIENT:1001:MAS");

        assertThat(hash).isNotNull();
        assertThat(hash).hasSize(64);
        assertThat(hash).matches("^[a-f0-9]{64}$");
    }

    @Test
    @DisplayName("Génération référence certificat ministériel et rapport stratégique")
    void shouldGenerateCertificatAndRapport() {
        when(jdbcTemplate.queryForObject(eq("SELECT nextval('seq_certificat_msas')"), eq(Long.class)))
                .thenReturn(205L);

        String cert = service.generateNumCertificat();
        String rap = service.generateNumRapport();

        assertThat(cert).contains("MSAS-CERT-");
        assertThat(rap).contains("RAP-STRAT-MSAS-");
    }
}
