package com.techfix.dto.request;

import jakarta.validation.constraints.NotNull;

public record BudgetAnswerRequestDTO(
        @NotNull(message = "O identificador deve ser informado") Long id,
        @NotNull(message = "Deve ser informada uma resposta para o orçamento") String answer
) {
}
