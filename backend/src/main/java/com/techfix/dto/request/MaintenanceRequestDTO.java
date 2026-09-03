package com.techfix.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record MaintenanceRequestDTO(
        @NotBlank(message = "A descrição do equipamento é obrigatória")
        @Size(max = 255, message = "A descrição do equipamento deve ter no máximo 255 caracteres")
        String item,

        @NotBlank(message = "A descrição do equipamento é obrigatória")
        String itemDescription,

        @NotBlank(message = "A descrição do defeito é obrigatória")
        String itemDefect,

        @NotNull(message = "A categoria é obrigatória")
        Long categoryId
) {
}