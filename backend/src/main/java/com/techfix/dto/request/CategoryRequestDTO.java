package com.techfix.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequestDTO(
        @NotBlank(message = "O nome da categoria é obrigatório")
        @Size(max = 255, message = "O nome deve ter no máximo 255 caracteres")
        String name,

        @NotBlank(message = "O código da categoria é obrigatório")
        @Size(max = 100, message = "O código deve ter no máximo 100 caracteres")
        String code
) {
}
