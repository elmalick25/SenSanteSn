package org.sensante.sn.service.ia;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@Service
public class WhisperTranscriptionService {
    private static final Logger log = LoggerFactory.getLogger(WhisperTranscriptionService.class);

    @Value("${sensante.ia.groq.api-key:}")
    private String groqApiKey;
    @Value("${sensante.ia.groq.base-url:https://api.groq.com/openai/v1}")
    private String groqBaseUrl;
    @Value("${sensante.ia.groq.whisper-model:whisper-large-v3-turbo}")
    private String whisperModel;

    private final RestTemplate restTemplate = new RestTemplate();

    public TranscriptionResultDTO transcrire(MultipartFile audioFile, String langue) {
        if (!StringUtils.hasText(groqApiKey)) {
            log.warn("Groq API key absente - transcription differee (mode OFFLINE)");
            return TranscriptionResultDTO.offline();
        }
        try {
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new MultipartFileResource(audioFile));
            body.add("model", whisperModel);
            body.add("response_format", "json");
            if (StringUtils.hasText(langue)) {
                body.add("language", "wo".equals(langue) ? "fr" : langue);
            }
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.setBearerAuth(groqApiKey);
            HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<WhisperResponse> response = restTemplate.exchange(
                groqBaseUrl + "/audio/transcriptions", HttpMethod.POST, request, WhisperResponse.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                String texte = response.getBody().text();
                log.info("Transcription Groq OK - {} caracteres", texte != null ? texte.length() : 0);
                return new TranscriptionResultDTO(texte, langue != null ? langue : "fr", "GROQ_WHISPER", null);
            }
            return TranscriptionResultDTO.erreur("HTTP " + response.getStatusCode());
        } catch (Exception e) {
            log.error("Erreur transcription Groq Whisper : {}", e.getMessage());
            return TranscriptionResultDTO.erreur(e.getMessage());
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record WhisperResponse(@JsonProperty("text") String text) {}

    public record TranscriptionResultDTO(String transcription, String langue, String mode, String erreurDetail) {
        public static TranscriptionResultDTO offline() {
            return new TranscriptionResultDTO(null, "fr", "OFFLINE", "Transcription differee - configurez GROQ_API_KEY.");
        }
        public static TranscriptionResultDTO erreur(String detail) {
            return new TranscriptionResultDTO(null, "fr", "ERREUR", detail);
        }
    }

    private static class MultipartFileResource extends ByteArrayResource {
        private final String filename;
        MultipartFileResource(MultipartFile file) throws Exception {
            super(file.getBytes());
            this.filename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "audio.webm";
        }
        @Override public String getFilename() { return filename; }
    }
}