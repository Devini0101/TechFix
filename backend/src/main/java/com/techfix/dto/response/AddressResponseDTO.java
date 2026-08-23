package com.techfix.dto.response;

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
    //pega entidade salva no banco e transforma em um dto pro front 
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
