package com.techfix.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AddressRequestDTO (
        @NotBlank @Size(min = 8, max = 8) String cep,
        @NotBlank String street,
        String complement,
        @NotBlank String neighborhood,
        @NotBlank @Size(min = 2, max = 2) String uf,
        @NotBlank String city
        ){
}
