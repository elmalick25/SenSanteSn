-- =============================================================================
-- SenSanté - V7 : comptes de démonstration (un par espace métier)
-- Mot de passe commun : Passw0rd!   (hash BCrypt)
-- =============================================================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_utilisateur_email ON utilisateur(email);

INSERT INTO utilisateur (type_utilisateur, nom, prenom, email, telephone, mot_de_passe, role, statut_compte)
SELECT 'PARENT', 'Diop', 'Awa', 'parent@sensante.sn', '+221 77 645 12 34', '$2a$10$EGIy5jAP811v8OPBA8DfmeGsGhmaY/ayTu.1fjBpHIqsLZgENtKbi', 'PARENT', 'ACTIF'
WHERE NOT EXISTS (SELECT 1 FROM utilisateur WHERE email = 'parent@sensante.sn');

INSERT INTO utilisateur (type_utilisateur, nom, prenom, email, telephone, mot_de_passe, role, statut_compte)
SELECT 'AGENT_SANTE', 'Ndiaye', 'Fatou', 'agent@sensante.sn', '770000002', '$2a$10$EGIy5jAP811v8OPBA8DfmeGsGhmaY/ayTu.1fjBpHIqsLZgENtKbi', 'AGENT_SANTE', 'ACTIF'
WHERE NOT EXISTS (SELECT 1 FROM utilisateur WHERE email = 'agent@sensante.sn');

INSERT INTO utilisateur (type_utilisateur, nom, prenom, email, telephone, mot_de_passe, role, statut_compte)
SELECT 'MEDECIN', 'Fall', 'Moussa', 'medecin@sensante.sn', '770000003', '$2a$10$EGIy5jAP811v8OPBA8DfmeGsGhmaY/ayTu.1fjBpHIqsLZgENtKbi', 'MEDECIN', 'ACTIF'
WHERE NOT EXISTS (SELECT 1 FROM utilisateur WHERE email = 'medecin@sensante.sn');

INSERT INTO utilisateur (type_utilisateur, nom, prenom, email, telephone, mot_de_passe, role, statut_compte)
SELECT 'SUPERVISEUR', 'Sow', 'Aminata', 'superviseur@sensante.sn', '770000004', '$2a$10$EGIy5jAP811v8OPBA8DfmeGsGhmaY/ayTu.1fjBpHIqsLZgENtKbi', 'SUPERVISEUR', 'ACTIF'
WHERE NOT EXISTS (SELECT 1 FROM utilisateur WHERE email = 'superviseur@sensante.sn');

INSERT INTO utilisateur (type_utilisateur, nom, prenom, email, telephone, mot_de_passe, role, statut_compte)
SELECT 'ADMINISTRATEUR', 'Gueye', 'Ibrahima', 'admin@sensante.sn', '770000005', '$2a$10$EGIy5jAP811v8OPBA8DfmeGsGhmaY/ayTu.1fjBpHIqsLZgENtKbi', 'ADMINISTRATEUR', 'ACTIF'
WHERE NOT EXISTS (SELECT 1 FROM utilisateur WHERE email = 'admin@sensante.sn');
