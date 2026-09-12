package org.sensante.sn.Service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.sensante.sn.dto.StoredFileDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service de stockage de fichiers sécurisé sur système de fichiers local
 * avec calcul d'intégrité SHA-256 et protection contre les attaques de path traversal.
 * Compatible avec la réplication vers un bucket S3/MinIO.
 */
@Service
@Slf4j
public class LocalFileStorageService implements FileStorageService {

    @Value("${sensante.storage.local-dir:./uploads/sensante}")
    private String uploadDir;

    @Value("${sensante.storage.max-file-size-mb:10}")
    private long maxFileSizeMb;

    private Path rootLocation;
    private final Map<String, StoredFileDTO> metadataStore = new ConcurrentHashMap<>();

    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf",
            "application/json"
    );

    @PostConstruct
    public void init() {
        try {
            this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(this.rootLocation);
            log.info("Répertoire de stockage des fichiers initialisé : {}", this.rootLocation);
        } catch (IOException e) {
            log.error("Impossible d'initialiser le répertoire de stockage : {}", e.getMessage());
            throw new RuntimeException("Erreur d'initialisation du stockage", e);
        }
    }

    @Override
    public StoredFileDTO storeFile(MultipartFile file, String category) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Le fichier fourni est vide ou invalide.");
        }

        // 1. Validation de la taille maximale
        long maxBytes = maxFileSizeMb * 1024 * 1024;
        if (file.getSize() > maxBytes) {
            throw new IllegalArgumentException("La taille du fichier dépasse la limite autorisée de " + maxFileSizeMb + " Mo.");
        }

        // 2. Validation du type MIME
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Type MIME non autorisé : " + contentType + ". Formats acceptés : JPEG, PNG, WebP, PDF.");
        }

        try {
            // 3. Calcul du hash SHA-256
            byte[] fileBytes = file.getBytes();
            String sha256 = calculateSha256(fileBytes);

            // Extension déduite
            String originalFilename = Optional.ofNullable(file.getOriginalFilename()).orElse("fichier");
            String extension = "";
            int extIndex = originalFilename.lastIndexOf(".");
            if (extIndex > 0) {
                extension = originalFilename.substring(extIndex);
            }

            // Génération de l'identifiant unique
            String fileId = UUID.randomUUID().toString();
            String storedFilename = fileId + "_" + sha256.substring(0, 12) + extension;
            Path destinationFile = this.rootLocation.resolve(Paths.get(storedFilename)).normalize().toAbsolutePath();

            // Sécurité anti-path traversal
            if (!destinationFile.getParent().equals(this.rootLocation)) {
                throw new SecurityException("Tentative de path traversal détectée.");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            StoredFileDTO dto = StoredFileDTO.builder()
                    .fileId(fileId)
                    .originalFilename(originalFilename)
                    .contentType(contentType)
                    .size(file.getSize())
                    .sha256Checksum(sha256)
                    .downloadUrl("/api/files/" + fileId + "/download")
                    .uploadTimestamp(LocalDateTime.now())
                    .category(category != null ? category : "AUTRE")
                    .build();

            metadataStore.put(fileId, dto);
            log.info("Fichier stocké avec succès : id={}, nom={}, hash={}", fileId, originalFilename, sha256);
            return dto;

        } catch (IOException | NoSuchAlgorithmException e) {
            log.error("Échec de l'enregistrement du fichier : {}", e.getMessage());
            throw new RuntimeException("Erreur lors de l'enregistrement du fichier", e);
        }
    }

    @Override
    public Resource loadFileAsResource(String fileId) {
        StoredFileDTO metadata = metadataStore.get(fileId);
        if (metadata == null) {
            throw new NoSuchElementException("Fichier introuvable pour l'identifiant : " + fileId);
        }

        try {
            // Recherche du fichier commençant par fileId
            Path found = Files.list(this.rootLocation)
                    .filter(path -> path.getFileName().toString().startsWith(fileId))
                    .findFirst()
                    .orElseThrow(() -> new NoSuchElementException("Fichier physique manquant sur le disque pour l'id : " + fileId));

            Resource resource = new UrlResource(found.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Fichier non accessible en lecture.");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("URI de fichier invalide", e);
        } catch (IOException e) {
            throw new RuntimeException("Erreur de lecture du fichier", e);
        }
    }

    @Override
    public void deleteFile(String fileId) {
        try {
            metadataStore.remove(fileId);
            Files.list(this.rootLocation)
                    .filter(path -> path.getFileName().toString().startsWith(fileId))
                    .forEach(path -> {
                        try {
                            Files.deleteIfExists(path);
                            log.info("Fichier physique supprimé : {}", path);
                        } catch (IOException e) {
                            log.error("Erreur lors de la suppression de {}", path, e);
                        }
                    });
        } catch (IOException e) {
            log.error("Erreur lors de la liste pour suppression : {}", e.getMessage());
        }
    }

    @Override
    public StoredFileDTO getFileMetadata(String fileId) {
        StoredFileDTO dto = metadataStore.get(fileId);
        if (dto == null) {
            throw new NoSuchElementException("Métadonnées introuvables pour le fichier : " + fileId);
        }
        return dto;
    }

    private String calculateSha256(byte[] data) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(data);
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
