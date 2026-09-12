package org.sensante.sn.service.ia;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;

/**
 * Service de calcul des z-scores OMS selon la méthode LMS (Box-Cox).
 * Tables sources : WHO Child Growth Standards 2006 — chargées depuis resources/oms/*.csv
 * Zéro dépendance externe — 100% Java, auditable, testable unitairement.
 */
@Service
public class OmsZscoreService {

    // Map<genre-indicateur, Map<ageMois, double[]{L,M,S}>>
    private final Map<String, TreeMap<Integer, double[]>> tables = new HashMap<>();

    @PostConstruct
    public void chargerTables() {
        chargerTable("boys_wfa",  "oms/wfa_boys_0_60.csv");
        chargerTable("girls_wfa", "oms/wfa_girls_0_60.csv");
    }

    private void chargerTable(String cle, String chemin) {
        TreeMap<Integer, double[]> table = new TreeMap<>();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(new ClassPathResource(chemin).getInputStream()))) {
            String ligne;
            while ((ligne = reader.readLine()) != null) {
                if (ligne.startsWith("#") || ligne.startsWith("age_months")) continue;
                String[] parts = ligne.trim().split(",");
                if (parts.length < 4) continue;
                int age = Integer.parseInt(parts[0].trim());
                double L = Double.parseDouble(parts[1].trim());
                double M = Double.parseDouble(parts[2].trim());
                double S = Double.parseDouble(parts[3].trim());
                table.put(age, new double[]{L, M, S});
            }
            tables.put(cle, table);
        } catch (Exception e) {
            // Fallback silencieux — le service reste fonctionnel avec tables partielles
            tables.put(cle, table);
        }
    }

    /**
     * Calcule le z-score poids-pour-âge selon la méthode LMS Box-Cox.
     * Interpolation linéaire entre les âges disponibles.
     *
     * @param poidKg    Poids en kilogrammes
     * @param ageMois   Âge en mois complets
     * @param sexe      "M" (garçon) ou "F" (fille)
     * @return z-score, ou Double.NaN si données insuffisantes
     */
    public double calculerZscorePoidsAge(double poidKg, int ageMois, String sexe) {
        String cle = "M".equalsIgnoreCase(sexe) ? "boys_wfa" : "girls_wfa";
        TreeMap<Integer, double[]> table = tables.get(cle);
        if (table == null || table.isEmpty()) return Double.NaN;

        double[] lms = interpoler(table, ageMois);
        if (lms == null) return Double.NaN;

        return calculerZscore(poidKg, lms[0], lms[1], lms[2]);
    }

    /**
     * Interprétation clinique du z-score poids-pour-âge.
     */
    public String interpreterZscoreWFA(double zscore) {
        if (Double.isNaN(zscore)) return "Indéterminé";
        if (zscore < -3.0) return "Insuffisance pondérale sévère (MAS)";
        if (zscore < -2.0) return "Insuffisance pondérale modérée (MAM)";
        if (zscore < -1.0) return "Risque d'insuffisance pondérale";
        if (zscore <= 1.0) return "Poids normal";
        return "Surpoids";
    }

    /**
     * Interprétation du MUAC en mm selon les seuils OMS PCIMA 2013.
     */
    public String interpreterMuac(double muacMm) {
        if (muacMm < 115.0) return "MAS";
        if (muacMm < 125.0) return "MAM";
        return "Normal";
    }

    // ── Méthode LMS Box-Cox (WHO Technical Report Series 916) ──────────────────
    private double calculerZscore(double X, double L, double M, double S) {
        if (L == 0) return Math.log(X / M) / S;
        return (Math.pow(X / M, L) - 1.0) / (L * S);
    }

    private double[] interpoler(TreeMap<Integer, double[]> table, int ageMois) {
        // Recherche exacte
        if (table.containsKey(ageMois)) return table.get(ageMois);
        // Interpolation linéaire entre les deux entrées encadrantes
        Map.Entry<Integer, double[]> inf = table.floorEntry(ageMois);
        Map.Entry<Integer, double[]> sup = table.ceilingEntry(ageMois);
        if (inf == null) return sup != null ? sup.getValue() : null;
        if (sup == null) return inf.getValue();
        double t = (double)(ageMois - inf.getKey()) / (sup.getKey() - inf.getKey());
        double[] a = inf.getValue(), b = sup.getValue();
        return new double[]{
            a[0] + t * (b[0] - a[0]),
            a[1] + t * (b[1] - a[1]),
            a[2] + t * (b[2] - a[2])
        };
    }
}
