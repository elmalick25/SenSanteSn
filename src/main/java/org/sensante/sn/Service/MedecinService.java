package org.sensante.sn.Service;

import org.springframework.stereotype.Service;
import org.sensante.sn.Model.Medecin;
import org.sensante.sn.Repository.MedecinRepository;
import org.sensante.sn.exception.RessourceNonTrouveException;

import java.util.List;

@Service
public class MedecinService {

    private final MedecinRepository medecinRepository;

    public MedecinService(MedecinRepository medecinRepository) {
        this.medecinRepository = medecinRepository;
    }

    public Medecin createMedecin(Medecin medecin) {
        return medecinRepository.save(medecin);
    }

    public List<Medecin> getAllMedecins() {
        return medecinRepository.findAll();
    }

    public Medecin getMedecinById(Long id) {
        return medecinRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveException("Médecin non trouvé avec l'id : " + id));
    }

    public Medecin updateMedecin(Long id, Medecin medecinDetails) {
        Medecin medecinExistant = getMedecinById(id);

        medecinExistant.setNom(medecinDetails.getNom());
        medecinExistant.setPrenom(medecinDetails.getPrenom());
        medecinExistant.setEmail(medecinDetails.getEmail());
        medecinExistant.setTelephone(medecinDetails.getTelephone());

        return medecinRepository.save(medecinExistant);
    }

    public void deleteMedecin(Long id) {
        Medecin medecin = getMedecinById(id);
        medecinRepository.delete(medecin);
    }
}