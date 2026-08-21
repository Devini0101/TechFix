package com.techfix.dto;

import java.time.LocalDateTime;

public record StandardError (
        LocalDateTime timestamp,
        Integer status,
        String error,
        String message
) {
}
