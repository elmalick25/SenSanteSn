-- Migration V4 : Création de la table d'audit légale des données de santé
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    entite VARCHAR(100) NOT NULL,
    entite_id BIGINT,
    utilisateur_email VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    details TEXT,
    ip_client VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    hash_sha256 VARCHAR(64) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_email ON audit_logs(utilisateur_email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entite ON audit_logs(entite, entite_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_hash ON audit_logs(hash_sha256);
