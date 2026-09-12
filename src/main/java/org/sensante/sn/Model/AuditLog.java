package org.sensante.sn.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String action;

    @Column(nullable = false, length = 100)
    private String entite;

    @Column(name = "entite_id")
    private Long entiteId;

    @Column(name = "utilisateur_email", nullable = false)
    private String utilisateurEmail;

    @Column(length = 100)
    private String role;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(name = "ip_client", length = 50)
    private String ipClient;

    @Column(nullable = false)
    private OffsetDateTime timestamp;

    @Column(name = "hash_sha256", nullable = false, length = 64)
    private String hashSha256;
}
