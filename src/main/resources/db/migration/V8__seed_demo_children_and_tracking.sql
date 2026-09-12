-- =============================================================================
-- SenSanté - V8 : Données de Démonstration Cliniques & Pédiatriques Complètes
-- Rattachées au Compte Parent Officiel : parent@sensante.sn (+221 77 645 12 34)
-- =============================================================================

-- 1. Harmoniser le téléphone du compte parent de test
UPDATE utilisateur
SET telephone = '+221 77 645 12 34'
WHERE email = 'parent@sensante.sn';

-- Insérer le parent au cas où V7 ne l'aurait pas créé
INSERT INTO utilisateur (type_utilisateur, nom, prenom, nom_utilisateur, email, telephone, mot_de_passe, role, statut_compte)
VALUES ('PARENT', 'Ndiaye', 'Aminata', 'aminata.ndiaye', 'parent@sensante.sn', '+221 77 645 12 34', '$2a$10$EGIy5jAP811v8OPBA8DfmeGsGhmaY/ayTu.1fjBpHIqsLZgENtKbi', 'PARENT', 'ACTIF')
ON CONFLICT (email) DO UPDATE SET telephone = '+221 77 645 12 34';

-- 2. Garantir les structures sanitaires de rattachement
INSERT INTO structure_sante (code_national, nom, type, statut, localisation, region, district, commune, latitude, longitude, gps_valide, capacite_lits, lits_reanimation, urgences247, bloc_operatoire, agrement_cren)
VALUES
('SN-DK-003', 'Poste de Santé Médina', 'POSTE_DE_SANTE', 'OPERATIONNEL', 'Médina Rue 6 x 11', 'Dakar', 'Dakar Centre', 'Médina', 14.6850, -17.4480, true, 22, 0, false, false, 'CRENAS'),
('SN-DK-002', 'Poste de Santé Yoff', 'POSTE_DE_SANTE', 'OPERATIONNEL', 'Yoff Village', 'Dakar', 'Dakar Ouest', 'Yoff', 14.7610, -17.4670, true, 16, 0, false, false, 'CRENAM')
ON CONFLICT (code_national) DO NOTHING;

-- 3. Insérer les 2 Enfants de Démonstration liés au parent
INSERT INTO enfant (enfant_id, nom, prenom, genre, date_naissance, telephone_parent, qr_code, groupe_sanguin, structure_sante_id)
VALUES
(1, 'Diallo', 'Fatou', 'FEMININ', CURRENT_DATE - INTERVAL '14 months', '+221 77 645 12 34', 'SN-DKR-2025-001', 'O+', (SELECT id FROM structure_sante WHERE code_national = 'SN-DK-003' LIMIT 1)),
(2, 'Ndiaye', 'Moussa', 'MASCULIN', CURRENT_DATE - INTERVAL '22 months', '+221 77 645 12 34', 'SN-DKR-2025-002', 'B+', (SELECT id FROM structure_sante WHERE code_national = 'SN-DK-002' LIMIT 1))
ON CONFLICT (enfant_id) DO UPDATE
SET telephone_parent = '+221 77 645 12 34',
    nom = EXCLUDED.nom,
    prenom = EXCLUDED.prenom,
    genre = EXCLUDED.genre,
    groupe_sanguin = EXCLUDED.groupe_sanguin;

-- Réaligner la séquence enfant si besoin
SELECT setval('enfant_enfant_id_seq', GREATEST((SELECT MAX(enfant_id) FROM enfant), 10));

-- 4. Antécédents Néonataux
INSERT INTO antecedent_neonatal (poids_naissance, taille_naissance, perimetre_cranien, score_apgar, statut_drepanocytose, mode_accouchement, allaitement_maternel_exclusif, maternite_origine, enfant_id)
VALUES
(3.10, 49.0, 34.5, '9/10', 'AA', 'Accouchement Voie Basse', true, 'Maternité Principale de Dakar', 1),
(3.45, 51.0, 35.5, '10/10', 'AS', 'Accouchement Voie Basse', true, 'Maternité Poste de Santé Yoff', 2)
ON CONFLICT (enfant_id) DO NOTHING;

-- 5. Série Chronologique des Bilans Anthropométriques (Courbes OMS)
-- Fatou Diallo (Déclin vers MAS)
INSERT INTO bilan_antro (date_bilan, poids, taille, perimetre_brachial, z_score_poids_taille, z_score_poids_age, statut, oedemes, enfant_id)
VALUES
(CURRENT_DATE - INTERVAL '14 months', 3.10, 49.0, 10.5, 0.05, 0.02, 'NORMAL', false, 1),
(CURRENT_DATE - INTERVAL '12 months', 4.90, 56.5, 12.0, -0.10, -0.15, 'NORMAL', false, 1),
(CURRENT_DATE - INTERVAL '10 months', 6.10, 62.0, 12.8, -0.15, -0.20, 'NORMAL', false, 1),
(CURRENT_DATE - INTERVAL '8 months', 6.40, 65.0, 12.9, -0.80, -0.90, 'NORMAL', false, 1),
(CURRENT_DATE - INTERVAL '6 months', 6.30, 67.5, 12.2, -1.70, -1.85, 'NORMAL', false, 1),
(CURRENT_DATE - INTERVAL '4 months', 6.25, 69.5, 11.5, -2.40, -2.55, 'MAM', false, 1),
(CURRENT_DATE - INTERVAL '1 day', 6.20, 72.0, 10.8, -3.40, -3.10, 'MAS', false, 1);

-- Moussa Ndiaye (Trajectoire MAM)
INSERT INTO bilan_antro (date_bilan, poids, taille, perimetre_brachial, z_score_poids_taille, z_score_poids_age, statut, oedemes, enfant_id)
VALUES
(CURRENT_DATE - INTERVAL '22 months', 3.45, 51.0, 11.0, 0.10, 0.05, 'NORMAL', false, 2),
(CURRENT_DATE - INTERVAL '18 months', 5.40, 58.0, 13.0, 0.05, 0.00, 'NORMAL', false, 2),
(CURRENT_DATE - INTERVAL '14 months', 7.60, 67.0, 14.2, -0.25, -0.30, 'NORMAL', false, 2),
(CURRENT_DATE - INTERVAL '10 months', 8.80, 73.5, 14.5, -0.40, -0.50, 'NORMAL', false, 2),
(CURRENT_DATE - INTERVAL '6 months', 9.60, 78.0, 14.1, -0.90, -1.05, 'NORMAL', false, 2),
(CURRENT_DATE - INTERVAL '2 months', 9.30, 80.0, 12.8, -1.65, -1.80, 'NORMAL', false, 2),
(CURRENT_DATE - INTERVAL '3 days', 9.10, 81.5, 12.1, -2.30, -2.10, 'MAM', false, 2);

-- 6. Alerte MAS active pour Fatou Diallo
INSERT INTO alerte_mas (date_alerte, message, acquittee, bilan_id)
SELECT CURRENT_DATE - INTERVAL '1 day',
       'URGENCE MAS : Périmètre brachial à 108mm (<115mm) et Z-score P/T à -3.4. Prise en charge CREN immédiate requise.',
       false,
       b.id
FROM bilan_antro b
WHERE b.enfant_id = 1 AND b.statut = 'MAS'
ORDER BY b.id DESC LIMIT 1
ON CONFLICT (bilan_id) DO NOTHING;

-- 7. Fiche de Suivi
INSERT INTO fiche_suivi (date_generation, contenu, enfant_id)
VALUES
(CURRENT_DATE - INTERVAL '1 day', 'Dépistage terrain par Agent Santé. Référé d''urgence pour admission CRENAS et test d''appétit Plumpy''Nut.', 1),
(CURRENT_DATE - INTERVAL '3 days', 'Consultation de suivi MAM. Prescription Plumpy''Sup 1 sachet/jour pendant 14 jours.', 2);

-- 8. Vaccins Enfant (PEV National)
INSERT INTO vaccin_enfant (code_vaccin, nom_vaccin, date_administration, effectue, agent_sante_nom, enfant_id)
VALUES
('BCG', 'Vaccin antituberculeux (BCG)', CURRENT_DATE - INTERVAL '14 months', true, 'Sage-femme Ndoye', 1),
('VPO 0', 'Vaccin antipoliomyélitique oral 0', CURRENT_DATE - INTERVAL '14 months', true, 'Sage-femme Ndoye', 1),
('HepB 0', 'Vaccin hépatite B naissance', CURRENT_DATE - INTERVAL '14 months', true, 'Sage-femme Ndoye', 1),
('Penta 1', 'Pentavalent 1 (DTC-HepB-Hib)', CURRENT_DATE - INTERVAL '12 months', true, 'Sage-femme Ndoye', 1),
('Penta 2', 'Pentavalent 2 (DTC-HepB-Hib)', CURRENT_DATE - INTERVAL '10 months', true, 'Sage-femme Ndoye', 1),
('Penta 3', 'Pentavalent 3 (DTC-HepB-Hib)', CURRENT_DATE - INTERVAL '8 months', true, 'Sage-femme Ndoye', 1),
('VAR 1', 'Vaccin antirougeoleux 1', CURRENT_DATE - INTERVAL '5 months', true, 'Sage-femme Ndoye', 1),
('BCG', 'Vaccin antituberculeux (BCG)', CURRENT_DATE - INTERVAL '22 months', true, 'Sage-femme Ndoye', 2),
('VPO 0', 'Vaccin antipoliomyélitique oral 0', CURRENT_DATE - INTERVAL '22 months', true, 'Sage-femme Ndoye', 2),
('HepB 0', 'Vaccin hépatite B naissance', CURRENT_DATE - INTERVAL '22 months', true, 'Sage-femme Ndoye', 2),
('Penta 1', 'Pentavalent 1 (DTC-HepB-Hib)', CURRENT_DATE - INTERVAL '20 months', true, 'Sage-femme Ndoye', 2);

-- 9. Rendez-Vous Médicaux (Zéro Attente)
INSERT INTO rendez_vous (enfant_id, code_dossier_ref, titre, type_consultation, date_rendez_vous, heure_rendez_vous, statut, priorite, motif_parent, nom_praticien, specialite_praticien, ordre_medecin, nom_structure, localisation_salle, nom_relais, role_relais, telephone_relais, telephone_structure, instructions_tuteur, distance_estimee, crenau_propose)
VALUES
(1, 'REF-SN-2025-8841', 'Évaluation MAS & Protocole ATPE', 'NUTRITION', CURRENT_DATE + INTERVAL '2 days', '09:30:00', 'CONFIRME', 'MODÉRÉE (J-2)', 'Dépistage communautaire positif (PB < 11.5cm). Perte d''appétit constatée.', 'Dr. Assane Malick Ndiaye', 'Pédiatre Nutritionniste', 'Ordre des Médecins N° 1042-SN', 'Poste de Santé Médina', 'Bâtiment B - Box 3', 'Badara Gueye', 'Médiateur communautaire référent', '+221 77 412 89 00', '+221 33 834 12 00', 'Apporter le carnet de santé et veiller à ce que l''enfant soit à jeun 30 minutes avant le test d''appétit.', '1.2 km (environ 15 min à pied)', 'Matinée (09:00 - 11:30)'),
(2, 'REF-SN-2025-8842', 'Contrôle Évolution MAM & Dotation', 'NUTRITION', CURRENT_DATE + INTERVAL '5 days', '10:00:00', 'CONFIRME', 'STANDARD', 'Visite de contrôle quinzaine sous Plumpy''Sup.', 'Dr. Babacar Fall', 'Médecin Généraliste', 'Ordre des Médecins N° 2188-SN', 'Poste de Santé Yoff', 'Cabinet 04', 'Aïssatou Diop', 'Bajenu Gox Secteur Yoff', '+221 77 520 14 88', '+221 33 820 15 15', 'Pesée de suivi et vérification du carnet de santé.', '2.0 km', 'Matinée (10:00 - 12:00)');

-- 10. Consultations Archivées (Historique Médical 360)
INSERT INTO consultation_archive (enfant_id, date_consultation, titre, categorie, statut_badge, nom_structure, nom_praticien, notes_cliniques, poids_kg, perimetre_brachial_cm, prescription, reference_document)
VALUES
(1, CURRENT_DATE - INTERVAL '14 days', 'Dépistage Communautaire & Pesée Mensuelle', 'NUTRITION', 'COMPLÉTÉ', 'Dispensaire Communautaire Medina-Gounass', 'Badara Gueye (Relais)', 'Périmètre brachial mesuré à 10.8 cm. Référence immédiate vers CRENAS.', 6.20, 10.8, 'Plumpy''Nut d''attente (2 sachets test tolérance).', 'Fiche F-04 N° 2025-089'),
(1, CURRENT_DATE - INTERVAL '45 days', 'Suivi Nutritionnel Post-Sevrage', 'NUTRITION', 'ARCHIVÉ', 'Centre de Santé Gaspard Kamara', 'Dr. Aïssatou Diop', 'Ralentissement pondéral modéré. Conseils sur bouillies enrichies locales.', 6.35, 11.9, 'Complémentation Vitamine A (200 000 UI) + Mebendazole 500mg.', 'Ordonnance Ordo-Kamara-881'),
(1, CURRENT_DATE - INTERVAL '90 days', 'Séance Vaccination PEV & Contrôle Pédiatrique', 'VACCINATION', 'VALIDÉ', 'Poste de Santé Médina', 'Sage-femme Ndoye', 'Administration des rappels Pentavalent et VPO. Tolérance parfaite.', 6.40, 12.8, 'Paracétamol sirop 2.4% si fièvre.', 'Certificat PEV N° SN-PEV-2024-912'),
(2, CURRENT_DATE - INTERVAL '20 days', 'Consultation MAM & Bilan de Croissance', 'NUTRITION', 'COMPLÉTÉ', 'Poste de Santé Yoff', 'Dr. Babacar Fall', 'Ralentissement staturo-pondéral modéré. Début de cure Plumpy''Sup.', 9.15, 12.1, 'Plumpy''Sup 1 sachet/jour pendant 28 jours.', 'Ordo-Yoff-2024-441');

-- 11. Traitements Nutritionnels Actifs (Pilulier)
INSERT INTO traitement_nutritionnel (enfant_id, protocole, nom_traitement, produit, type_produit, numero_lot, description, stock_total, stock_restant, jours_autonomie_estimee, jour_cure_courant, total_jours_cure, semaine_courante, total_semaines, rations_par_jour_prescrit, centre_dotation, prescripteur, conseillere_nom, conseillere_telephone, conseillere_lieu, date_debut, date_fin_prevue, actif)
VALUES
(1, 'Protocole National MAS • MSAS', 'Cure RUTF Plumpy''Nut & Réhabilitation Nutritionnelle', 'Plumpy''Nut', 'Pâte lipidique prête à l''emploi (ATPE)', 'Lot #PLU-2024-DK-890', 'Pâte nutritionnelle hautement énergétique. Ne pas cuire, ne pas diluer.', 28, 12, 6, 17, 28, 3, 4, 2, 'Poste de Santé Médina', 'Dr. Assane Malick Ndiaye', 'Badien Fatou Ndoye', '+221 77 000 00 00', 'Poste de Santé Médina', CURRENT_DATE - INTERVAL '17 days', CURRENT_DATE + INTERVAL '11 days', true),
(2, 'Protocole National MAM • MSAS', 'Supplémentation Plumpy''Sup', 'Plumpy''Sup', 'Pâte lipidique prête à l''emploi (RUSF)', 'Lot #RUSF-2024-DK-112', 'Supplémentation pour malnutrition modérée.', 28, 18, 9, 10, 28, 2, 4, 2, 'Poste de Santé Yoff', 'Dr. Babacar Fall', 'Aïssatou Diop', '+221 77 520 14 88', 'Poste de Santé Yoff', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '18 days', true);

-- 12. Prises Nutritionnelles du Jour (Pilulier interactif)
INSERT INTO prise_nutritionnelle (traitement_id, date_prise, heure_prevue, heure_reelle, type_ration, titre_ration, statut, instructions, notes_observation)
SELECT t.id, CURRENT_DATE, '08:00:00', '08:14:00', 'PLUMPY_NUT', '1 sachet Plumpy''Nut', 'VALIDE', 'Pris avec eau saine bouillie • Enregistré à 08:14', 'Ration terminée sans régurgitation.'
FROM traitement_nutritionnel t WHERE t.enfant_id = 1 AND t.actif = true ORDER BY t.id DESC LIMIT 1;

INSERT INTO prise_nutritionnelle (traitement_id, date_prise, heure_prevue, heure_reelle, type_ration, titre_ration, statut, instructions, notes_observation)
SELECT t.id, CURRENT_DATE, '13:00:00', NULL, 'PLUMPY_NUT', '1 sachet Plumpy''Nut', 'A_DONNER', 'Donner lentement par petites cuillères propres. Proposer de l''eau saine.', NULL
FROM traitement_nutritionnel t WHERE t.enfant_id = 1 AND t.actif = true ORDER BY t.id DESC LIMIT 1;

INSERT INTO prise_nutritionnelle (traitement_id, date_prise, heure_prevue, heure_reelle, type_ration, titre_ration, statut, instructions, notes_observation)
SELECT t.id, CURRENT_DATE, '19:00:00', NULL, 'REPAS_FORTIFIE_421', 'Repas de Famille Fortifié', 'PROGRAMME', 'Bouillie enrichie 4:2:1 du soir (mil + niébé + pâte d''arachide).', NULL
FROM traitement_nutritionnel t WHERE t.enfant_id = 1 AND t.actif = true ORDER BY t.id DESC LIMIT 1;
