package org.sensante.sn.Model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "utilisateur")
@Data
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type_utilisateur", discriminatorType = DiscriminatorType.STRING)
public class Utilisateur implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUser;

    private String nom;
    private String prenom;
    private String nomUtilisateur;

    @Column(unique = true, nullable = false)
    private String email;

    private String telephone;

    private java.time.LocalDate dateNaissance;
    private String adresseActuelle;
    private String adressePermanente;
    private String ville;
    private String codePostal;
    private String pays;

    @Column(columnDefinition = "TEXT")
    private String avatarUrl;

    @Column(nullable = false)
    private String motDePasse;

    @Enumerated(EnumType.STRING)
    private Role role;

    // Champs spécifiques Badges & Habilitations Nationales MSAS
    @Column(length = 30)
    private String cni;

    @Column(length = 50)
    private String numeroOrdre;

    @Column(length = 50)
    private String matriculeEtat;

    @Column(length = 150)
    private String titrePoste;

    @Column(length = 50)
    private String codeStructure;

    @Column(length = 150)
    private String nomStructure;

    @Column(length = 100)
    private String regionSanitaire;

    @Column(length = 100)
    private String districtSanitaire;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private StatutCompte statutCompte = StatutCompte.ACTIF;

    @Column(length = 100)
    private String securiteMfa;

    @Column(length = 255)
    private String motifSuspension;

    @Column(length = 60, unique = true)
    private String codeBadge;

    @Column(length = 100)
    private String accreditation;

    @Column(length = 60)
    private String idCarnet;

    private Integer enfantsAssociesCount = 0;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (role == null) {
            return List.of();
        }
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return this.motDePasse;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}