package org.sensante.sn.exception;

import org.springframework.http.HttpStatus;

public class ConflitMetierException extends SenSanteBusinessException {

    public ConflitMetierException(String message) {
        super(message, HttpStatus.CONFLICT, "ERR_CONFLIT_METIER");
    }

    public ConflitMetierException(String message, String errorCode) {
        super(message, HttpStatus.CONFLICT, errorCode);
    }
}
