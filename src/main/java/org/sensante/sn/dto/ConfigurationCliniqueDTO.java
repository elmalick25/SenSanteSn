package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfigurationCliniqueDTO {
    // Métadonnées d'Audit Institutionnel
    private String versionProtocole; // "OMS / MSAS 2024"
    private LocalDate derniereRevisionDate; // e.g. 2024-02-02
    private String derniereRevisionTexte; // "02 Fév 2024"
    private String modifiePar; // "Dr. Ibrahima Sow"
    private String titreAuteur; // "Super-Admin National MSAS"
    private int postesSynchronisesCount; // 1428
    private int modificationsEnAttenteCount; // e.g. 4
    private double coefficientTamponPna; // 1.25

    // Modules Métiers
    private MuacThresholdsDTO muac;
    private QueueBufferConfigDTO queueBuffer;
    private List<ZScoreReferenceRowDTO> zscoreRows;
    private List<AtpeTierDTO> atpeTiers;
}
