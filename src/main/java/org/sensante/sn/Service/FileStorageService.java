package org.sensante.sn.Service;

import org.sensante.sn.dto.StoredFileDTO;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    StoredFileDTO storeFile(MultipartFile file, String category);
    Resource loadFileAsResource(String fileId);
    void deleteFile(String fileId);
    StoredFileDTO getFileMetadata(String fileId);
}
