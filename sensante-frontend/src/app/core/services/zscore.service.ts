import { Injectable } from '@angular/core';

/**
 * Service de calcul du Z-Score basé sur les standards OMS de croissance de l'enfant.
 * Référence : WHO Child Growth Standards (2006) — Poids/Taille (P/T)
 * Méthode LMS : Z = ((X/M)^L - 1) / (L × S)
 *
 * Tables simplifiées : L (Box-Cox), M (médiane), S (coefficient de variation)
 * Source officielle : https://www.who.int/tools/child-growth-standards/standards/weight-for-length-height
 */
@Injectable({ providedIn: 'root' })
export class ZscoreService {

  // ──────────────────────────────────────────────────────────────────
  // Tables OMS P/T (Poids pour Taille) — Garçons — 45–110 cm (échantillon)
  // Format : { taille_cm: { L, M, S } }
  // ──────────────────────────────────────────────────────────────────
  private readonly wfhBoysTable: Record<number, { L: number; M: number; S: number }> = {
    45:  { L: -0.3521, M: 2.441,  S: 0.09182 },
    46:  { L: -0.3521, M: 2.588,  S: 0.09041 },
    47:  { L: -0.3521, M: 2.745,  S: 0.09006 },
    48:  { L: -0.3521, M: 2.906,  S: 0.08964 },
    49:  { L: -0.3521, M: 3.067,  S: 0.08935 },
    50:  { L: -0.3521, M: 3.232,  S: 0.08906 },
    51:  { L: -0.3521, M: 3.401,  S: 0.08880 },
    52:  { L: -0.3521, M: 3.576,  S: 0.08856 },
    53:  { L: -0.3521, M: 3.762,  S: 0.08875 },
    54:  { L: -0.3521, M: 3.964,  S: 0.08921 },
    55:  { L: -0.3521, M: 4.187,  S: 0.08972 },
    56:  { L: -0.3521, M: 4.427,  S: 0.09023 },
    57:  { L: -0.3521, M: 4.676,  S: 0.09062 },
    58:  { L: -0.3521, M: 4.924,  S: 0.09084 },
    59:  { L: -0.3521, M: 5.163,  S: 0.09094 },
    60:  { L: -0.3521, M: 5.388,  S: 0.09093 },
    61:  { L: -0.3521, M: 5.602,  S: 0.09088 },
    62:  { L: -0.3521, M: 5.810,  S: 0.09083 },
    63:  { L: -0.3521, M: 6.014,  S: 0.09075 },
    64:  { L: -0.3521, M: 6.215,  S: 0.09070 },
    65:  { L: -0.3521, M: 6.418,  S: 0.09073 },
    66:  { L: -0.3521, M: 6.625,  S: 0.09085 },
    67:  { L: -0.3521, M: 6.836,  S: 0.09098 },
    68:  { L: -0.3521, M: 7.050,  S: 0.09109 },
    69:  { L: -0.3521, M: 7.263,  S: 0.09118 },
    70:  { L: -0.3521, M: 7.474,  S: 0.09128 },
    71:  { L: -0.3521, M: 7.680,  S: 0.09137 },
    72:  { L: -0.3521, M: 7.880,  S: 0.09148 },
    73:  { L: -0.3521, M: 8.073,  S: 0.09159 },
    74:  { L: -0.3521, M: 8.258,  S: 0.09172 },
    75:  { L: -0.3521, M: 8.436,  S: 0.09186 },
    76:  { L: -0.3521, M: 8.607,  S: 0.09200 },
    77:  { L: -0.3521, M: 8.771,  S: 0.09211 },
    78:  { L: -0.3521, M: 8.928,  S: 0.09215 },
    79:  { L: -0.3521, M: 9.081,  S: 0.09218 },
    80:  { L: -0.3521, M: 9.234,  S: 0.09220 },
    81:  { L: -0.3521, M: 9.388,  S: 0.09222 },
    82:  { L: -0.3521, M: 9.543,  S: 0.09224 },
    83:  { L: -0.3521, M: 9.699,  S: 0.09226 },
    84:  { L: -0.3521, M: 9.856,  S: 0.09232 },
    85:  { L: -0.3521, M: 10.018, S: 0.09247 },
    86:  { L: -0.3521, M: 10.185, S: 0.09271 },
    87:  { L: -0.3521, M: 10.357, S: 0.09299 },
    88:  { L: -0.3521, M: 10.534, S: 0.09330 },
    89:  { L: -0.3521, M: 10.714, S: 0.09362 },
    90:  { L: -0.3521, M: 10.896, S: 0.09395 },
    91:  { L: -0.3521, M: 11.079, S: 0.09428 },
    92:  { L: -0.3521, M: 11.263, S: 0.09458 },
    93:  { L: -0.3521, M: 11.448, S: 0.09486 },
    94:  { L: -0.3521, M: 11.634, S: 0.09510 },
    95:  { L: -0.3521, M: 11.820, S: 0.09528 },
    96:  { L: -0.3521, M: 12.009, S: 0.09545 },
    97:  { L: -0.3521, M: 12.203, S: 0.09568 },
    98:  { L: -0.3521, M: 12.403, S: 0.09598 },
    99:  { L: -0.3521, M: 12.608, S: 0.09633 },
    100: { L: -0.3521, M: 12.815, S: 0.09669 },
    101: { L: -0.3521, M: 13.022, S: 0.09706 },
    102: { L: -0.3521, M: 13.231, S: 0.09740 },
    103: { L: -0.3521, M: 13.441, S: 0.09769 },
    104: { L: -0.3521, M: 13.653, S: 0.09793 },
    105: { L: -0.3521, M: 13.869, S: 0.09818 },
    106: { L: -0.3521, M: 14.090, S: 0.09847 },
    107: { L: -0.3521, M: 14.316, S: 0.09879 },
    108: { L: -0.3521, M: 14.545, S: 0.09914 },
    109: { L: -0.3521, M: 14.777, S: 0.09948 },
    110: { L: -0.3521, M: 15.014, S: 0.09983 }
  };

  // Tables filles (similaires, légèrement différentes)
  private readonly wfhGirlsTable: Record<number, { L: number; M: number; S: number }> = {
    45:  { L: -0.3833, M: 2.369,  S: 0.09613 },
    46:  { L: -0.3833, M: 2.517,  S: 0.09479 },
    47:  { L: -0.3833, M: 2.673,  S: 0.09431 },
    48:  { L: -0.3833, M: 2.837,  S: 0.09375 },
    49:  { L: -0.3833, M: 3.000,  S: 0.09323 },
    50:  { L: -0.3833, M: 3.165,  S: 0.09275 },
    55:  { L: -0.3833, M: 4.003,  S: 0.09081 },
    60:  { L: -0.3833, M: 5.165,  S: 0.09009 },
    65:  { L: -0.3833, M: 6.175,  S: 0.08978 },
    70:  { L: -0.3833, M: 7.090,  S: 0.09106 },
    75:  { L: -0.3833, M: 7.902,  S: 0.09190 },
    80:  { L: -0.3833, M: 8.673,  S: 0.09218 },
    85:  { L: -0.3833, M: 9.433,  S: 0.09284 },
    90:  { L: -0.3833, M: 10.199, S: 0.09441 },
    95:  { L: -0.3833, M: 11.020, S: 0.09580 },
    100: { L: -0.3833, M: 11.915, S: 0.09716 },
    105: { L: -0.3833, M: 12.932, S: 0.09883 },
    110: { L: -0.3833, M: 14.000, S: 0.10027 }
  };

  /**
   * Calcule le Z-Score Poids/Taille selon la méthode LMS OMS.
   *
   * @param poids - Poids en kg
   * @param taille - Taille en cm (45–110 cm)
   * @param genre - 'M' ou 'F'
   * @returns Z-Score arrondi à 2 décimales, ou null si hors plage
   *
   * Interprétation PCIMA :
   *   Z < -3  → MAS (Malnutrition Aiguë Sévère)
   *   -3 ≤ Z < -2 → MAM (Malnutrition Aiguë Modérée)
   *   Z ≥ -2  → NORMAL
   */
  calculateWFH(poids: number, taille: number, genre: 'M' | 'F'): number | null {
    if (!poids || !taille || poids <= 0 || taille <= 0) return null;

    const table = genre === 'M' ? this.wfhBoysTable : this.wfhGirlsTable;

    // Interpolation linéaire entre les deux tailles les plus proches
    const tailles = Object.keys(table).map(Number).sort((a, b) => a - b);
    const t = Math.round(taille);

    // Taille exacte en table
    if (table[t]) {
      return this._lmsFormula(poids, table[t]);
    }

    // Interpolation entre bornes
    const lower = tailles.filter(x => x <= taille).pop();
    const upper = tailles.find(x => x >= taille);
    if (lower === undefined || upper === undefined) return null;
    if (lower === upper) return this._lmsFormula(poids, table[lower]);

    const ratio = (taille - lower) / (upper - lower);
    const lowerLMS = table[lower];
    const upperLMS = table[upper];
    const interpolated = {
      L: lowerLMS.L + ratio * (upperLMS.L - lowerLMS.L),
      M: lowerLMS.M + ratio * (upperLMS.M - lowerLMS.M),
      S: lowerLMS.S + ratio * (upperLMS.S - lowerLMS.S)
    };

    return this._lmsFormula(poids, interpolated);
  }

  /** Formule LMS OMS : Z = ((X/M)^L - 1) / (L × S) */
  private _lmsFormula(X: number, { L, M, S }: { L: number; M: number; S: number }): number {
    const z = (Math.pow(X / M, L) - 1) / (L * S);
    // Ajustement SD3+ pour queues extrêmes (recommandation OMS)
    const cutAdj = 3;
    const zAdj = Math.abs(z) > cutAdj
      ? z > 0 ? cutAdj + (z - cutAdj) / 10 : -(cutAdj + (-z - cutAdj) / 10)
      : z;
    return Math.round(zAdj * 100) / 100;
  }

  /**
   * Classification nutritionnelle selon le Z-Score P/T et le MUAC.
   * Conforme au protocole PCIMA du Sénégal (MSAS 2019).
   */
  classify(zScore: number | null, muac: number, oedemes: boolean): {
    zone: 'MAS' | 'MAM' | 'NORMAL';
    label: string;
    badgeClass: string;
    description: string;
  } {
    // Œdèmes bilatéraux → MAS immédiate (indépendamment du Z-Score)
    if (oedemes) {
      return {
        zone: 'MAS',
        label: 'MAS — Œdèmes',
        badgeClass: 'badge-mas',
        description: 'Œdèmes bilatéraux — Référence urgente CRENI'
      };
    }

    // MUAC prend le dessus sur Z-Score pour dépistage communautaire
    if (muac < 11.5) {
      return {
        zone: 'MAS',
        label: 'MAS',
        badgeClass: 'badge-mas',
        description: `MUAC ${muac.toFixed(1)} cm < 11.5 cm — Prise en charge ATPE (Plumpy'Nut)`
      };
    }
    if (muac < 12.5) {
      return {
        zone: 'MAM',
        label: 'MAM',
        badgeClass: 'badge-mam',
        description: `MUAC ${muac.toFixed(1)} cm < 12.5 cm — Protocole MAM (Plumpy'Sup / Farines)`
      };
    }

    // Z-Score si disponible
    if (zScore !== null) {
      if (zScore < -3) {
        return {
          zone: 'MAS',
          label: 'MAS',
          badgeClass: 'badge-mas',
          description: `Z-Score P/T ${zScore} < -3 DS — Prise en charge CRENI/CRENAS`
        };
      }
      if (zScore < -2) {
        return {
          zone: 'MAM',
          label: 'MAM',
          badgeClass: 'badge-mam',
          description: `Z-Score P/T ${zScore} entre -3 et -2 DS — Protocole ambulatoire MAM`
        };
      }
    }

    return {
      zone: 'NORMAL',
      label: 'Normal',
      badgeClass: 'badge-normal',
      description: `MUAC ${muac.toFixed(1)} cm ≥ 12.5 cm — État nutritionnel satisfaisant`
    };
  }
}
