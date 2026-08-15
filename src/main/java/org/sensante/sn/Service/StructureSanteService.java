package org.sensante.sn.Service;

import org.springframework.stereotype.Service;
import org.sensante.sn.Model.StructureSante;
import org.sensante.sn.Repository.StructureSanteRepository;
import org.sensante.sn.exception.RessourceNonTrouveException;

import java.util.List;

@Service
public class StructureSanteService {

    private final StructureSanteRepository structureSanteRepository;

    public StructureSanteService(StructureSanteRepository structureSanteRepository) {
        this.structureSanteRepository = structureSanteRepository;
    }

    public StructureSante createStructureSante(StructureSante structureSante) {
        return structureSanteRepository.save(structureSante);
    }

    public List<StructureSante> getAllStructuresSante() {
        return structureSanteRepository.findAll();
    }

    public StructureSante getStructureSanteById(Long id) {
        return structureSanteRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveException("Structure de santé non trouvée avec l'id : " + id));
    }

    public StructureSante updateStructureSante(Long id, StructureSante structureDetails) {
        StructureSante structureExistante = getStructureSanteById(id);

        structureExistante.setNom(structureDetails.getNom());
        structureExistante.setType(structureDetails.getType());
        structureExistante.setLocalisation(structureDetails.getLocalisation());
        structureExistante.setRegion(structureDetails.getRegion());

        return structureSanteRepository.save(structureExistante);
    }

    public void deleteStructureSante(Long id) {
        StructureSante structure = getStructureSanteById(id);
        structureSanteRepository.delete(structure);
    }
}