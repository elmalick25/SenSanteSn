package org.sensante.sn.dto;

public class MedecinIdentiteDTO {

    private Long idUser;
    private String nom;
    private String prenom;
    private String nomComplet;
    private String specialite;
    private String cabinet;
    private String avatarUrl;
    /** EN_VACATION | HORS_VACATION */
    private String statutVacation;
    private String structureSante;
    private String email;

    public MedecinIdentiteDTO() {}

    public MedecinIdentiteDTO(Long idUser, String nom, String prenom, String specialite,
                              String cabinet, String avatarUrl, String statutVacation,
                              String structureSante, String email) {
        this.idUser = idUser;
        this.nom = nom;
        this.prenom = prenom;
        this.nomComplet = "Dr. " + prenom + " " + nom;
        this.specialite = specialite;
        this.cabinet = cabinet;
        this.avatarUrl = avatarUrl;
        this.statutVacation = statutVacation;
        this.structureSante = structureSante;
        this.email = email;
    }

    public Long getIdUser() { return idUser; }
    public void setIdUser(Long idUser) { this.idUser = idUser; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getNomComplet() { return nomComplet; }
    public void setNomComplet(String nomComplet) { this.nomComplet = nomComplet; }

    public String getSpecialite() { return specialite; }
    public void setSpecialite(String specialite) { this.specialite = specialite; }

    public String getCabinet() { return cabinet; }
    public void setCabinet(String cabinet) { this.cabinet = cabinet; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getStatutVacation() { return statutVacation; }
    public void setStatutVacation(String statutVacation) { this.statutVacation = statutVacation; }

    public String getStructureSante() { return structureSante; }
    public void setStructureSante(String structureSante) { this.structureSante = structureSante; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
