package org.sensante.sn.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.net.URI;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * Gestionnaire d'exceptions global au standard RFC 7807 (Problem Details for HTTP APIs).
 * Assure des réponses d'erreur unifiées, typées et conformes aux directives MSAS / DSSI.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final org.slf4j.Logger LOG = org.slf4j.LoggerFactory.getLogger(GlobalExceptionHandler.class);


    private ProblemDetail buildProblemDetail(
            HttpStatus status,
            String title,
            String detail,
            String errorCode,
            HttpServletRequest request
    ) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(status, detail);
        problemDetail.setTitle(title);
        problemDetail.setType(URI.create("https://sensante.sn/errors/" + (errorCode != null ? errorCode.toLowerCase() : "generic")));
        problemDetail.setInstance(URI.create(request.getRequestURI()));
        problemDetail.setProperty("timestamp", Instant.now().toString());
        if (errorCode != null) {
            problemDetail.setProperty("errorCode", errorCode);
        }
        return problemDetail;
    }

    @ExceptionHandler(SenSanteBusinessException.class)
    public ResponseEntity<ProblemDetail> handleBusinessException(SenSanteBusinessException ex, HttpServletRequest request) {
        ProblemDetail problem = buildProblemDetail(
                ex.getStatus(),
                "Erreur Métier SenSanté",
                ex.getMessage(),
                ex.getErrorCode(),
                request
        );
        return ResponseEntity.status(ex.getStatus()).body(problem);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ProblemDetail> handleAccessDeniedException(AccessDeniedException ex, HttpServletRequest request) {
        ProblemDetail problem = buildProblemDetail(
                HttpStatus.FORBIDDEN,
                "Accès Refusé",
                ex.getMessage() != null ? ex.getMessage() : "Vous n'avez pas les autorisations nécessaires pour effectuer cette action.",
                "ERR_ACCES_INTERDIT",
                request
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(problem);
    }

    @ExceptionHandler({BadCredentialsException.class, UsernameNotFoundException.class})
    public ResponseEntity<ProblemDetail> handleAuthenticationException(Exception ex, HttpServletRequest request) {
        ProblemDetail problem = buildProblemDetail(
                HttpStatus.UNAUTHORIZED,
                "Authentification Échouée",
                "Identifiant ou mot de passe incorrect.",
                "ERR_AUTH_INVALIDE",
                request
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(problem);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemDetail> handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }

        ProblemDetail problem = buildProblemDetail(
                HttpStatus.BAD_REQUEST,
                "Erreur de Validation",
                "Le format des données fournies est invalide.",
                "ERR_VALIDATION_DONNEES",
                request
        );
        problem.setProperty("validationErrors", fieldErrors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problem);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ProblemDetail> handleIllegalArgumentException(IllegalArgumentException ex, HttpServletRequest request) {
        ProblemDetail problem = buildProblemDetail(
                HttpStatus.BAD_REQUEST,
                "Requête Invalide",
                ex.getMessage(),
                "ERR_ARGUMENT_INVALIDE",
                request
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problem);
    }

    @ExceptionHandler(org.springframework.web.bind.MissingServletRequestParameterException.class)
    public ResponseEntity<ProblemDetail> handleMissingParams(org.springframework.web.bind.MissingServletRequestParameterException ex, HttpServletRequest request) {
        ProblemDetail problem = buildProblemDetail(
                HttpStatus.BAD_REQUEST,
                "Paramètre Obligatoire Manquant",
                "Le paramètre requis '" + ex.getParameterName() + "' (" + ex.getParameterType() + ") est manquant dans la requête.",
                "ERR_PARAM_MANQUANT",
                request
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problem);
    }

    @ExceptionHandler(org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ProblemDetail> handleTypeMismatch(org.springframework.web.method.annotation.MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        ProblemDetail problem = buildProblemDetail(
                HttpStatus.BAD_REQUEST,
                "Type de Paramètre Invalide",
                "La valeur fournie pour le paramètre '" + ex.getName() + "' est incompatible avec le type attendu.",
                "ERR_PARAM_TYPE_INVALIDE",
                request
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problem);
    }

    @ExceptionHandler(org.springframework.web.multipart.support.MissingServletRequestPartException.class)
    public ResponseEntity<ProblemDetail> handleMissingPart(org.springframework.web.multipart.support.MissingServletRequestPartException ex, HttpServletRequest request) {
        ProblemDetail problem = buildProblemDetail(
                HttpStatus.BAD_REQUEST,
                "Fichier ou Partie Manquante",
                "La partie multipart '" + ex.getRequestPartName() + "' est requise.",
                "ERR_PARTIE_MULTIPART_MANQUANTE",
                request
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problem);
    }

    @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
    public ResponseEntity<ProblemDetail> handleMessageNotReadable(org.springframework.http.converter.HttpMessageNotReadableException ex, HttpServletRequest request) {
        ProblemDetail problem = buildProblemDetail(
                HttpStatus.BAD_REQUEST,
                "Corps de Requête Illisible",
                "Le corps de la requête JSON est manquant ou mal formé.",
                "ERR_CORPS_REQUETE_INVALIDE",
                request
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problem);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ProblemDetail> handleNoResourceFoundException(NoResourceFoundException ex, HttpServletRequest request) {
        ProblemDetail problem = buildProblemDetail(
                HttpStatus.NOT_FOUND,
                "Endpoint Introuvable",
                "Aucune ressource ou route ne correspond à cette requête HTTP.",
                "ERR_ROUTE_NON_TROUVEE",
                request
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problem);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> handleGlobalException(Exception ex, HttpServletRequest request) {
        // Toute anomalie non interceptee doit laisser une trace exploitable en production.
        LOG.error("Anomalie non interceptee sur {} {} : {}", request.getMethod(), request.getRequestURI(), ex.getMessage(), ex);
        ProblemDetail problem = buildProblemDetail(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Erreur Système Interne",
                "Une anomalie non interceptée est survenue. L'équipe d'astreinte a été notifiée.",
                "ERR_SERVEUR_INTERNE",
                request
        );
        problem.setProperty("exceptionType", ex.getClass().getSimpleName());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(problem);
    }
}