package org.sensante.sn.exception;

import org.springframework.http.HttpStatus;

public class RessourceNonTrouveeException extends SenSanteBusinessException {

    public RessourceNonTrouveeException(String message) {
        super(message, HttpStatus.NOT_FOUND, "ERR_RESSOURCE_NON_TROUVEE");
    }

    public RessourceNonTrouveeException(String ressource, Object identifiant) {
        super(String.format("La ressource '%s' identifiée par '%s' est introuvable.", ressource, identifiant),
                HttpStatus.NOT_FOUND, "ERR_RESSOURCE_NON_TROUVEE");
    }
}
