package com.techfix.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record BudgetRequestDTO(
        @NotNull(message = "O id do serviço é obrigatório")
        Long id,

        @NotNull(message = "O valor do orçamento é obrigatório")
        @DecimalMin(
                value = "0.01",
                message = "O valor do orçamento deve ser maior que zero"
        )
        BigDecimal value
) {
}
