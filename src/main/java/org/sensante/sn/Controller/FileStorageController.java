package org.sensante.sn.Controller;

import lombok.RequiredArgsConstructor;
import org.sensante.sn.dto.StoredFileDTO;
import org.sensante.sn.Service.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/files")
@Tag(name = "Stockage d'Objets & Preuves Numériques", description = "Dépôt sécurisé, vérification d'intégrité SHA-256 et téléchargement de documents")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class FileStorageController {

    private final FileStorageService storageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<StoredFileDTO> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", required = false, defaultValue = "AUTRE") String category) {
        StoredFileDTO result = storageService.storeFile(file, category);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<StoredFileDTO> getFileMetadata(@PathVariable String fileId) {
        return ResponseEntity.ok(storageService.getFileMetadata(fileId));
    }

    @GetMapping("/{fileId}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileId) {
        StoredFileDTO metadata = storageService.getFileMetadata(fileId);
        Resource resource = storageService.loadFileAsResource(fileId);

        String contentType = metadata.getContentType();
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + metadata.getOriginalFilename() + "\"")
                .header("X-Checksum-SHA256", metadata.getSha256Checksum())
                .body(resource);
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(@PathVariable String fileId) {
        storageService.deleteFile(fileId);
        return ResponseEntity.noContent().build();
    }
}
