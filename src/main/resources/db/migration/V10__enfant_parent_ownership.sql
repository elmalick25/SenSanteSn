-- =====================================================================
-- V10 : Rattachement fort des enfants à leur parent (isolation des comptes)
-- ---------------------------------------------------------------------
-- Avant cette migration, le lien parent <-> enfant reposait uniquement sur
-- une comparaison de chaînes (utilisateur.telephone = enfant.telephone_parent).
-- Un nouveau compte parent sans téléphone renseigné (ou sans correspondance)
-- se voyait donc attribuer des enfants d'autres familles.
-- On introduit une vraie clé étrangère enfant.parent_id -> utilisateur.id_user.
-- =====================================================================

ALTER TABLE enfant
    ADD COLUMN IF NOT EXISTS parent_id BIGINT;

-- Backfill : on rattache les dossiers existants au parent dont le numéro
-- de téléphone correspond exactement (en ignorant espaces et séparateurs).
UPDATE enfant e
SET parent_id = u.id_user
FROM utilisateur u
WHERE e.parent_id IS NULL
  AND u.role = 'PARENT'
  AND u.telephone IS NOT NULL
  AND e.telephone_parent IS NOT NULL
  AND regexp_replace(u.telephone, '[^0-9]', '', 'g') = regexp_replace(e.telephone_parent, '[^0-9]', '', 'g')
  AND regexp_replace(u.telephone, '[^0-9]', '', 'g') <> '';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_enfant_parent'
    ) THEN
        ALTER TABLE enfant
            ADD CONSTRAINT fk_enfant_parent
            FOREIGN KEY (parent_id) REFERENCES utilisateur (id_user)
            ON DELETE SET NULL;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_enfant_parent_id ON enfant (parent_id);
