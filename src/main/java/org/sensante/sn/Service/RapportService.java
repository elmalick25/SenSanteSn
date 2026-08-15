package org.sensante.sn.Service;

import org.springframework.stereotype.Service;
import org.sensante.sn.Model.Rapport;
import org.sensante.sn.Repository.RapportRepository;
import org.sensante.sn.exception.RessourceNonTrouveException;

import java.util.List;

@Service
public class RapportService {

    private final RapportRepository rapportRepository;

    public RapportService(RapportRepository rapportRepository) {
        this.rapportRepository = rapportRepository;
    }

    public Rapport createRapport(Rapport rapport) {
        return rapportRepository.save(rapport);
    }

    public List<Rapport> getAllRapports() {
        return rapportRepository.findAll();
    }

    public Rapport getRapportById(Long id) {
        return rapportRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveException("Rapport non trouvé avec l'id : " + id));
    }

    public Rapport updateRapport(Long id, Rapport rapportDetails) {
        Rapport rapportExistant = getRapportById(id);

        rapportExistant.setDateGeneration(rapportDetails.getDateGeneration());
        rapportExistant.setTypeRapport(rapportDetails.getTypeRapport());
        rapportExistant.setTauxGuerison(rapportDetails.getTauxGuerison());
        rapportExistant.setTauxAbandon(rapportDetails.getTauxAbandon());
        rapportExistant.setZonePrevalence(rapportDetails.getZonePrevalence());
        rapportExistant.setSuperviseur(rapportDetails.getSuperviseur());

        return rapportRepository.save(rapportExistant);
    }

    public void deleteRapport(Long id) {
        Rapport rapport = getRapportById(id);
        rapportRepository.delete(rapport);
    }
}