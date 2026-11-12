package com.techfix.dto.response;

public record ValidationErrorResponseDTO (
    String field,
    String message
){}
