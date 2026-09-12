package org.sensante.sn.exception;

import org.springframework.http.HttpStatus;

public class MasUrgenceException extends SenSanteBusinessException {

    public MasUrgenceException(String message) {
        super(message, HttpStatus.UNPROCESSABLE_ENTITY, "ERR_MAS_URGENCE_VITALE");
    }

    public MasUrgenceException(String matricule, String message) {
        super(String.format("Urgence MAS critique sur l'enfant [%s] : %s", matricule, message),
                HttpStatus.UNPROCESSABLE_ENTITY, "ERR_MAS_URGENCE_VITALE");
    }
}
