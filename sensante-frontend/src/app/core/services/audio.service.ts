import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface TranscriptionResult {
  transcription: string | null;
  langue: string;
  mode: 'GROQ_WHISPER' | 'OFFLINE' | 'ERREUR';
  erreurDetail: string | null;
}

export interface TtsResult {
  audioUrl: string | null;
  mode: 'STATIC_MP3' | 'NO_AUDIO';
  phraseKey: string;
}

export interface ConseilClinique {
  alerteNiveau: 'NORMAL' | 'SURVEILLANCE' | 'ALERTE' | 'CRITIQUE';
  titre: string;
  detail: string;
  phraseAudioKey: string;
  couleurHex: string;
}

/**
 * AudioService — Service singleton centralisant :
 * 1. Enregistrement audio réel (MediaRecorder API)
 * 2. Transcription via Groq Whisper (POST /api/ia/transcribe)
 * 3. Lecture des fichiers MP3 Wolof pré-enregistrés (assets/audio/wolof/)
 * 4. Analyse MUAC clinique PCIMA (GET /api/ia/analyse-muac)
 *
 * Remplace définitivement window.speechSynthesis dans toute l'application.
 */
@Injectable({ providedIn: 'root' })
export class AudioService {
  private readonly API = '/api/ia';
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private currentAudio: HTMLAudioElement | null = null;

  constructor(private http: HttpClient) {}

  // ── 1. Enregistrement Audio (MediaRecorder) ──────────────────────────────

  async startRecording(): Promise<void> {
    this.audioChunks = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm';
    this.mediaRecorder = new MediaRecorder(stream, { mimeType });
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.audioChunks.push(e.data);
    };
    this.mediaRecorder.start(200); // timeslice 200ms pour streaming terrain
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('Aucun enregistrement en cours'));
        return;
      }
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, { type: this.mediaRecorder!.mimeType });
        // Libérer les pistes micro (LED éteinte)
        this.mediaRecorder!.stream.getTracks().forEach(t => t.stop());
        this.mediaRecorder = null;
        resolve(blob);
      };
      this.mediaRecorder.stop();
    });
  }

  get isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }

  getDuration(startTime: number): string {
    const s = Math.floor((Date.now() - startTime) / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  // ── 2. Transcription Groq Whisper ────────────────────────────────────────

  transcribe(audioBlob: Blob, langue = 'fr'): Observable<TranscriptionResult> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'note.webm');
    formData.append('langue', langue);
    return this.http.post<TranscriptionResult>(
      `${this.API}/transcribe?langue=${langue}`, formData
    ).pipe(
      catchError(() => of({ transcription: null, langue, mode: 'ERREUR' as const, erreurDetail: 'Erreur réseau' }))
    );
  }

  // ── 3. TTS Wolof — Lecture fichiers MP3 pré-enregistrés ─────────────────

  /**
   * Joue un fichier audio Wolof pré-enregistré par clé de phrase.
   * Ne fait JAMAIS appel à window.speechSynthesis.
   * @param phraseKey Clé ex: 'muac_normal', 'rdv_confirme', 'bienvenue'
   */
  playWolofPhrase(phraseKey: string): void {
    // Arrêter l'audio en cours si besoin
    this.stopCurrentAudio();

    // Résolution locale directe (zéro latence réseau pour les fichiers statiques)
    const staticUrl = `/assets/audio/wolof/${phraseKey}.mp3`;
    this.playUrl(staticUrl);
  }

  /**
   * Joue un audio depuis une URL absolue ou relative.
   */
  playUrl(url: string): void {
    this.stopCurrentAudio();
    this.currentAudio = new Audio(url);
    this.currentAudio.play().catch(() => {
      // Si le fichier MP3 est absent, aucune erreur visible (pas d'exception non gérée)
      console.warn(`[AudioService] Fichier audio introuvable : ${url}`);
    });
  }

  stopCurrentAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  get isPlaying(): boolean {
    return this.currentAudio !== null && !this.currentAudio.paused;
  }

  // ── 4. Analyse MUAC PCIMA OMS ────────────────────────────────────────────

  analyseMuac(
    muac: number,
    poids = 0,
    ageMois = 12,
    sexe = 'M',
    prenom = 'Bébé'
  ): Observable<ConseilClinique> {
    return this.http.get<ConseilClinique>(
      `${this.API}/analyse-muac?muac=${muac}&poids=${poids}&ageMois=${ageMois}&sexe=${sexe}&prenom=${encodeURIComponent(prenom)}`
    );
  }
}