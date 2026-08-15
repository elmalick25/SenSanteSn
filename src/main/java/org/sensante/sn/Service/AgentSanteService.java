package org.sensante.sn.Service;

import org.springframework.stereotype.Service;
import org.sensante.sn.Model.AgentSante;
import org.sensante.sn.Repository.AgentSanteRepository;
import org.sensante.sn.exception.RessourceNonTrouveException;

import java.util.List;

@Service
public class AgentSanteService {

    private final AgentSanteRepository agentRepository;

    public AgentSanteService(AgentSanteRepository agentRepository) {
        this.agentRepository = agentRepository;
    }

    public AgentSante createAgent(AgentSante agent) {
        return agentRepository.save(agent);
    }

    public List<AgentSante> getAllAgents() {
        return agentRepository.findAll();
    }

    public AgentSante getAgentById(Long id) {
        return agentRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveException("Agent de santé non trouvé avec l'id : " + id));
    }

    public AgentSante updateAgent(Long id, AgentSante agentDetails) {
        AgentSante agentExistant = getAgentById(id);

        // Mise à jour des champs hérités d'Utilisateur
        agentExistant.setNom(agentDetails.getNom());
        agentExistant.setPrenom(agentDetails.getPrenom());
        agentExistant.setEmail(agentDetails.getEmail());
        agentExistant.setTelephone(agentDetails.getTelephone());
        // Mettre à jour les autres champs spécifiques à Utilisateur si nécessaire

        return agentRepository.save(agentExistant);
    }

    public void deleteAgent(Long id) {
        AgentSante agent = getAgentById(id);
        agentRepository.delete(agent);
    }
}