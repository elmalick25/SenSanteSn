package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PreuvePhotoDTO {
    private String titre;
    private String tag;
    private String heureGmt;
    private String imageUrl;
    private String statutExif;
}
