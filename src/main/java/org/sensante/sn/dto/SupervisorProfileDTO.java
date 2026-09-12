package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupervisorProfileDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String birthdate;
    private String address;
    private String districtName;
    private String regionName;
    private String matricule;
    private String roleLabel;
    private String avatarUrl;
    private String lastSyncDate;
    private String preferredLanguage; // "fr" | "wo"
    private Integer totalStructuresSupervised;
    private Double conformityRate;
    private boolean msasAccreditationActive;
    private List<SupervisedStructureDTO> structures;
}
