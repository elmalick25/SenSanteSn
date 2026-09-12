package org.sensante.sn.Service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.sensante.sn.dto.StoredFileDTO;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class FileStorageServiceTest {

    private LocalFileStorageService storageService;

    @TempDir
    Path tempDir;

    @BeforeEach
    void setUp() {
        storageService = new LocalFileStorageService();
        ReflectionTestUtils.setField(storageService, "uploadDir", tempDir.toString());
        ReflectionTestUtils.setField(storageService, "maxFileSizeMb", 5L);
        storageService.init();
    }

    @Test
    @DisplayName("Stockage valide d'une image avec calcul de hash SHA-256 et URL de téléchargement")
    void shouldStoreValidImageFile() throws IOException {
        byte[] content = "test photo preuve mission".getBytes();
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "preuve_mission_teren.jpg",
                "image/jpeg",
                content
        );

        StoredFileDTO stored = storageService.storeFile(file, "PREUVE_MISSION");

        assertThat(stored).isNotNull();
        assertThat(stored.getFileId()).isNotBlank();
        assertThat(stored.getOriginalFilename()).isEqualTo("preuve_mission_teren.jpg");
        assertThat(stored.getContentType()).isEqualTo("image/jpeg");
        assertThat(stored.getCategory()).isEqualTo("PREUVE_MISSION");
        assertThat(stored.getSha256Checksum()).hasSize(64);

        // Vérification de la récupération
        Resource resource = storageService.loadFileAsResource(stored.getFileId());
        assertThat(resource.exists()).isTrue();
        assertThat(resource.getContentAsByteArray()).isEqualTo(content);
    }

    @Test
    @DisplayName("Rejet des fichiers aux types MIME non autorisés (ex: exécutables .exe)")
    void shouldRejectInvalidMimeType() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "malware.exe",
                "application/x-msdownload",
                new byte[]{1, 2, 3}
        );

        assertThatThrownBy(() -> storageService.storeFile(file, "AUTRE"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Type MIME non autorisé");
    }

    @Test
    @DisplayName("Suppression d'un fichier stocké et mise à jour du registre")
    void shouldDeleteStoredFile() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "rapport.pdf",
                "application/pdf",
                "%PDF-1.4 test".getBytes()
        );

        StoredFileDTO stored = storageService.storeFile(file, "RAPPORT");
        assertThat(storageService.loadFileAsResource(stored.getFileId()).exists()).isTrue();

        storageService.deleteFile(stored.getFileId());

        assertThatThrownBy(() -> storageService.loadFileAsResource(stored.getFileId()))
                .isInstanceOf(Exception.class);
    }
}
