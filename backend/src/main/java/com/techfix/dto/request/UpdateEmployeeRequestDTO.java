package com.techfix.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public record UpdateEmployeeRequestDTO(
        @NotEmpty(message = "Nome é obrigatório") String name,
        @NotEmpty(message = "Email é obrigatório") @Email(message = "Email inválido") String email,
        @NotEmpty(message = "Celular é obrigatório") String phone,
        @NotEmpty(message = "Cep é obrigatório") String cep,
        @NotEmpty(message = "Rua é obrigatória") String street,
        @NotEmpty(message = "Bairro é obrigatório") String neighborhood,
        @NotEmpty(message = "Cidade é obrigatória") String city,
        @NotEmpty(message = "UF é obrigatória") String uf,
        String complement
) {
}
