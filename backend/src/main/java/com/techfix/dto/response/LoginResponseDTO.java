package com.techfix.dto.response;

import com.techfix.model.enums.UserRole;

public record LoginResponseDTO(String token, UserRole role) {
}
