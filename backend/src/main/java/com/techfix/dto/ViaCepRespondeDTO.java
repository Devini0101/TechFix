package com.techfix.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ViaCepRespondeDTO (
        String cep,
        @JsonProperty("logradouro") String street,
        @JsonProperty("complemento") String complement,
        @JsonProperty("bairro") String neighborhood,
        @JsonProperty("localidade") String city,
        String uf,
        Boolean erro
) { }
