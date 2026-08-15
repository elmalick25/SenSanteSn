package org.sensante.sn.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Enfant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long enfantId;

    private String nom;
    private String prenom;

    @Enumerated(EnumType.STRING)
    private Genre genre;

    private LocalDate dateNaissance;
    private String telephoneParent;
    private String qrCode;

}