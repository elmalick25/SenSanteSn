package org.sensante.sn.Service;

import org.sensante.sn.Model.*;
import org.sensante.sn.Repository.UtilisateurRepository;
import org.sensante.sn.dto.AuthResponse;
import org.sensante.sn.dto.LoginRequest;
import org.sensante.sn.dto.RegisterRequest;
import org.sensante.sn.dto.UtilisateurResponseDTO;
import org.sensante.sn.security.JwtUtils;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(AuthenticationManager authenticationManager,
                       UtilisateurRepository utilisateurRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public AuthResponse register(RegisterRequest request) {
        if (request.getRole() != null && request.getRole() != Role.PARENT) {
            throw new AccessDeniedException(
                "L'auto-inscription est réservée aux Parents/Tuteurs. " +
                "Les comptes professionnels sont créés par un administrateur SenSanté."
            );
        }
        request.setRole(Role.PARENT);

        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Un utilisateur avec cet email existe déjà : " + request.getEmail());
        }

        Parent parent = new Parent();
        parent.setNom(request.getNom());
        parent.setPrenom(request.getPrenom());
        parent.setEmail(request.getEmail());
        parent.setTelephone(request.getTelephone());
        parent.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        parent.setRole(Role.PARENT);

        Utilisateur savedUser = utilisateurRepository.save(parent);
        String jwtToken = jwtUtils.generateToken(savedUser);

        return AuthResponse.builder()
                .token(jwtToken)
                .idUser(savedUser.getIdUser())
                .nom(savedUser.getNom())
                .prenom(savedUser.getPrenom())
                .email(savedUser.getEmail())
                .telephone(savedUser.getTelephone())
                .role(savedUser.getRole())
                .build();
    }

    public UtilisateurResponseDTO registerProfessionnel(RegisterRequest request) {
        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Un utilisateur avec cet email existe déjà : " + request.getEmail());
        }

        Role role = request.getRole() != null ? request.getRole() : Role.AGENT_SANTE;

        Utilisateur user = switch (role) {
            case MEDECIN -> new Medecin();
            case AGENT_SANTE -> new AgentSante();
            case SUPERVISEUR -> new Superviseur();
            case ADMINISTRATEUR -> new Administrateur();
            case PARENT -> new Parent();
        };

        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setEmail(request.getEmail());
        user.setTelephone(request.getTelephone());
        user.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        user.setRole(role);

        Utilisateur savedUser = utilisateurRepository.save(user);

        UtilisateurResponseDTO dto = new UtilisateurResponseDTO();
        dto.setIdUser(savedUser.getIdUser());
        dto.setNomUser(savedUser.getNom());
        dto.setPrenomUser(savedUser.getPrenom());
        dto.setEmail(savedUser.getEmail());
        dto.setRole(savedUser.getRole());
        return dto;
    }

    public AuthResponse authenticate(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getMotDePasse()
                )
        );

        Utilisateur user = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable"));

        String jwtToken = jwtUtils.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .idUser(user.getIdUser())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .email(user.getEmail())
                .telephone(user.getTelephone())
                .role(user.getRole())
                .build();
    }
}