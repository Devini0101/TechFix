package com.techfix.service;

import com.techfix.dto.AddressRequestDTO;
import com.techfix.dto.AddressResponseDTO;
import com.techfix.model.Address;
import com.techfix.repository.AddressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AddressService {

    private final AddressRepository repository;

    public AddressService (AddressRepository repository) {
        this.repository = repository;
    }

    public List<Address> findByCep (String cep){
        //todo: implementar dto para converter para JSON
        Optional<Address> address = repository.findByCep(cep);
        if (address.isPresent()) {
            return address.stream().toList();
        }
        return null;
    }

    @Transactional
    public AddressResponseDTO save(AddressRequestDTO dto) {
        Address address = Address.builder()
                .cep(dto.cep())
                .street(dto.street())
                .complement(dto.complement())
                .neighborhood(dto.neighborhood())
                .uf(dto.uf())
                .city(dto.city())
                .build();
        Address savedAddress = repository.save(address);
        return AddressResponseDTO.fromEntity(savedAddress);
    }
}
