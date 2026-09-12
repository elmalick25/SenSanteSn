package org.sensante.sn.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.sensante.sn.dto.MedecinProfilDTO;
import org.sensante.sn.dto.UpdateMedecinProfilRequest;
import org.sensante.sn.dto.UpdateMedecinProfilResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class MedecinProfilService {

    // État mutable du profil initialisé avec les données officielles du Dr. Babacar Fall
    private MedecinProfilDTO profilActuel = MedecinProfilDTO.builder()
            .idMedecin(4L)
            .nomComplet("Dr. Babacar Fall")
            .prenom("Babacar")
            .nom("Fall")
            .email("babacar.fall@sensante.sn")
            .telephone("+221 77 645 82 91")
            .dateNaissance("14/09/1982")
            .adresse("Médina, Rue 22 x Corniche Ouest, Dakar")
            .specialite("Pédiatrie & Néonatalogie Ambulatoire")
            .matriculeOrdre("CNOM-SN-4812 / MSAS-DK-094")
            .structureRattachement("Centre de Santé Gaspard Kamara (District Dakar Centre)")
            .cabinet("Cabinet 04")
            .statutOrdre("Médecin Pédiatre Inscrit • Ordre National")
            .langueFrancaise(true)
            .langueWolof(true)
            .avatarUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuDqefWwa3WWJuRcZA3k3TLs3xEsLDMLNP2AY-fc99wOl_KrqpY24BBYFq5s1WUefXqRHkEtCJtqv9F-FgUiUIRxqwnjX2bBK-eYnpSy92vQ9Bb3cas0BZATI2-9RhcJpsDWLtAX2oSi7LGwLippHII53UxG3teCROzoVuZTeBubXgU1VvkvOIpH9iz3EJx8C5AIgyy9aX2hyOxQd5ylp_C8i7ciFSpRmmykyJxgYaUL3ilZKDvkzWYw")
            .dateDerniereMiseAJour("12 Octobre 2024")
            .synchroniseDhis2(true)
            .build();

    public MedecinProfilDTO getProfil() {
        return profilActuel;
    }

    public UpdateMedecinProfilResponse updateProfil(UpdateMedecinProfilRequest request) {
        log.info("Mise à jour du profil praticien Dr. Babacar Fall : {}", request);

        if (request.getNomComplet() != null && !request.getNomComplet().isBlank()) {
            profilActuel.setNomComplet(request.getNomComplet());
        }
        if (request.getTelephone() != null && !request.getTelephone().isBlank()) {
            profilActuel.setTelephone(request.getTelephone());
        }
        if (request.getDateNaissance() != null && !request.getDateNaissance().isBlank()) {
            profilActuel.setDateNaissance(request.getDateNaissance());
        }
        if (request.getAdresse() != null && !request.getAdresse().isBlank()) {
            profilActuel.setAdresse(request.getAdresse());
        }
        if (request.getSpecialite() != null && !request.getSpecialite().isBlank()) {
            profilActuel.setSpecialite(request.getSpecialite());
        }
        if (request.getStructureRattachement() != null && !request.getStructureRattachement().isBlank()) {
            profilActuel.setStructureRattachement(request.getStructureRattachement());
        }
        if (request.getLangueFrancaise() != null) {
            profilActuel.setLangueFrancaise(request.getLangueFrancaise());
        }
        if (request.getLangueWolof() != null) {
            profilActuel.setLangueWolof(request.getLangueWolof());
        }
        if (request.getAvatarUrl() != null && !request.getAvatarUrl().isBlank()) {
            profilActuel.setAvatarUrl(request.getAvatarUrl());
        }

        String horodatage = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
        profilActuel.setDateDerniereMiseAJour(LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")));

        return UpdateMedecinProfilResponse.builder()
                .succes(true)
                .message("Profil praticien mis à jour avec succès et certifié.")
                .horodatage(horodatage)
                .profil(profilActuel)
                .build();
    }
}
