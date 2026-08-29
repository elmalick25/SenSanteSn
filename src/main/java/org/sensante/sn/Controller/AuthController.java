package org.sensante.sn.Controller;

import jakarta.validation.Valid;
import org.sensante.sn.Service.AuthService;
import org.sensante.sn.dto.AuthResponse;
import org.sensante.sn.dto.LoginRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.authenticate(loginRequest));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody org.sensante.sn.dto.RegisterRequest registerRequest) {
        return ResponseEntity.ok(authService.register(registerRequest));
    }
}