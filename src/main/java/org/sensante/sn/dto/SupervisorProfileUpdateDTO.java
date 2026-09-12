package org.sensante.sn.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupervisorProfileUpdateDTO {
    @NotBlank(message = "Le nom complet est obligatoire")
    private String fullName;

    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    private String phone;

    private String birthdate;
    private String address;
    private String preferredLanguage;
    private String avatarUrl;
}
