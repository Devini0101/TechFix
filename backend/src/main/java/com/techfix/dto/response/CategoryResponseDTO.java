package com.techfix.dto.response;

public record CategoryResponseDTO(
    Long id,
    String name,
    String code,
    Boolean active
) {
}
