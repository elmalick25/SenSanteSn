-- =============================================================================
-- SenSanté - Migration Flyway V2 : Données de Référence Nationales MSAS
-- =============================================================================

-- Structures Sanitaires de Référence
INSERT INTO structure_sante (code_national, nom, type, statut, localisation, region, district, commune, latitude, longitude, gps_valide, capacite_lits, lits_reanimation, urgences247, bloc_operatoire)
VALUES 
('DK-MED-01', 'Centre de Santé Gaspard Kamara', 'CENTRE_DE_SANTE', 'OPERATIONNEL', 'Dakar Médina', 'Dakar', 'District Dakar Ouest', 'Médina', 14.6869, -17.4526, true, 45, 6, true, true),
('DK-FANN-01', 'CHU Fann - Pédiatrie', 'HOPITAL_NATIONAL', 'OPERATIONNEL', 'Fann Résidence', 'Dakar', 'District Dakar Ouest', 'Fann-Point E', 14.6922, -17.4690, true, 120, 18, true, true),
('DK-OUAK-01', 'Poste de Santé Ouakam', 'POSTE_DE_SANTE', 'OPERATIONNEL', 'Ouakam Village', 'Dakar', 'District Dakar Ouest', 'Ouakam', 14.7228, -17.4891, true, 12, 0, false, false)
ON CONFLICT (code_national) DO NOTHING;
