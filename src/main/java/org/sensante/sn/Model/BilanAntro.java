package org.sensante.sn.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "bilan_antro")
@Getter
@Setter
public class BilanAntro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dateBilan;
    private Double poids;
    private Double taille;
    private Double perimetreBrachial;
    private Double zScorePoidsTaille;
    private Double zScorePoidsAge;

    @Enumerated(EnumType.STRING)
    private StatutNutritionnel statut;

    private Boolean oedemes = false;

    @ManyToOne
    @JoinColumn(name = "enfant_id")
    private Enfant enfant;

    @ManyToOne
    @JoinColumn(name = "agent_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"motDePasse", "authorities"})
    private Utilisateur agentSaisie;

    @ManyToOne
    @JoinColumn(name = "structure_sante_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"enfants"})
    private StructureSante structureSante;

    @OneToOne(mappedBy = "bilan")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("bilan")
    private AlerteMAS alerte;

    public Long getBilanId() {
        return this.id;
    }

    public void setBilanId(Long bilanId) {
        this.id = bilanId;
    }

    public Boolean getOedemes() {
        return Boolean.TRUE.equals(this.oedemes);
    }

    public void setOedemes(Boolean oedemes) {
        this.oedemes = oedemes;
    }

    public String getExaminateur() {
        if (agentSaisie != null) {
            String p = agentSaisie.getPrenom() != null ? agentSaisie.getPrenom() : "";
            String n = agentSaisie.getNom() != null ? agentSaisie.getNom() : "";
            String full = (p + " " + n).trim();
            if (!full.isEmpty()) return full;
        }
        return "Praticien Nutritionniste";
    }
}