-- =============================================================================
-- SenSanté - Migration Flyway V1 : Initialisation Complète du Schéma Relationnel
-- Standard 20/20 : Intégrité Référentielle, Séquences Atomiques & Index Optimisés
-- =============================================================================

-- 1. Séquences Métier Sécurisées (Zéro Math.random)
CREATE SEQUENCE IF NOT EXISTS seq_dossier_medical START WITH 1001 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS seq_ordonnance START WITH 1001 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS seq_bon_transfert START WITH 101 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS seq_bon_commande_pna START WITH 101 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS seq_certificat_msas START WITH 101 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS seq_code_securite START WITH 1001 INCREMENT BY 1;

-- 2. Structure Sanitaire
CREATE TABLE IF NOT EXISTS structure_sante (
    id BIGSERIAL PRIMARY KEY,
    code_national VARCHAR(255) UNIQUE,
    nom VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    statut VARCHAR(255) DEFAULT 'OPERATIONNEL',
    localisation VARCHAR(255),
    region VARCHAR(255),
    district VARCHAR(255),
    commune VARCHAR(255),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    gps_valide BOOLEAN DEFAULT FALSE,
    agrement_cren VARCHAR(255) DEFAULT 'AUCUN',
    capacite_lits INTEGER DEFAULT 0,
    lits_reanimation INTEGER DEFAULT 0,
    urgences247 BOOLEAN DEFAULT FALSE,
    bloc_operatoire BOOLEAN DEFAULT FALSE
);

-- 3. Utilisateurs & Acteurs de Santé (Héritage Single Table)
CREATE TABLE IF NOT EXISTS utilisateur (
    id_user BIGSERIAL PRIMARY KEY,
    type_utilisateur VARCHAR(31) NOT NULL,
    nom VARCHAR(255),
    prenom VARCHAR(255),
    nom_utilisateur VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(255),
    date_naissance DATE,
    adresse_actuelle VARCHAR(255),
    adresse_permanente VARCHAR(255),
    ville VARCHAR(255),
    code_postal VARCHAR(255),
    pays VARCHAR(255),
    avatar_url TEXT,
    mot_de_passe VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    cni VARCHAR(30),
    numero_ordre VARCHAR(50),
    matricule_etat VARCHAR(50),
    titre_poste VARCHAR(150),
    code_structure VARCHAR(50),
    nom_structure VARCHAR(150),
    region_sanitaire VARCHAR(100),
    district_sanitaire VARCHAR(100),
    statut_compte VARCHAR(30) DEFAULT 'ACTIF',
    securite_mfa VARCHAR(100),
    motif_suspension VARCHAR(255),
    code_badge VARCHAR(60) UNIQUE,
    accreditation VARCHAR(100),
    id_carnet VARCHAR(60),
    enfants_associes_count INTEGER DEFAULT 0
);

-- 4. Enfant (Bénéficiaire Suivi)
CREATE TABLE IF NOT EXISTS enfant (
    enfant_id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(255),
    prenom VARCHAR(255),
    genre VARCHAR(255),
    date_naissance DATE,
    telephone_parent VARCHAR(255),
    qr_code VARCHAR(255),
    groupe_sanguin VARCHAR(255),
    structure_sante_id BIGINT REFERENCES structure_sante(id)
);

-- 5. Bilan Anthropométrique (Nutrition OMS)
CREATE TABLE IF NOT EXISTS bilan_antro (
    id BIGSERIAL PRIMARY KEY,
    date_bilan DATE,
    poids DOUBLE PRECISION,
    taille DOUBLE PRECISION,
    perimetre_brachial DOUBLE PRECISION,
    z_score_poids_taille DOUBLE PRECISION,
    z_score_poids_age DOUBLE PRECISION,
    statut VARCHAR(255),
    oedemes BOOLEAN DEFAULT FALSE,
    enfant_id BIGINT REFERENCES enfant(enfant_id),
    agent_id BIGINT REFERENCES utilisateur(id_user),
    structure_sante_id BIGINT REFERENCES structure_sante(id)
);

-- 6. Alerte MAS
CREATE TABLE IF NOT EXISTS alerte_mas (
    id BIGSERIAL PRIMARY KEY,
    date_alerte DATE,
    message VARCHAR(255),
    acquittee BOOLEAN DEFAULT FALSE,
    bilan_id BIGINT UNIQUE REFERENCES bilan_antro(id)
);

-- 7. Antécédents Néonatals
CREATE TABLE IF NOT EXISTS antecedent_neonatal (
    id BIGSERIAL PRIMARY KEY,
    poids_naissance DOUBLE PRECISION,
    taille_naissance DOUBLE PRECISION,
    perimetre_cranien DOUBLE PRECISION,
    score_apgar VARCHAR(255),
    statut_drepanocytose VARCHAR(255),
    mode_accouchement VARCHAR(255),
    allaitement_maternel_exclusif BOOLEAN DEFAULT TRUE,
    maternite_origine VARCHAR(255),
    enfant_id BIGINT UNIQUE REFERENCES enfant(enfant_id)
);

-- 8. Consultation Archive (Historique Médical 360)
CREATE TABLE IF NOT EXISTS consultation_archive (
    id BIGSERIAL PRIMARY KEY,
    enfant_id BIGINT NOT NULL REFERENCES enfant(enfant_id),
    date_consultation DATE,
    titre VARCHAR(255),
    categorie VARCHAR(255),
    statut_badge VARCHAR(255),
    nom_structure VARCHAR(255),
    nom_praticien VARCHAR(255),
    notes_cliniques TEXT,
    poids_kg DOUBLE PRECISION,
    perimetre_brachial_cm DOUBLE PRECISION,
    prescription VARCHAR(255),
    reference_document VARCHAR(255)
);

-- 9. Fiche de Suivi
CREATE TABLE IF NOT EXISTS fiche_suivi (
    id BIGSERIAL PRIMARY KEY,
    date_generation DATE,
    contenu TEXT,
    enfant_id BIGINT REFERENCES enfant(enfant_id)
);

-- 10. Missions de Terrain
CREATE TABLE IF NOT EXISTS mission_terrain (
    id BIGSERIAL PRIMARY KEY,
    code_mission VARCHAR(30) NOT NULL UNIQUE,
    zone_ciblee VARCHAR(120) NOT NULL,
    poste_sante VARCHAR(150),
    agent_nom VARCHAR(120) NOT NULL,
    agent_initiale VARCHAR(10),
    agent_statut VARCHAR(50),
    objectif_chiffre TEXT,
    progression INTEGER DEFAULT 0,
    cible_atteinte INTEGER DEFAULT 0,
    cible_totale INTEGER DEFAULT 50,
    date_limite DATE,
    heure_echeance TIME,
    echeance_libelle VARCHAR(60),
    priorite VARCHAR(30) NOT NULL DEFAULT 'NORMALE',
    statut VARCHAR(30) NOT NULL DEFAULT 'A_INTERVENIR',
    dotation_muac BOOLEAN DEFAULT TRUE,
    dotation_atpe BOOLEAN DEFAULT TRUE,
    dotation_registres BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cree_par VARCHAR(100)
);

-- 11. Rapports de Mission de Terrain
CREATE TABLE IF NOT EXISTS rapports_mission_terrain (
    id BIGSERIAL PRIMARY KEY,
    numero_rapport VARCHAR(50) NOT NULL UNIQUE,
    type_mission VARCHAR(40) NOT NULL,
    titre_mission VARCHAR(120) NOT NULL,
    agent_nom VARCHAR(100) NOT NULL,
    agent_role VARCHAR(100),
    agent_initiales VARCHAR(10),
    zone_ciblee VARCHAR(150) NOT NULL,
    poste_sante VARCHAR(150),
    distance_foyer_metres INTEGER,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geofence_conforme BOOLEAN,
    heure_check_in VARCHAR(20),
    heure_check_out VARCHAR(20),
    duree_terrain VARCHAR(50),
    enfants_depistes INTEGER,
    cible_initiale INTEGER,
    taux_cible_pourcent INTEGER,
    mas_detectes INTEGER,
    mam_detectes INTEGER,
    atpe_delivres_cartons INTEGER,
    lot_atpe VARCHAR(50),
    observations_terrain TEXT,
    priorite_clinique VARCHAR(30),
    date_soumission TIMESTAMP,
    temps_relatif VARCHAR(50),
    statut_validation VARCHAR(30) NOT NULL,
    motif_complement TEXT,
    commentaire_medecin_chef TEXT
);

-- 12. Preuves Photos de Rapport de Mission
CREATE TABLE IF NOT EXISTS rapport_preuves_photos (
    rapport_id BIGINT NOT NULL REFERENCES rapports_mission_terrain(id) ON DELETE CASCADE,
    titre VARCHAR(255),
    tag VARCHAR(255),
    heure_gmt VARCHAR(255),
    image_url TEXT,
    statut_exif VARCHAR(255)
);

-- 13. Traitement Nutritionnel
CREATE TABLE IF NOT EXISTS traitement_nutritionnel (
    id BIGSERIAL PRIMARY KEY,
    enfant_id BIGINT NOT NULL REFERENCES enfant(enfant_id),
    protocole VARCHAR(255),
    nom_traitement VARCHAR(255),
    produit VARCHAR(255),
    type_produit VARCHAR(255),
    numero_lot VARCHAR(255),
    description VARCHAR(255),
    stock_total INTEGER,
    stock_restant INTEGER,
    jours_autonomie_estimee INTEGER,
    jour_cure_courant INTEGER,
    total_jours_cure INTEGER,
    semaine_courante INTEGER,
    total_semaines INTEGER,
    rations_par_jour_prescrit INTEGER,
    centre_dotation VARCHAR(255),
    prescripteur VARCHAR(255),
    conseillere_nom VARCHAR(255),
    conseillere_telephone VARCHAR(255),
    conseillere_lieu VARCHAR(255),
    date_debut DATE,
    date_fin_prevue DATE,
    actif BOOLEAN DEFAULT TRUE
);

-- 14. Prise Nutritionnelle
CREATE TABLE IF NOT EXISTS prise_nutritionnelle (
    id BIGSERIAL PRIMARY KEY,
    traitement_id BIGINT NOT NULL REFERENCES traitement_nutritionnel(id) ON DELETE CASCADE,
    date_prise DATE,
    heure_prevue TIME,
    heure_reelle TIME,
    type_ration VARCHAR(255),
    titre_ration VARCHAR(255),
    statut VARCHAR(255),
    instructions VARCHAR(255),
    notes_observation VARCHAR(255)
);

-- 15. Rapport Superviseur
CREATE TABLE IF NOT EXISTS rapport (
    id BIGSERIAL PRIMARY KEY,
    date_generation DATE,
    type_rapport VARCHAR(255),
    taux_guerison DOUBLE PRECISION,
    taux_abandon DOUBLE PRECISION,
    zone_prevalence VARCHAR(255),
    superviseur_id BIGINT REFERENCES utilisateur(id_user)
);

-- 16. Rendez-Vous Médicaux
CREATE TABLE IF NOT EXISTS rendez_vous (
    id BIGSERIAL PRIMARY KEY,
    enfant_id BIGINT NOT NULL REFERENCES enfant(enfant_id),
    code_dossier_ref VARCHAR(255),
    titre VARCHAR(255),
    type_consultation VARCHAR(255),
    date_rendez_vous DATE,
    heure_rendez_vous TIME,
    statut VARCHAR(255) NOT NULL,
    priorite VARCHAR(255),
    motif_parent TEXT,
    nom_praticien VARCHAR(255),
    specialite_praticien VARCHAR(255),
    ordre_medecin VARCHAR(255),
    nom_structure VARCHAR(255),
    localisation_salle VARCHAR(255),
    nom_relais VARCHAR(255),
    role_relais VARCHAR(255),
    telephone_relais VARCHAR(255),
    telephone_structure VARCHAR(255),
    instructions_tuteur TEXT,
    distance_estimee VARCHAR(255),
    crenau_propose VARCHAR(255),
    photo_jointes_info VARCHAR(255)
);

-- 17. Supplément Nutritionnel
CREATE TABLE IF NOT EXISTS suple_nutritionnel (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(255),
    quantite_stock INTEGER,
    date_distribution DATE,
    enfant_id BIGINT REFERENCES enfant(enfant_id)
);

-- 18. Vaccins Enfant (PEV Sénégal)
CREATE TABLE IF NOT EXISTS vaccin_enfant (
    id BIGSERIAL PRIMARY KEY,
    code_vaccin VARCHAR(255),
    nom_vaccin VARCHAR(255),
    date_administration DATE,
    effectue BOOLEAN DEFAULT FALSE,
    agent_sante_nom VARCHAR(255),
    enfant_id BIGINT REFERENCES enfant(enfant_id)
);

-- =============================================================================
-- Index de Performance pour les Requêtes Fréquentes & Télémétrie
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_enfant_qr_code ON enfant(qr_code);
CREATE INDEX IF NOT EXISTS idx_bilan_enfant_id ON bilan_antro(enfant_id);
CREATE INDEX IF NOT EXISTS idx_bilan_date ON bilan_antro(date_bilan);
CREATE INDEX IF NOT EXISTS idx_bilan_statut ON bilan_antro(statut);
CREATE INDEX IF NOT EXISTS idx_rdv_enfant_id ON rendez_vous(enfant_id);
CREATE INDEX IF NOT EXISTS idx_rdv_date_statut ON rendez_vous(date_rendez_vous, statut);
CREATE INDEX IF NOT EXISTS idx_alerte_mas_acquittee ON alerte_mas(acquittee);
CREATE INDEX IF NOT EXISTS idx_consultation_enfant ON consultation_archive(enfant_id);
CREATE INDEX IF NOT EXISTS idx_traitement_enfant ON traitement_nutritionnel(enfant_id);
CREATE INDEX IF NOT EXISTS idx_vaccin_enfant ON vaccin_enfant(enfant_id);
