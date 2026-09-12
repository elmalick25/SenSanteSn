-- Alignement du schema sur les entites JPA (colonnes manquantes detectees a la validation Hibernate)
ALTER TABLE consultation_archive ADD COLUMN IF NOT EXISTS type_document VARCHAR(255);

ALTER TABLE structure_sante ADD COLUMN IF NOT EXISTS responsable VARCHAR(255);
ALTER TABLE structure_sante ADD COLUMN IF NOT EXISTS secteur_rural BOOLEAN DEFAULT FALSE;
ALTER TABLE structure_sante ADD COLUMN IF NOT EXISTS telephone VARCHAR(255);
