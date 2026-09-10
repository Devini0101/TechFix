package com.techfix.controller;

import com.techfix.dto.request.MaintenanceRequestDTO;
import com.techfix.dto.response.MaintenanceDetailsResponseDTO;
import com.techfix.dto.response.MaintenanceSummaryResponseDTO;
import com.techfix.model.MaintenanceRequest;
import com.techfix.model.User;
import com.techfix.model.enums.UserRole;
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

    @GetMapping("/summary")
    public MaintenanceSummaryResponseDTO getMaintenanceSummary(Authentication authentication) {
        User client = (User) authentication.getPrincipal();

        if (client.getRole().equals(UserRole.employee)) {
            MaintenanceSummaryResponseDTO summary = service.getMaintenancesSummary();
            return summary;
        }

        MaintenanceSummaryResponseDTO summary = service.getMaintenancesSummaryByClient(client.getId());
        return summary;
    }

    @GetMapping
    public List<MaintenanceDetailsResponseDTO> getAll (Authentication authentication, @RequestParam(required = false) String status) {
        User client = (User) authentication.getPrincipal();
        String formattedStatus = (status != null) ? status.toUpperCase() : null;

        if (client.getRole().equals(UserRole.employee)) {
            return service.getAll(formattedStatus);
        }

        return service.getAllByClient(client.getId(), formattedStatus);
    }


    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceDetailsResponseDTO> findById(@PathVariable String id, Authentication authentication) {
        User client = (User) authentication.getPrincipal();
        MaintenanceDetailsResponseDTO response = service.findById(id, client);
        return ResponseEntity.ok(response);
    }
}
