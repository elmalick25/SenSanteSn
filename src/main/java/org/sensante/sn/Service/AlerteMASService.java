package org.sensante.sn.Service;

import org.springframework.stereotype.Service;
import org.sensante.sn.Model.AlerteMAS;
import org.sensante.sn.Repository.AlerteMASRepository;
import org.sensante.sn.exception.RessourceNonTrouveException;

import java.util.List;

@Service
public class AlerteMASService {

    private final AlerteMASRepository alerteRepository;

    public AlerteMASService(AlerteMASRepository alerteRepository) {
        this.alerteRepository = alerteRepository;
    }

    public AlerteMAS createAlerte(AlerteMAS alerte) {
        if (alerte.getAcquittee() == null) {
            alerte.setAcquittee(false);
        }
        return alerteRepository.save(alerte);
    }

    public List<AlerteMAS> getAllAlertes() {
        return alerteRepository.findAll();
    }

    public AlerteMAS getAlerteById(Long id) {
        return alerteRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveException("Alerte MAS non trouvée avec l'id : " + id));
    }

    public List<AlerteMAS> getAlertesNonAcquittees() {
        return alerteRepository.findByAcquitteeFalse();
    }

    public AlerteMAS updateAlerte(Long id, AlerteMAS alerteDetails) {
        AlerteMAS alerteExistante = getAlerteById(id);

        alerteExistante.setDateAlerte(alerteDetails.getDateAlerte());
        alerteExistante.setMessage(alerteDetails.getMessage());
        alerteExistante.setAcquittee(alerteDetails.getAcquittee());
        alerteExistante.setBilan(alerteDetails.getBilan());

        return alerteRepository.save(alerteExistante);
    }

    public void deleteAlerte(Long id) {
        AlerteMAS alerte = getAlerteById(id);
        alerteRepository.delete(alerte);
    }
}