package com.techfix.exception;

public class InvalidMaintenanceApprovalException
        extends RuntimeException {

    public InvalidMaintenanceApprovalException(String message) {
        super(message);
    }
}
