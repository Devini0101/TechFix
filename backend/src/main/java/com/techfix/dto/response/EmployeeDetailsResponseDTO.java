package com.techfix.dto.response;

import com.techfix.model.Address;
import com.techfix.model.User;

// dados completos do funcionário, usados para preencher o formulário de edição
public record EmployeeDetailsResponseDTO(
        Long id,
        String name,
        String email,
        String cpf,
        String phone,
        String cep,
        String street,
        String neighborhood,
        String city,
        String uf,
        String complement
) {
    public static EmployeeDetailsResponseDTO from(User user) {
        Address address = user.getAddress();
        return new EmployeeDetailsResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCpf(),
                user.getPhone(),
                address != null ? address.getCep() : null,
                address != null ? address.getStreet() : null,
                address != null ? address.getNeighborhood() : null,
                address != null ? address.getCity() : null,
                address != null ? address.getUf() : null,
                address != null ? address.getComplement() : null
        );
    }
}
