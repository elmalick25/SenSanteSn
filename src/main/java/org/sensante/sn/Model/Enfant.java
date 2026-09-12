package org.sensante.sn.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "enfant")
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
    private String groupeSanguin;

    @ManyToOne
    @JoinColumn(name = "structure_sante_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "enfants"})
    private StructureSante structureSante;

    /**
     * Rattachement fort au compte parent propriétaire du dossier.
     * C'est la seule source de vérité pour l'isolation des données :
     * le téléphone du tuteur reste un simple champ d'état civil.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Utilisateur parent;

    /** Identifiant du parent propriétaire, exposé au frontend en lecture seule. */
    public Long getParentId() {
        return parent != null ? parent.getIdUser() : null;
    }

    /**
     * Champ virtuel sérialisé : retourne directement le nom du centre
     * pour éviter une requête supplémentaire côté frontend.
     */
    public String getStructureSanteNom() {
        return structureSante != null ? structureSante.getNom() : null;
    }

    public String getPhotoUrl() {
        String n = (prenom != null ? prenom : "") + "+" + (nom != null ? nom : "");
        return "https://ui-avatars.com/api/?name=" + n + "&background=0D9488&color=fff";
    }

    public String getAdresse() {
        return structureSante != null && structureSante.getLocalisation() != null ? structureSante.getLocalisation() : "Dakar, Sénégal";
    }
}
