package com.techfix.controller;

import com.techfix.dto.request.MaintenanceRequestDTO;
import com.techfix.dto.response.MaintenanceDetailsResponseDTO;
import com.techfix.dto.response.MaintenanceResponseDTO;
import com.techfix.model.MaintenanceRequest;
import com.techfix.model.User;
import com.techfix.service.MaintenanceRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance-request")
public class MaintenanceRequestController {

    private final MaintenanceRequestService service;

    public MaintenanceRequestController(MaintenanceRequestService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<MaintenanceRequest> create(
            @Valid @RequestBody MaintenanceRequestDTO request,
            Authentication authentication) {
        User client = (User) authentication.getPrincipal();
        service.create(request, client);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/pending")
    public List<MaintenanceResponseDTO> openMaintenances(Authentication authentication) {
        User client = (User) authentication.getPrincipal();
        List<MaintenanceResponseDTO> pendingList = service.getPendingMaintenances(client.getId());
        return pendingList;
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceDetailsResponseDTO> findById(@PathVariable String id, Authentication authentication) {
        User client = (User) authentication.getPrincipal();
        MaintenanceDetailsResponseDTO response = service.findById(id, client.getId());
        return ResponseEntity.ok(response);
    }
}
