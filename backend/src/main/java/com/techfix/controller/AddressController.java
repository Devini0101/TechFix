package com.techfix.controller;

import com.techfix.dto.response.ViaCepResponseDTO;
import com.techfix.service.ViaCepClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/address")
public class AddressController {
    private final ViaCepClient viaCepClient;

    public AddressController(ViaCepClient viaCepClient) {
        this.viaCepClient = viaCepClient;
    }

    @GetMapping("/via-cep/{cep}")
    public ResponseEntity<ViaCepResponseDTO> getAddressByCep (@PathVariable String cep) {
        ViaCepResponseDTO address = viaCepClient.findAddressByCep(cep);
        return ResponseEntity.ok(address);
    }
}
