package com.techfix.dto.request;

import jakarta.validation.constraints.NotBlank;

public record RepairRequestDTO(
        @NotBlank(message = "É obrigatório informar a descrição da manutenção")
        String fixDescription,

        @NotBlank(message = "É obrigatório informar as orientações para o cliente")
        String orientation
) {
}
