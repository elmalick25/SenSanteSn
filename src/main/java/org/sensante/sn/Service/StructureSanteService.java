package org.sensante.sn.Service;

import org.sensante.sn.Model.AgrementCren;
import org.sensante.sn.Model.StatutStructure;
import org.sensante.sn.Model.StructureSante;
import org.sensante.sn.Model.TypeStructure;
import org.sensante.sn.Repository.StructureSanteRepository;
import org.sensante.sn.dto.CreateStructureRequest;
import org.sensante.sn.dto.StructureSanteDTO;
import org.sensante.sn.dto.StructureStatsDTO;
import org.sensante.sn.exception.RessourceNonTrouveException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class StructureSanteService {

    private final StructureSanteRepository structureSanteRepository;

    public StructureSanteService(StructureSanteRepository structureSanteRepository) {
        this.structureSanteRepository = structureSanteRepository;
    }

    @Transactional
    public StructureSanteDTO createStructureSante(CreateStructureRequest request) {
        String code = request.getCodeNational();
        if (code == null || code.trim().isEmpty()) {
            code = generateCodeNational(request.getRegion());
        }

        StructureSante entity = StructureSante.builder()
                .codeNational(code.trim().toUpperCase(Locale.ROOT))
                .nom(request.getNom().trim())
                .type(request.getType())
                .statut(request.getStatut() != null ? request.getStatut() : StatutStructure.OPERATIONNEL)
                .localisation(request.getLocalisation())
                .region(request.getRegion())
                .district(request.getDistrict())
                .commune(request.getCommune())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .gpsValide(request.getGpsValide() != null ? request.getGpsValide() : (request.getLatitude() != null && request.getLongitude() != null))
                .agrementCren(request.getAgrementCren() != null ? request.getAgrementCren() : AgrementCren.AUCUN)
                .capaciteLits(request.getCapaciteLits() != null ? request.getCapaciteLits() : 0)
                .litsReanimation(request.getLitsReanimation() != null ? request.getLitsReanimation() : 0)
                .urgences247(Boolean.TRUE.equals(request.getUrgences247()))
                .blocOperatoire(Boolean.TRUE.equals(request.getBlocOperatoire()))
                .secteurRural(Boolean.TRUE.equals(request.getSecteurRural()))
                .responsable(request.getResponsable())
                .telephone(request.getTelephone())
                .build();

        StructureSante saved = structureSanteRepository.save(entity);
        return toDTO(saved);
    }

    public List<StructureSanteDTO> getAllStructuresSante() {
        return structureSanteRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<StructureSanteDTO> searchStructures(
            String region,
            String district,
            TypeStructure type,
            StatutStructure statut,
            AgrementCren cren,
            String query
    ) {
        String cleanRegion = (region != null && !region.isBlank() && !region.startsWith("Toutes")) ? region.trim() : null;
        String cleanDistrict = (district != null && !district.isBlank() && !district.startsWith("Tous")) ? district.trim() : null;
        String cleanQuery = (query != null && !query.isBlank()) ? query.trim() : null;

        return structureSanteRepository.searchStructures(cleanRegion, cleanDistrict, type, statut, cren, cleanQuery)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public StructureSanteDTO getStructureSanteById(Long id) {
        StructureSante structure = structureSanteRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveException("Structure de santé non trouvée avec l'id : " + id));
        return toDTO(structure);
    }

    @Transactional
    public StructureSanteDTO updateStructureSante(Long id, CreateStructureRequest request) {
        StructureSante existing = structureSanteRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveException("Structure de santé non trouvée avec l'id : " + id));

        if (request.getCodeNational() != null && !request.getCodeNational().isBlank()) {
            existing.setCodeNational(request.getCodeNational().trim().toUpperCase(Locale.ROOT));
        }
        existing.setNom(request.getNom().trim());
        existing.setType(request.getType());
        if (request.getStatut() != null) {
            existing.setStatut(request.getStatut());
        }
        existing.setLocalisation(request.getLocalisation());
        existing.setRegion(request.getRegion());
        existing.setDistrict(request.getDistrict());
        existing.setCommune(request.getCommune());
        existing.setLatitude(request.getLatitude());
        existing.setLongitude(request.getLongitude());
        if (request.getGpsValide() != null) {
            existing.setGpsValide(request.getGpsValide());
        }
        if (request.getAgrementCren() != null) {
            existing.setAgrementCren(request.getAgrementCren());
        }
        if (request.getCapaciteLits() != null) {
            existing.setCapaciteLits(request.getCapaciteLits());
        }
        if (request.getLitsReanimation() != null) {
            existing.setLitsReanimation(request.getLitsReanimation());
        }
        if (request.getUrgences247() != null) {
            existing.setUrgences247(request.getUrgences247());
        }
        if (request.getBlocOperatoire() != null) {
            existing.setBlocOperatoire(request.getBlocOperatoire());
        }
        if (request.getSecteurRural() != null) {
            existing.setSecteurRural(request.getSecteurRural());
        }
        existing.setResponsable(request.getResponsable());
        existing.setTelephone(request.getTelephone());

        StructureSante saved = structureSanteRepository.save(existing);
        return toDTO(saved);
    }

    @Transactional
    public void deleteStructureSante(Long id) {
        StructureSante structure = structureSanteRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveException("Structure de santé non trouvée avec l'id : " + id));
        structureSanteRepository.delete(structure);
    }

    public StructureStatsDTO getStats() {
        List<StructureSante> all = structureSanteRepository.findAll();
        long total = all.size();

        long hopitauxNiv3 = all.stream().filter(s -> s.getType() == TypeStructure.HOPITAL_NATIONAL).count();
        long hopitauxNiv2 = all.stream().filter(s -> s.getType() == TypeStructure.HOPITAL_REGIONAL).count();
        long hopitauxNiv1 = all.stream().filter(s -> s.getType() == TypeStructure.HOPITAL).count();
        long totalHopitaux = hopitauxNiv3 + hopitauxNiv2 + hopitauxNiv1;

        long totalCentres = all.stream().filter(s -> s.getType() == TypeStructure.CENTRE_DE_SANTE).count();
        long centresUrgences = all.stream().filter(s -> s.getType() == TypeStructure.CENTRE_DE_SANTE && Boolean.TRUE.equals(s.getUrgences247())).count();
        long centresBloc = all.stream().filter(s -> s.getType() == TypeStructure.CENTRE_DE_SANTE && Boolean.TRUE.equals(s.getBlocOperatoire())).count();

        long totalPostes = all.stream().filter(s -> s.getType() == TypeStructure.POSTE_DE_SANTE || s.getType() == TypeStructure.DISPENSAIRE).count();
        long postesRural = all.stream().filter(s -> (s.getType() == TypeStructure.POSTE_DE_SANTE || s.getType() == TypeStructure.DISPENSAIRE) && Boolean.TRUE.equals(s.getSecteurRural())).count();
        long postesUrbain = totalPostes - postesRural;
        long postesSousSurveillance = all.stream().filter(s -> s.getStatut() == StatutStructure.SOUS_SURVEILLANCE).count();

        long geolocalisees = all.stream().filter(s -> Boolean.TRUE.equals(s.getGpsValide()) || (s.getLatitude() != null && s.getLongitude() != null)).count();
        double pctGeo = total > 0 ? Math.round(((double) geolocalisees / total) * 1000.0) / 10.0 : 0.0;

        long capaciteLits = all.stream().mapToLong(s -> s.getCapaciteLits() != null ? s.getCapaciteLits() : 0).sum();

        double pctPostes = total > 0 ? Math.round(((double) totalPostes / total) * 1000.0) / 10.0 : 0.0;
        double pctCentres = total > 0 ? Math.round(((double) totalCentres / total) * 1000.0) / 10.0 : 0.0;
        double pctHopitaux = total > 0 ? Math.round(((double) totalHopitaux / total) * 1000.0) / 10.0 : 0.0;
        double pctAutres = Math.max(0.0, Math.round((100.0 - (pctPostes + pctCentres + pctHopitaux)) * 10.0) / 10.0);

        return StructureStatsDTO.builder()
                .totalStructures(total)
                .pourcentageGeolocalisees(pctGeo)
                .totalHopitaux(totalHopitaux)
                .hopitauxNiveau1(hopitauxNiv1)
                .hopitauxNiveau2(hopitauxNiv2)
                .hopitauxNiveau3(hopitauxNiv3)
                .totalCentresSante(totalCentres)
                .centresUrgences247(centresUrgences)
                .centresBlocOperatoire(centresBloc)
                .totalPostesSante(totalPostes)
                .postesRural(postesRural)
                .postesUrbain(postesUrbain)
                .postesSousSurveillance(postesSousSurveillance)
                .pctPostes(pctPostes)
                .pctCentres(pctCentres)
                .pctHopitaux(pctHopitaux)
                .pctAutres(pctAutres)
                .capaciteTotaleLits(capaciteLits)
                .build();
    }

    private String generateCodeNational(String region) {
        String prefix = "SN";
        String regCode = "DK";
        if (region != null) {
            String clean = region.trim().toUpperCase(Locale.ROOT);
            if (clean.contains("THIÈS") || clean.contains("THIES")) regCode = "TH";
            else if (clean.contains("SAINT-LOUIS") || clean.contains("SAINT LOUIS")) regCode = "SL";
            else if (clean.contains("KAOLACK")) regCode = "KL";
            else if (clean.contains("DIOURBEL")) regCode = "DB";
            else if (clean.contains("TOUBA")) regCode = "TB";
            else if (clean.contains("ZIGUINCHOR")) regCode = "ZG";
            else if (clean.contains("KÉDOUGOU") || clean.contains("KEDOUGOU")) regCode = "KD";
            else if (clean.contains("TAMBACOUNDA")) regCode = "TC";
            else if (clean.contains("FATICK")) regCode = "FK";
            else if (clean.contains("KOLDA")) regCode = "KD";
            else if (clean.contains("LOUGA")) regCode = "LG";
            else if (clean.contains("MATAM")) regCode = "MT";
            else if (clean.contains("SÉDHIOU") || clean.contains("SEDHIOU")) regCode = "SD";
            else if (clean.contains("KAFRINE")) regCode = "KF";
        }
        long count = structureSanteRepository.count() + 1;
        String generated = String.format("%s-%s-%03d", prefix, regCode, count);
        while (structureSanteRepository.existsByCodeNational(generated)) {
            count++;
            generated = String.format("%s-%s-%03d", prefix, regCode, count);
        }
        return generated;
    }

    public StructureSanteDTO toDTO(StructureSante s) {
        if (s == null) return null;
        return StructureSanteDTO.builder()
                .id(s.getId())
                .codeNational(s.getCodeNational())
                .nom(s.getNom())
                .type(s.getType())
                .statut(s.getStatut())
                .localisation(s.getLocalisation())
                .region(s.getRegion())
                .district(s.getDistrict())
                .commune(s.getCommune())
                .latitude(s.getLatitude())
                .longitude(s.getLongitude())
                .gpsValide(s.getGpsValide())
                .agrementCren(s.getAgrementCren())
                .capaciteLits(s.getCapaciteLits())
                .litsReanimation(s.getLitsReanimation())
                .urgences247(s.getUrgences247())
                .blocOperatoire(s.getBlocOperatoire())
                .secteurRural(s.getSecteurRural())
                .responsable(s.getResponsable())
                .telephone(s.getTelephone())
                .build();
    }
}