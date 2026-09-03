package com.techfix.controller;

import com.techfix.dto.request.MaintenanceRequestDTO;
import com.techfix.model.MaintenanceRequest;
import com.techfix.model.User;
import com.techfix.service.MaintenanceRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/maintenance-request" )
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
        MaintenanceRequest saved = service.create(request, client);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
