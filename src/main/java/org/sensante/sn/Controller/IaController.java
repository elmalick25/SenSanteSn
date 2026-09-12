package org.sensante.sn.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.sensante.sn.service.ia.PcimaTriageService;
import org.sensante.sn.service.ia.WolofTtsService;
import org.sensante.sn.service.ia.WhisperTranscriptionService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ia")
@Tag(name = "Intelligence Artificielle SenSante", description = "Transcription audio Groq Whisper, TTS Wolof, analyse PCIMA OMS")
public class IaController {

    private final WhisperTranscriptionService whisperService;
    private final WolofTtsService ttsService;
    private final PcimaTriageService pcimaService;

    public IaController(WhisperTranscriptionService whisperService,
                        WolofTtsService ttsService,
                        PcimaTriageService pcimaService) {
        this.whisperService = whisperService;
        this.ttsService = ttsService;
        this.pcimaService = pcimaService;
    }

    @GetMapping("/health")
    @Operation(summary = "Statut du service IA")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "services", Map.of(
                "whisper_stt", "Groq whisper-large-v3-turbo",
                "tts_wolof",   "HuggingFace facebook/mms-tts-wol + static MP3",
                "pcima_engine","OMS PCIMA 2013 Java rules"
            )
        ));
    }

    /**
     * Transcrit un enregistrement audio (webm/mp3/wav) via Groq Whisper.
     * Utilise le mode OFFLINE si GROQ_API_KEY est absent.
     */
    @PostMapping(value = "/transcribe", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Transcription audio (Groq Whisper) — supporte fr et wolof")
    public ResponseEntity<WhisperTranscriptionService.TranscriptionResultDTO> transcrire(
            @RequestPart("audio") MultipartFile audio,
            @RequestParam(value = "langue", defaultValue = "fr") String langue) {
        return ResponseEntity.ok(whisperService.transcrire(audio, langue));
    }

    /**
     * Retourne l'URL du fichier MP3 Wolof pour une cle de phrase.
     */
    @GetMapping("/tts/wolof")
    @Operation(summary = "URL audio Wolof pour une phrase-type")
    public ResponseEntity<WolofTtsService.TtsResultDTO> getTtsUrl(
            @RequestParam(value = "phraseKey", required = false) String phraseKey) {
        if (phraseKey == null || phraseKey.isBlank()) {
            throw new IllegalArgumentException("Le paramètre 'phraseKey' est obligatoire et ne peut être vide.");
        }
        return ResponseEntity.ok(ttsService.getAudioUrl(phraseKey));
    }

    /**
     * Genere dynamiquement un audio Wolof via HuggingFace MMS-TTS.
     * Retourne un fichier WAV binaire.
     */
    @PostMapping("/tts/wolof/generate")
    @Operation(summary = "Generation TTS Wolof dynamique (HuggingFace MMS-TTS)")
    public ResponseEntity<byte[]> genererTts(@RequestBody(required = false) Map<String, String> body) {
        if (body == null || !body.containsKey("texte") || body.get("texte") == null || body.get("texte").isBlank()) {
            throw new IllegalArgumentException("Le corps de la requête doit contenir un champ 'texte' non vide.");
        }
        String texte = body.get("texte");
        byte[] audio = ttsService.genererAudio(texte);
        if (audio == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"wolof.wav\"")
            .contentType(MediaType.parseMediaType("audio/wav"))
            .body(audio);
    }

    /**
     * Analyse MUAC + z-score OMS et genere un conseil clinique contextuel.
     * Utilisee par les composants parent (dashboard, courbes).
     */
    @GetMapping("/analyse-muac")
    @Operation(summary = "Analyse PCIMA OMS — conseil clinique parent avec audioKey Wolof")
    public ResponseEntity<PcimaTriageService.ConseilClinique> analyseMuac(
            @RequestParam(value = "muac", required = false) Double muac,
            @RequestParam(defaultValue = "0") double poids,
            @RequestParam(defaultValue = "12") int ageMois,
            @RequestParam(defaultValue = "M") String sexe,
            @RequestParam(defaultValue = "Bebe") String prenom) {
        if (muac == null || muac <= 0) {
            throw new IllegalArgumentException("Le paramètre 'muac' est obligatoire et doit être supérieur à zéro (ex: 12.5 cm).");
        }
        PcimaTriageService.ConseilClinique conseil = pcimaService.genererConseilParent(muac, poids, ageMois, sexe, prenom);
        return ResponseEntity.ok(conseil);
    }

    /**
     * Calcule le statut et l ordre de priorite PCIMA pour le triage agent.
     */
    @PostMapping("/triage/priorite")
    @Operation(summary = "Calcul priorite triage OMS PCIMA — pour AgentTactiqueController")
    public ResponseEntity<Map<String, Object>> calculerPriorite(@RequestBody TriageRequest req) {
        PcimaTriageService.StatutNutritionnel statut = pcimaService.calculerStatut(
            req.muacMm(), req.poidKg(), req.ageMois(), req.sexe(), req.oedemesBilateraux());
        int priorite = pcimaService.calculerOrdrePriorite(
            req.muacMm(), req.poidKg(), req.ageMois(), req.sexe(),
            req.oedemesBilateraux(), req.signesDanger());
        return ResponseEntity.ok(Map.of(
            "statut",    statut.name(),
            "priorite",  priorite,
            "libelle",   switch(statut) {
                case MAS      -> "Malnutrition Aigue Severe";
                case MAM      -> "Malnutrition Aigue Moderee";
                case A_RISQUE -> "A risque nutritionnel";
                case NORMAL   -> "Statut normal";
            }
        ));
    }

    public record TriageRequest(
        double muacMm,
        double poidKg,
        int ageMois,
        String sexe,
        boolean oedemesBilateraux,
        List<String> signesDanger
    ) {}
}