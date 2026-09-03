package com.techfix.dto.request;

import jakarta.validation.constraints.NotEmpty;
import org.hibernate.validator.constraints.Length;

public record MaintenanceRequestDTO(
        @NotEmpty(message = "É obrigatório informar o item") String item,
        @Length(max = 255, message = "A descrição não deve ser maior que 255 caracteres") String itemDescription,
        @NotEmpty(message = "É obrigatório informar o defeito do item") String itemDefect,
        @NotEmpty(message = "É obrigatório uma categoria para o item") String categoryCode
) {
}
