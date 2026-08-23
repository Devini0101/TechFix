package com.techfix.dto.request;

import jakarta.validation.constraints.NotEmpty;

public record LoginRequestDTO(@NotEmpty(message = "Email é obrigatório") String email,
                              @NotEmpty(message = "Senha é obrigatória") String password) {
}
