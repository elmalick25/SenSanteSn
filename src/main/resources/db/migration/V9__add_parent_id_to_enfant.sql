-- =============================================================================
-- SenSanté - V9 : Ajout de la clé étrangère parent_id sur la table enfant
-- Permet l'isolation stricte par compte utilisateur (id_user)
-- =============================================================================

ALTER TABLE enfant
ADD COLUMN IF NOT EXISTS parent_id BIGINT REFERENCES utilisateur(id_user);

-- Associer les enfants de démonstration (Fatou et Moussa) au compte parent officiel de test
UPDATE enfant
SET parent_id = (SELECT id_user FROM utilisateur WHERE email = 'parent@sensante.sn' LIMIT 1)
WHERE parent_id IS NULL
  AND (enfant_id IN (1, 2) OR prenom IN ('Fatou', 'Moussa'));
