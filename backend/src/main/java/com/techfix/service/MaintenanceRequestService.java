package com.techfix.service;

import com.techfix.dto.request.MaintenanceRequestDTO;
import com.techfix.model.Category;
import com.techfix.model.MaintenanceRequest;
import com.techfix.model.Status;
import com.techfix.model.User;
import com.techfix.repository.CategoryRepository;
import com.techfix.repository.MaintenanceRequestRepository;
import com.techfix.repository.StatusRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class MaintenanceRequestService {

    private final MaintenanceRequestRepository requestRepository;
    private final CategoryRepository categoryRepository;
    private final StatusRepository statusRepository;

    public MaintenanceRequestService(
            MaintenanceRequestRepository requestRepository,
            CategoryRepository categoryRepository,
            StatusRepository statusRepository ) {
        this.requestRepository = requestRepository;
        this.categoryRepository = categoryRepository;
        this.statusRepository = statusRepository;
    }

    @Transactional
    public MaintenanceRequest create(MaintenanceRequestDTO request, User client) {
        Category category = categoryRepository.findByCodeAndActiveTrue(request.categoryCode())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Categoria não encontrada"));

        Status status = statusRepository.findByCode("OPEN")
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR, "Status inicial não cadastrado"));

        MaintenanceRequest maintenanceRequest = new MaintenanceRequest();
        maintenanceRequest.setItem(request.item().trim());
        maintenanceRequest.setItemDescription(request.itemDescription().trim());
        maintenanceRequest.setItemDefect(request.itemDefect().trim());
        maintenanceRequest.setCategory(category);
        maintenanceRequest.setClient(client);
        maintenanceRequest.setStatus(status);

        return requestRepository.save(maintenanceRequest);
    }
}