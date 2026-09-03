package com.techfix.dto.request;

import jakarta.validation.constraints.NotEmpty;

public record MaintenanceRequestDTO(
        @NotEmpty(message = "É obrigatório informar o item") String item,
        String itemDescription,
        @NotEmpty(message = "É obrigatório informar o defeito do item") String itemDefect,
        @NotEmpty(message = "É obrigatório uma categoria para o item") String categoryCode
) {
}
