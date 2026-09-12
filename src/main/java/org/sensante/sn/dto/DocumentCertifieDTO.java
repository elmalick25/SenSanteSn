package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentCertifieDTO {
    private String id;
    private String titre;
    private String description;
    private LocalDate dateSignature;
    private String tailleFichier;
    private String nomSignataire;
    private String roleSignataire;
    private String empreinteSecurite;
    private String typeDocument;
}
