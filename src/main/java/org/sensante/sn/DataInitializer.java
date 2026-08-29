package org.sensante.sn;

import org.sensante.sn.Model.*;
import org.sensante.sn.Repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final EnfantRepository enfantRepository;
    private final BilanAnthroRepository bilanAnthroRepository;
    private final AlerteMASRepository alerteMASRepository;
    private final SupleNutritionnelRepository supleNutritionnelRepository;
    private final FicheSuiviRepository ficheSuiviRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UtilisateurRepository utilisateurRepository,
                           EnfantRepository enfantRepository,
                           BilanAnthroRepository bilanAnthroRepository,
                           AlerteMASRepository alerteMASRepository,
                           SupleNutritionnelRepository supleNutritionnelRepository,
                           FicheSuiviRepository ficheSuiviRepository,
                           PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.enfantRepository = enfantRepository;
        this.bilanAnthroRepository = bilanAnthroRepository;
        this.alerteMASRepository = alerteMASRepository;
        this.supleNutritionnelRepository = supleNutritionnelRepository;
        this.ficheSuiviRepository = ficheSuiviRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        initUsers();
        initChildrenAndClinicalData();
    }

    private void initUsers() {
        // 1. Admin
        String adminEmail = "admin@sensante.sn";
        if (utilisateurRepository.findByEmail(adminEmail).isEmpty()) {
            Administrateur admin = new Administrateur();
            admin.setNom("Admin");
            admin.setPrenom("SenSanté");
            admin.setEmail(adminEmail);
            admin.setTelephone("+221 33 800 00 01");
            admin.setMotDePasse(passwordEncoder.encode("Admin@2025!"));
            admin.setRole(Role.ADMINISTRATEUR);
            utilisateurRepository.save(admin);
            System.out.println("✅ Compte administrateur initialisé : " + adminEmail);
        }

        // 2. Médecin référent : Dr. Assane Malick Ndiaye (ass@malick.com)
        String medecinEmail = "ass@malick.com";
        if (utilisateurRepository.findByEmail(medecinEmail).isEmpty()) {
            Medecin medecin = new Medecin();
            medecin.setNom("Ndiaye");
            medecin.setPrenom("Dr. Assane Malick");
            medecin.setEmail(medecinEmail);
            medecin.setTelephone("+221 77 555 12 34");
            medecin.setMotDePasse(passwordEncoder.encode("monpwd"));
            medecin.setRole(Role.MEDECIN);
            utilisateurRepository.save(medecin);
            System.out.println("✅ Compte Médecin initialisé : " + medecinEmail + " (Dr. Assane Malick Ndiaye)");
        }
    }

    private void initChildrenAndClinicalData() {
        if (enfantRepository.count() > 0) {
            return;
        }

        // Enfant 1 : Fatou Diallo (MAS critique - PB: 108mm, Z-score: -3.4)
        Enfant e1 = new Enfant();
        e1.setPrenom("Fatou");
        e1.setNom("Diallo");
        e1.setGenre(Genre.FEMININ);
        e1.setDateNaissance(LocalDate.now().minusMonths(14));
        e1.setTelephoneParent("+221 77 645 88 12");
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
        e2.setTelephoneParent("+221 78 230 45 67");
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
}
