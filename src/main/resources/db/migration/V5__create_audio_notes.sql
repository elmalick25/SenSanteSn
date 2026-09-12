-- V5 : Table des notes audio terrain (agents Bajenu Gox)
-- Chaque releve de concession peut avoir une note vocale associee
-- transcrite via Groq Whisper (whisper-large-v3-turbo)
CREATE TABLE IF NOT EXISTS audio_notes (
    id                BIGSERIAL       PRIMARY KEY,
    concession_id     VARCHAR(50),
    agent_email       VARCHAR(255),
    fichier_url       VARCHAR(512)    NOT NULL,
    transcription     TEXT,
    langue            VARCHAR(10)     DEFAULT 'fr',
    duree_secondes    SMALLINT,
    mode_transcription VARCHAR(30)    DEFAULT 'GROQ_WHISPER',
    created_at        TIMESTAMPTZ     DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audio_notes_concession ON audio_notes(concession_id);
CREATE INDEX IF NOT EXISTS idx_audio_notes_agent      ON audio_notes(agent_email);