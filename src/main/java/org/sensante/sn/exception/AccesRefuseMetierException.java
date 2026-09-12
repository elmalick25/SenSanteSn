package org.sensante.sn.exception;

import org.springframework.http.HttpStatus;

public class AccesRefuseMetierException extends SenSanteBusinessException {

    public AccesRefuseMetierException(String message) {
        super(message, HttpStatus.FORBIDDEN, "ERR_ACCES_REFUSE_METIER");
    }

    public AccesRefuseMetierException(String utilisateur, String action, String perimetre) {
        super(String.format("L'utilisateur '%s' n'a pas les droits pour effectuer l'action '%s' sur le périmètre '%s'.",
                utilisateur, action, perimetre), HttpStatus.FORBIDDEN, "ERR_ACCES_REFUSE_METIER");
    }
}
