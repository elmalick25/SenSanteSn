package org.sensante.sn.exception;

import org.springframework.http.HttpStatus;

public abstract class SenSanteBusinessException extends RuntimeException {

    private final HttpStatus status;
    private final String errorCode;

    public SenSanteBusinessException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
