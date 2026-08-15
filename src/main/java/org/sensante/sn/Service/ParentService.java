package org.sensante.sn.Service;

import org.springframework.stereotype.Service;
import org.sensante.sn.Model.Parent;
import org.sensante.sn.Repository.ParentRepository;
import org.sensante.sn.exception.RessourceNonTrouveException;

import java.util.List;

@Service
public class ParentService {

    private final ParentRepository parentRepository;

    public ParentService(ParentRepository parentRepository) {
        this.parentRepository = parentRepository;
    }

    public Parent createParent(Parent parent) {
        return parentRepository.save(parent);
    }

    public List<Parent> getAllParents() {
        return parentRepository.findAll();
    }

    public Parent getParentById(Long id) {
        return parentRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveException("Parent non trouvé avec l'id : " + id));
    }

    public Parent updateParent(Long id, Parent parentDetails) {
        Parent parentExistant = getParentById(id);

        parentExistant.setNom(parentDetails.getNom());
        parentExistant.setPrenom(parentDetails.getPrenom());
        parentExistant.setEmail(parentDetails.getEmail());
        parentExistant.setTelephone(parentDetails.getTelephone());

        return parentRepository.save(parentExistant);
    }

    public void deleteParent(Long id) {
        Parent parent = getParentById(id);
        parentRepository.delete(parent);
    }
}