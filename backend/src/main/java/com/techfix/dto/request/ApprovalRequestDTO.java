package com.techfix.dto.request;

import jakarta.validation.constraints.NotNull;

public record ApprovalRequestDTO(
        @NotNull(message = "O id do serviço é obrigatório")
        Long id
) {
}
