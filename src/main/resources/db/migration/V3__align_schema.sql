-- V3 : Alignement des colonnes pour validation stricte Hibernate (ddl-auto: validate)

ALTER TABLE bilan_antro ADD COLUMN IF NOT EXISTS oedemes BOOLEAN DEFAULT FALSE;
ALTER TABLE bilan_antro ADD COLUMN IF NOT EXISTS agent_id BIGINT REFERENCES utilisateur(id_user);
ALTER TABLE bilan_antro ADD COLUMN IF NOT EXISTS structure_sante_id BIGINT REFERENCES structure_sante(id);
