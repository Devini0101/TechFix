package com.techfix.dto;

import com.techfix.model.Address;

public record AddressResponseDTO(
        Long id,
        String cep,
        String street,
        String complement,
        String neighborhood,
        String uf,
        String city
) {
    // Mapeador estático de Entidade -> DTO
    public static AddressResponseDTO fromEntity(Address address) {
        return new AddressResponseDTO(
                address.getId(),
                address.getCep(),
                address.getStreet(),
                address.getComplement(),
                address.getNeighborhood(),
                address.getUf(),
                address.getCity()
        );
    }
}
