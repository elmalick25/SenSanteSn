package org.sensante.sn.service.ia;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

/**
 * Service TTS (Text-to-Speech) Wolof via HuggingFace Inference API.
 * Modele : facebook/mms-tts-wol (Meta Massively Multilingual Speech)
 * Gratuit sur le tier public HuggingFace.
 *
 * STRATEGIE PRINCIPALE : Les phrases-types Wolof sont servies en tant que fichiers
 * MP3 statiques depuis assets/audio/wolof/ (pre-enregistrees, zero latence).
 * Ce service est appele uniquement pour les messages dynamiques.
 */
@Service
public class WolofTtsService {
    private static final Logger log = LoggerFactory.getLogger(WolofTtsService.class);

    @Value("${sensante.ia.huggingface.api-key:}")
    private String hfApiKey;
    @Value("${sensante.ia.huggingface.base-url:https://api-inference.huggingface.co/models}")
    private String hfBaseUrl;
    @Value("${sensante.ia.huggingface.tts-wolof-model:facebook/mms-tts-wol}")
    private String ttsModel;

    private final RestTemplate restTemplate = new RestTemplate();

    /** Carte des phrases-types : cle -> chemin statique relatif */
    private static final Map<String, String> PHRASES_STATIQUES = Map.ofEntries(
        Map.entry("bienvenue",         "/assets/audio/wolof/bienvenue.mp3"),
        Map.entry("muac_normal",       "/assets/audio/wolof/muac_normal.mp3"),
        Map.entry("muac_mam",          "/assets/audio/wolof/muac_mam.mp3"),
        Map.entry("muac_mas",          "/assets/audio/wolof/muac_mas.mp3"),
        Map.entry("mas_urgent",        "/assets/audio/wolof/muac_mas.mp3"),
        Map.entry("mam_suivi",         "/assets/audio/wolof/muac_mam.mp3"),
        Map.entry("a_risque_surveillance", "/assets/audio/wolof/muac_mam.mp3"),
        Map.entry("normal_wer",        "/assets/audio/wolof/muac_normal.mp3"),
        Map.entry("rdv_confirme",      "/assets/audio/wolof/rdv_confirme.mp3"),
        Map.entry("medicament_rappel", "/assets/audio/wolof/medicament_rappel.mp3"),
        Map.entry("carnet_info",       "/assets/audio/wolof/carnet_info.mp3"),
        Map.entry("courbes_info",      "/assets/audio/wolof/courbes_info.mp3"),
        Map.entry("pilulier_rappel",   "/assets/audio/wolof/pilulier_rappel.mp3"),
        Map.entry("bienvenue_rdv",     "/assets/audio/wolof/bienvenue_rdv.mp3")
    );

    /**
     * Retourne l'URL du fichier audio Wolof pour une cle de phrase.
     * Priorise les fichiers statiques (zero latence) avant l'API HuggingFace.
     */
    public TtsResultDTO getAudioUrl(String phraseKey) {
        // Cas 1 : phrase statique pre-enregistree (chemin recommande)
        if (PHRASES_STATIQUES.containsKey(phraseKey)) {
            return new TtsResultDTO(PHRASES_STATIQUES.get(phraseKey), "STATIC_MP3", phraseKey);
        }
        // Cas 2 : aucune cle connue -> fallback silencieux
        return new TtsResultDTO(null, "NO_AUDIO", phraseKey);
    }

    /**
     * Genere dynamiquement un audio via HuggingFace MMS-TTS (pour textes variables).
     * Retourne les bytes audio WAV ou null en cas d'echec.
     */
    public byte[] genererAudio(String texte) {
        if (!StringUtils.hasText(hfApiKey) || !StringUtils.hasText(texte)) {
            log.warn("HuggingFace API key absente ou texte vide - TTS dynamique desactive");
            return null;
        }
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(hfApiKey);
            Map<String, String> payload = Map.of("inputs", texte);
            HttpEntity<Map<String, String>> request = new HttpEntity<>(payload, headers);
            ResponseEntity<byte[]> response = restTemplate.exchange(
                hfBaseUrl + "/" + ttsModel,
                HttpMethod.POST, request, byte[].class);
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("TTS Wolof HuggingFace OK - {} bytes", response.getBody() != null ? response.getBody().length : 0);
                return response.getBody();
            }
            log.error("HuggingFace TTS erreur {}", response.getStatusCode());
            return null;
        } catch (Exception e) {
            log.error("Erreur TTS Wolof HuggingFace : {}", e.getMessage());
            return null;
        }
    }

    public record TtsResultDTO(String audioUrl, String mode, String phraseKey) {}
}