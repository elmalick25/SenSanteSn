package org.sensante.sn.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PreuvePhotoRapport {
    private String titre;
    private String tag;
    private String heureGmt;
    @Column(columnDefinition = "TEXT")
    private String imageUrl;
    private String statutExif;
}
