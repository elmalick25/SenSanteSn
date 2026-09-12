package org.sensante.sn.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.sensante.sn.Service.AudioAiService;
import org.sensante.sn.dto.AudioConseilRequest;
import org.sensante.sn.dto.AudioConseilResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/audio-ai")
@Tag(name = "Intelligence Artificielle Vocale & Traduction Wolof", description = "Synthèse vocale, conseils personnalisés en Wolof et transcription de rapports de terrain")
@PreAuthorize("isAuthenticated()")
public class AudioAiController {

    private final AudioAiService audioAiService;

    public AudioAiController(AudioAiService audioAiService) {
        this.audioAiService = audioAiService;
    }

    @PostMapping("/conseil")
    @Operation(summary = "Générer un conseil clinique bilingue Wolof/Français basé sur la biométrie")
    public ResponseEntity<AudioConseilResponse> genererConseil(@RequestBody AudioConseilRequest request) {
        return ResponseEntity.ok(audioAiService.genererConseilAudio(request));
    }

    @PostMapping(value = "/transcription", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Transcrire un enregistrement audio de terrain (Bajenu Gox / Relais)")
    public ResponseEntity<String> transcrireAudio(@RequestParam("audio") MultipartFile file) throws IOException {
        String transcription = audioAiService.transcrireAudioTerrain(file.getBytes(), file.getContentType());
        return ResponseEntity.ok(transcription);
    }
}
