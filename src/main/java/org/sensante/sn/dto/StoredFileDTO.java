package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoredFileDTO {
    private String fileId;
    private String originalFilename;
    private String contentType;
    private Long size;
    private String sha256Checksum;
    private String downloadUrl;
    private LocalDateTime uploadTimestamp;
    private String category; // PREUVE_MISSION, ORDONNANCE, PHOTO_ENFANT, AUTRE
}
