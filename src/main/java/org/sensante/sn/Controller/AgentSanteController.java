package org.sensante.sn.Controller;

import org.springframework.web.bind.annotation.*;
import org.sensante.sn.Model.AgentSante;
import org.sensante.sn.Service.AgentSanteService;

import java.util.List;

@RestController
@RequestMapping("/api/agents-sante")
public class AgentSanteController {

    private final AgentSanteService agentSanteService;

    public AgentSanteController(AgentSanteService agentSanteService) {
        this.agentSanteService = agentSanteService;
    }

    @PostMapping
    public AgentSante createAgent(@RequestBody AgentSante agent) {
        return agentSanteService.createAgent(agent);
    }

    @GetMapping
    public List<AgentSante> getAllAgents() {
        return agentSanteService.getAllAgents();
    }

    @GetMapping("/{id}")
    public AgentSante getAgentById(@PathVariable Long id) {
        return agentSanteService.getAgentById(id);
    }

    @PutMapping("/{id}")
    public AgentSante updateAgent(@PathVariable Long id, @RequestBody AgentSante agentDetails) {
        return agentSanteService.updateAgent(id, agentDetails);
    }

    @DeleteMapping("/{id}")
    public String deleteAgent(@PathVariable Long id) {
        agentSanteService.deleteAgent(id);
        return "L'agent de santé avec l'id " + id + " a bien été supprimé.";
    }
}