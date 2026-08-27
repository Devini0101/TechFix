package com.techfix.dto.request;

import com.techfix.model.enums.UserRole;
import jakarta.validation.constraints.NotEmpty;

public record RegisterUserRequestDTO(
        @NotEmpty(message = "Nome é obrigatório") String name,
        @NotEmpty(message = "Email é obrigatório") String email,
        @NotEmpty(message = "CPF é obrigatório") String cpf,
        @NotEmpty(message = "Celular é obrigatório") String phone,
        @NotEmpty(message = "Senha é obrigatória") String password,
        @NotEmpty(message = "Cep é obrigatório") String cep,
        @NotEmpty(message = "Rua é obrigatória") String street,
        @NotEmpty(message = "Bairro é obrigatório") String neighborhood,
        @NotEmpty(message = "Cidade é obrigatória") String city,
        @NotEmpty(message = "UF é obrigatória") String uf,
        String complement,
        UserRole role
) {
}
