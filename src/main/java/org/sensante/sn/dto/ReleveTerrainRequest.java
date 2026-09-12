package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReleveTerrainRequest {
    private String concessionId;
    private int enfantsExamines;
    private int casMas;
    private int casMam;
    private int atpeDelivres;
    private String noteVocaleDuree;
    private String noteVocaleTranscription;
    private boolean noteVocaleEnregistree;
    private String signatureAuteur;
    private boolean eauPurifieeRemise;
    private boolean ficheLiaisonTamponnee;
    private boolean miseEnAttente;
    private boolean alerteSamu;
}
