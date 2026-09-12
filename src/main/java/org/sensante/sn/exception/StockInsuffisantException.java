package org.sensante.sn.exception;

import org.springframework.http.HttpStatus;

public class StockInsuffisantException extends SenSanteBusinessException {

    public StockInsuffisantException(String message) {
        super(message, HttpStatus.CONFLICT, "ERR_STOCK_INSUFFISANT");
    }

    public StockInsuffisantException(String intrant, int demande, int disponible) {
        super(String.format("Stock insuffisant pour l'intrant '%s' : %d demandés, seulement %d disponibles.",
                intrant, demande, disponible), HttpStatus.CONFLICT, "ERR_STOCK_INSUFFISANT");
    }
}
