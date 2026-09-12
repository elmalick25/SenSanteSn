package org.sensante.sn;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Test de démarrage du contexte Spring.
 * Utilise le profil "test" (H2 en mémoire) afin de ne dépendre
 * d'aucune base PostgreSQL installée localement.
 */
@SpringBootTest
@ActiveProfiles("test")
class SenSanteApplicationTests {

    @Test
    void contextLoads() {
    }
}
