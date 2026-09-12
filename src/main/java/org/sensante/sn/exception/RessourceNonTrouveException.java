package org.sensante.sn.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception pour ressource introuvable.
 * Conserve la rétrocompatibilité tout en s'intégrant dans la hiérarchie SenSanteBusinessException.
 */
public class RessourceNonTrouveException extends SenSanteBusinessException {

    public RessourceNonTrouveException(String message) {
        super(message, HttpStatus.NOT_FOUND, "ERR_RESSOURCE_NON_TROUVEE");
    }

    public RessourceNonTrouveException(String ressource, Object id) {
        super(String.format("La ressource '%s' identifiée par '%s' est introuvable.", ressource, id),
                HttpStatus.NOT_FOUND, "ERR_RESSOURCE_NON_TROUVEE");
    }
}
