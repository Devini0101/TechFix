package com.techfix.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ViaCepResponseDTO(
        String cep,
        @JsonProperty("logradouro") String street,
        @JsonProperty("complemento") String complement,
        @JsonProperty("bairro") String neighborhood,
        @JsonProperty("localidade") String city,
        String uf,
        Boolean erro
) { }
