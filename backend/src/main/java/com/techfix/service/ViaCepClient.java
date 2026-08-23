package com.techfix.service;

import com.techfix.dto.response.ViaCepResponseDTO;
import com.techfix.exception.CepNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ViaCepClient {
    private final RestClient restClient;

    public ViaCepClient() {
        this.restClient = RestClient.builder()
                .baseUrl("https://viacep.com.br/ws/")
                .build();
    }

    public ViaCepResponseDTO findAddressByCep(String cep) {
        //transforma em somente nums
        String sanitizedCep = cep.replaceAll("\\D","");

        if (sanitizedCep.length() != 8) {
            throw new IllegalArgumentException("Formato de CEP inválido, o CEP deve conter 8 dígitos.");
        }

        ViaCepResponseDTO response = restClient.get()
                .uri("/{cep}/json", sanitizedCep)
                .retrieve().body(ViaCepResponseDTO.class);

        if(response != null  && response.erro() != null && response.erro()) {
            throw new CepNotFoundException("CEP " + sanitizedCep + "não encontrado na base da ViaCep.");
        }
        return response;
    }
}
