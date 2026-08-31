package com.techfix.dto.response;

import com.techfix.model.enums.UserRole;

public record AuthUserInfoResponseDTO(UserRole role) {
}
