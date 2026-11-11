package com.techfix.exception;

public class ValidationErrorDTO extends RuntimeException {
    public ValidationErrorDTO(String message) {
        super(message);
    }
}
