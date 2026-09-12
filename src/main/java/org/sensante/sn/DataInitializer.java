package org.sensante.sn;

import org.sensante.sn.Model.*;
import org.sensante.sn.Repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
@Profile({"dev", "default"})
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final EnfantRepository enfantRepository;
    private final BilanAnthroRepository bilanAnthroRepository;
    private final AlerteMASRepository alerteMASRepository;
    private final SupleNutritionnelRepository supleNutritionnelRepository;
    private final FicheSuiviRepository ficheSuiviRepository;
    private final StructureSanteRepository structureSanteRepository;
    private final AntecedentNeonatalRepository antecedentNeonatalRepository;
    private final VaccinEnfantRepository vaccinEnfantRepository;
    private final RendezVousRepository rendezVousRepository;
    private final ConsultationArchiveRepository consultationArchiveRepository;
    private final TraitementNutritionnelRepository traitementNutritionnelRepository;
    private final PriseNutritionnelleRepository priseNutritionnelleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    public DataInitializer(UtilisateurRepository utilisateurRepository,
                           EnfantRepository enfantRepository,
                           BilanAnthroRepository bilanAnthroRepository,
                           AlerteMASRepository alerteMASRepository,
                           SupleNutritionnelRepository supleNutritionnelRepository,
                           FicheSuiviRepository ficheSuiviRepository,
                           StructureSanteRepository structureSanteRepository,
                           AntecedentNeonatalRepository antecedentNeonatalRepository,
                           VaccinEnfantRepository vaccinEnfantRepository,
                           RendezVousRepository rendezVousRepository,
                           ConsultationArchiveRepository consultationArchiveRepository,
                           TraitementNutritionnelRepository traitementNutritionnelRepository,
                           PriseNutritionnelleRepository priseNutritionnelleRepository,
                           PasswordEncoder passwordEncoder,
                           JdbcTemplate jdbcTemplate) {
        this.utilisateurRepository = utilisateurRepository;
        this.enfantRepository = enfantRepository;
        this.bilanAnthroRepository = bilanAnthroRepository;
        this.alerteMASRepository = alerteMASRepository;
        this.supleNutritionnelRepository = supleNutritionnelRepository;
        this.ficheSuiviRepository = ficheSuiviRepository;
        this.structureSanteRepository = structureSanteRepository;
        this.antecedentNeonatalRepository = antecedentNeonatalRepository;
        this.vaccinEnfantRepository = vaccinEnfantRepository;
        this.rendezVousRepository = rendezVousRepository;
        this.consultationArchiveRepository = consultationArchiveRepository;
        this.traitementNutritionnelRepository = traitementNutritionnelRepository;
        this.priseNutritionnelleRepository = priseNutritionnelleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        // Nettoyer les anciennes contraintes PostgreSQL CHECK qui n'incluaient pas PARENT
        try {
            jdbcTemplate.execute("ALTER TABLE utilisateur DROP CONSTRAINT IF EXISTS utilisateur_role_check");
            jdbcTemplate.execute("ALTER TABLE utilisateur DROP CONSTRAINT IF EXISTS utilisateur_type_utilisateur_check");
        } catch (Exception e) {
            System.out.println("Note: Contraintes PostgreSQL vérifiées.");
        }

        initUsers();
        initBadgesData();
        initChildrenAndClinicalData();
        initCarnetData();
        initCroissanceHistorique();
        initRdvData();
    }

    private void initUsers() {
        // 1. Admin National MSAS
        String adminEmail = "admin@sensante.sn";
        Utilisateur adminExistant = utilisateurRepository.findByEmail(adminEmail).orElse(null);
        if (adminExistant == null) {
            Administrateur admin = new Administrateur();
            admin.setNom("Sow");
            admin.setPrenom("Dr. Ibrahima");
            admin.setNomUtilisateur("ibrahima.sow");
            admin.setEmail(adminEmail);
            admin.setTelephone("+221 33 800 00 01");
            admin.setDateNaissance(LocalDate.of(1978, 6, 20));
            admin.setAdresseActuelle("Fann Résidence, Dakar");
            admin.setAdressePermanente("Dakar, Sénégal");
            admin.setVille("Dakar");
            admin.setCodePostal("10200");
            admin.setPays("Sénégal");
            admin.setMotDePasse(passwordEncoder.encode("Admin@2025!"));
            admin.setRole(Role.ADMINISTRATEUR);
            utilisateurRepository.save(admin);
            System.out.println("✅ Compte administrateur initialisé : " + adminEmail);
        } else {
            adminExistant.setNom("Sow");
            adminExistant.setPrenom("Dr. Ibrahima");
            utilisateurRepository.save(adminExistant);
        }

        // 2. Médecin référent : Dr. Assane Malick Ndiaye (ass@malick.com)
        String medecinEmail = "ass@malick.com";
        if (utilisateurRepository.findByEmail(medecinEmail).isEmpty()) {
            Medecin medecin = new Medecin();
            medecin.setNom("Ndiaye");
            medecin.setPrenom("Dr. Assane Malick");
            medecin.setNomUtilisateur("dr.malick");
            medecin.setEmail(medecinEmail);
            medecin.setTelephone("+221 77 555 12 34");
            medecin.setDateNaissance(LocalDate.of(1988, 3, 20));
            medecin.setAdresseActuelle("Fann Résidence, Allée des Almadies");
            medecin.setAdressePermanente("Dakar, Sénégal");
            medecin.setVille("Dakar");
            medecin.setCodePostal("10500");
            medecin.setPays("Sénégal");
            medecin.setMotDePasse(passwordEncoder.encode("monpwd"));
            medecin.setRole(Role.MEDECIN);
            utilisateurRepository.save(medecin);
            System.out.println("✅ Compte Médecin initialisé : " + medecinEmail + " (Dr. Assane Malick Ndiaye)");
        }

        // 3. Superviseur de district : Ibrahima Seck
        String superviseurEmail = "superviseur@sensante.sn";
        if (utilisateurRepository.findByEmail(superviseurEmail).isEmpty()) {
            Superviseur superviseur = new Superviseur();
            superviseur.setNom("Seck");
            superviseur.setPrenom("Ibrahima");
            superviseur.setNomUtilisateur("ibrahima.seck");
            superviseur.setEmail(superviseurEmail);
            superviseur.setTelephone("+221 77 300 20 10");
            superviseur.setDateNaissance(LocalDate.of(1990, 8, 14));
            superviseur.setAdresseActuelle("District Sanitaire de Mbour");
            superviseur.setAdressePermanente("Thiès, Sénégal");
            superviseur.setVille("Mbour");
            superviseur.setCodePostal("23000");
            superviseur.setPays("Sénégal");
            superviseur.setMotDePasse(passwordEncoder.encode("Super@2025!"));
            superviseur.setRole(Role.SUPERVISEUR);
            utilisateurRepository.save(superviseur);
            System.out.println("✅ Compte Superviseur initialisé : " + superviseurEmail);
        }

        // 4. Parent / Tuteur référent : Aminata Ndiaye
        String parentEmail = "parent@sensante.sn";
        Utilisateur parentExistant = utilisateurRepository.findByEmail(parentEmail).orElse(null);
        if (parentExistant == null) {
            Parent parent = new Parent();
            parent.setNom("Ndiaye");
            parent.setPrenom("Aminata");
            parent.setNomUtilisateur("aminata.ndiaye");
            parent.setEmail(parentEmail);
            parent.setTelephone("+221 77 645 12 34");
            parent.setDateNaissance(LocalDate.of(1994, 1, 25));
            parent.setAdresseActuelle("Médina, Rue 6 x 11");
            parent.setAdressePermanente("Dakar, Sénégal");
            parent.setVille("Dakar");
            parent.setCodePostal("10000");
            parent.setPays("Sénégal");
            parent.setMotDePasse(passwordEncoder.encode("Parent@2025!"));
            parent.setRole(Role.PARENT);
            utilisateurRepository.save(parent);
            System.out.println("✅ Compte Parent initialisé : " + parentEmail);
        } else {
            parentExistant.setTelephone("+221 77 645 12 34");
            utilisateurRepository.save(parentExistant);
        }

        String mereEmail = "aminata.ndiaye@sensante.sn";
        if (utilisateurRepository.findByEmail(mereEmail).isEmpty()) {
            Parent parent2 = new Parent();
            parent2.setNom("Ndiaye");
            parent2.setPrenom("Aminata");
            parent2.setNomUtilisateur("aminata.ndiaye");
            parent2.setEmail(mereEmail);
            parent2.setTelephone("+221 77 645 12 34");
            parent2.setDateNaissance(LocalDate.of(1994, 1, 25));
            parent2.setAdresseActuelle("Médina, Rue 6 x 11");
            parent2.setAdressePermanente("Dakar, Sénégal");
            parent2.setVille("Dakar");
            parent2.setCodePostal("10000");
            parent2.setPays("Sénégal");
            parent2.setMotDePasse(passwordEncoder.encode("Parent@2025!"));
            parent2.setRole(Role.PARENT);
            utilisateurRepository.save(parent2);
            System.out.println("✅ Compte Parent 2 initialisé : " + mereEmail);
        }

        // 6. Dr. Babacar Fall — Pédiatre Box 04 (Espace Médecin Vue 1)
        String drFallEmail = "babacar.fall@sensante.sn";
        if (utilisateurRepository.findByEmail(drFallEmail).isEmpty()) {
            Medecin drFall = new Medecin();
            drFall.setNom("Fall");
            drFall.setPrenom("Babacar");
            drFall.setNomUtilisateur("babacar.fall");
            drFall.setEmail(drFallEmail);
            drFall.setTelephone("+221 77 432 89 01");
            drFall.setDateNaissance(LocalDate.of(1985, 4, 12));
            drFall.setAdresseActuelle("Plateau, Avenue Cheikh Anta Diop");
            drFall.setAdressePermanente("Dakar, Sénégal");
            drFall.setVille("Dakar");
            drFall.setCodePostal("10000");
            drFall.setPays("Sénégal");
            drFall.setMotDePasse(passwordEncoder.encode("Medecin@2025!"));
            drFall.setRole(Role.MEDECIN);
            drFall.setAvatarUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuD5w515RpsTCZq3bYV3IPRWenES_WpPWET4vwy8uD1zVJyT8ELNEwuNNj3ui_YOElStAk0G5mEyqhNID-r45iihYw3tPBKk7kPP5jlVgV9dWHE5QuSKw0ait3CBA8hW7MyC8GF_vtCJlH5Z6w3QlG57M2XXaR67zmoNujd3mVPoJPXQJ9kTF1E82ClHEyknxv5cFwTJBsdDrdWbpsaaOhdolRY7NuKLk-Lz2PtAtlxrhPUbhsuaZfqp");
            utilisateurRepository.save(drFall);
            System.out.println("✅ Compte Médecin Espace initialisé : " + drFallEmail + " (Dr. Babacar Fall — Pédiatre Box 04)");
        }
    }

    private void initBadgesData() {
        // 1. Dr. Mouhamadou Moustapha Kane (Médecin Chef Pédiatrie)
        String drKaneEmail = "moustapha.kane@sante.gouv.sn";
        if (utilisateurRepository.findByEmail(drKaneEmail).isEmpty()) {
            Medecin kane = new Medecin();
            kane.setNom("Kane");
            kane.setPrenom("Dr. Mouhamadou M.");
            kane.setNomUtilisateur("moustapha.kane");
            kane.setEmail(drKaneEmail);
            kane.setTelephone("+221 77 410 88 22");
            kane.setDateNaissance(LocalDate.of(1982, 5, 14));
            kane.setVille("Dakar");
            kane.setPays("Sénégal");
            kane.setMotDePasse(passwordEncoder.encode("Kane@2025!"));
            kane.setRole(Role.MEDECIN);
            kane.setAvatarUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuDfZkPQNUxl-f-4U80-V6tGP4H0XB5Acz6LbeLaDrPwwA80T2JlySyhwpsCj5imNdgxQaYWKz-rDc4ZBfIlZ4Zzfil3ZO8iK7UNPkch0pIBBz8c6pTGkiadok-kA4JxlK3H2vwPn9Ftn9h2uBoBReEc1dlWhjcLg9KNv9rJaWyzKtGBioUVs-GssVqAOXpNFCw8TEFr_39b6TkBZyZZvOK5E9MkiP8gz5EXxMJ1mvTO1-hhmyCh1riC");
            kane.setCni("1 751 1982 00482 14");
            kane.setNumeroOrdre("ONMS-SN-8492");
            kane.setTitrePoste("Pédiatrie & Urgences Néonatales");
            kane.setNomStructure("Hôpital Principal Dakar");
            kane.setCodeStructure("SN-DK-001");
            kane.setRegionSanitaire("Dakar");
            kane.setDistrictSanitaire("Dakar Centre (Plateau)");
            kane.setStatutCompte(StatutCompte.ACTIF);
            kane.setSecuriteMfa("FIDO2 / Biométrie");
            kane.setCodeBadge("SN-DK-001-KANE");
            kane.setAccreditation("Ordre Médecins ONMS-SN-8492");
            utilisateurRepository.save(kane);
            System.out.println("✅ Badge Praticien initialisé : Dr. Mouhamadou Moustapha Kane");
        }

        // 2. Aïssatou Diallo (Sage-Femme / Agent de Santé)
        String dialloEmail = "aissatou.diallo@choucair.sn";
        if (utilisateurRepository.findByEmail(dialloEmail).isEmpty()) {
            AgentSante diallo = new AgentSante();
            diallo.setNom("Diallo");
            diallo.setPrenom("Aïssatou");
            diallo.setNomUtilisateur("aissatou.diallo");
            diallo.setEmail(dialloEmail);
            diallo.setTelephone("+221 77 520 14 88");
            diallo.setDateNaissance(LocalDate.of(1991, 8, 22));
            diallo.setVille("Dakar");
            diallo.setPays("Sénégal");
            diallo.setMotDePasse(passwordEncoder.encode("Diallo@2025!"));
            diallo.setRole(Role.AGENT_SANTE);
            diallo.setAvatarUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuASNvDnwIXUbhnGkssQKIh6z42abNIzuE5AG7XUIJHfrySmnIYkoUsXE8onWI3Mg5j0jhTJdRm_L1Xkn1aJeU_irl7mR--GvHgFZ-jDGOilDSuxabbOSW-ektCrYnD5HxsGmPKBWnobxVIDbAyU893W8mbg5MgKpS6hZ5IB_iiN28f4sQDW0uFRfDYXLGl1ijhFyECTNY_ADfRcaLbd2Fzsn2kThj7OxwoYmuHlFqs1QLiIA89lMB0b");
            diallo.setCni("2 751 1991 00891 88");
            diallo.setMatriculeEtat("MAT-941802");
            diallo.setTitrePoste("Santé Maternelle & Vaccination");
            diallo.setNomStructure("CS Nabil Choucair");
            diallo.setCodeStructure("SN-DK-014");
            diallo.setRegionSanitaire("Dakar");
            diallo.setDistrictSanitaire("Dakar Nord");
            diallo.setStatutCompte(StatutCompte.ACTIF);
            diallo.setSecuriteMfa("OTP SMS Actif");
            diallo.setCodeBadge("SN-DK-014-DIALLO");
            diallo.setAccreditation("Matricule MAT-941802");
            utilisateurRepository.save(diallo);
            System.out.println("✅ Badge Praticienne initialisé : Aïssatou Diallo (CS Nabil Choucair)");
        }

        // 2b. Aïssatou Diop (Agent Terrain — Bajenu Gox Médina)
        String diopEmail = "aissatou.diop@sensante.sn";
        if (utilisateurRepository.findByEmail(diopEmail).isEmpty()) {
            AgentSante diop = new AgentSante();
            diop.setNom("Diop");
            diop.setPrenom("Aïssatou");
            diop.setNomUtilisateur("aissatou.diop");
            diop.setEmail(diopEmail);
            diop.setTelephone("+221 77 520 14 88");
            diop.setDateNaissance(LocalDate.of(1992, 4, 15));
            diop.setVille("Dakar");
            diop.setPays("Sénégal");
            diop.setMotDePasse(passwordEncoder.encode("Agent@2025!"));
            diop.setRole(Role.AGENT_SANTE);
            diop.setAvatarUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuAzCi3mC_GPkSix2r-PU1IR8QGQ7_gtYqKwfqZ9m4OaqxHbaYP5sLC4Q03w51nakEpn0YEf9vaXYT1O7LoU5P6gh1G3QDmRpU82OTQQvAgH4HcuSA2VbaTPWaFew8Mv6B52glopy6UuIIuW3RXi_eyCzWlRh3WAj-PZx-HN3HY05HI-QHt5zQhFtCCEmw2jBMu2SgZeNtrujJ7gHdoPMvu-eHDnmAm9E2-9WLYiLjHdnjGg8ebz-zBg");
            diop.setCni("2 751 1992 00412 88");
            diop.setMatriculeEtat("BG-MED-0412");
            diop.setTitrePoste("Agent Terrain — Bajenu Gox");
            diop.setNomStructure("Poste de Santé Médina");
            diop.setCodeStructure("SN-DK-MED-04");
            diop.setRegionSanitaire("Dakar");
            diop.setDistrictSanitaire("Dakar Ouest (Médina)");
            diop.setStatutCompte(StatutCompte.ACTIF);
            diop.setSecuriteMfa("OTP SMS Actif");
            diop.setCodeBadge("SN-DK-MED-DIOP");
            diop.setAccreditation("Réseau National Bajenu Gox MSAS");
            utilisateurRepository.save(diop);
            System.out.println("✅ Compte Agent Terrain Bajenu Gox initialisé : Aïssatou Diop (Poste Médina — Secteur 4)");
        }

        String genericAgentEmail = "agent@sensante.sn";
        if (utilisateurRepository.findByEmail(genericAgentEmail).isEmpty()) {
            AgentSante genericAgent = new AgentSante();
            genericAgent.setNom("Diop");
            genericAgent.setPrenom("Aïssatou");
            genericAgent.setNomUtilisateur("agent.terrain");
            genericAgent.setEmail(genericAgentEmail);
            genericAgent.setTelephone("+221 77 520 14 88");
            genericAgent.setDateNaissance(LocalDate.of(1992, 4, 15));
            genericAgent.setVille("Dakar");
            genericAgent.setPays("Sénégal");
            genericAgent.setMotDePasse(passwordEncoder.encode("Agent@2025!"));
            genericAgent.setRole(Role.AGENT_SANTE);
            genericAgent.setAvatarUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuAzCi3mC_GPkSix2r-PU1IR8QGQ7_gtYqKwfqZ9m4OaqxHbaYP5sLC4Q03w51nakEpn0YEf9vaXYT1O7LoU5P6gh1G3QDmRpU82OTQQvAgH4HcuSA2VbaTPWaFew8Mv6B52glopy6UuIIuW3RXi_eyCzWlRh3WAj-PZx-HN3HY05HI-QHt5zQhFtCCEmw2jBMu2SgZeNtrujJ7gHdoPMvu-eHDnmAm9E2-9WLYiLjHdnjGg8ebz-zBg");
            genericAgent.setTitrePoste("Agent Terrain — Bajenu Gox");
            genericAgent.setNomStructure("Poste de Santé Médina");
            genericAgent.setRegionSanitaire("Dakar");
            genericAgent.setDistrictSanitaire("Dakar Ouest (Médina)");
            genericAgent.setStatutCompte(StatutCompte.ACTIF);
            utilisateurRepository.save(genericAgent);
            System.out.println("✅ Compte Agent générique initialisé : agent@sensante.sn");
        }

        // 3. Enrichir le Super-Admin National (Dr. Ibrahima Sow)
        utilisateurRepository.findByEmail("admin@sensante.sn").ifPresent(admin -> {
            admin.setAvatarUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuBe27r99uMNjfFMBE_zz9BR4DYxiaM5uj5ZvgB48ZKMxxdBEylmOqecQqh8n2aNYkFWzf6InUsfbf4ebsGdEa5Hf5KZRcQYfXlk-pNK5tWilrCxbYjOwmCQx2CwTDXxl9E5_IQ9SCESDdnAxZ3p5cW8gkVLnuE6j_iIecKANK_pyu_yAgSOYrBI9quiPvqD4y9GVKpz_2qNHCK517-sFfJ7dHGp-25m6t88sSwtCsgC02WhYTNkWA_l");
            admin.setCni("1 751 1978 00122 92");
            admin.setTitrePoste("Direction des Systèmes d'Information");
            admin.setNomStructure("MSAS Ministère Central");
            admin.setCodeStructure("SN-MSAS-CAB-01");
            admin.setRegionSanitaire("Dakar");
            admin.setDistrictSanitaire("Dakar Centre");
            admin.setStatutCompte(StatutCompte.ACTIF);
            admin.setSecuriteMfa("Clé Matérielle PKI");
            admin.setCodeBadge("SN-MSAS-CAB-SOW-01");
            admin.setAccreditation("Décret #2023-1184");
            utilisateurRepository.save(admin);
        });

        // 4. Awa Diop (Superviseur District Thiès)
        String awaEmail = "awa.diop@thies.sante.sn";
        if (utilisateurRepository.findByEmail(awaEmail).isEmpty()) {
            Superviseur awa = new Superviseur();
            awa.setNom("Diop");
            awa.setPrenom("Awa");
            awa.setNomUtilisateur("awa.diop");
            awa.setEmail(awaEmail);
            awa.setTelephone("+221 77 630 45 10");
            awa.setDateNaissance(LocalDate.of(1989, 11, 3));
            awa.setVille("Thiès");
            awa.setPays("Sénégal");
            awa.setMotDePasse(passwordEncoder.encode("Diop@2025!"));
            awa.setRole(Role.SUPERVISEUR);
            awa.setAvatarUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuC18mLB1iykoVQHK7IQ1dWGh3z4QCr-ku8UeVNfMlNKuaZrSztmckKdDP4EEOCLinpdt4vp8ebh-WRqADHWjfNkMlrnZHf4vkz-lguhL7M2HCf-ca0WI6ZOzYjoYK-d-zZCWUm9D_J-O1M8hrFMhrC3KmfymF2UrLXlgW-KaSAsvaV3WKmS47yTift7nKPDJK0Z6Z1fwF27yyJgi1xKcWJ-4FfQOQvgb2LREWdH5fmRXX105di8kUtU");
            awa.setCni("2 751 1989 00412 45");
            awa.setTitrePoste("Coordination Sanitaire Régionale");
            awa.setNomStructure("Région Médicale de Thiès");
            awa.setCodeStructure("SN-TH-001");
            awa.setRegionSanitaire("Thiès");
            awa.setDistrictSanitaire("Thiès Centre");
            awa.setStatutCompte(StatutCompte.ACTIF);
            awa.setSecuriteMfa("App Authenticator");
            awa.setCodeBadge("SN-TH-001-DIOP");
            awa.setAccreditation("Arrêté ARR-TH-2022-77");
            utilisateurRepository.save(awa);
            System.out.println("✅ Badge Superviseur initialisé : Awa Diop (Thiès)");
        }

        // 5. Aminata Ndiaye (Parent / Carnet Numérique Citoyen)
        String aminataEmail = "aminata.ndiaye88@orange.sn";
        if (utilisateurRepository.findByEmail(aminataEmail).isEmpty()) {
            Parent parentCitoyen = new Parent();
            parentCitoyen.setNom("Ndiaye");
            parentCitoyen.setPrenom("Aminata");
            parentCitoyen.setNomUtilisateur("aminata.citoyen");
            parentCitoyen.setEmail(aminataEmail);
            parentCitoyen.setTelephone("+221 77 645 31 00");
            parentCitoyen.setDateNaissance(LocalDate.of(1994, 2, 10));
            parentCitoyen.setVille("Dakar");
            parentCitoyen.setPays("Sénégal");
            parentCitoyen.setMotDePasse(passwordEncoder.encode("Parent@2025!"));
            parentCitoyen.setRole(Role.PARENT);
            parentCitoyen.setAvatarUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuDqlmYmEFfeTY3yvRk2gdQ1WCPG8ssxVG_asYQ7Y1ikAGc7XmRmA3RmgzP1A89-oUJ8sXlGIe55GaLtIT_w909ysV9bb-WanMSdinV1lZHhL4_wEU6e68hJ_cG_o0vR8kOY-qATUcznBKYZLnB6bYqbqtjF_4qtxHvNRZ_ck0Z5U0bKtNGLfOwe-WO9i9oAk7Ymek_pKurYesT2H7Y6-LpDeiermqbWet3haaMwG8qpEnEpCnLZgu9v");
            parentCitoyen.setCni("2 751 1994 00645 31");
            parentCitoyen.setTitrePoste("Carnet Digital Pédiatrique (3 enfants)");
            parentCitoyen.setNomStructure("Portail Citoyen SenSanté");
            parentCitoyen.setCodeStructure("SN-CITOYEN");
            parentCitoyen.setRegionSanitaire("Dakar");
            parentCitoyen.setDistrictSanitaire("Dakar Plateau");
            parentCitoyen.setStatutCompte(StatutCompte.ACTIF);
            parentCitoyen.setSecuriteMfa("OTP SMS / WhatsApp");
            parentCitoyen.setCodeBadge("CITOYEN-DK-9021");
            parentCitoyen.setAccreditation("CNI Biométrique OK");
            parentCitoyen.setIdCarnet("CARNET-DK-9021");
            parentCitoyen.setEnfantsAssociesCount(3);
            utilisateurRepository.save(parentCitoyen);
            System.out.println("✅ Badge Citoyen initialisé : Aminata Ndiaye (CARNET-DK-9021)");
        }

        // 6. Cheikh Tidiane Bâ (Agent de Santé Suspendu - Kaolack)
        String baEmail = "cheikh.ba@poste-ndorong.sn";
        if (utilisateurRepository.findByEmail(baEmail).isEmpty()) {
            AgentSante ba = new AgentSante();
            ba.setNom("Bâ");
            ba.setPrenom("Cheikh Tidiane");
            ba.setNomUtilisateur("cheikh.ba");
            ba.setEmail(baEmail);
            ba.setTelephone("+221 77 340 66 12");
            ba.setDateNaissance(LocalDate.of(1986, 9, 17));
            ba.setVille("Kaolack");
            ba.setPays("Sénégal");
            ba.setMotDePasse(passwordEncoder.encode("Ba@2025!"));
            ba.setRole(Role.AGENT_SANTE);
            ba.setAvatarUrl(null); // Pas d'avatar -> Placeholder avec initiales "CB"
            ba.setCni("1 751 1986 00332 66");
            ba.setTitrePoste("Poste de Santé Ndorong");
            ba.setNomStructure("PS Ndorong (Kaolack)");
            ba.setCodeStructure("SN-KL-033");
            ba.setRegionSanitaire("Kaolack");
            ba.setDistrictSanitaire("Kaolack Commune");
            ba.setStatutCompte(StatutCompte.SUSPENDU);
            ba.setMotifSuspension("Inactivité > 30 jours");
            ba.setSecuriteMfa("Renouvellement OTP");
            ba.setCodeBadge("SN-KL-033-BA");
            ba.setAccreditation("Arrêté Suspension Temp.");
            utilisateurRepository.save(ba);
            System.out.println("✅ Profil Suspendu initialisé : Cheikh Tidiane Bâ (PS Ndorong)");
        }

        // Mettre à jour les utilisateurs préexistants sans statut
        utilisateurRepository.findAll().forEach(u -> {
            boolean updated = false;
            if (u.getStatutCompte() == null) {
                u.setStatutCompte(StatutCompte.ACTIF);
                updated = true;
            }
            if (u.getCodeBadge() == null) {
                u.setCodeBadge("BADGE-" + u.getIdUser() + "-" + (u.getRole() != null ? u.getRole().name() : "SN"));
                updated = true;
            }
            if (u.getSecuriteMfa() == null) {
                u.setSecuriteMfa("Double Facteur SMS");
                updated = true;
            }
            if (u.getRegionSanitaire() == null) {
                u.setRegionSanitaire("Dakar");
                updated = true;
            }
            if (u.getNomStructure() == null) {
                u.setNomStructure("Structure Non Définie");
                updated = true;
            }
            if (updated) {
                utilisateurRepository.save(u);
            }
        });
    }

    private void initChildrenAndClinicalData() {
        if (enfantRepository.count() > 0) {
            // S'assurer que les enfants de test sont bien rattachés au compte parent dédié
            Utilisateur parentCitoyen = utilisateurRepository.findByEmail("aminata.ndiaye88@orange.sn").orElse(null);
            enfantRepository.findAll().forEach(e -> {
                if (e.getPrenom() != null && (e.getPrenom().equalsIgnoreCase("Fatou") || e.getPrenom().equalsIgnoreCase("Moussa"))) {
                    boolean changed = false;
                    if (e.getTelephoneParent() == null || !e.getTelephoneParent().equals("+221 77 645 12 34")) {
                        e.setTelephoneParent("+221 77 645 12 34");
                        changed = true;
                    }
                    if (e.getParent() == null && parentCitoyen != null) {
                        e.setParent(parentCitoyen);
                        changed = true;
                    }
                    if (changed) {
                        enfantRepository.save(e);
                    }
                }
            });
            return;
        }

        // Enfant 1 : Fatou Diallo (MAS critique - PB: 108mm, Z-score: -3.4)
        Enfant e1 = new Enfant();
        e1.setPrenom("Fatou");
        e1.setNom("Diallo");
        e1.setGenre(Genre.FEMININ);
        e1.setDateNaissance(LocalDate.now().minusMonths(14));
        e1.setTelephoneParent("+221 77 645 12 34");
        e1.setQrCode("SN-DKR-2025-001");
        e1 = enfantRepository.save(e1);

        BilanAntro b1 = new BilanAntro();
        b1.setEnfant(e1);
        b1.setDateBilan(LocalDate.now().minusDays(1));
        b1.setPoids(6.2);
        b1.setTaille(72.0);
        b1.setPerimetreBrachial(10.8);
        b1.setZScorePoidsTaille(-3.4);
        b1.setZScorePoidsAge(-3.1);
        b1.setStatut(StatutNutritionnel.MAS);
        b1 = bilanAnthroRepository.save(b1);

        AlerteMAS a1 = new AlerteMAS();
        a1.setBilan(b1);
        a1.setDateAlerte(LocalDate.now().minusDays(1));
        a1.setMessage("URGENCE MAS : Périmètre brachial à 108mm (<115mm) et Z-score P/T à -3.4. Prise en charge CREN immédiate requise.");
        a1.setAcquittee(false);
        alerteMASRepository.save(a1);

        FicheSuivi f1 = new FicheSuivi();
        f1.setEnfant(e1);
        f1.setDateGeneration(LocalDate.now().minusDays(1));
        f1.setContenu("Dépistage terrain par Agent Santé. Référé d'urgence au Dr. Ndiaye pour admission CREN et test d'appétit Plumpy'Nut.");
        ficheSuiviRepository.save(f1);

        // Enfant 2 : Moussa Ndiaye (MAM - PB: 121mm, Z-score: -2.3)
        Enfant e2 = new Enfant();
        e2.setPrenom("Moussa");
        e2.setNom("Ndiaye");
        e2.setGenre(Genre.MASCULIN);
        e2.setDateNaissance(LocalDate.now().minusMonths(22));
        e2.setTelephoneParent("+221 77 645 12 34");
        e2.setQrCode("SN-DKR-2025-002");
        e2 = enfantRepository.save(e2);

        BilanAntro b2 = new BilanAntro();
        b2.setEnfant(e2);
        b2.setDateBilan(LocalDate.now().minusDays(3));
        b2.setPoids(9.1);
        b2.setTaille(81.5);
        b2.setPerimetreBrachial(12.1);
        b2.setZScorePoidsTaille(-2.3);
        b2.setZScorePoidsAge(-2.1);
        b2.setStatut(StatutNutritionnel.MAM);
        bilanAnthroRepository.save(b2);

        FicheSuivi f2 = new FicheSuivi();
        f2.setEnfant(e2);
        f2.setDateGeneration(LocalDate.now().minusDays(3));
        f2.setContenu("Demande de consultation de suivi MAM. Prescription de suppléments nutritionnels Plumpy'Sup (1 sachet/jour pendant 14 jours). Rendez-vous de contrôle dans 2 semaines.");
        ficheSuiviRepository.save(f2);

        // Enfant 3 : Aïcha Sow (MAS - PB: 112mm, Z-score: -3.1)
        Enfant e3 = new Enfant();
        e3.setPrenom("Aïcha");
        e3.setNom("Sow");
        e3.setGenre(Genre.FEMININ);
        e3.setDateNaissance(LocalDate.now().minusMonths(9));
        e3.setTelephoneParent("+221 70 892 11 00");
        e3.setQrCode("SN-DKR-2025-003");
        e3 = enfantRepository.save(e3);

        BilanAntro b3 = new BilanAntro();
        b3.setEnfant(e3);
        b3.setDateBilan(LocalDate.now().minusDays(2));
        b3.setPoids(5.4);
        b3.setTaille(66.0);
        b3.setPerimetreBrachial(11.2);
        b3.setZScorePoidsTaille(-3.1);
        b3.setZScorePoidsAge(-2.9);
        b3.setStatut(StatutNutritionnel.MAS);
        b3 = bilanAnthroRepository.save(b3);

        AlerteMAS a3 = new AlerteMAS();
        a3.setBilan(b3);
        a3.setDateAlerte(LocalDate.now().minusDays(2));
        a3.setMessage("Alerte MAS sévère : Nourrisson de 9 mois. Perte pondérale rapide.");
        a3.setAcquittee(false);
        alerteMASRepository.save(a3);

        // Enfant 4 : Ibrahim Ba (NORMAL - Suivi vaccinal & croissance)
        Enfant e4 = new Enfant();
        e4.setPrenom("Ibrahim");
        e4.setNom("Ba");
        e4.setGenre(Genre.MASCULIN);
        e4.setDateNaissance(LocalDate.now().minusMonths(18));
        e4.setTelephoneParent("+221 76 341 90 22");
        e4.setQrCode("SN-DKR-2025-004");
        e4 = enfantRepository.save(e4);

        BilanAntro b4 = new BilanAntro();
        b4.setEnfant(e4);
        b4.setDateBilan(LocalDate.now().minusDays(5));
        b4.setPoids(11.0);
        b4.setTaille(83.0);
        b4.setPerimetreBrachial(14.2);
        b4.setZScorePoidsTaille(0.2);
        b4.setZScorePoidsAge(0.1);
        b4.setStatut(StatutNutritionnel.NORMAL);
        bilanAnthroRepository.save(b4);

        // Enfant 5 : Aminata Gueye (MAM - En rémission post-traitement)
        Enfant e5 = new Enfant();
        e5.setPrenom("Aminata");
        e5.setNom("Gueye");
        e5.setGenre(Genre.FEMININ);
        e5.setDateNaissance(LocalDate.now().minusMonths(30));
        e5.setTelephoneParent("+221 77 112 33 44");
        e5.setQrCode("SN-DKR-2025-005");
        e5 = enfantRepository.save(e5);

        BilanAntro b5 = new BilanAntro();
        b5.setEnfant(e5);
        b5.setDateBilan(LocalDate.now().minusDays(7));
        b5.setPoids(10.8);
        b5.setTaille(88.0);
        b5.setPerimetreBrachial(12.4);
        b5.setZScorePoidsTaille(-1.8);
        b5.setZScorePoidsAge(-1.6);
        b5.setStatut(StatutNutritionnel.MAM);
        bilanAnthroRepository.save(b5);

        // Intrants nutritionnels en stock
        SupleNutritionnel sup1 = new SupleNutritionnel();
        sup1.setType("Plumpy'Nut (ATPE - RUTF)");
        sup1.setQuantiteStock(450);
        sup1.setDateDistribution(LocalDate.now());
        supleNutritionnelRepository.save(sup1);

        SupleNutritionnel sup2 = new SupleNutritionnel();
        sup2.setType("Lait Thérapeutique F-75 (Phase 1)");
        sup2.setQuantiteStock(120);
        sup2.setDateDistribution(LocalDate.now());
        supleNutritionnelRepository.save(sup2);

        SupleNutritionnel sup3 = new SupleNutritionnel();
        sup3.setType("Lait Thérapeutique F-100 (Phase Transition)");
        sup3.setQuantiteStock(180);
        sup3.setDateDistribution(LocalDate.now());
        supleNutritionnelRepository.save(sup3);

        SupleNutritionnel sup4 = new SupleNutritionnel();
        sup4.setType("Plumpy'Sup (RUSF - MAM)");
        sup4.setQuantiteStock(600);
        sup4.setDateDistribution(LocalDate.now());
        supleNutritionnelRepository.save(sup4);

        System.out.println("✅ Données cliniques et pédiatriques initialisées avec succès pour SenSanté.");
    }

    private void initCarnetData() {
        // 1. Structures de santé du Référentiel National MSAS
        StructureSante hpDakar = upsertStructure(
                "SN-DK-001", "Hôpital Principal de Dakar", TypeStructure.HOPITAL_NATIONAL, StatutStructure.OPERATIONNEL,
                "Dakar Plateau", "Dakar", "Dakar Centre", "Dakar Plateau",
                14.6648, -17.4330, true, AgrementCren.CRENI, 450, 40, true, true, false,
                "Dr. M. Diop", "+221 33 839 50 50"
        );

        StructureSante csNabil = upsertStructure(
                "SN-DK-014", "Centre de Santé Nabil Choucair", TypeStructure.CENTRE_DE_SANTE, StatutStructure.OPERATIONNEL,
                "Patte d'Oie", "Dakar", "Dakar Nord", "Patte d'Oie",
                14.7312, -17.4491, true, AgrementCren.CRENAS, 65, 6, true, true, false,
                "Dr. A. Fall", "+221 33 827 12 34"
        );

        StructureSante hrThies = upsertStructure(
                "SN-TH-022", "Hôpital Régional El Hadji Ahmadou Sakhir Ndiéguène", TypeStructure.HOPITAL_REGIONAL, StatutStructure.OPERATIONNEL,
                "Thiès Ville", "Thiès", "Thiès", "Thiès Ville",
                14.7892, -16.9261, true, AgrementCren.CRENI, 280, 20, true, true, false,
                "Pr. K. Kane", "+221 33 951 10 20"
        );

        StructureSante csSaintLouis = upsertStructure(
                "SN-SL-005", "Centre de Santé de Saint-Louis (Pointe Sud)", TypeStructure.CENTRE_DE_SANTE, StatutStructure.OPERATIONNEL,
                "Pointe Sud", "Saint-Louis", "Saint-Louis", "Saint-Louis",
                16.0211, -16.5052, true, AgrementCren.CRENAS, 52, 4, true, false, false,
                "Dr. F. Sarr", "+221 33 961 22 11"
        );

        StructureSante psKahone = upsertStructure(
                "SN-KL-031", "Poste de Santé de Kahone", TypeStructure.POSTE_DE_SANTE, StatutStructure.SOUS_SURVEILLANCE,
                "Kahone Centre", "Kaolack", "Kaolack", "Kahone",
                14.1542, -16.0381, true, AgrementCren.AUCUN, 12, 0, false, false, false,
                "ICP M. Ndour", "+221 33 941 33 44"
        );

        StructureSante csBignona = upsertStructure(
                "SN-ZG-012", "Centre de Santé de Bignona", TypeStructure.CENTRE_DE_SANTE, StatutStructure.OPERATIONNEL,
                "Bignona Centre", "Ziguinchor", "Bignona", "Bignona",
                12.8115, -16.2319, true, AgrementCren.CRENAS, 48, 4, true, false, false,
                "Dr. E. Badji", "+221 33 994 15 22"
        );

        StructureSante hrTouba = upsertStructure(
                "SN-TB-089", "Hôpital Matlaboul Fawzayni", TypeStructure.HOPITAL_REGIONAL, StatutStructure.OPERATIONNEL,
                "Touba Mosquée", "Diourbel", "Touba", "Touba",
                14.8624, -15.8790, true, AgrementCren.CRENI, 320, 25, true, true, false,
                "Dr. M. Cissé", "+221 33 978 80 00"
        );

        StructureSante psSalemata = upsertStructure(
                "SN-KD-004", "Poste de Santé de Salémata", TypeStructure.POSTE_DE_SANTE, StatutStructure.OPERATIONNEL,
                "Salémata Frontière", "Kédougou", "Salémata", "Salémata",
                12.6310, -12.8210, true, AgrementCren.CRENAS, 8, 0, false, false, true,
                "ICP Mme B. Diallo", "+221 33 981 10 05"
        );

        StructureSante posteYoff = upsertStructure(
                "SN-DK-002", "Poste de Santé Yoff - District Sanitaire Ouest", TypeStructure.POSTE_DE_SANTE, StatutStructure.OPERATIONNEL,
                "Yoff Village", "Dakar", "Dakar Ouest", "Yoff",
                14.7610, -17.4670, true, AgrementCren.CRENAM, 16, 0, false, false, false,
                "ICP P. Diagne", "+221 33 820 15 15"
        );

        StructureSante posteMedina = upsertStructure(
                "SN-DK-003", "Poste de Santé Médina", TypeStructure.POSTE_DE_SANTE, StatutStructure.OPERATIONNEL,
                "Médina Rue 6 x 11", "Dakar", "Dakar Centre", "Médina",
                14.6850, -17.4480, true, AgrementCren.CRENAS, 22, 0, false, false, false,
                "Dr. S. Ndiaye", "+221 33 822 45 67"
        );

        StructureSante chAbassNdao = upsertStructure(
                "SN-DK-004", "Centre Hospitalier Abass Ndao", TypeStructure.CENTRE_DE_SANTE, StatutStructure.OPERATIONNEL,
                "Avenue Cheikh Anta Diop", "Dakar", "Dakar Centre", "Fann-Point E",
                14.6880, -17.4600, true, AgrementCren.CRENI, 120, 10, true, true, false,
                "Pr. O. Gueye", "+221 33 839 70 70"
        );

        // 2. Mettre à jour les enfants existants
        List<Enfant> enfants = enfantRepository.findAll();
        for (Enfant e : enfants) {
            if (e.getGroupeSanguin() == null) {
                if (e.getPrenom() != null && e.getPrenom().equalsIgnoreCase("Fatou")) {
                    e.setGroupeSanguin("O+");
                    e.setStructureSante(posteMedina);
                } else if (e.getPrenom() != null && e.getPrenom().equalsIgnoreCase("Moussa")) {
                    e.setGroupeSanguin("B+");
                    e.setStructureSante(posteYoff);
                } else if (e.getPrenom() != null && e.getPrenom().equalsIgnoreCase("Aïcha")) {
                    e.setGroupeSanguin("A+");
                    e.setStructureSante(chAbassNdao);
                } else {
                    e.setGroupeSanguin("O+");
                    e.setStructureSante(posteYoff);
                }
                enfantRepository.save(e);
            }

            // Antécédents néonataux
            if (antecedentNeonatalRepository.findByEnfantEnfantId(e.getEnfantId()).isEmpty()) {
                AntecedentNeonatal ant = new AntecedentNeonatal();
                ant.setEnfant(e);
                if (e.getPrenom() != null && e.getPrenom().equalsIgnoreCase("Fatou")) {
                    ant.setPoidsNaissance(3.10);
                    ant.setTailleNaissance(49.0);
                    ant.setPerimetreCranien(34.5);
                    ant.setScoreApgar("9/10");
                    ant.setStatutDrepanocytose("AA");
                    ant.setModeAccouchement("Accouchement Voie Basse");
                    ant.setAllaitementMaternelExclusif(true);
                    ant.setMaterniteOrigine("Maternité Principale de Dakar");
                } else if (e.getPrenom() != null && e.getPrenom().equalsIgnoreCase("Moussa")) {
                    ant.setPoidsNaissance(3.45);
                    ant.setTailleNaissance(51.0);
                    ant.setPerimetreCranien(35.5);
                    ant.setScoreApgar("10/10");
                    ant.setStatutDrepanocytose("AS");
                    ant.setModeAccouchement("Accouchement Voie Basse");
                    ant.setAllaitementMaternelExclusif(true);
                    ant.setMaterniteOrigine("Maternité Poste de Santé Yoff");
                } else if (e.getPrenom() != null && e.getPrenom().equalsIgnoreCase("Aïcha")) {
                    ant.setPoidsNaissance(2.90);
                    ant.setTailleNaissance(48.0);
                    ant.setPerimetreCranien(34.0);
                    ant.setScoreApgar("8/10");
                    ant.setStatutDrepanocytose("AA");
                    ant.setModeAccouchement("Accouchement Césarienne");
                    ant.setAllaitementMaternelExclusif(false);
                    ant.setMaterniteOrigine("Maternité Abass Ndao");
                } else {
                    ant.setPoidsNaissance(3.25);
                    ant.setTailleNaissance(50.0);
                    ant.setPerimetreCranien(35.0);
                    ant.setScoreApgar("10/10");
                    ant.setStatutDrepanocytose("AA");
                    ant.setModeAccouchement("Accouchement Voie Basse");
                    ant.setAllaitementMaternelExclusif(true);
                    ant.setMaterniteOrigine("Maternité Principale de Dakar");
                }
                antecedentNeonatalRepository.save(ant);
            }

            // Vaccins clés de naissance
            if (vaccinEnfantRepository.findByEnfantEnfantIdOrderByDateAdministrationAsc(e.getEnfantId()).isEmpty()) {
                LocalDate dateN = e.getDateNaissance() != null ? e.getDateNaissance() : LocalDate.now().minusMonths(6);

                VaccinEnfant v1 = new VaccinEnfant();
                v1.setEnfant(e);
                v1.setCodeVaccin("BCG");
                v1.setNomVaccin("Vaccin antituberculeux (BCG)");
                v1.setDateAdministration(dateN);
                v1.setEffectue(true);
                v1.setAgentSanteNom("Sage-femme Ndoye");
                vaccinEnfantRepository.save(v1);

                VaccinEnfant v2 = new VaccinEnfant();
                v2.setEnfant(e);
                v2.setCodeVaccin("VPO 0");
                v2.setNomVaccin("Vaccin antipoliomyélitique oral 0");
                v2.setDateAdministration(dateN);
                v2.setEffectue(true);
                v2.setAgentSanteNom("Sage-femme Ndoye");
                vaccinEnfantRepository.save(v2);

                VaccinEnfant v3 = new VaccinEnfant();
                v3.setEnfant(e);
                v3.setCodeVaccin("Hépatite B0");
                v3.setNomVaccin("Vaccin hépatite B naissance (HepB 0)");
                v3.setDateAdministration(dateN);
                v3.setEffectue(true);
                v3.setAgentSanteNom("Sage-femme Ndoye");
                vaccinEnfantRepository.save(v3);
            }
        }
        System.out.println("✅ Données du Carnet de Santé & Passeport Sanitaire (Structures, Antécédents, Vaccins) initialisées.");
    }

    private void initCroissanceHistorique() {
        List<Enfant> enfants = enfantRepository.findAll();
        for (Enfant e : enfants) {
            List<BilanAntro> existants = bilanAnthroRepository.findByEnfantEnfantIdOrderByDateBilanAsc(e.getEnfantId());
            if (existants.size() <= 1) {
                LocalDate birth = e.getDateNaissance() != null ? e.getDateNaissance() : LocalDate.now().minusMonths(14);
                
                if (e.getPrenom() != null && e.getPrenom().equalsIgnoreCase("Fatou")) {
                    // Fatou Diallo: Courbe descendante menant à une alerte MAS
                    creerBilan(e, birth, 3.10, 49.0, 10.5, 0.05, 0.02, StatutNutritionnel.NORMAL);
                    creerBilan(e, birth.plusMonths(2), 4.90, 56.5, 12.0, -0.10, -0.15, StatutNutritionnel.NORMAL);
                    creerBilan(e, birth.plusMonths(4), 6.10, 62.0, 12.8, -0.15, -0.20, StatutNutritionnel.NORMAL);
                    creerBilan(e, birth.plusMonths(6), 6.40, 65.0, 12.9, -0.80, -0.90, StatutNutritionnel.NORMAL);
                    creerBilan(e, birth.plusMonths(8), 6.30, 67.5, 12.2, -1.70, -1.85, StatutNutritionnel.NORMAL);
                    creerBilan(e, birth.plusMonths(10), 6.25, 69.5, 11.5, -2.40, -2.55, StatutNutritionnel.MAM);
                    creerBilan(e, birth.plusMonths(14).minusDays(1), 6.20, 72.0, 10.8, -3.10, -3.40, StatutNutritionnel.MAS);
                } else if (e.getPrenom() != null && e.getPrenom().equalsIgnoreCase("Moussa")) {
                    // Moussa Ndiaye: Garçon avec trajectoire MAM
                    creerBilan(e, birth, 3.45, 51.0, 11.0, 0.10, 0.05, StatutNutritionnel.NORMAL);
                    creerBilan(e, birth.plusMonths(2), 5.40, 58.0, 13.0, 0.05, 0.00, StatutNutritionnel.NORMAL);
                    creerBilan(e, birth.plusMonths(6), 7.60, 67.0, 14.2, -0.25, -0.30, StatutNutritionnel.NORMAL);
                    creerBilan(e, birth.plusMonths(10), 8.80, 73.5, 14.5, -0.40, -0.50, StatutNutritionnel.NORMAL);
                    creerBilan(e, birth.plusMonths(14), 9.60, 78.0, 14.1, -0.90, -1.05, StatutNutritionnel.NORMAL);
                    creerBilan(e, birth.plusMonths(18), 9.30, 80.0, 12.8, -1.65, -1.80, StatutNutritionnel.NORMAL);
                    creerBilan(e, birth.plusMonths(22).minusDays(3), 9.10, 81.5, 12.1, -2.10, -2.30, StatutNutritionnel.MAM);
                } else if (e.getPrenom() != null && e.getPrenom().equalsIgnoreCase("Aïcha")) {
                    // Aïcha Sow: 9 mois
                    creerBilan(e, birth, 2.90, 48.0, 10.2, -0.20, -0.15, StatutNutritionnel.NORMAL);
                    creerBilan(e, birth.plusMonths(2), 4.40, 55.0, 11.8, -0.45, -0.40, StatutNutritionnel.NORMAL);
                    creerBilan(e, birth.plusMonths(4), 5.20, 60.0, 12.2, -0.95, -1.10, StatutNutritionnel.NORMAL);
                    creerBilan(e, birth.plusMonths(6), 5.50, 63.5, 11.8, -1.80, -2.05, StatutNutritionnel.MAM);
                    creerBilan(e, birth.plusMonths(9).minusDays(2), 5.40, 66.0, 11.2, -2.90, -3.10, StatutNutritionnel.MAS);
                }
            }
        }
        System.out.println("✅ Séries historiques de pesées OMS initialisées pour les enfants.");
    }

    private void creerBilan(Enfant e, LocalDate date, double poids, double taille, double pb, double zPoidsAge, double zPoidsTaille, StatutNutritionnel statut) {
        BilanAntro b = new BilanAntro();
        b.setEnfant(e);
        b.setDateBilan(date);
        b.setPoids(poids);
        b.setTaille(taille);
        b.setPerimetreBrachial(pb);
        b.setZScorePoidsAge(zPoidsAge);
        b.setZScorePoidsTaille(zPoidsTaille);
        b.setStatut(statut);
        bilanAnthroRepository.save(b);
    }

    private void initRdvData() {
        List<Enfant> enfants = enfantRepository.findAll();
        for (Enfant e : enfants) {
            List<RendezVous> existingRdv = rendezVousRepository.findByEnfantEnfantIdOrderByDateRendezVousAsc(e.getEnfantId());
            if (existingRdv.isEmpty()) {
                // Création d'un RDV de référence actif
                RendezVous rdv = RendezVous.builder()
                        .enfant(e)
                        .codeDossierRef("REF-SN-2025-8841")
                        .titre("Évaluation MAS & Protocole ATPE")
                        .typeConsultation("NUTRITION")
                        .dateRendezVous(LocalDate.now().plusDays(2))
                        .heureRendezVous(LocalTime.of(9, 30))
                        .statut(StatutRendezVous.CONFIRME)
                        .priorite("MODÉRÉE (J-2)")
                        .motifParent("Dépistage communautaire positif (PB < 11.5cm). Baisse d'appétit et perte de tonus constatées depuis 48h.")
                        .nomPraticien("Dr. Assane Malick Ndiaye")
                        .specialitePraticien("Pédiatre Nutritionniste")
                        .ordreMedecin("Ordre des Médecins N° 1042-SN")
                        .nomStructure("Poste de Santé de Medina-Gounass")
                        .localisationSalle("Bâtiment B - Niveau 1 - Cabinet 3")
                        .nomRelais("Badara Gueye")
                        .roleRelais("Médiateur communautaire référent")
                        .telephoneRelais("+221 77 412 89 00")
                        .telephoneStructure("+221 33 834 12 00")
                        .instructionsTuteur("Apporter le carnet de santé physique, la fiche d'enrôlement QR code, et veiller à ce que l'enfant soit à jeun 30 minutes avant le test de l'appétit (ATPE).")
                        .distanceEstimee("1.2 km (environ 15 min à pied)")
                        .crenauPropose("Matinée (09:00 - 11:30)")
                        .build();
                rendezVousRepository.save(rdv);
            }

            List<ConsultationArchive> existingArchives = consultationArchiveRepository.findByEnfantEnfantIdOrderByDateConsultationDesc(e.getEnfantId());
            if (existingArchives.isEmpty()) {
                // 1. Consultation Dépistage communautaire (il y a 14 jours)
                ConsultationArchive c1 = ConsultationArchive.builder()
                        .enfant(e)
                        .titre("Dépistage Communautaire & Pesée Mensuelle")
                        .categorie("NUTRITION")
                        .statutBadge("COMPLÉTÉ")
                        .dateConsultation(LocalDate.now().minusDays(14))
                        .nomStructure("Dispensaire Communautaire Medina-Gounass")
                        .nomPraticien("Badara Gueye (Relais de Santé)")
                        .notesCliniques("Périmètre brachial mesuré à 10.8 cm (Bandelette Shakhya rouge). Z-score P/T estimé à -3.4 ET. Déclenchement de la fiche de liaison et référence immédiate vers le Dr. Ndiaye.")
                        .poidsKg(6.20)
                        .perimetreBrachialCm(10.8)
                        .prescription("Plumpy'Nut d'attente (2 sachets test tolérance), référence urgente dispensaire.")
                        .referenceDocument("Fiche F-04 N° 2025-089")
                        .typeDocument("FICHE_F04")
                        .build();
                consultationArchiveRepository.save(c1);

                // 2. Consultation Suivi Nutritionnel (il y a 45 jours)
                ConsultationArchive c2 = ConsultationArchive.builder()
                        .enfant(e)
                        .titre("Suivi Nutritionnel Post-Sevrage & Pesée Trimestrielle")
                        .categorie("NUTRITION")
                        .statutBadge("ARCHIVÉ")
                        .dateConsultation(LocalDate.now().minusDays(45))
                        .nomStructure("Centre de Santé Gaspard Kamara")
                        .nomPraticien("Dr. Aïssatou Diop")
                        .notesCliniques("Ralentissement staturo-pondéral modéré. Pas d'oedèmes bilatéraux. Mère conseillée sur la diversification alimentaire locale (bouillie enrichie mil/arachide).")
                        .poidsKg(6.35)
                        .perimetreBrachialCm(11.9)
                        .prescription("Complémentation Vitamine A (200 000 UI) + Déparasitage Mebendazole 500mg.")
                        .referenceDocument("Ordonnance Ordo-Kamara-881")
                        .typeDocument("ORDONNANCE")
                        .build();
                consultationArchiveRepository.save(c2);

                // 3. Consultation Vaccination PEV (il y a 90 jours)
                ConsultationArchive c3 = ConsultationArchive.builder()
                        .enfant(e)
                        .titre("Séance de Vaccination PEV & Contrôle Pédiatrique")
                        .categorie("VACCINATION")
                        .statutBadge("VALIDÉ")
                        .dateConsultation(LocalDate.now().minusDays(90))
                        .nomStructure("Poste de Santé de Medina-Gounass")
                        .nomPraticien("Sage-femme Ndoye")
                        .notesCliniques("Administration des rappels Pentavalent 3 et VPO 3. Tolérance parfaite. Courbe de croissance stable.")
                        .poidsKg(6.40)
                        .perimetreBrachialCm(12.8)
                        .prescription("Paracétamol sirop 2.4% en cas de réaction fébrile.")
                        .referenceDocument("Certificat PEV N° SN-PEV-2024-912")
                        .typeDocument("CERTIFICAT_PEV")
                        .build();
                consultationArchiveRepository.save(c3);
            }
        }
        initTraitementsNutritionnels();
    }

    private void initTraitementsNutritionnels() {
        List<Enfant> enfants = enfantRepository.findAll();
        for (Enfant e : enfants) {
            TraitementNutritionnel existant = traitementNutritionnelRepository.findFirstByEnfantAndActifTrueOrderByIdDesc(e).orElse(null);
            if (existant == null) {
                TraitementNutritionnel t = TraitementNutritionnel.builder()
                        .enfant(e)
                        .protocole("Protocole National MAM • MSAS")
                        .nomTraitement("Suivi du Traitement Plumpy'Sup & Prévention MAM")
                        .produit("Plumpy'Sup")
                        .typeProduit("Pâte lipidique prête à l'emploi")
                        .numeroLot("Lot #PLU-2024-DK-890")
                        .description("Pâte lipidique prête à l'emploi pour la récupération pondérale rapide de l'enfant. Ne pas cuire, ne pas partager.")
                        .stockTotal(28)
                        .stockRestant(12)
                        .joursAutonomieEstimee(6)
                        .jourCureCourant(18)
                        .totalJoursCure(28)
                        .semaineCourante(3)
                        .totalSemaines(4)
                        .rationsParJourPrescrit(2)
                        .centreDotation("Poste de Santé Yoff")
                        .prescripteur("Dr. Babacar Fall • DS Dakar Ouest")
                        .conseillereNom("Badien Fatou Ndoye")
                        .conseillereTelephone("+221770000000")
                        .conseillereLieu("Poste de Santé Yoff Tonghor")
                        .dateDebut(LocalDate.now().minusDays(18))
                        .dateFinPrevue(LocalDate.now().plusDays(10))
                        .actif(true)
                        .build();
                t = traitementNutritionnelRepository.save(t);

                // Initialiser les prises du jour
                LocalDate today = LocalDate.now();

                // Dose 1 : 08:00
                PriseNutritionnelle d1 = PriseNutritionnelle.builder()
                        .traitement(t)
                        .datePrise(today)
                        .heurePrevue(LocalTime.of(8, 0))
                        .heureReelle(LocalTime.of(8, 14))
                        .typeRation("PLUMPY_SUP")
                        .titreRation("1 sachet Plumpy'Sup")
                        .statut("VALIDE")
                        .instructions("Pris avec eau tiède bouillie • Enregistré à 08:14")
                        .notesObservation("L'enfant a terminé l'intégralité de la ration sans régurgitation.")
                        .build();
                priseNutritionnelleRepository.save(d1);

                // Dose 2 : 13:00 (À donner maintenant)
                PriseNutritionnelle d2 = PriseNutritionnelle.builder()
                        .traitement(t)
                        .datePrise(today)
                        .heurePrevue(LocalTime.of(13, 0))
                        .typeRation("PLUMPY_SUP")
                        .titreRation("1 sachet Plumpy'Sup")
                        .statut("A_DONNER")
                        .instructions("Donner lentement par petites cuillères propres. Proposer de l'eau saine en parallèle.")
                        .notesObservation(null)
                        .build();
                priseNutritionnelleRepository.save(d2);

                // Dose 3 : 19:00 (Repas fortifié)
                PriseNutritionnelle d3 = PriseNutritionnelle.builder()
                        .traitement(t)
                        .datePrise(today)
                        .heurePrevue(LocalTime.of(19, 0))
                        .typeRation("REPAS_FORTIFIE_421")
                        .titreRation("Repas de Famille Fortifié")
                        .statut("PROGRAMME")
                        .instructions("Bouillie Enrichie 4:2:1 du soir (mil torréfié + niébé + pâte d'arachide + moringa).")
                        .notesObservation(null)
                        .build();
                priseNutritionnelleRepository.save(d3);
            }
        }
        System.out.println("✅ Données Pilulier & Traitements nutritionnels initialisées.");
    }

    private StructureSante upsertStructure(
            String codeNational, String nom, TypeStructure type, StatutStructure statut,
            String localisation, String region, String district, String commune,
            Double latitude, Double longitude, Boolean gpsValide, AgrementCren agrementCren,
            Integer capaciteLits, Integer litsReanimation, Boolean urgences247, Boolean blocOperatoire, Boolean secteurRural,
            String responsable, String telephone
    ) {
        StructureSante structure = structureSanteRepository.findByCodeNational(codeNational)
                .orElseGet(() -> StructureSante.builder().codeNational(codeNational).build());

        structure.setNom(nom);
        structure.setType(type);
        structure.setStatut(statut);
        structure.setLocalisation(localisation);
        structure.setRegion(region);
        structure.setDistrict(district);
        structure.setCommune(commune);
        structure.setLatitude(latitude);
        structure.setLongitude(longitude);
        structure.setGpsValide(gpsValide);
        structure.setAgrementCren(agrementCren);
        structure.setCapaciteLits(capaciteLits);
        structure.setLitsReanimation(litsReanimation);
        structure.setUrgences247(urgences247);
        structure.setBlocOperatoire(blocOperatoire);
        structure.setSecteurRural(secteurRural);
        structure.setResponsable(responsable);
        structure.setTelephone(telephone);

        return structureSanteRepository.save(structure);
    }
}

